import { Router } from 'express';
import { TechnologyController } from '../controllers/TechnologyController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const technologyController = new TechnologyController();

router.get('/', asyncHandler(technologyController.getAllTechnologies));
router.get('/:id', asyncHandler(technologyController.getTechnologyById));
router.post('/', asyncHandler(technologyController.createTechnology));

export default router;
