import { Router } from 'express';
import * as review from './review.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/trip/:tripId', review.getTripReviews);
router.get('/guide/:guideId', review.getGuideReviews);
router.get('/driver/:driverId', review.getDriverReviews);
router.get('/place/:placeId', review.getPlaceReviews);
router.get('/my', authenticate, review.getMyReviews);
router.get('/', review.getAllReviews);
router.get('/:id', review.getReview);
router.post('/', authenticate, review.createReview);
router.patch('/:id', authenticate, review.updateReview);
router.delete('/:id', authenticate, review.deleteReview);

export default router;
