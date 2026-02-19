import { Request, Response } from 'express';
import { TechnologyService } from '../services/TechnologyService';
import { AppError } from '../middleware/errorHandler';

export class TechnologyController {
  private technologyService = new TechnologyService();

  getAllTechnologies = async (req: Request, res: Response) => {
    const { categoryId } = req.query;

    const technologies = await this.technologyService.getAllTechnologies(
      categoryId as string | undefined
    );

    res.json({
      status: 'success',
      data: technologies,
    });
  };

  getTechnologyById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const technology = await this.technologyService.getTechnologyById(id);

    if (!technology) {
      throw new AppError('Technology not found', 404);
    }

    res.json({
      status: 'success',
      data: technology,
    });
  };

  createTechnology = async (req: Request, res: Response) => {
    const { name, slug, description, icon, categoryId, order } = req.body;

    if (!name || !slug || !description || !icon || !categoryId) {
      throw new AppError('Missing required fields', 400);
    }

    const technology = await this.technologyService.createTechnology({
      name,
      slug,
      description,
      icon,
      categoryId,
      order,
    });

    res.status(201).json({
      status: 'success',
      data: technology,
    });
  };
}
