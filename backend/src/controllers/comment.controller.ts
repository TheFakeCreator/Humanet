import { Response, NextFunction } from 'express';
import { CommentService } from '../services/comment.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export class CommentController {
  static async createComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const { id: ideaId } = req.params;
      const comment = await CommentService.createComment(ideaId, req.user._id, req.body);
      
      res.status(201).json({
        success: true,
        data: { comment },
        message: 'Comment created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getComments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: ideaId } = req.params;
      const comments = await CommentService.getCommentsByIdeaId(ideaId);
      
      res.json({
        success: true,
        data: { comments }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const { commentId } = req.params;
      const { text } = req.body;
      
      const comment = await CommentService.updateComment(commentId, req.user._id, text);
      
      res.json({
        success: true,
        data: { comment },
        message: 'Comment updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const { commentId } = req.params;
      await CommentService.deleteComment(commentId, req.user._id);
      
      res.json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
