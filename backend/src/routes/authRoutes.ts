import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken, requireSuperAdmin } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.get('/admins', authenticateToken, requireSuperAdmin, authController.getAllAdmins);
router.post('/admins', authenticateToken, requireSuperAdmin, authController.createAdmin);
router.put('/admins/:adminId', authenticateToken, authController.updateAdmin);
router.patch('/admins/:adminId/activate', authenticateToken, requireSuperAdmin, authController.activateAdmin);
router.delete('/admins/:adminId', authenticateToken, requireSuperAdmin, authController.deactivateAdmin);

export default router;
