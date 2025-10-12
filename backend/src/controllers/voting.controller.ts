import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { VotingService } from '../services/voting.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export class VotingController {
  /**
   * Get active voting for an idea
   */
  static async getActiveVoting(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ideaId } = req.params;
      const voting = await VotingService.getActiveVoting(ideaId);

      res.json({
        success: true,
        data: { voting },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Submit a vote for a candidate
   */
  static async submitVote(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { ideaId } = req.params;
      const { candidateRequestId, supportingReason } = req.body;

      const result = await VotingService.submitVote(
        ideaId,
        req.user._id,
        candidateRequestId,
        supportingReason
      );

      res.json({
        success: true,
        data: result,
        message: 'Vote submitted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get voting results for an idea
   */
  static async getVotingResults(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { ideaId } = req.params;
      const results = await VotingService.getVotingResults(ideaId);

      res.json({
        success: true,
        data: { results },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Manually conclude voting (admin or idea creator only)
   */
  static async concludeVoting(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { ideaId } = req.params;
      const result = await VotingService.concludeVoting(ideaId, req.user._id);

      res.json({
        success: true,
        data: result,
        message: 'Voting concluded successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
