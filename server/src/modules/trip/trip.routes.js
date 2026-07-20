import { Router } from 'express';
import * as trip from './trip.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { rbac } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.get('/my', authenticate, trip.getMyTrips);
router.get('/shared', authenticate, trip.getSharedTrips);
router.post('/calculate-price', authenticate, trip.calculateTripPrice);
router.get('/', authenticate, trip.getAllTrips);
router.post('/', authenticate, rbac('tourist', 'admin'), trip.createTrip);
router.get('/:id', authenticate, trip.getTrip);
router.patch('/:id', authenticate, rbac('tourist', 'admin'), trip.updateTrip);
router.delete('/:id', authenticate, rbac('tourist', 'admin'), trip.deleteTrip);
router.patch('/:id/assign-guide', authenticate, rbac('tourist', 'admin'), trip.assignGuide);
router.patch('/:id/assign-driver', authenticate, rbac('tourist', 'admin'), trip.assignDriver);
router.patch('/:id/assign-vehicle', authenticate, rbac('tourist', 'admin'), trip.assignVehicle);
router.patch('/:id/start', authenticate, rbac('tourist', 'driver', 'guide', 'admin'), trip.startTrip);
router.patch('/:id/complete', authenticate, rbac('tourist', 'driver', 'guide', 'admin'), trip.completeTrip);
router.patch('/:id/cancel', authenticate, rbac('tourist', 'admin'), trip.cancelTrip);
router.patch('/:id/share', authenticate, rbac('tourist', 'admin'), trip.shareTrip);
router.post('/:id/duplicate', authenticate, rbac('tourist', 'admin'), trip.duplicateTrip);
router.get('/:id/route', authenticate, trip.getTripRoute);

export default router;
