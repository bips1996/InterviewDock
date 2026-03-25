import { Router } from 'express';
import { QuestionController } from '../controllers/QuestionController';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const questionController = new QuestionController();

// Public routes
router.get('/', asyncHandler(questionController.getQuestions));
router.get('/:id', asyncHandler(questionController.getQuestionById));
router.post('/:id/like', asyncHandler(questionController.likeQuestion));
router.post('/:id/dislike', asyncHandler(questionController.dislikeQuestion));

// Protected routes (require authentication)
router.post('/', authenticateToken, asyncHandler(questionController.createQuestion));
router.put('/:id', authenticateToken, asyncHandler(questionController.updateQuestion));
router.delete('/:id', authenticateToken, asyncHandler(questionController.deleteQuestion));

export default router;
