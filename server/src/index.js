import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

import env from './config/env.js';
import connectDB from './config/db.js';

import guideRoutes from './routes/guide.routes.js';
import driverRoutes from './routes/driver.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import externalRoutes from './routes/external.routes.js';
import trackingRoutes from './routes/tracking.routes.js';
import adminRoutes from './routes/admin.routes.js';

import { errorHandler, notFound } from './middleware/error.middleware.js';

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

const start = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`[server] TourMate API listening on port ${env.port} (${env.nodeEnv})`);
  });
};

start();

export default app;
