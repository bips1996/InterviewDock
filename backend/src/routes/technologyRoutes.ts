import { Router } from 'express';
import { TechnologyController } from '../controllers/TechnologyController';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const technologyController = new TechnologyController();

// Public routes
router.get('/', asyncHandler(technologyController.getAllTechnologies));
router.get('/:id', asyncHandler(technologyController.getTechnologyById));

// Protected routes (require authentication)
router.post('/', authenticateToken, asyncHandler(technologyController.createTechnology));
router.put('/:id', authenticateToken, asyncHandler(technologyController.updateTechnology));
router.delete('/:id', authenticateToken, asyncHandler(technologyController.deleteTechnology));

export default router;
