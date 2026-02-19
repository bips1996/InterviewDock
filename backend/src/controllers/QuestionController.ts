import { Request, Response } from 'express';
import { QuestionService, QuestionFilters } from '../services/QuestionService';
import { AppError } from '../middleware/errorHandler';
import { getPaginationParams } from '../utils/pagination';
import { config } from '../config';
import { Difficulty } from '../entities/Question';

export class QuestionController {
  private questionService = new QuestionService();

  getQuestions = async (req: Request, res: Response) => {
    const { technologyId, difficulty, tag, search, page, limit } = req.query;

    // Build filters
    const filters: QuestionFilters = {};

    if (technologyId) {
      filters.technologyId = technologyId as string;
    }

    if (difficulty && Object.values(Difficulty).includes(difficulty as Difficulty)) {
      filters.difficulty = difficulty as Difficulty;
    }

    if (tag) {
      filters.tag = tag as string;
    }

    if (search) {
      filters.search = search as string;
    }

    // Get pagination params
    const pagination = getPaginationParams(
      page as string | undefined,
      limit as string | undefined,
      config.pagination.maxPageSize
    );

    const result = await this.questionService.getQuestions(filters, pagination);

    res.json({
      status: 'success',
      ...result,
    });
  };

  getQuestionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const question = await this.questionService.getQuestionById(id);

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    res.json({
      status: 'success',
      data: question,
    });
  };

  createQuestion = async (req: Request, res: Response) => {
    const { title, answer, codeSnippet, codeLanguage, difficulty, technologyId, tags } = req.body;

    if (!title || !answer || !difficulty || !technologyId) {
      throw new AppError('Missing required fields', 400);
    }

    if (!Object.values(Difficulty).includes(difficulty as Difficulty)) {
      throw new AppError('Invalid difficulty level', 400);
    }

    const question = await this.questionService.createQuestion({
      title,
      answer,
      codeSnippet,
      codeLanguage,
      difficulty: difficulty as Difficulty,
      technologyId,
      tags,
    });

    res.status(201).json({
      status: 'success',
      data: question,
    });
  };
}
