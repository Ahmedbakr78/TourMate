import { Router } from 'express';
import * as admin from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { rbac } from '../middleware/rbac.middleware.js';

const router = Router();

router.use(authenticate, rbac('admin'));

router.get('/users', admin.getUsers);
router.patch('/users/:id/block', admin.blockUser);
router.patch('/users/:id/unblock', admin.unblockUser);
router.get('/stats', admin.getStats);

export default router;
