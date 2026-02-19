import { AppDataSource } from '../config/database';
import { Technology } from '../entities/Technology';

export class TechnologyService {
  private technologyRepository = AppDataSource.getRepository(Technology);

  async getAllTechnologies(categoryId?: string): Promise<Technology[]> {
    const queryBuilder = this.technologyRepository
      .createQueryBuilder('technology')
      .leftJoinAndSelect('technology.category', 'category')
      .orderBy('technology.order', 'ASC')
      .addOrderBy('technology.name', 'ASC');

    if (categoryId) {
      queryBuilder.where('technology.categoryId = :categoryId', { categoryId });
    }

    return await queryBuilder.getMany();
  }

  async getTechnologyById(id: string): Promise<Technology | null> {
    return await this.technologyRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async getTechnologyBySlug(slug: string): Promise<Technology | null> {
    return await this.technologyRepository.findOne({
      where: { slug },
      relations: ['category'],
    });
  }

  async createTechnology(data: {
    name: string;
    slug: string;
    description: string;
    icon: string;
    categoryId: string;
    order?: number;
  }): Promise<Technology> {
    const technology = this.technologyRepository.create(data);
    return await this.technologyRepository.save(technology);
  }
}
