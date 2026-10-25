import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB } from '../../src/config/db.js';
import { config } from '../../src/config/env.js';

describe('Database Connection Unit Tests', () => {
  let mongod;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    config.mongoUri = mongod.getUri();
  }, 30000);

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  });

  it('should establish and cache the MongoDB connection', async () => {
    const conn1 = await connectDB();
    expect(conn1).toBeDefined();
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected

    const conn2 = await connectDB();
    expect(conn2).toBe(conn1); // Returns cached instance
  });

  it('should reset promise and rethrow error when connection fails', async () => {
    // Clear cache
    global.mongoose.conn = null;
    global.mongoose.promise = null;

    config.mongoUri = 'mongodb://invalid-host-that-does-not-exist:27017/db';

    await expect(connectDB()).rejects.toThrow();
    expect(global.mongoose.promise).toBeNull();

    // Restore working URI
    config.mongoUri = mongod.getUri();
  });
});
