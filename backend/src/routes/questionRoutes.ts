import { Router } from 'express';
import { QuestionController } from '../controllers/QuestionController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const questionController = new QuestionController();

router.get('/', asyncHandler(questionController.getQuestions));
router.get('/:id', asyncHandler(questionController.getQuestionById));
router.post('/', asyncHandler(questionController.createQuestion));

export default router;
