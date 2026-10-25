import {
  validateSessionToken,
  getUserSurveyStatus,
  recordSurveySubmission,
} from '../db/database.js';
import { config } from '../config/index.js';

export async function getSurveyStatus(req, res) {
  try {
    const token = req.cookies?.oretna_session || req.cookies?.kaetle_session;
    if (!token) {
      return res.status(401).json({
        authenticated: false,
        surveyCompleted: false,
        error: 'Authentication required',
      });
    }

    const user = await validateSessionToken(token);
    if (!user) {
      return res.status(401).json({
        authenticated: false,
        surveyCompleted: false,
        error: 'Invalid or expired session',
      });
    }

    const status = await getUserSurveyStatus(user.id, user.email);

    return res.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      surveyCompleted: status.surveyCompleted,
      surveyCompletedAt: status.surveyCompletedAt,
      surveyResponseReference: status.surveyResponseReference,
    });
  } catch (error) {
    console.error('Error fetching survey status:', error);
    return res.status(500).json({ error: 'Failed to check survey status' });
  }
}

export async function handleSurveyWebhook(req, res) {
  try {
    // 1. Verify Secret
    const providedSecret =
      req.headers['x-survey-secret'] ||
      req.query?.secret ||
      req.body?.secret;

    if (!providedSecret || providedSecret !== config.surveyWebhookSecret) {
      console.warn('[SURVEY WEBHOOK] Unauthorized attempt with secret:', providedSecret);
      return res.status(401).json({ error: 'Unauthorized: Invalid survey webhook secret' });
    }

    // 2. Extract Data from Google Apps Script payload
    const { email, responseReference, responseId, timestamp } = req.body || {};
    const targetEmail = email || req.body?.['Email address'] || req.body?.['Email'];

    if (!targetEmail || typeof targetEmail !== 'string' || !targetEmail.includes('@')) {
      return res.status(400).json({
        error: 'Missing or invalid email in survey submission payload',
      });
    }

    const ref = responseReference || responseId || `gform_${Date.now()}`;

    console.log(`[SURVEY WEBHOOK RECEIVED] Verified submission for: ${targetEmail} (Ref: ${ref})`);

    const result = await recordSurveySubmission({
      email: targetEmail,
      responseReference: ref,
    });

    return res.json({
      success: true,
      message: 'Survey submission verified and recorded',
      result,
    });
  } catch (error) {
    console.error('Error handling survey webhook:', error);
    return res.status(500).json({ error: 'Failed to process survey submission' });
  }
}
