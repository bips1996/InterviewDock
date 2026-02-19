import { Router } from 'express';
import categoryRoutes from './categoryRoutes';
import technologyRoutes from './technologyRoutes';
import questionRoutes from './questionRoutes';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/technologies', technologyRoutes);
router.use('/questions', questionRoutes);

export default router;
