import request from 'supertest';
import app from '../../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from '../setup/db.js';
import { User } from '../../src/models/user.model.js';
import { Vehicle } from '../../src/models/vehicle.model.js';
import { generateToken } from '../../src/utils/token.js';

describe('Vehicles CRUD and Search Integration Tests', () => {
  let userToken;
  let adminToken;
  let testVehicle;

  beforeAll(async () => {
    await connectTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();

    const user = await User.create({
      name: 'Normal User',
      email: 'user@example.com',
      password: 'Password123',
      role: 'user',
    });

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'AdminPassword123',
      role: 'admin',
    });

    userToken = generateToken({ id: user.id, role: user.role });
    adminToken = generateToken({ id: admin.id, role: admin.role });

    testVehicle = await Vehicle.create({
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      price: 2500000,
      quantity: 4,
      year: 2023,
    });
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('POST /api/vehicles (Create)', () => {
    const newVehicleData = {
      make: 'Honda',
      model: 'Civic',
      category: 'Sedan',
      price: 2200000,
      quantity: 6,
      year: 2024,
    };

    it('should allow admin to create a vehicle with status 201', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newVehicleData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.make).toBe('Honda');
      expect(response.body.quantity).toBe(6);
    });

    it('should return 403 Forbidden when normal user tries to create a vehicle', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newVehicleData);

      expect(response.status).toBe(403);
    });

    it('should return 401 Unauthorized when unauthenticated', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .send(newVehicleData);

      expect(response.status).toBe(401);
    });

    it('should return 400 validation error when body is invalid', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: '',
          price: -50,
          category: 'InvalidCategory',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/vehicles (List & Pagination)', () => {
    beforeEach(async () => {
      // Add an out-of-stock vehicle
      await Vehicle.create({
        make: 'Ford',
        model: 'Mustang',
        category: 'Coupe',
        price: 5500000,
        quantity: 0,
        year: 2022,
      });
    });

    it('should list only in-stock vehicles by default with pagination metadata', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total', 1); // 1 in stock, 1 out of stock hidden
      expect(response.body.data[0].make).toBe('Toyota');
      expect(response.body).toMatchObject({
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should include out-of-stock vehicles when ?includeOutOfStock=true is passed', async () => {
      const response = await request(app)
        .get('/api/vehicles?includeOutOfStock=true')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(2);
      expect(response.body.data.some((v) => v.quantity === 0)).toBe(true);
    });
  });

  describe('GET /api/vehicles/search (Search, Filtering & Sorting)', () => {
    beforeEach(async () => {
      await Vehicle.create([
        {
          make: 'BMW',
          model: 'X5',
          category: 'SUV',
          price: 7500000,
          quantity: 3,
          year: 2024,
        },
        {
          make: 'Hyundai',
          model: 'Creta',
          category: 'SUV',
          price: 1500000,
          quantity: 8,
          year: 2023,
        },
        {
          make: 'BMW',
          model: '3 Series',
          category: 'Sedan',
          price: 4500000,
          quantity: 2,
          year: 2023,
        },
      ]);
    });

    it('should search by case-insensitive partial make and model', async () => {
      const response = await request(app)
        .get('/api/vehicles/search?make=bmw')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(2);
      expect(response.body.data.every((v) => v.make === 'BMW')).toBe(true);
    });

    it('should filter by category and price range', async () => {
      const response = await request(app)
        .get('/api/vehicles/search?category=SUV&minPrice=1000000&maxPrice=2000000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.data[0].model).toBe('Creta');
    });

    it('should sort results correctly by price ascending', async () => {
      const response = await request(app)
        .get('/api/vehicles/search?sort=price_asc')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      const prices = response.body.data.map((v) => v.price);
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sortedPrices);
    });

    it('should return 400 when minPrice > maxPrice', async () => {
      const response = await request(app)
        .get('/api/vehicles/search?minPrice=5000000&maxPrice=1000000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/minPrice cannot be greater than maxPrice/i);
    });

    it('should ensure /search route is matched before /:id parameter route', async () => {
      const response = await request(app)
        .get('/api/vehicles/search')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('PUT /api/vehicles/:id (Update)', () => {
    it('should allow admin to update vehicle details partially with status 200', async () => {
      const response = await request(app)
        .put(`/api/vehicles/${testVehicle.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 2600000,
        });

      expect(response.status).toBe(200);
      expect(response.body.price).toBe(2600000);
      expect(response.body.make).toBe('Toyota'); // original remains unchanged
    });

    it('should return 403 when regular user tries to update', async () => {
      const response = await request(app)
        .put(`/api/vehicles/${testVehicle.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 3000000 });

      expect(response.status).toBe(403);
    });

    it('should return 400 for invalid ObjectId', async () => {
      const response = await request(app)
        .put('/api/vehicles/invalid-id-format')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 3000000 });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/invalid.*id/i);
    });

    it('should return 404 when vehicle id does not exist', async () => {
      const nonExistentId = '60d0fe4f5311236168a109ca';
      const response = await request(app)
        .put(`/api/vehicles/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 3000000 });

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/vehicle not found/i);
    });
  });

  describe('DELETE /api/vehicles/:id (Delete)', () => {
    it('should allow admin to delete vehicle with status 204', async () => {
      const response = await request(app)
        .delete(`/api/vehicles/${testVehicle.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);

      const inDB = await Vehicle.findById(testVehicle.id);
      expect(inDB).toBeNull();
    });

    it('should return 403 when regular user tries to delete', async () => {
      const response = await request(app)
        .delete(`/api/vehicles/${testVehicle.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    it('should return 404 when vehicle id is not found', async () => {
      const nonExistentId = '60d0fe4f5311236168a109ca';
      const response = await request(app)
        .delete(`/api/vehicles/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});
