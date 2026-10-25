/**
 * Express middleware helper to catch asynchronous rejections and forward to next().
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware handler
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
