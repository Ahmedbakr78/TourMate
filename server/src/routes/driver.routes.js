import { Router } from 'express';
import * as driver from '../controllers/driver.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { rbac } from '../middleware/rbac.middleware.js';

const router = Router();

router.get('/', driver.getAllDrivers);
router.get('/search', driver.searchDrivers);
router.get('/:id', driver.getDriver);
router.post('/', authenticate, rbac('admin'), driver.createDriver);
router.patch('/:id', authenticate, rbac('admin', 'driver'), driver.updateDriver);
router.delete('/:id', authenticate, rbac('admin'), driver.deleteDriver);
router.patch('/:id/availability', authenticate, rbac('driver'), driver.updateAvailability);

export default router;
