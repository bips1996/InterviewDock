import { Router } from 'express';
import { QuestionController } from '../controllers/QuestionController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const questionController = new QuestionController();

router.get('/', asyncHandler(questionController.getQuestions));
router.get('/:id', asyncHandler(questionController.getQuestionById));
router.post('/', asyncHandler(questionController.createQuestion));
router.put('/:id', asyncHandler(questionController.updateQuestion));
router.delete('/:id', asyncHandler(questionController.deleteQuestion));
router.post('/:id/like', asyncHandler(questionController.likeQuestion));
router.post('/:id/dislike', asyncHandler(questionController.dislikeQuestion));

export default router;
