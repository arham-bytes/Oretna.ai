import { Router } from 'express';
import { processQuery } from '../controllers/researchController.js';
import { requireAuth, requireSurveyCompleted } from '../middleware/authGuard.js';

const router = Router();

// Protect research AI assistant endpoint behind both auth and verified survey
router.post('/query', requireAuth, requireSurveyCompleted, processQuery);

export default router;
