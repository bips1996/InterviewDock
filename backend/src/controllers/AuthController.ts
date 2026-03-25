import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, pin } = req.body;

      if (!userId || !pin) {
        res.status(400).json({
          status: 'error',
          message: 'User ID and PIN are required',
        });
        return;
      }

      const result = await this.authService.login(userId, pin);

      if (!result.success) {
        res.status(401).json({
          status: 'error',
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };

  createAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, pin, name, isSuperAdmin } = req.body;
      const creatorId = (req as any).admin?.adminId;

      if (!userId || !pin) {
        res.status(400).json({
          status: 'error',
          message: 'User ID and PIN are required',
        });
        return;
      }

      const result = await this.authService.createAdmin(
        { userId, pin, name, isSuperAdmin },
        creatorId
      );

      if (!result.success) {
        res.status(400).json({
          status: 'error',
          message: result.message,
        });
        return;
      }

      res.status(201).json({
        status: 'success',
        message: result.message,
        data: { adminId: result.adminId },
      });
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          status: 'error',
          message: 'Refresh token is required',
        });
        return;
      }

      const result = await this.authService.refreshAccessToken(refreshToken);

      if (!result.success) {
        res.status(401).json({
          status: 'error',
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: result.message,
        data: { accessToken: result.accessToken },
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as any).admin?.adminId;

      if (!adminId) {
        res.status(401).json({
          status: 'error',
          message: 'Unauthorized',
        });
        return;
      }

      const admin = await this.authService.getAdminById(adminId);

      if (!admin) {
        res.status(404).json({
          status: 'error',
          message: 'Admin not found',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: {
          id: admin.id,
          userId: admin.userId,
          name: admin.name,
          isSuperAdmin: admin.isSuperAdmin,
          lastLoginAt: admin.lastLoginAt,
        },
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };

  getAllAdmins = async (req: Request, res: Response): Promise<void> => {
    try {
      const isSuperAdmin = (req as any).admin?.isSuperAdmin;

      if (!isSuperAdmin) {
        res.status(403).json({
          status: 'error',
          message: 'Only super admins can view all admins',
        });
        return;
      }

      const admins = await this.authService.getAllAdmins();

      res.status(200).json({
        status: 'success',
        data: admins,
      });
    } catch (error) {
      console.error('Get all admins error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };
  updateAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { adminId } = req.params;
      const { name, pin, isActive } = req.body;
      const requesterId = (req as any).admin?.adminId;

      if (!adminId) {
        res.status(400).json({
          status: 'error',
          message: 'Admin ID is required',
        });
        return;
      }

      const result = await this.authService.updateAdmin(
        adminId,
        { name, pin, isActive },
        requesterId
      );

      if (!result.success) {
        res.status(400).json({
          status: 'error',
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      console.error('Update admin error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };
  deactivateAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { adminId } = req.params;
      const requesterId = (req as any).admin?.adminId;

      if (!adminId) {
        res.status(400).json({
          status: 'error',
          message: 'Admin ID is required',
        });
        return;
      }

      const result = await this.authService.deactivateAdmin(adminId, requesterId);

      if (!result.success) {
        res.status(400).json({
          status: 'error',
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      console.error('Deactivate admin error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };

  activateAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { adminId } = req.params;
      const requesterId = (req as any).admin?.adminId;

      if (!adminId) {
        res.status(400).json({
          status: 'error',
          message: 'Admin ID is required',
        });
        return;
      }

      const result = await this.authService.activateAdmin(adminId, requesterId);

      if (!result.success) {
        res.status(400).json({
          status: 'error',
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      console.error('Activate admin error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    // Since we're using JWT, logout is handled client-side by removing tokens
    // But we can add token blacklisting if needed in the future
    res.status(200).json({
      status: 'success',
      message: 'Logout successful',
    });
  };
}
