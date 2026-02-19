import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const categoryController = new CategoryController();

router.get('/', asyncHandler(categoryController.getAllCategories));
router.get('/:id', asyncHandler(categoryController.getCategoryById));

export default router;
