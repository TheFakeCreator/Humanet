import { Router } from 'express';
import { IdeaController } from '../controllers/idea.controller.js';
import { authenticateToken, optionalAuth } from '../middlewares/auth.middleware.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validation.middleware.js';
import { createIdeaSchema, ideaSearchSchema, mongoIdSchema } from '../validation/idea.schema.js';
import { createIdeaLimiter, upvoteLimiter } from '../middlewares/rate-limit.middleware.js';
import config from '../config/index.js';

const router = Router();

// Use rate limiting conditionally
const useRateLimit = config.NODE_ENV === 'production' || config.ENABLE_RATE_LIMITING;

// Public routes (with optional auth for personalization)
router.get('/', validateQuery(ideaSearchSchema), optionalAuth, IdeaController.getIdeas);
router.get('/:id', validateParams(mongoIdSchema), optionalAuth, IdeaController.getIdeaById);
router.get('/:id/tree', validateParams(mongoIdSchema), optionalAuth, IdeaController.getIdeaTree);

// Protected routes with conditional rate limiting
router.post('/', 
  ...(useRateLimit ? [createIdeaLimiter] : []),
  validateBody(createIdeaSchema), 
  authenticateToken, 
  IdeaController.createIdea
);
router.post('/:id/fork', 
  ...(useRateLimit ? [createIdeaLimiter] : []),
  validateParams(mongoIdSchema), 
  authenticateToken, 
  IdeaController.forkIdea
);
router.post('/:id/upvote', 
  ...(useRateLimit ? [upvoteLimiter] : []),
  validateParams(mongoIdSchema), 
  authenticateToken, 
  IdeaController.upvoteIdea
);

export default router;
