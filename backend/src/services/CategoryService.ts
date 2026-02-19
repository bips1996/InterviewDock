import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category';

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: { order: 'ASC', name: 'ASC' },
      relations: ['technologies'],
    });
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: ['technologies'],
    });
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { slug },
      relations: ['technologies'],
    });
  }
}
