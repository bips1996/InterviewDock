import { AppDataSource } from '../config/database';
import { Question, Difficulty } from '../entities/Question';
import { Tag } from '../entities/Tag';
import { Technology } from '../entities/Technology';
import { PaginationParams, PaginatedResponse, createPaginatedResponse } from '../utils/pagination';
import { Like } from 'typeorm';

export interface QuestionFilters {
  technologyId?: string;
  difficulty?: Difficulty;
  tag?: string;
  search?: string;
  companyTag?: string;
  sortBy?: 'difficulty' | 'impressions' | 'recent';
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
      .leftJoinAndSelect('question.tags', 'tags');

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

    if (filters.companyTag) {
      queryBuilder.andWhere(':companyTag = ANY(question.companyTags)', {
        companyTag: filters.companyTag,
      });
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'difficulty';
    switch (sortBy) {
      case 'difficulty':
        // Sort by difficulty: Easy -> Medium -> Hard
        queryBuilder
          .addSelect(
            `CASE question.difficulty WHEN 'Easy' THEN 1 WHEN 'Medium' THEN 2 WHEN 'Hard' THEN 3 END`,
            'difficulty_order'
          )
          .addOrderBy('difficulty_order', 'ASC')
          .addOrderBy('question.createdAt', 'DESC');
        break;
      case 'impressions':
        // Sort by impressions (likes - dislikes) descending
        queryBuilder
          .addSelect('(question.likes - question.dislikes)', 'impression_score')
          .addOrderBy('impression_score', 'DESC')
          .addOrderBy('question.createdAt', 'DESC');
        break;
      case 'recent':
      default:
        queryBuilder.orderBy('question.createdAt', 'DESC');
        break;
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
    companyTags?: string[];
  }): Promise<Question> {
    // Generate question number
    const questionNumber = await this.generateQuestionNumber(data.technologyId);

    const question = this.questionRepository.create({
      questionNumber,
      title: data.title,
      answer: data.answer,
      codeSnippet: data.codeSnippet,
      codeLanguage: data.codeLanguage,
      difficulty: data.difficulty,
      technologyId: data.technologyId,
      companyTags: data.companyTags || [],
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

  /**
   * Generate a unique question number in format: _{TechSlug}-{Number}
   * Example: react-001, _nodejs-042
   */
  private async generateQuestionNumber(technologyId: string): Promise<string> {
    // Get technology to get its slug
    const technologyRepository = AppDataSource.getRepository(Technology);
    const technology = await technologyRepository.findOne({
      where: { id: technologyId },
    });

    if (!technology) {
      throw new Error('Technology not found');
    }

    // Find the highest question number for this technology
    const lastQuestion = await this.questionRepository
      .createQueryBuilder('question')
      .where('question.technologyId = :technologyId', { technologyId })
      .andWhere('question.questionNumber LIKE :pattern', {
        pattern: `${technology.slug}-%`,
      })
      .orderBy('question.questionNumber', 'DESC')
      .getOne();

    let nextNumber = 1;

    if (lastQuestion && lastQuestion.questionNumber) {
      // Extract number from format like "_react-001"
      const match = lastQuestion.questionNumber.match(/-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    // Format: _{slug}-{number padded to 3 digits}
    return `${technology.slug}-${String(nextNumber).padStart(3, '0')}`;
  }

  async updateQuestion(
    id: string,
    data: {
      title?: string;
      answer?: string;
      codeSnippet?: string;
      codeLanguage?: string;
      difficulty?: Difficulty;
      tags?: string[];
      companyTags?: string[];
    }
  ): Promise<Question | null> {
    const question = await this.getQuestionById(id);
    if (!question) {
      return null;
    }

    // Update fields
    if (data.title !== undefined) question.title = data.title;
    if (data.answer !== undefined) question.answer = data.answer;
    if (data.codeSnippet !== undefined) question.codeSnippet = data.codeSnippet;
    if (data.codeLanguage !== undefined) question.codeLanguage = data.codeLanguage;
    if (data.difficulty !== undefined) question.difficulty = data.difficulty;
    if (data.companyTags !== undefined) question.companyTags = data.companyTags;

    // Handle tags if provided
    if (data.tags !== undefined) {
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

  async deleteQuestion(id: string): Promise<boolean> {
    const result = await this.questionRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  /**
   * Like a question (increment likes count)
   */
  async likeQuestion(id: string): Promise<Question | null> {
    const question = await this.getQuestionById(id);
    if (!question) {
      return null;
    }

    question.likes += 1;
    return await this.questionRepository.save(question);
  }

  /**
   * Dislike a question (increment dislikes count)
   */
  async dislikeQuestion(id: string): Promise<Question | null> {
    const question = await this.getQuestionById(id);
    if (!question) {
      return null;
    }

    question.dislikes += 1;
    return await this.questionRepository.save(question);
  }

  /**
   * Get impression score for a question (likes - dislikes)
   */
  getImpressionScore(question: Question): number {
    return question.likes - question.dislikes;
  }
}
