import { Router } from 'express';
import * as place from './place.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { rbac } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.get('/search', place.searchPlaces);
router.get('/filter', place.filterPlaces);
router.get('/nearby', place.getNearbyPlaces);
router.get('/popular', place.getPopularPlaces);
router.get('/', place.getAllPlaces);
router.get('/:id', place.getPlace);
router.post('/', authenticate, rbac('admin'), place.createPlace);
router.post('/save', authenticate, place.savePlace);
router.patch('/:id', authenticate, rbac('admin'), place.updatePlace);
router.delete('/:id', authenticate, rbac('admin'), place.deletePlace);

export default router;
