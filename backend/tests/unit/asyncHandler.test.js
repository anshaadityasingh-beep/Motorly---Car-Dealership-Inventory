import { jest, describe, it, expect } from '@jest/globals';
import { asyncHandler } from '../../src/middleware/asyncHandler.js';

describe('asyncHandler Middleware Unit Tests', () => {
  it('should call the wrapped function with req, res, and next', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const req = {};
    const res = {};
    const next = jest.fn();

    const handler = asyncHandler(fn);
    await handler(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('should catch rejected promises and forward error to next()', async () => {
    const error = new Error('Async error occurred');
    const fn = jest.fn().mockRejectedValue(error);
    const req = {};
    const res = {};
    const next = jest.fn();

    const handler = asyncHandler(fn);
    await handler(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
