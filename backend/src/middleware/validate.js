import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

/**
 * Middleware that checks validation results from express-validator.
 * If errors exist, throws an ApiError formatted with detailed messages.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return next(new ApiError(400, 'Validation error', formattedErrors));
  }
  next();
};
