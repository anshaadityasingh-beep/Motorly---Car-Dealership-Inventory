import request from 'supertest';
import app from '../../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from '../setup/db.js';
import { User } from '../../src/models/user.model.js';
import { Vehicle } from '../../src/models/vehicle.model.js';
import { generateToken } from '../../src/utils/token.js';

describe('Inventory Endpoints Integration Tests', () => {
  let userToken;
  let adminToken;
  let vehicle;

  beforeAll(async () => {
    await connectTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();

    const user = await User.create({
      name: 'Buyer User',
      email: 'buyer@example.com',
      password: 'Password123',
      role: 'user',
    });

    const admin = await User.create({
      name: 'Manager Admin',
      email: 'manager@example.com',
      password: 'AdminPassword123',
      role: 'admin',
    });

    userToken = generateToken({ id: user.id, role: user.role });
    adminToken = generateToken({ id: admin.id, role: admin.role });

    vehicle = await Vehicle.create({
      make: 'Mercedes-Benz',
      model: 'C-Class',
      category: 'Sedan',
      price: 6000000,
      quantity: 3,
      year: 2024,
    });
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should allow authenticated user to purchase vehicle and return updated vehicle', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicle.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(2);
      expect(response.body.id).toBe(vehicle.id);
    });

    it('should default quantity to 1 when no quantity is supplied in body', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicle.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(2);
    });

    it('should return 401 when unauthenticated', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicle.id}/purchase`)
        .send({ quantity: 1 });

      expect(response.status).toBe(401);
    });

    it('should return 409 when insufficient stock available', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicle.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/insufficient stock/i);
    });

    it('should return 400 for invalid quantity (negative or float)', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicle.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: -2 });

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid vehicle ID format', async () => {
      const response = await request(app)
        .post('/api/vehicles/invalid-format/purchase')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(400);
    });

    it('should return 404 when vehicle ID does not exist', async () => {
      const nonExistentId = '60d0fe4f5311236168a109ca';
      const response = await request(app)
        .post(`/api/vehicles/${nonExistentId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('should allow admin to restock vehicle with status 200', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicle.id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(8);
    });

    it('should return 403 Forbidden when normal user tries to restock', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicle.id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(403);
    });

    it('should return 400 when restock quantity is missing or invalid', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicle.id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });
});
