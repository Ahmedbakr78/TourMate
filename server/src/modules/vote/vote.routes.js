import { Router } from 'express';
import * as vote from './vote.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/user', authenticate, vote.getUserVotes);
router.get('/place/:placeId', authenticate, vote.getPlaceVotes);
router.post('/', authenticate, vote.createVote);
router.patch('/:id', authenticate, vote.updateVote);
router.delete('/:id', authenticate, vote.deleteVote);

export default router;
