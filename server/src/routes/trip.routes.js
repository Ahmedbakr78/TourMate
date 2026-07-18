import { Router } from 'express';
import * as trip from '../controllers/trip.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { rbac } from '../middleware/rbac.middleware.js';

const router = Router();

// Define non-parameterized routes first to prevent conflicts with :id
router.get('/my', authenticate, trip.getMyTrips);
router.get('/shared', authenticate, trip.getSharedTrips);
router.post('/calculate-price', authenticate, trip.calculateTripPrice);

// Standard CRUD
router.get('/', authenticate, trip.getAllTrips);
router.post('/', authenticate, rbac('tourist', 'admin'), trip.createTrip);
router.get('/:id', authenticate, trip.getTrip);
router.patch('/:id', authenticate, rbac('tourist', 'admin'), trip.updateTrip);
router.delete('/:id', authenticate, rbac('tourist', 'admin'), trip.deleteTrip);

// Assignments
router.patch('/:id/assign-guide', authenticate, rbac('tourist', 'admin'), trip.assignGuide);
router.patch('/:id/assign-driver', authenticate, rbac('tourist', 'admin'), trip.assignDriver);
router.patch('/:id/assign-vehicle', authenticate, rbac('tourist', 'admin'), trip.assignVehicle);

// State transitions
router.patch('/:id/start', authenticate, rbac('tourist', 'driver', 'guide', 'admin'), trip.startTrip);
router.patch('/:id/complete', authenticate, rbac('tourist', 'driver', 'guide', 'admin'), trip.completeTrip);
router.patch('/:id/cancel', authenticate, rbac('tourist', 'admin'), trip.cancelTrip);

// Actions
router.patch('/:id/share', authenticate, rbac('tourist', 'admin'), trip.shareTrip);
router.post('/:id/duplicate', authenticate, rbac('tourist', 'admin'), trip.duplicateTrip);
router.get('/:id/route', authenticate, trip.getTripRoute);

export default router;
