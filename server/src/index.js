import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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

import { errorHandler, notFound } from './middlewares/error.middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../', env.upload.dir);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(uploadDir));

app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/guides', guideRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/admin', adminRoutes);

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
