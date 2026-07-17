import { ApiError, httpStatus } from '../utils/apiError.js';

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          `Access denied. Required role(s): ${roles.join(', ')}`
        )
      );
    }
    next();
  };
}
