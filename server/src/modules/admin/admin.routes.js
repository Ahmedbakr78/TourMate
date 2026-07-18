import { Router } from 'express';
import * as admin from './admin.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { rbac } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.use(authenticate, rbac('admin'));

router.get('/users', admin.getUsers);
router.patch('/users/:id/block', admin.blockUser);
router.patch('/users/:id/unblock', admin.unblockUser);
router.get('/stats', admin.getStats);

export default router;
