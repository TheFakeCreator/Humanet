import { Response, NextFunction } from 'express';
import { IdeaService } from '../services/idea.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export class IdeaController {
  static async createIdea(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      // Extract repository options from request body
      const { autoCreateRepository, repositoryTemplate, ...ideaData } = req.body;

      const idea = await IdeaService.createIdea(ideaData, req.user._id, {
        autoCreateRepository: autoCreateRepository === true,
        repositoryTemplate: repositoryTemplate || 'basic',
      });

      res.status(201).json({
        success: true,
        data: { idea },
        message: 'Idea created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getIdeas(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await IdeaService.getIdeas(req.query as any, req.user?._id);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getIdeaById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const idea = await IdeaService.getIdeaById(id, req.user?._id);

      res.json({
        success: true,
        data: { idea },
      });
    } catch (error) {
      next(error);
    }
  }

  static async forkIdea(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { id } = req.params;
      const fork = await IdeaService.forkIdea(id, req.user._id, req.body);

      res.status(201).json({
        success: true,
        data: { idea: fork },
        message: 'Idea forked successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async upvoteIdea(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { id } = req.params;
      const result = await IdeaService.upvoteIdea(id, req.user._id);

      res.json({
        success: true,
        data: result,
        message: result.upvoted ? 'Idea upvoted' : 'Upvote removed',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getIdeaTree(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { maxDepth } = req.query;

      const tree = await IdeaService.getIdeaTree(id, maxDepth ? parseInt(maxDepth as string) : 3);

      res.json({
        success: true,
        data: { tree },
      });
    } catch (error) {
      next(error);
    }
  }
}
