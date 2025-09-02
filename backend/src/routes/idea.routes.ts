import { Router } from 'express';
import { IdeaController } from '../controllers/idea.controller.js';
import { authenticateToken, optionalAuth } from '../middlewares/auth.middleware.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validation.middleware.js';
import { createIdeaSchema, ideaSearchSchema, mongoIdSchema } from '../validation/idea.schema.js';

const router = Router();

// Public routes (with optional auth for personalization)
router.get('/', validateQuery(ideaSearchSchema), optionalAuth, IdeaController.getIdeas);
router.get('/:id', validateParams(mongoIdSchema), optionalAuth, IdeaController.getIdeaById);
router.get('/:id/tree', validateParams(mongoIdSchema), optionalAuth, IdeaController.getIdeaTree);

// Protected routes
router.post('/', validateBody(createIdeaSchema), authenticateToken, IdeaController.createIdea);
router.post('/:id/fork', validateParams(mongoIdSchema), authenticateToken, IdeaController.forkIdea);
router.post('/:id/upvote', validateParams(mongoIdSchema), authenticateToken, IdeaController.upvoteIdea);

export default router;
