import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
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

function readUsers(): User[] {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  ensureDataFiles();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function readSessions(): Record<string, { userId: string; expiresAt: number }> {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeSessions(sessions: Record<string, { userId: string; expiresAt: number }>) {
  ensureDataFiles();
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
}

export function findUserByEmail(email: string): User | undefined {
  const users = readUsers();
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function findUserById(id: string): User | undefined {
  const users = readUsers();
  return users.find((u) => u.id === id);
}

export function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): { user: Omit<User, 'passwordHash' | 'passwordSalt'>; error?: string } {
  const existing = findUserByEmail(data.email);
  if (existing) {
    return { error: 'An account with this email address already exists.' } as any;
  }

  const { hash, salt } = hashPassword(data.password);
  const newUser: User = {
    id: `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
  };

  const users = readUsers();
  users.push(newUser);
  writeUsers(users);

  const { passwordHash, passwordSalt, ...safeUser } = newUser;
  return { user: safeUser };
}

export function authenticateUser(email: string, password: string): {
  user?: Omit<User, 'passwordHash' | 'passwordSalt'>;
  error?: string;
} {
  const user = findUserByEmail(email);
  if (!user) {
    return { error: 'Invalid email address or password.' };
  }

  const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
  if (!isValid) {
    return { error: 'Invalid email address or password.' };
  }

  const { passwordHash, passwordSalt, ...safeUser } = user;
  return { user: safeUser };
}

export function createSessionToken(userId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const sessions = readSessions();
  // 30 days expiration
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  sessions[token] = { userId, expiresAt };
  writeSessions(sessions);
  return token;
}

export function validateSessionToken(token: string): Omit<User, 'passwordHash' | 'passwordSalt'> | null {
  const sessions = readSessions();
  const session = sessions[token];
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    delete sessions[token];
    writeSessions(sessions);
    return null;
  }

  const user = findUserById(session.userId);
  if (!user) return null;

  const { passwordHash, passwordSalt, ...safeUser } = user;
  return safeUser;
}

export function revokeSessionToken(token: string) {
  const sessions = readSessions();
  if (sessions[token]) {
    delete sessions[token];
    writeSessions(sessions);
  }
}
