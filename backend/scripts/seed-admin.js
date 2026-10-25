import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/db.js';
import { seedAdminUser } from '../src/services/auth.service.js';

dotenv.config();

const runSeed = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Super Admin';

  if (!email || !password) {
    console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.');
    process.exit(1);
  }

  try {
    await connectDB();
    console.log('Connected to MongoDB. Seeding administrator account...');

    const result = await seedAdminUser({ name, email, password });

    if (result.created) {
      console.log(`Successfully created new admin account: ${result.user.email}`);
    } else {
      console.log(`Successfully updated existing admin account: ${result.user.email}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

runSeed();
