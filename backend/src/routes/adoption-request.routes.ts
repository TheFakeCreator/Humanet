import { Router } from 'express';
import { AdoptionRequestController } from '../controllers/adoption-request.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';
import {
  createAdoptionRequestSchema,
  respondToAdoptionRequestSchema,
  getUserRequestsSchema,
  getIdeaRequestsSchema,
  getRequestByIdSchema,
} from '../validation/adoption-request.schema.js';

const router = Router();

// All adoption request routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/adoption-requests/:ideaId
 * @desc    Create a new adoption request for an idea
 * @access  Private (Authenticated users)
 */
router.post(
  '/:ideaId',
  validateBody(createAdoptionRequestSchema.shape.body),
  validateParams(createAdoptionRequestSchema.shape.params),
  AdoptionRequestController.createAdoptionRequest
);

/**
 * @route   GET /api/adoption-requests/idea/:ideaId
 * @desc    Get all adoption requests for a specific idea
 * @access  Private (Original creator only)
 */
router.get(
  '/idea/:ideaId',
  validateParams(getIdeaRequestsSchema.shape.params),
  AdoptionRequestController.getAdoptionRequests
);

/**
 * @route   GET /api/adoption-requests/user/:userId
 * @desc    Get all adoption requests made by a specific user
 * @access  Private (User can only see their own requests)
 */
router.get(
  '/user/:userId',
  validateParams(getUserRequestsSchema.shape.params),
  AdoptionRequestController.getMyAdoptionRequests
);

/**
 * @route   PUT /api/adoption-requests/:requestId/respond
 * @desc    Respond to an adoption request (approve/reject)
 * @access  Private (Original creator only)
 */
router.put(
  '/:requestId/respond',
  validateBody(respondToAdoptionRequestSchema.shape.body),
  validateParams(respondToAdoptionRequestSchema.shape.params),
  AdoptionRequestController.respondToAdoptionRequest
);

/**
 * @route   DELETE /api/adoption-requests/:requestId
 * @desc    Withdraw an adoption request
 * @access  Private (Request creator only)
 */
router.delete(
  '/:requestId',
  validateParams(getRequestByIdSchema.shape.params),
  AdoptionRequestController.withdrawAdoptionRequest
);

/**
 * @route   GET /api/adoption-requests/:requestId
 * @desc    Get a specific adoption request by ID
 * @access  Private (Creator or original idea creator only)
 */
router.get(
  '/:requestId',
  validateParams(getRequestByIdSchema.shape.params),
  AdoptionRequestController.getAdoptionRequestById
);

export default router;
