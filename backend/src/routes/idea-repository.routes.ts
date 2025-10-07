import { Router } from 'express';
import { IdeaRepositoryController } from '../controllers/idea-repository.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';
import { z } from 'zod';

const router = Router();
const repositoryController = new IdeaRepositoryController();

// Validation schemas
const createRepositorySchema = z.object({
  template: z.enum(['basic', 'research', 'technical']).optional().default('basic'),
});

const ideaIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid idea ID format'),
});

// Repository management routes
router.post(
  '/:id/repository',
  authenticateToken,
  validateBody(createRepositorySchema),
  validateParams(ideaIdSchema),
  repositoryController.createRepository
);

router.get(
  '/:id/repository',
  authenticateToken,
  validateParams(ideaIdSchema),
  repositoryController.getRepositoryOverview
);

router.delete(
  '/:id/repository',
  authenticateToken,
  validateParams(ideaIdSchema),
  repositoryController.deleteRepository
);

router.post(
  '/:id/repository/sync',
  authenticateToken,
  validateParams(ideaIdSchema),
  repositoryController.syncRepository
);

// Admin routes
router.post(
  '/admin/migrate-repositories',
  authenticateToken,
  // TODO: Add admin role check middleware
  repositoryController.migrateRepositories
);

export { router as ideaRepositoryRoutes };
