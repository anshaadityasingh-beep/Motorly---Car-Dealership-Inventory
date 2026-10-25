import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'FRONTEND_URL',
  'PORT',
];

// In test environment, assign default test configurations if missing
if (process.env.NODE_ENV === 'test') {
  process.env.PORT = process.env.PORT || '5001';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key_minimum_32_characters_long';
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
  process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
  process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test_db';
}

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variable(s): ${missingVars.join(', ')}. Please check your .env file.`
  );
}

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  frontendUrl: process.env.FRONTEND_URL,
};
