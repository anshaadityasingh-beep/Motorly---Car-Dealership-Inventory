/**
 * Centralized error-handling middleware.
 * Ensures consistent response format: { message: "...", errors: [...] }
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  const response = {
    message: err.message || 'Internal Server Error',
  };

  if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
    response.errors = err.errors;
  }

  // In development, stack trace can optionally be attached if needed, but error shape remains clean
  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
