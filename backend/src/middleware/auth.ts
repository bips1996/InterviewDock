import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

// Extend Express Request type to include admin data
declare global {
  namespace Express {
    interface Request {
      admin?: {
        adminId: string;
        userId: string;
        isSuperAdmin: boolean;
      };
    }
  }
}

const authService = new AuthService();

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Access token is required',
      });
      return;
    }

    const decoded = await authService.verifyToken(token);

    if (!decoded) {
      res.status(403).json({
        status: 'error',
        message: 'Invalid or expired token',
      });
      return;
    }

    // Attach admin data to request
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
};

export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.admin?.isSuperAdmin) {
    res.status(403).json({
      status: 'error',
      message: 'This action requires super admin privileges',
    });
    return;
  }
  next();
};
