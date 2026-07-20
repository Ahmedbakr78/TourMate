import { Router } from 'express';
import * as user from './user.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';

const router = Router();

router.get('/me', authenticate, user.getProfile);
router.patch('/me', authenticate, user.updateProfile);
router.get('/:id', user.getUserById);
router.post('/profile-image', authenticate, upload.single('image'), user.uploadProfileImage);
router.delete('/profile-image', authenticate, user.deleteProfileImage);
router.delete('/account', authenticate, user.deleteAccount);

export default router;
