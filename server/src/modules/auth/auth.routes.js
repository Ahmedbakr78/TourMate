import { Router } from 'express';
import * as auth from './auth.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', authenticate, auth.logout);
router.post('/refresh-token', auth.refreshToken);
router.get('/profile', authenticate, auth.getProfile);
router.patch('/profile', authenticate, auth.updateProfile);
router.patch('/change-password', authenticate, auth.changePassword);
router.post('/forgot-password', auth.forgotPassword);
router.post('/verify-reset-code', auth.verifyResetCode);
router.post('/reset-password', auth.resetPassword);
router.post('/verify-email', auth.verifyEmail);
router.post('/resend-verification', auth.resendVerification);

export default router;
