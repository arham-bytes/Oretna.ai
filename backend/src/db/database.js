import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const dbUrl = process.env.DATABASE_URL;
export const sql = dbUrl ? neon(dbUrl) : null;

if (sql) {
  console.log('✓ Neon PostgreSQL database connected');
} else {
  console.log('ℹ Using local JSON file fallback database');
}

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf-8');
  }
  if (!fs.existsSync(SESSIONS_FILE)) {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify({}), 'utf-8');
  }
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password, hash, salt) {
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
}

export async function findUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();

  if (sql) {
    const rows = await sql`
      SELECT id, first_name as "firstName", last_name as "lastName", email, password_hash as "passwordHash", password_salt as "passwordSalt", created_at as "createdAt"
      FROM users
      WHERE LOWER(email) = ${normalizedEmail}
      LIMIT 1
    `;
    return rows[0] || null;
  }

  // Fallback to local file
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(raw);
    return users.find((u) => u.email.toLowerCase() === normalizedEmail) || null;
  } catch {
    return null;
  }
}

export async function findUserById(id) {
  if (sql) {
    const rows = await sql`
      SELECT id, first_name as "firstName", last_name as "lastName", email, password_hash as "passwordHash", password_salt as "passwordSalt", created_at as "createdAt"
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows[0] || null;
  }

  ensureDataFiles();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(raw);
    return users.find((u) => u.id === id) || null;
  } catch {
    return null;
  }
}

export async function createUser({ firstName, lastName, email, password }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const { hash, salt } = hashPassword(password);
  const id = `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const now = new Date().toISOString();

  if (sql) {
    await sql`
      INSERT INTO users (id, first_name, last_name, email, password_hash, password_salt, created_at)
      VALUES (${id}, ${firstName.trim()}, ${lastName.trim()}, ${email.trim().toLowerCase()}, ${hash}, ${salt}, ${now})
    `;

    // Check if user previously completed survey before creating account
    const pending = await sql`
      SELECT survey_response_reference as "surveyResponseReference"
      FROM pending_surveys
      WHERE LOWER(email) = ${email.trim().toLowerCase()}
      LIMIT 1
    `;

    if (pending && pending.length > 0) {
      await sql`
        INSERT INTO user_surveys (user_id, survey_completed, survey_completed_at, survey_response_reference, updated_at)
        VALUES (${id}, true, NOW(), ${pending[0].surveyResponseReference}, NOW())
        ON CONFLICT (user_id) DO UPDATE SET survey_completed = true, survey_completed_at = NOW(), updated_at = NOW()
      `;
      await sql`DELETE FROM pending_surveys WHERE LOWER(email) = ${email.trim().toLowerCase()}`;
    } else {
      await sql`
        INSERT INTO user_surveys (user_id, survey_completed, updated_at)
        VALUES (${id}, false, NOW())
        ON CONFLICT (user_id) DO NOTHING
      `;
    }

    return {
      id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      createdAt: now,
    };
  }

  // Fallback to local JSON file
  ensureDataFiles();
  const raw = fs.readFileSync(USERS_FILE, 'utf-8');
  const users = JSON.parse(raw);
  const newUser = {
    id,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: now,
  };
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');

  const { passwordHash, passwordSalt, ...safeUser } = newUser;
  return safeUser;
}

export async function authenticateUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email address or password.');
  }

  const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
  if (!isValid) {
    throw new Error('Invalid email address or password.');
  }

  const { passwordHash, passwordSalt, ...safeUser } = user;
  return safeUser;
}

export async function createSessionToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

  if (sql) {
    await sql`
      INSERT INTO sessions (token, user_id, expires_at)
      VALUES (${token}, ${userId}, ${expiresAt})
      ON CONFLICT (token) DO UPDATE SET user_id = ${userId}, expires_at = ${expiresAt}
    `;
    return token;
  }

  ensureDataFiles();
  const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
  const sessions = JSON.parse(raw);
  sessions[token] = { userId, expiresAt };
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  return token;
}

