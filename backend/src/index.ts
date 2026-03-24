import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { createApp } from './app';
import { config } from './config';

const startServer = async () => {
  try {
    console.log('🚀 Starting server...');
    console.log(`📍 Environment: ${config.nodeEnv}`);
    console.log(`🔧 Port: ${config.port}`);
    
    // Log database configuration (without password)
    console.log('🔗 Database configuration:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '5432',
      database: process.env.DB_DATABASE || 'interviewdock',
      username: process.env.DB_USERNAME || 'postgres',
      migrations: 'enabled',
    });

    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    // Run pending migrations
    const pendingMigrations = await AppDataSource.showMigrations();
    if (pendingMigrations) {
      console.log('⚠️  Warning: There are pending migrations.');
      console.log('   Run: npm run migration:run');
    } else {
      console.log('✅ All migrations are up to date');
    }

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`🔗 API: http://localhost:${config.port}/api`);
      console.log(`💚 Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    process.exit(1);
  }
};

startServer();
