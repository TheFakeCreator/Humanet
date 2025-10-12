import { Router } from 'express';
import { VotingController } from '../controllers/voting.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';
import { submitVoteSchema, concludeVotingSchema } from '../validation/voting.schema.js';

const router = Router();

/**
 * @route   GET /api/voting/:ideaId
 * @desc    Get active voting data for an idea
 * @access  Public
 */
router.get('/:ideaId', VotingController.getActiveVoting);

/**
 * @route   POST /api/voting/:ideaId/vote
 * @desc    Submit a vote for a candidate
 * @access  Private (Authenticated users)
 */
router.post(
  '/:ideaId/vote',
  authenticateToken,
  validateBody(submitVoteSchema.shape.body),
  validateParams(submitVoteSchema.shape.params),
  VotingController.submitVote
);

/**
 * @route   GET /api/voting/:ideaId/results
 * @desc    Get voting results for an idea
 * @access  Public
 */
router.get('/:ideaId/results', VotingController.getVotingResults);

/**
 * @route   POST /api/voting/:ideaId/conclude
 * @desc    Manually conclude voting (idea creator only)
 * @access  Private (Idea creator only)
 */
router.post(
  '/:ideaId/conclude',
  authenticateToken,
  validateParams(concludeVotingSchema.shape.params),
  VotingController.concludeVoting
);

export default router;