export async function validateSessionToken(token) {
  if (sql) {
    const rows = await sql`
      SELECT s.expires_at, u.id, u.first_name as "firstName", u.last_name as "lastName", u.email, u.created_at as "createdAt"
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${token}
      LIMIT 1
    `;
    if (!rows || rows.length === 0) return null;
    const row = rows[0];
    if (Date.now() > Number(row.expires_at)) {
      await sql`DELETE FROM sessions WHERE token = ${token}`;
      return null;
    }
    const { expires_at, ...user } = row;
    return user;
  }

  ensureDataFiles();
  try {
    const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    const sessions = JSON.parse(raw);
    const session = sessions[token];
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      delete sessions[token];
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
      return null;
    }

    const user = await findUserById(session.userId);
    if (!user) return null;

    const { passwordHash, passwordSalt, ...safeUser } = user;
    return safeUser;
  } catch {
    return null;
  }
}

export async function revokeSessionToken(token) {
  if (sql) {
    await sql`DELETE FROM sessions WHERE token = ${token}`;
    return;
  }

  ensureDataFiles();
  try {
    const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    const sessions = JSON.parse(raw);
    if (sessions[token]) {
      delete sessions[token];
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
    }
  } catch {}
}

export async function recordResearchQuery({ userId = null, query, mode = 'deep', result }) {
  if (sql) {
    const id = `res_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    try {
      await sql`
        INSERT INTO research_queries (id, user_id, query, mode, status, result)
        VALUES (${id}, ${userId}, ${query}, ${mode}, 'completed', ${JSON.stringify(result)})
      `;
    } catch (err) {
      console.error('Failed to log query to Neon:', err.message);
    }
  }
}

export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number (0-9).';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    return 'Password must contain at least one special character (e.g. !@#$%^&*).';
  }
  return null;
}

export async function createPasswordResetToken(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw new Error('No account found with this email address.');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

  if (sql) {
    // Delete any previous reset tokens for this email
    await sql`DELETE FROM password_resets WHERE LOWER(email) = ${normalizedEmail}`;
    await sql`
      INSERT INTO password_resets (email, token, expires_at)
      VALUES (${normalizedEmail}, ${token}, ${expiresAt})
    `;
  } else {
    // local fallback
    const RESETS_FILE = path.join(DATA_DIR, 'resets.json');
    let resets = {};
    if (fs.existsSync(RESETS_FILE)) {
      try { resets = JSON.parse(fs.readFileSync(RESETS_FILE, 'utf-8')); } catch {}
    }
    resets[token] = { email: normalizedEmail, expiresAt };
    fs.writeFileSync(RESETS_FILE, JSON.stringify(resets, null, 2), 'utf-8');
  }

  return { token, email: normalizedEmail, firstName: user.firstName };
}

export async function verifyPasswordResetToken(token) {
  if (sql) {
    const rows = await sql`
      SELECT email, expires_at as "expiresAt"
      FROM password_resets
      WHERE token = ${token}
      LIMIT 1
    `;
    if (!rows || rows.length === 0) return null;
    const row = rows[0];
    if (Date.now() > Number(row.expiresAt)) {
      await sql`DELETE FROM password_resets WHERE token = ${token}`;
      return null;
    }
    return { email: row.email };
  }

  const RESETS_FILE = path.join(DATA_DIR, 'resets.json');
  if (!fs.existsSync(RESETS_FILE)) return null;
  try {
    const resets = JSON.parse(fs.readFileSync(RESETS_FILE, 'utf-8'));
    const item = resets[token];
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      delete resets[token];
      fs.writeFileSync(RESETS_FILE, JSON.stringify(resets, null, 2), 'utf-8');
      return null;
    }
    return { email: item.email };
  } catch {
    return null;
  }
}

export async function resetPasswordWithToken(token, newPassword) {
  const resetData = await verifyPasswordResetToken(token);
  if (!resetData) {
    throw new Error('This password reset link is invalid or has expired. Please request a new one.');
  }

  const validationError = validatePasswordStrength(newPassword);
  if (validationError) {
    throw new Error(validationError);
  }

  const user = await findUserByEmail(resetData.email);
  if (!user) {
    throw new Error('User not found.');
  }

  const { hash, salt } = hashPassword(newPassword);

  if (sql) {
    await sql`
      UPDATE users
      SET password_hash = ${hash}, password_salt = ${salt}
      WHERE LOWER(email) = ${resetData.email.toLowerCase()}
    `;
    // Clean up reset token
    await sql`DELETE FROM password_resets WHERE token = ${token}`;
    // Revoke all existing sessions for security
    await sql`DELETE FROM sessions WHERE user_id = ${user.id}`;
  } else {
    // fallback
    ensureDataFiles();
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(raw);
    const idx = users.findIndex((u) => u.email.toLowerCase() === resetData.email.toLowerCase());
    if (idx !== -1) {
      users[idx].passwordHash = hash;
      users[idx].passwordSalt = salt;
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    }
  }

  return { success: true, email: resetData.email };
}

export async function getUserSurveyStatus(userId, email) {
  if (sql) {
    // 1. Check user_surveys table
    const rows = await sql`
      SELECT survey_completed as "surveyCompleted", survey_completed_at as "surveyCompletedAt", survey_response_reference as "surveyResponseReference"
      FROM user_surveys
      WHERE user_id = ${userId}
      LIMIT 1
    `;

    if (rows && rows.length > 0 && rows[0].surveyCompleted) {
      return {
        surveyCompleted: true,
        surveyCompletedAt: rows[0].surveyCompletedAt,
        surveyResponseReference: rows[0].surveyResponseReference,
      };
    }

    // 2. If not marked completed, check if email exists in pending_surveys
    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      const pending = await sql`
        SELECT survey_response_reference as "surveyResponseReference", submitted_at as "submittedAt"
        FROM pending_surveys
        WHERE LOWER(email) = ${normalizedEmail}
        LIMIT 1
      `;

      if (pending && pending.length > 0) {
        // Upgrade to user_surveys
        await sql`
          INSERT INTO user_surveys (user_id, survey_completed, survey_completed_at, survey_response_reference, updated_at)
          VALUES (${userId}, true, ${pending[0].submittedAt || new Date()}, ${pending[0].surveyResponseReference}, NOW())
          ON CONFLICT (user_id) DO UPDATE SET
            survey_completed = true,
            survey_completed_at = EXCLUDED.survey_completed_at,
            survey_response_reference = EXCLUDED.survey_response_reference,
            updated_at = NOW()
        `;
        await sql`DELETE FROM pending_surveys WHERE LOWER(email) = ${normalizedEmail}`;

        return {
          surveyCompleted: true,
          surveyCompletedAt: pending[0].submittedAt,
          surveyResponseReference: pending[0].surveyResponseReference,
        };
      }
    }

    return {
      surveyCompleted: false,
      surveyCompletedAt: null,
      surveyResponseReference: null,
    };
  }

  // Fallback if local
  return {
    surveyCompleted: false,
    surveyCompletedAt: null,
    surveyResponseReference: null,
  };
}

export async function recordSurveySubmission({ email, responseReference = 'google_form_submission' }) {
  if (!email || !email.includes('@')) {
    throw new Error('Valid email is required.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (sql) {
    // 1. Check if user exists with this email
    const user = await findUserByEmail(normalizedEmail);

    if (user) {
      await sql`
        INSERT INTO user_surveys (user_id, survey_completed, survey_completed_at, survey_response_reference, updated_at)
        VALUES (${user.id}, true, NOW(), ${responseReference}, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          survey_completed = true,
          survey_completed_at = NOW(),
          survey_response_reference = ${responseReference},
          updated_at = NOW()
      `;

      return {
        matchedUser: true,
        userId: user.id,
        email: user.email,
        surveyCompleted: true,
        message: 'Survey submission verified for existing Oretna user',
      };
    } else {
      // User not registered yet, record in pending_surveys
      await sql`
        INSERT INTO pending_surveys (email, survey_response_reference, submitted_at)
        VALUES (${normalizedEmail}, ${responseReference}, NOW())
        ON CONFLICT (email) DO UPDATE SET
          survey_response_reference = ${responseReference},
          submitted_at = NOW()
      `;

      return {
        matchedUser: false,
        email: normalizedEmail,
        surveyCompleted: true,
        message: 'Survey recorded in pending queue. Will be linked when user registers.',
      };
    }
  }

  return {
    matchedUser: false,
    email: normalizedEmail,
    surveyCompleted: true,
    message: 'Survey recorded',
  };
}


