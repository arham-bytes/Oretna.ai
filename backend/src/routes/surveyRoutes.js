import { Router } from 'express';
import {
  getSurveyStatus,
  handleSurveyWebhook,
} from '../controllers/surveyController.js';

const router = Router();

// Endpoint for frontend to check the logged-in user's survey status
router.get('/status', getSurveyStatus);

// Secure webhook endpoint for Google Forms / Google Apps Script
router.post('/webhook', handleSurveyWebhook);

export default router;
