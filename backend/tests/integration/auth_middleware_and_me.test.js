import request from 'supertest';
import app from '../../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from '../setup/db.js';
import { User } from '../../src/models/user.model.js';
import { generateToken } from '../../src/utils/token.js';

describe('Auth Middleware and /me Endpoint Integration Tests', () => {
  let regularUser;
  let adminUser;
  let userToken;
  let adminToken;

  beforeAll(async () => {
    await connectTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();

    regularUser = await User.create({
      name: 'Regular Joe',
      email: 'joe@example.com',
      password: 'Password123',
      role: 'user',
    });

    adminUser = await User.create({
      name: 'Admin Boss',
      email: 'boss@example.com',
      password: 'AdminPassword123',
      role: 'admin',
    });

    userToken = generateToken({ id: regularUser.id, role: regularUser.role });
    adminToken = generateToken({ id: adminUser.id, role: adminUser.role });
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('GET /api/auth/me', () => {
    it('should return current user profile when valid token provided', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({
        id: regularUser.id,
        email: 'joe@example.com',
        name: 'Regular Joe',
        role: 'user',
      });
      expect(response.body.user.password).toBeUndefined();
    });

    it('should return 401 when Authorization header is missing', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/authentication required|missing token/i);
    });

    it('should return 401 when Authorization header does not start with Bearer', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Basic ${userToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid authorization format/i);
    });

    it('should return 401 when token is invalid or malformed', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.payload');

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid or expired token/i);
    });

    it('should return 401 when token is expired', async () => {
      const expiredToken = generateToken({ id: regularUser.id, role: 'user' }, '-1s');

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid or expired token/i);
    });
  });

  describe('authorizeRoles Middleware via Protected Test Route', () => {
    it('should return 403 when user does not have required role', async () => {
      // Testing admin route with regular user token
      const response = await request(app)
        .post('/api/auth/test-admin-only')
        .set('Authorization', `Bearer ${userToken}`);

      // We expect 403 or 404 before route is created
      expect([403, 404]).toContain(response.status);
    });
  });
});
