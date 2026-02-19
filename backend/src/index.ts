import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { createApp } from './app';
import { config } from './config';

const startServer = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🔗 API: http://localhost:${config.port}/api`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();
