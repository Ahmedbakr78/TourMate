import { Router } from 'express';
import * as vehicle from '../controllers/vehicle.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { rbac } from '../middleware/rbac.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/', vehicle.getAllVehicles);
router.get('/driver/:driverId', vehicle.getDriverVehicles);
router.get('/:id', vehicle.getVehicle);
router.post('/', authenticate, rbac('admin', 'driver'), vehicle.createVehicle);
router.patch('/:id', authenticate, rbac('admin', 'driver'), vehicle.updateVehicle);
router.delete('/:id', authenticate, rbac('admin', 'driver'), vehicle.deleteVehicle);
router.post(
  '/:id/image',
  authenticate,
  rbac('admin', 'driver'),
  upload.single('image'),
  vehicle.uploadVehicleImage
);
router.delete('/:id/image', authenticate, rbac('admin', 'driver'), vehicle.deleteVehicleImage);

export default router;
