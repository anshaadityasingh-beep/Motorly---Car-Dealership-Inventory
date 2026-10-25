import { connectTestDB, clearTestDB, closeTestDB } from '../setup/db.js';
import { Vehicle } from '../../src/models/vehicle.model.js';
import { VEHICLE_CATEGORIES } from '../../src/constants/vehicleCategories.js';

describe('Vehicle Model Unit Tests', () => {
  beforeAll(async () => {
    await connectTestDB();
  }, 30000);

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  const validVehicleData = {
    make: 'Tesla',
    model: 'Model 3',
    category: 'Electric',
    price: 3500000,
    quantity: 5,
    year: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89',
  };

  it('should create and save a vehicle with valid attributes and map _id to id', async () => {
    const vehicle = await Vehicle.create(validVehicleData);

    expect(vehicle.make).toBe('Tesla');
    expect(vehicle.model).toBe('Model 3');
    expect(vehicle.category).toBe('Electric');
    expect(vehicle.price).toBe(3500000);
    expect(vehicle.quantity).toBe(5);
    expect(vehicle.year).toBe(2024);

    const json = vehicle.toJSON();
    expect(json.id).toBe(vehicle._id.toString());
    expect(json._id).toBeUndefined();
    expect(json.__v).toBeUndefined();
  });

  it('should default quantity to 0 when not provided', async () => {
    const { quantity, ...dataWithoutQuantity } = validVehicleData;
    const vehicle = await Vehicle.create(dataWithoutQuantity);
    expect(vehicle.quantity).toBe(0);
  });

  it('should reject invalid category not in VEHICLE_CATEGORIES enum', async () => {
    await expect(
      Vehicle.create({
        ...validVehicleData,
        category: 'RocketShip',
      })
    ).rejects.toThrow();
  });

  it('should reject negative price and negative quantity', async () => {
    await expect(
      Vehicle.create({
        ...validVehicleData,
        price: -100,
      })
    ).rejects.toThrow();

    await expect(
      Vehicle.create({
        ...validVehicleData,
        quantity: -5,
      })
    ).rejects.toThrow();
  });

  it('should require make, model, category, and price', async () => {
    await expect(Vehicle.create({})).rejects.toThrow();
  });
});
