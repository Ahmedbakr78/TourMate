import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { ApiError, httpStatus } from '../utils/apiError.js';

export function signToken(payload, options = {}) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: options.expiresIn || env.jwt.expiresIn,
  });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

export function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication token missing');
    }
    const token = header.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
  }
}
