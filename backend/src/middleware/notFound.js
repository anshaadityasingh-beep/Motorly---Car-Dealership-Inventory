import { ApiError } from '../utils/ApiError.js';

/**
 * 404 handler for unknown routes.
 */
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};
