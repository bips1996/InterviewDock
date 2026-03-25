import { Router } from 'express';
import categoryRoutes from './categoryRoutes';
import technologyRoutes from './technologyRoutes';
import questionRoutes from './questionRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/technologies', technologyRoutes);
router.use('/questions', questionRoutes);

export default router;
