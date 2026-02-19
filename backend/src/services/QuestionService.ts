import { AppDataSource } from '../config/database';
import { Question, Difficulty } from '../entities/Question';
import { Tag } from '../entities/Tag';
import { PaginationParams, PaginatedResponse, createPaginatedResponse } from '../utils/pagination';
import { Like } from 'typeorm';

export interface QuestionFilters {
  technologyId?: string;
  difficulty?: Difficulty;
  tag?: string;
  search?: string;
}

export class QuestionService {
  private questionRepository = AppDataSource.getRepository(Question);

  async getQuestions(
    filters: QuestionFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Question>> {
    const queryBuilder = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.technology', 'technology')
      .leftJoinAndSelect('technology.category', 'category')
      .leftJoinAndSelect('question.tags', 'tags')
      .orderBy('question.createdAt', 'DESC');

    // Apply filters
    if (filters.technologyId) {
      queryBuilder.andWhere('question.technologyId = :technologyId', {
        technologyId: filters.technologyId,
      });
    }

    if (filters.difficulty) {
      queryBuilder.andWhere('question.difficulty = :difficulty', {
        difficulty: filters.difficulty,
      });
    }

    if (filters.tag) {
      queryBuilder.andWhere('tags.slug = :tag', { tag: filters.tag });
    }

    if (filters.search) {
      queryBuilder.andWhere('LOWER(question.title) LIKE LOWER(:search)', {
        search: `%${filters.search}%`,
      });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const skip = (pagination.page - 1) * pagination.limit;
    queryBuilder.skip(skip).take(pagination.limit);

    const questions = await queryBuilder.getMany();

    return createPaginatedResponse(questions, total, pagination);
  }

  async getQuestionById(id: string): Promise<Question | null> {
    return await this.questionRepository.findOne({
      where: { id },
      relations: ['technology', 'technology.category', 'tags'],
    });
  }

  async getQuestionsByTechnologyId(technologyId: string): Promise<Question[]> {
    return await this.questionRepository.find({
      where: { technologyId },
      relations: ['tags'],
      order: { createdAt: 'DESC' },
    });
  }

  async createQuestion(data: {
    title: string;
    answer: string;
    codeSnippet?: string;
    codeLanguage?: string;
    difficulty: Difficulty;
    technologyId: string;
    tags?: string[];
  }): Promise<Question> {
    const question = this.questionRepository.create({
      title: data.title,
      answer: data.answer,
      codeSnippet: data.codeSnippet,
      codeLanguage: data.codeLanguage,
      difficulty: data.difficulty,
      technologyId: data.technologyId,
    });

    // Handle tags if provided
    if (data.tags && data.tags.length > 0) {
      const tagRepository = AppDataSource.getRepository(Tag);
      const tagEntities = await Promise.all(
        data.tags.map(async (tagName) => {
          const slug = tagName.toLowerCase().replace(/\s+/g, '-');
          let tag = await tagRepository.findOne({ where: { slug } });
          if (!tag) {
            tag = tagRepository.create({ name: tagName, slug });
            await tagRepository.save(tag);
          }
          return tag;
        })
      );
      question.tags = tagEntities;
    }

    return await this.questionRepository.save(question);
  }
}
