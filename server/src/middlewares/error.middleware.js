import { ApiError } from '../utils/apiError.js';
import env from '../config/env.js';

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ status: 'error', message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ status: 'error', message: 'Duplicate key error', fields: err.keyValue });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 'error', message: 'Invalid JSON in request body' });
  }

  console.error('[error]', err);
  const message = env.nodeEnv === 'development' ? err.message : 'Internal server error';
  return res.status(500).json({ status: 'error', message });
}

export function notFound(_req, _res, next) {
  next(new ApiError(404, 'Route not found'));
}
