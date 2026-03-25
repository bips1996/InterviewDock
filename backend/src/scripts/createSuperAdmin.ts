import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { AuthService } from '../services/AuthService';

async function createSuperAdmin() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connected');

    const authService = new AuthService();

    // Create super admin
    const result = await authService.createAdmin(
      {
        userId: 'admin',
        pin: '123456', // Default PIN - CHANGE THIS IMMEDIATELY IN PRODUCTION
        name: 'Super Admin',
        isSuperAdmin: true,
      },
      undefined // No creator for initial super admin
    );

    if (result.success) {
      console.log('✅ Super admin created successfully!');
      console.log('User ID: admin');
      console.log('PIN: 123456');
      console.log('⚠️  WARNING: Change the PIN immediately after first login!');
    } else {
      console.log('❌ Failed to create super admin:', result.message);
    }

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
}

createSuperAdmin();
