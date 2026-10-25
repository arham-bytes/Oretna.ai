import {
  createUser,
  authenticateUser,
  createSessionToken,
  validateSessionToken,
  revokeSessionToken,
  validatePasswordStrength,
  createPasswordResetToken,
  verifyPasswordResetToken,
  resetPasswordWithToken,
  getUserSurveyStatus,
} from '../db/database.js';
import { sendPasswordResetEmail } from '../services/emailService.js';
import { config } from '../config/index.js';

export async function signup(req, res) {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: 'First name, last name, email, and password are all required.',
      });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        error: 'Passwords do not match.',
      });
    }

    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    const user = await createUser({ firstName, lastName, email, password });
    const token = await createSessionToken(user.id);

    res.cookie('oretna_session', token, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const surveyStatus = await getUserSurveyStatus(user.id, user.email);
    const redirectTo = surveyStatus.surveyCompleted ? '/onboarding/thank-you' : '/onboarding/survey';

    return res.status(201).json({
      success: true,
      user: {
        ...user,
        surveyCompleted: surveyStatus.surveyCompleted,
      },
      surveyCompleted: surveyStatus.surveyCompleted,
      redirectTo,
      message: 'Account created successfully',
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Registration failed',
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.',
      });
    }

    const user = await authenticateUser(email, password);
    const token = await createSessionToken(user.id);

    res.cookie('oretna_session', token, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const surveyStatus = await getUserSurveyStatus(user.id, user.email);
    const redirectTo = surveyStatus.surveyCompleted ? '/onboarding/thank-you' : '/onboarding/survey';

    return res.json({
      success: true,
      user: {
        ...user,
        surveyCompleted: surveyStatus.surveyCompleted,
      },
      surveyCompleted: surveyStatus.surveyCompleted,
      redirectTo,
      message: 'Logged in successfully',
    });
  } catch (error) {
    return res.status(401).json({
      error: error.message || 'Invalid email or password',
    });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        error: 'Please provide a valid email address.',
      });
    }

    let resetInfo;
    try {
      resetInfo = await createPasswordResetToken(email);
    } catch (err) {
      // Don't leak if email doesn't exist for user privacy, but in dev provide clear message
      return res.json({
        success: true,
        message: 'If that email address is registered, we have sent a password reset link.',
      });
    }

    const emailResult = await sendPasswordResetEmail({
      toEmail: resetInfo.email,
      firstName: resetInfo.firstName,
      resetToken: resetInfo.token,
    });

    return res.json({
      success: true,
      message: 'If that email address is registered, we have sent a password reset link to your email.',
      // If in local development and simulated, provide the direct test link
      previewUrl: emailResult.mode === 'simulated' ? emailResult.resetUrl : undefined,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      error: 'Unable to process password reset request right now.',
    });
  }
}

export async function verifyResetToken(req, res) {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ valid: false, error: 'Token is required.' });
    }

    const resetData = await verifyPasswordResetToken(token);
    if (!resetData) {
      return res.status(400).json({
        valid: false,
        error: 'This password reset link is invalid or has expired.',
      });
    }

    return res.json({ valid: true, email: resetData.email });
  } catch (error) {
    return res.status(500).json({ valid: false, error: 'Failed to verify token.' });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        error: 'Token and new password are required.',
      });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        error: 'Passwords do not match.',
      });
    }

    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    await resetPasswordWithToken(token, password);

    return res.json({
      success: true,
      message: 'Your password has been successfully reset! You can now log in with your new password.',
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to reset password.',
    });
  }
}

export async function me(req, res) {
  const token = req.cookies?.oretna_session || req.cookies?.kaetle_session;
  if (!token) {
    return res.json({ authenticated: false, user: null, surveyCompleted: false });
  }

  const user = await validateSessionToken(token);
  if (!user) {
    return res.json({ authenticated: false, user: null, surveyCompleted: false });
  }

  const surveyStatus = await getUserSurveyStatus(user.id, user.email);

  return res.json({
    authenticated: true,
    user,
    surveyCompleted: surveyStatus.surveyCompleted,
    surveyCompletedAt: surveyStatus.surveyCompletedAt,
  });
}

export async function logout(req, res) {
  const token = req.cookies?.oretna_session || req.cookies?.kaetle_session;
  if (token) {
    await revokeSessionToken(token);
  }

  res.clearCookie('oretna_session', { path: '/' });
  res.clearCookie('kaetle_session', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully' });
}
