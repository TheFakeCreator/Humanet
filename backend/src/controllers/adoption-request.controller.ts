import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { AdoptionRequestService } from '../services/adoption-request.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export class AdoptionRequestController {
  /**
   * Create a new adoption request
   */
  static async createAdoptionRequest(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { ideaId } = req.params;
      const adoptionRequest = await AdoptionRequestService.createRequest(
        ideaId,
        req.user._id,
        req.body
      );

      res.status(201).json({
        success: true,
        data: { adoptionRequest },
        message: 'Adoption request submitted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get adoption requests for an idea (for idea creator)
   */
  static async getAdoptionRequests(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { ideaId } = req.params;
      const { status } = req.query;

      const requests = await AdoptionRequestService.getRequestsForIdea(
        ideaId,
        req.user._id,
        status as string
      );

      res.json({
        success: true,
        data: { requests },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's own adoption requests
   */
  static async getMyAdoptionRequests(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { status } = req.query;
      const requests = await AdoptionRequestService.getUserRequests(req.user._id, status as string);

      res.json({
        success: true,
        data: { requests },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Respond to an adoption request (approve/reject)
   */
  static async respondToAdoptionRequest(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { requestId } = req.params;
      const { action, message } = req.body;

      const result = await AdoptionRequestService.respondToRequest(requestId, req.user._id, {
        action,
        message,
      });

      res.json({
        success: true,
        data: result,
        message: action === 'approve' ? 'Adoption request approved' : 'Adoption request rejected',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Withdraw an adoption request
   */
  static async withdrawAdoptionRequest(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { requestId } = req.params;

      await AdoptionRequestService.withdrawRequest(requestId, req.user._id);

      res.json({
        success: true,
        message: 'Adoption request withdrawn successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single adoption request details
   */
  static async getAdoptionRequestById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { requestId } = req.params;
      const request = await AdoptionRequestService.getRequestById(requestId, req.user._id);

      res.json({
        success: true,
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Manually trigger voting for an idea with multiple adoption requests
   */
  static async triggerVoting(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { ideaId } = req.params;
      const result = await AdoptionRequestService.manuallyTriggerVoting(ideaId, req.user._id);

      res.json({
        success: true,
        data: result,
        message: 'Voting triggered successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
