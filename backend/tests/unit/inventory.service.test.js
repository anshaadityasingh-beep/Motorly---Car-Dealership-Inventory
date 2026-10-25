import { connectTestDB, clearTestDB, closeTestDB } from '../setup/db.js';
import { Vehicle } from '../../src/models/vehicle.model.js';
import { purchaseVehicle, restockVehicle } from '../../src/services/inventory.service.js';

describe('Inventory Service Unit & Concurrency Tests', () => {
  let vehicle;

  beforeAll(async () => {
    await connectTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();

    vehicle = await Vehicle.create({
      make: 'Hyundai',
      model: 'Ioniq 5',
      category: 'Electric',
      price: 4500000,
      quantity: 5,
      year: 2024,
    });
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('purchaseVehicle', () => {
    it('should decrement stock atomically by requested quantity', async () => {
      const updated = await purchaseVehicle(vehicle.id, 2);
      expect(updated.quantity).toBe(3);

      const inDB = await Vehicle.findById(vehicle.id);
      expect(inDB.quantity).toBe(3);
    });

    it('should allow purchase down to exactly zero stock', async () => {
      const updated = await purchaseVehicle(vehicle.id, 5);
      expect(updated.quantity).toBe(0);

      const inDB = await Vehicle.findById(vehicle.id);
      expect(inDB.quantity).toBe(0);
    });

    it('should throw 409 when attempting to purchase more than available stock', async () => {
      await expect(purchaseVehicle(vehicle.id, 6)).rejects.toMatchObject({
        statusCode: 409,
        message: expect.stringMatching(/insufficient stock/i),
      });

      // Stock remains unaffected
      const inDB = await Vehicle.findById(vehicle.id);
      expect(inDB.quantity).toBe(5);
    });

    it('should throw 409 when attempting to purchase with 0 stock', async () => {
      await Vehicle.findByIdAndUpdate(vehicle.id, { quantity: 0 });

      await expect(purchaseVehicle(vehicle.id, 1)).rejects.toMatchObject({
        statusCode: 409,
        message: expect.stringMatching(/insufficient stock/i),
      });
    });

    it('should throw 400 for invalid quantities (0, negative, float, non-number)', async () => {
      await expect(purchaseVehicle(vehicle.id, 0)).rejects.toMatchObject({
        statusCode: 400,
      });
      await expect(purchaseVehicle(vehicle.id, -2)).rejects.toMatchObject({
        statusCode: 400,
      });
      await expect(purchaseVehicle(vehicle.id, 2.5)).rejects.toMatchObject({
        statusCode: 400,
      });
      await expect(purchaseVehicle(vehicle.id, 'two')).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it('should throw 404 when vehicle ID does not exist', async () => {
      const nonExistentId = '60d0fe4f5311236168a109ca';
      await expect(purchaseVehicle(nonExistentId, 1)).rejects.toMatchObject({
        statusCode: 404,
        message: expect.stringMatching(/vehicle not found/i),
      });
    });

    it('CONCURRENCY TEST: should safely handle 10 parallel purchases when stock = 5, exactly 5 succeed and final stock is 0', async () => {
      const purchasePromises = Array.from({ length: 10 }, () =>
        purchaseVehicle(vehicle.id, 1)
          .then((res) => ({ status: 'fulfilled', value: res }))
          .catch((err) => ({ status: 'rejected', reason: err }))
      );

      const results = await Promise.all(purchasePromises);

      const successful = results.filter((r) => r.status === 'fulfilled');
      const failed = results.filter((r) => r.status === 'rejected');

      expect(successful).toHaveLength(5);
      expect(failed).toHaveLength(5);

      failed.forEach((f) => {
        expect(f.reason.statusCode).toBe(409);
        expect(f.reason.message).toMatch(/insufficient stock/i);
      });

      const finalInDB = await Vehicle.findById(vehicle.id);
      expect(finalInDB.quantity).toBe(0);
    });
  });

  describe('restockVehicle', () => {
    it('should increment stock atomically by requested quantity', async () => {
      const updated = await restockVehicle(vehicle.id, 10);
      expect(updated.quantity).toBe(15);

      const inDB = await Vehicle.findById(vehicle.id);
      expect(inDB.quantity).toBe(15);
    });

    it('should throw 400 for invalid quantities (0, negative, float, non-number, or above 10000)', async () => {
      await expect(restockVehicle(vehicle.id, 0)).rejects.toMatchObject({
        statusCode: 400,
      });
      await expect(restockVehicle(vehicle.id, -5)).rejects.toMatchObject({
        statusCode: 400,
      });
      await expect(restockVehicle(vehicle.id, 3.14)).rejects.toMatchObject({
        statusCode: 400,
      });
      await expect(restockVehicle(vehicle.id, 50000)).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it('should throw 404 when restocking non-existent vehicle ID', async () => {
      const nonExistentId = '60d0fe4f5311236168a109ca';
      await expect(restockVehicle(nonExistentId, 5)).rejects.toMatchObject({
        statusCode: 404,
        message: expect.stringMatching(/vehicle not found/i),
      });
    });
  });
});
