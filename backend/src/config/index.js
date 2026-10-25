import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  sessionSecret: process.env.SESSION_SECRET || 'oretna_secret_key_2026',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  surveyWebhookSecret: process.env.SURVEY_WEBHOOK_SECRET || 'oretna_survey_secret_2026_x7k9',
};
