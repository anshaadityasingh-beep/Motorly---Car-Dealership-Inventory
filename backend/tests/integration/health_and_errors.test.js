import request from 'supertest';
import app from '../../src/app.js';
import { ApiError } from '../../src/utils/ApiError.js';

describe('Health check and Error Handling Integration Tests', () => {
  describe('GET /api/health', () => {
    it('should return 200 with status ok and timestamp', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 Not Found Middleware', () => {
    it('should return 404 with standard error shape for unknown routes', async () => {
      const response = await request(app).get('/api/unknown-endpoint');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/not found/i);
    });
  });

  describe('Centralized Error Handler Middleware', () => {
    it('should handle thrown ApiError with appropriate status and message', async () => {
      // Simulate an endpoint throwing ApiError
      app.get('/api/test-error', () => {
        throw new ApiError(400, 'Custom client error', ['Invalid field']);
      });

      const response = await request(app).get('/api/test-error');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Custom client error',
        errors: ['Invalid field'],
      });
    });

    it('should handle unexpected errors with 500 status and generic message in production', async () => {
      app.get('/api/test-500', () => {
        throw new Error('Unexpected crash');
      });

      const response = await request(app).get('/api/test-500');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });
});
