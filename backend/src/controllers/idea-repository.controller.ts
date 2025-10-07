import { Request, Response } from 'express';
import { IdeaRepositoryService } from '../services/idea-repository.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export class IdeaRepositoryController {
  private repositoryService: IdeaRepositoryService;

  constructor() {
    this.repositoryService = new IdeaRepositoryService();
  }

  /**
   * POST /api/ideas/:id/repository
   * Create repository for an idea
   */
  createRepository = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { template = 'basic' } = req.body;

      if (!['basic', 'research', 'technical'].includes(template)) {
        throw new AppError('Invalid template. Must be basic, research, or technical', 400);
      }

      await this.repositoryService.createIdeaRepository(id, template);

      res.status(201).json({
        success: true,
        message: 'Repository created successfully',
        data: { ideaId: id, template },
      });
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Failed to create repository', 500);
    }
  };

  /**
   * DELETE /api/ideas/:id/repository
   * Delete repository for an idea
   */
  deleteRepository = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      await this.repositoryService.deleteIdeaRepository(id);

      res.json({
        success: true,
        message: 'Repository deleted successfully',
        data: { ideaId: id },
      });
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Failed to delete repository', 500);
    }
  };

  /**
   * GET /api/ideas/:id/repository
   * Get repository overview
   */
  getRepositoryOverview = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const overview = await this.repositoryService.getRepositoryOverview(id);

      res.json({
        success: true,
        data: overview,
      });
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new AppError('Failed to get repository overview', 500);
    }
  };

  /**
   * POST /api/ideas/:id/repository/sync
   * Sync idea data with repository files
   */
  syncRepository = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      await this.repositoryService.syncIdeaWithRepository(id);

      res.json({
        success: true,
        message: 'Repository synced successfully',
        data: { ideaId: id },
      });
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Failed to sync repository', 500);
    }
  };

  /**
   * POST /api/admin/migrate-repositories
   * Migrate existing ideas to include repository metadata
   * (Admin only endpoint)
   */
  migrateRepositories = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.repositoryService.migrateExistingIdeas();

      res.json({
        success: true,
        message: 'Migration completed',
        data: result,
      });
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Migration failed', 500);
    }
  };
}
