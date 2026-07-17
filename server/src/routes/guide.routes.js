import { Router } from 'express';
import * as guide from '../controllers/guide.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { rbac } from '../middleware/rbac.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/', guide.getAllGuides);
router.get('/search', guide.searchGuides);
router.get('/:id', guide.getGuide);
router.post('/', authenticate, rbac('admin'), guide.createGuide);
router.patch('/:id', authenticate, rbac('admin', 'guide'), guide.updateGuide);
router.delete('/:id', authenticate, rbac('admin'), guide.deleteGuide);
router.patch('/:id/availability', authenticate, rbac('guide'), guide.updateAvailability);
router.post(
  '/:id/certificate',
  authenticate,
  rbac('guide'),
  upload.single('certificate'),
  guide.uploadCertificate
);
router.delete('/:id/certificate', authenticate, rbac('guide'), guide.deleteCertificate);

export default router;
