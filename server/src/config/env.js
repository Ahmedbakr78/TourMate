import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tourmate',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:4200')
    .split(',')
    .map((o) => o.trim()),
  overpass: {
    url: process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter',
    timeoutMs: Number(process.env.OVERPASS_TIMEOUT_MS) || 2000,
    cacheTtlMs: Number(process.env.OVERPASS_CACHE_TTL_MS) || 3600000,
  },
  osrm: {
    baseUrl: process.env.OSRM_BASE_URL || 'https://router.project-osrm.org',
    orsBaseUrl: process.env.ORS_BASE_URL || 'https://api.openrouteservice.org',
    orsApiKey: process.env.ORS_API_KEY || '',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB) || 5,
  },
};

export default env;
