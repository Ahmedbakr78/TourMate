import { Router } from 'express';
import * as tracking from '../controllers/tracking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { rbac } from '../middleware/rbac.middleware.js';

const router = Router();

// Driver pushes its own location (polling source). NO WebSockets.
router.post('/driver/:driverId/location', authenticate, rbac('driver'), tracking.pushLocation);
// Clients poll current driver location(s)
router.get('/driver/:driverId', tracking.pollDriverLocation);
router.get('/all', tracking.pollAllLocations);
router.get('/active-trips', authenticate, rbac('admin', 'tourist'), tracking.pollActiveTrips);
router.delete('/driver/:driverId', authenticate, rbac('admin', 'driver'), tracking.clearLocation);

export default router;
