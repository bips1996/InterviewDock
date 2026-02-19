import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { AppError } from '../middleware/errorHandler';

export class CategoryController {
  private categoryService = new CategoryService();

  getAllCategories = async (req: Request, res: Response) => {
    const categories = await this.categoryService.getAllCategories();

    res.json({
      status: 'success',
      data: categories,
    });
  };

  getCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await this.categoryService.getCategoryById(id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    res.json({
      status: 'success',
      data: category,
    });
  };
}
