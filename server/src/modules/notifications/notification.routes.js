import { Router } from 'express';
import * as notification from './notification.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, notification.createNotification);
router.get('/', authenticate, notification.getNotifications);
router.get('/unread-count', authenticate, notification.getUnreadCount);
router.get('/:id', authenticate, notification.getNotificationById);
router.patch('/:id/read', authenticate, notification.markNotificationAsRead);
router.patch('/read-all', authenticate, notification.markAllNotificationsAsRead);
router.delete('/:id', authenticate, notification.deleteNotification);
router.delete('/', authenticate, notification.deleteAllNotifications);

export default router;
