import { Router } from 'express';
import * as admin from './admin.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { rbac } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.use(authenticate, rbac('admin'));

router.get('/guides/pending', admin.getPendingGuides);
router.get('/drivers/pending', admin.getPendingDrivers);
router.get('/users', admin.getUsers);
router.get('/users/:id', admin.getUserById);
router.patch('/users/:id/block', admin.blockUser);
router.patch('/users/:id/unblock', admin.unblockUser);
router.delete('/users/:id', admin.deleteUser);
router.delete('/trips/:id', admin.deleteTrip);
router.patch('/guides/:id/approve', admin.approveGuide);
router.patch('/guides/:id/reject', admin.rejectGuide);
router.patch('/drivers/:id/approve', admin.approveDriver);
router.patch('/drivers/:id/reject', admin.rejectDriver);
router.get('/stats', admin.getStats);
router.get('/reports', admin.getReports);

export default router;
