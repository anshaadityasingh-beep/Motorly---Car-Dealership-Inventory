import express from 'express';
import request from 'supertest';
import app from '../../src/app.js';
import { ApiError } from '../../src/utils/ApiError.js';
import { errorHandler } from '../../src/middleware/errorHandler.js';

describe('Health check and Error Handling Integration Tests', () => {
  describe('GET /api/health', () => {
    it('should return 200 with status ok and timestamp', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('CORS policy', () => {
    it('should allow requests from allowed origins', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:5173');

      expect(response.status).toBe(200);
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
    let testApp;

    beforeAll(() => {
      testApp = express();
      testApp.use(express.json());

      testApp.get('/api/test-error', () => {
        throw new ApiError(400, 'Custom client error', ['Invalid field']);
      });

      testApp.get('/api/test-500', () => {
        throw new Error('Unexpected crash');
      });

      testApp.get('/api/test-dev-error', () => {
        const err = new Error('Dev crash');
        err.statusCode = 500;
        throw err;
      });

      testApp.use(errorHandler);
    });

    it('should handle thrown ApiError with appropriate status and message', async () => {
      const response = await request(testApp).get('/api/test-error');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Custom client error',
        errors: ['Invalid field'],
      });
    });

    it('should handle unexpected errors with 500 status and generic message', async () => {
      const response = await request(testApp).get('/api/test-500');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Unexpected crash');
    });

    it('should include stack trace when NODE_ENV is development', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const response = await request(testApp).get('/api/test-dev-error');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('stack');

      process.env.NODE_ENV = originalEnv;
    });
  });
});
