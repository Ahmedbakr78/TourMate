import { Router } from 'express';
import * as lostItem from './lost_item.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/my', authenticate, lostItem.getMyLostItems);
router.get('/trip/:tripId', authenticate, lostItem.getTripLostItems);
router.get('/', lostItem.getAllLostItems);
router.post('/', authenticate, lostItem.createLostItem);
router.get('/:id', lostItem.getLostItem);
router.patch('/:id', authenticate, lostItem.updateLostItem);
router.patch('/:id/status', authenticate, lostItem.updateLostItemStatus);
router.patch('/:id/report-found', authenticate, lostItem.reportFoundItem);
router.patch('/:id/close', authenticate, lostItem.closeLostItem);
router.patch('/:id/reopen', authenticate, lostItem.reopenLostItem);
router.delete('/:id', authenticate, lostItem.deleteLostItem);

export default router;
