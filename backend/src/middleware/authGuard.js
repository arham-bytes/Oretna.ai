import { validateSessionToken, getUserSurveyStatus } from '../db/database.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.oretna_session || req.cookies?.kaetle_session;
    if (!token) {
      return res.status(401).json({
        error: 'Authentication required. Please log in to access this feature.',
        authenticated: false,
      });
    }

    const user = await validateSessionToken(token);
    if (!user) {
      return res.status(401).json({
        error: 'Session invalid or expired. Please log in again.',
        authenticated: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal authentication error' });
  }
}

export async function requireSurveyCompleted(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const status = await getUserSurveyStatus(req.user.id, req.user.email);
    if (!status.surveyCompleted) {
      return res.status(403).json({
        error: 'Please complete the pre-launch feedback survey to reserve early access.',
        surveyRequired: true,
      });
    }

    // Pre-launch restriction: Chatbox / AI assistant is closed to all users
    return res.status(403).json({
      error: 'The AI Research Assistant is currently in private pre-launch. Public access will open soon.',
      prelaunchActive: true,
    });
  } catch (error) {
    console.error('Survey guard middleware error:', error);
    return res.status(500).json({ error: 'Internal server error checking survey status' });
  }
}
