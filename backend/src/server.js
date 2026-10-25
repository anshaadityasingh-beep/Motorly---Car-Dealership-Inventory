import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  try {
    await connectDB();
    console.log('Successfully connected to MongoDB.');

    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Only execute when run directly, not when imported
if (process.env.NODE_ENV !== 'test') {
  startServer();
}
