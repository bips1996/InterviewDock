import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../entities/Admin';
import { AppDataSource } from '../config/database';

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    admin: {
      id: string;
      userId: string;
      name?: string;
      isSuperAdmin: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}

interface CreateAdminData {
  userId: string;
  pin: string;
  name?: string;
  isSuperAdmin?: boolean;
}

export class AuthService {
  private adminRepository: Repository<Admin>;
  private readonly JWT_SECRET: string;
  private readonly JWT_REFRESH_SECRET: string;
  private readonly JWT_EXPIRES_IN = '1h'; // Access token expires in 1 hour
  private readonly JWT_REFRESH_EXPIRES_IN = '7d'; // Refresh token expires in 7 days

  constructor() {
    this.adminRepository = AppDataSource.getRepository(Admin);
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';
  }

  async login(userId: string, pin: string): Promise<LoginResponse> {
    try {
      // Find admin by userId
      const admin = await this.adminRepository.findOne({
        where: { userId, isActive: true },
      });

      if (!admin) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Verify PIN
      const isPinValid = await bcrypt.compare(pin, admin.pinHash);

      if (!isPinValid) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Update last login time
      admin.lastLoginAt = new Date();
      await this.adminRepository.save(admin);

      // Generate tokens
      const accessToken = this.generateAccessToken(admin);
      const refreshToken = this.generateRefreshToken(admin);

      return {
        success: true,
        message: 'Login successful',
        data: {
          admin: {
            id: admin.id,
            userId: admin.userId,
            name: admin.name,
            isSuperAdmin: admin.isSuperAdmin,
          },
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
      };
    }
  }

  async createAdmin(data: CreateAdminData, creatorId?: string): Promise<{ success: boolean; message: string; adminId?: string }> {
    try {
      // Check if creator has permission (only super admins can create other admins)
      if (creatorId) {
        const creator = await this.adminRepository.findOne({
          where: { id: creatorId, isSuperAdmin: true, isActive: true },
        });

        if (!creator) {
          return {
            success: false,
            message: 'Only super admins can create new admins',
          };
        }
      }

      // Check if userId already exists
      const existingAdmin = await this.adminRepository.findOne({
        where: { userId: data.userId },
      });

      if (existingAdmin) {
        return {
          success: false,
          message: 'User ID already exists',
        };
      }

      // Validate PIN (should be 4-6 digits)
      if (!/^\d{4,6}$/.test(data.pin)) {
        return {
          success: false,
          message: 'PIN must be 4-6 digits',
        };
      }

      // Hash the PIN
      const pinHash = await bcrypt.hash(data.pin, 10);

      // Create new admin
      const newAdmin = this.adminRepository.create({
        userId: data.userId,
        pinHash,
        name: data.name,
        isSuperAdmin: data.isSuperAdmin || false,
        isActive: true,
      });

      await this.adminRepository.save(newAdmin);

      return {
        success: true,
        message: 'Admin created successfully',
        adminId: newAdmin.id,
      };
    } catch (error) {
      console.error('Create admin error:', error);
      return {
        success: false,
        message: 'An error occurred while creating admin',
      };
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<{ success: boolean; message: string; accessToken?: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as { adminId: string; userId: string };

      // Check if admin still exists and is active
      const admin = await this.adminRepository.findOne({
        where: { id: decoded.adminId, isActive: true },
      });

      if (!admin) {
        return {
          success: false,
          message: 'Invalid refresh token',
        };
      }

      // Generate new access token
      const accessToken = this.generateAccessToken(admin);

      return {
        success: true,
        message: 'Token refreshed successfully',
        accessToken,
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: 'Invalid or expired refresh token',
      };
    }
  }

  async getAdminById(adminId: string): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { id: adminId, isActive: true },
    });
  }

  async getAllAdmins(): Promise<Admin[]> {
    return this.adminRepository.find({
      select: ['id', 'userId', 'name', 'isActive', 'isSuperAdmin', 'lastLoginAt', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateAdmin(
    adminId: string,
    data: { name?: string; pin?: string; isActive?: boolean },
    requesterId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Check if requester is super admin or updating their own profile
      const requester = await this.adminRepository.findOne({
        where: { id: requesterId, isActive: true },
      });

      if (!requester) {
        return {
          success: false,
          message: 'Unauthorized',
        };
      }

      // Only super admins can update other admins or change active status
      if (adminId !== requesterId && !requester.isSuperAdmin) {
        return {
          success: false,
          message: 'Only super admins can update other admin accounts',
        };
      }

      const admin = await this.adminRepository.findOne({ where: { id: adminId } });

      if (!admin) {
        return {
          success: false,
          message: 'Admin not found',
        };
      }

      // Update fields
      if (data.name !== undefined) {
        admin.name = data.name;
      }

      if (data.pin) {
        // Validate PIN
        if (!/^\d{4,6}$/.test(data.pin)) {
          return {
            success: false,
            message: 'PIN must be 4-6 digits',
          };
        }
        admin.pinHash = await bcrypt.hash(data.pin, 10);
      }

      // Only super admins can change isActive status
      if (data.isActive !== undefined && requester.isSuperAdmin) {
        admin.isActive = data.isActive;
      }

      await this.adminRepository.save(admin);

      return {
        success: true,
        message: 'Admin updated successfully',
      };
    } catch (error) {
      console.error('Update admin error:', error);
      return {
        success: false,
        message: 'An error occurred while updating admin',
      };
    }
  }

  async deactivateAdmin(adminId: string, requesterId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if requester is super admin
      const requester = await this.adminRepository.findOne({
        where: { id: requesterId, isSuperAdmin: true, isActive: true },
      });

      if (!requester) {
        return {
          success: false,
          message: 'Only super admins can deactivate admins',
        };
      }

      // Don't allow deactivating self
      if (adminId === requesterId) {
        return {
          success: false,
          message: 'Cannot deactivate your own account',
        };
      }

      const admin = await this.adminRepository.findOne({ where: { id: adminId } });

      if (!admin) {
        return {
          success: false,
          message: 'Admin not found',
        };
      }

      // Don't allow deactivating super admins
      if (admin.isSuperAdmin) {
        return {
          success: false,
          message: 'Cannot deactivate super admin accounts',
        };
      }

      admin.isActive = false;
      await this.adminRepository.save(admin);

      return {
        success: true,
        message: 'Admin deactivated successfully',
      };
    } catch (error) {
      console.error('Deactivate admin error:', error);
      return {
        success: false,
        message: 'An error occurred while deactivating admin',
      };
    }
  }

  async activateAdmin(adminId: string, requesterId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if requester is super admin
      const requester = await this.adminRepository.findOne({
        where: { id: requesterId, isSuperAdmin: true, isActive: true },
      });

      if (!requester) {
        return {
          success: false,
          message: 'Only super admins can activate admins',
        };
      }

      const admin = await this.adminRepository.findOne({ where: { id: adminId } });

      if (!admin) {
        return {
          success: false,
          message: 'Admin not found',
        };
      }

      if (admin.isActive) {
        return {
          success: false,
          message: 'Admin is already active',
        };
      }

      admin.isActive = true;
      await this.adminRepository.save(admin);

      return {
        success: true,
        message: 'Admin activated successfully',
      };
    } catch (error) {
      console.error('Activate admin error:', error);
      return {
        success: false,
        message: 'An error occurred while activating admin',
      };
    }
  }

  private generateAccessToken(admin: Admin): string {
    return jwt.sign(
      {
        adminId: admin.id,
        userId: admin.userId,
        isSuperAdmin: admin.isSuperAdmin,
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  private generateRefreshToken(admin: Admin): string {
    return jwt.sign(
      {
        adminId: admin.id,
        userId: admin.userId,
      },
      this.JWT_REFRESH_SECRET,
      { expiresIn: this.JWT_REFRESH_EXPIRES_IN }
    );
  }

  async verifyToken(token: string): Promise<{ adminId: string; userId: string; isSuperAdmin: boolean } | null> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as {
        adminId: string;
        userId: string;
        isSuperAdmin: boolean;
      };
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
