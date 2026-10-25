import { ApiError } from '../../src/utils/ApiError.js';

describe('ApiError Unit Tests', () => {
  it('should initialize with default errors and operational flag', () => {
    const error = new ApiError(400, 'Bad Request');
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Bad Request');
    expect(error.errors).toEqual([]);
    expect(error.isOperational).toBe(true);
    expect(error.stack).toBeDefined();
  });

  it('should support custom error list and custom stack trace', () => {
    const customStack = 'CustomStackError: test';
    const error = new ApiError(422, 'Validation Failed', ['Email is invalid'], customStack);
    expect(error.statusCode).toBe(422);
    expect(error.message).toBe('Validation Failed');
    expect(error.errors).toEqual(['Email is invalid']);
    expect(error.stack).toBe(customStack);
  });
});
