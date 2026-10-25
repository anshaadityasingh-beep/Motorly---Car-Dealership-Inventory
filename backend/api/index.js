import { app } from '../src/app.js';
import { connectDB } from '../src/config/db.js';

/**
 * Vercel Serverless Function entry point.
 * Ensures cached MongoDB connection is established prior to processing Express request.
 */
export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.error('Serverless MongoDB connection failure:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({
        success: false,
        message: 'Database connection failed',
      })
    );
  }

  return app(req, res);
}
