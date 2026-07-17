import { Router } from 'express';
import * as external from '../controllers/external.controller.js';

const router = Router();

router.get('/pois', external.getPOIs);
router.get('/route', external.getRouteHandler);
router.get('/cache', external.getCacheStats);

export default router;
