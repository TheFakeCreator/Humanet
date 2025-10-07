import { Router } from 'express';
import { IdeaFilesController } from '../controllers/idea-files.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validateParams } from '../middlewares/validation.middleware.js';
import { z } from 'zod';

const router = Router();

// Parameter validation schema
const ideaIdSchema = z.object({
  ideaId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid idea ID format'),
});

// Repository management routes
router.post(
  '/:ideaId/repository',
  authenticateToken,
  validateParams(ideaIdSchema),
  IdeaFilesController.createRepository
);

router.get(
  '/:ideaId/repository',
  validateParams(ideaIdSchema),
  IdeaFilesController.getRepositoryInfo
);

router.delete(
  '/:ideaId/repository',
  authenticateToken,
  validateParams(ideaIdSchema),
  IdeaFilesController.deleteRepository
);

// File listing routes
router.get('/:ideaId/files', validateParams(ideaIdSchema), IdeaFilesController.listFiles);

// File operations routes
router.get('/:ideaId/files/*', validateParams(ideaIdSchema), IdeaFilesController.getFile);

router.put(
  '/:ideaId/files/*',
  authenticateToken,
  validateParams(ideaIdSchema),
  IdeaFilesController.updateFile
);

router.post(
  '/:ideaId/files',
  authenticateToken,
  validateParams(ideaIdSchema),
  IdeaFilesController.createFile
);

router.delete(
  '/:ideaId/files/*',
  authenticateToken,
  validateParams(ideaIdSchema),
  IdeaFilesController.deleteFile
);

export default router;
