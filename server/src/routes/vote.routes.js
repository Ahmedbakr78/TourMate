import { Router } from 'express';
import * as vote from '../controllers/vote.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Define non-parameterized routes first to prevent conflict with :id
router.get('/user', authenticate, vote.getUserVotes);
router.get('/place/:placeId', authenticate, vote.getPlaceVotes);

router.post('/', authenticate, vote.createVote);
router.patch('/:id', authenticate, vote.updateVote);
router.delete('/:id', authenticate, vote.deleteVote);

export default router;
