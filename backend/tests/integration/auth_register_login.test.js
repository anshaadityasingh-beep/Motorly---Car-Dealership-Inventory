import request from 'supertest';
import app from '../../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from '../setup/db.js';
import { User } from '../../src/models/user.model.js';

describe('Auth Register and Login Integration Tests', () => {
  beforeAll(async () => {
    await connectTestDB();
  }, 30000);

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('POST /api/auth/register', () => {
    const validPayload = {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'Password123',
    };

    it('should register a new user successfully and return user and token', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validPayload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'user',
      });
      expect(response.body.user.password).toBeUndefined();
      expect(response.body.user.id).toBeDefined();
    });

    it('should always assign "user" role even if an attacker passes role "admin"', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validPayload,
          role: 'admin',
        });

      expect(response.status).toBe(201);
      expect(response.body.user.role).toBe('user');

      const savedUser = await User.findOne({ email: 'alice@example.com' });
      expect(savedUser.role).toBe('user');
    });

    it('should fail with 400 validation error when email is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validPayload,
          email: 'not-an-email',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('errors');
    });

    it('should fail with 400 validation error when password is under 8 chars or lacks a number', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validPayload,
          password: 'short',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 409 conflict when email is already registered', async () => {
      await User.create(validPayload);

      const response = await request(app)
        .post('/api/auth/register')
        .send(validPayload);

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/already registered|already in use/i);
    });
  });

  describe('POST /api/auth/login', () => {
    const userCredentials = {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'Password123',
    };

    beforeEach(async () => {
      await User.create(userCredentials);
    });

    it('should log in successfully with valid credentials and return user and token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'bob@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        email: 'bob@example.com',
        name: 'Bob Smith',
        role: 'user',
      });
      expect(response.body.user.password).toBeUndefined();
    });

    it('should return generic 401 when password does not match', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'bob@example.com',
          password: 'WrongPassword456',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid email or password/i);
    });

    it('should return generic 401 when email does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nobody@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid email or password/i);
    });
  });
});
