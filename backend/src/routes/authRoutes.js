import { Router } from 'express';
import {
  signup,
  login,
  me,
  logout,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', me);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.get('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword);

export default router;

