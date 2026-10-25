import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/token.js';
import { User } from '../models/user.model.js';

/**
 * Authentication middleware that verifies JWT from Authorization Bearer header
 * and attaches the authenticated user document to req.user.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new ApiError(401, 'Authentication required: missing token'));
    }

    if (!authHeader.startsWith('Bearer ')) {
      return next(new ApiError(401, 'Invalid authorization format. Expected Bearer token'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(new ApiError(401, 'Authentication required: missing token'));
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return next(new ApiError(401, 'Invalid or expired token'));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError(401, 'User not found or inactive'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware factory.
 * @param  {...string} roles - Permitted roles (e.g. 'admin', 'user')
 * @returns {Function} Express middleware
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: insufficient permissions'));
    }
    next();
  };
};
