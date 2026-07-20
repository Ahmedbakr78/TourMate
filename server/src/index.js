import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

import env from './config/env.js';
import connectDB from './config/db.js';

import guideRoutes from './modules/guide/guide.routes.js';
import driverRoutes from './modules/driver/driver.routes.js';
import vehicleRoutes from './modules/vehicle/vehicle.routes.js';
import externalRoutes from './modules/external/external.routes.js';
import trackingRoutes from './modules/tracking/tracking.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import tripRoutes from './modules/trip/trip.routes.js';
import voteRoutes from './modules/vote/vote.routes.js';
import placeRoutes from './modules/place/place.routes.js';
import reviewRoutes from './modules/review/review.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';
import lostItemRoutes from './modules/lost_item/lost_item.routes.js';
import userRoutes from './modules/user/user.routes.js';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.js';

import { errorHandler, notFound } from './middlewares/error.middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../', env.upload.dir);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(morgan(env.nodeEnv === 'production' ? 'tiny' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(uploadDir));

app.get('/', (_req, res) => res.json({ status: 'ok', app: 'TourMate API', version: '1.0.0', docs: '/health' }));
app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/guides', guideRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/lost-items', lostItemRoutes);
app.use('/api/users', userRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(notFound);
app.use(errorHandler);

if (!process.env.VERCEL) {
  const start = async () => {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`[server] TourMate API listening on port ${env.port} (${env.nodeEnv})`);
    });
  };
  start();
}

export default app;
