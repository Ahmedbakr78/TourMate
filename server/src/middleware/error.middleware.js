import { ApiError } from '../utils/apiError.js';

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(422).json({ status: 'error', message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ status: 'error', message: 'Duplicate key error', fields: err.keyValue });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }

  console.error('[error]', err);
  return res.status(500).json({ status: 'error', message: 'Internal server error' });
}

export function notFound(_req, _res, next) {
  next(new ApiError(404, 'Route not found'));
}
