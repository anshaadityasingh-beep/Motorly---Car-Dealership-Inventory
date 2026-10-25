import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

/**
 * Connect to the in-memory MongoDB instance.
 */
export const connectTestDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
};

/**
 * Clear all data from all collections.
 */
export const clearTestDB = async () => {
  if (!mongoose.connection.db) return;
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
};

/**
 * Disconnect and stop the in-memory MongoDB instance.
 */
export const closeTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
};
