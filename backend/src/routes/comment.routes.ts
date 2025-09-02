import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller.js';
import { authenticateToken, optionalAuth } from '../middlewares/auth.middleware.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';
import { createCommentSchema, updateCommentSchema } from '../validation/comment.schema.js';
import { mongoIdSchema } from '../validation/idea.schema.js';
import { commentLimiter } from '../middlewares/rate-limit.middleware.js';
import config from '../config/index.js';
import { z } from 'zod';

const router = Router();

// Use rate limiting conditionally
const useRateLimit = config.NODE_ENV === 'production' || config.ENABLE_RATE_LIMITING;

const commentIdSchema = z.object({
  commentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid comment ID format')
});

// Public routes (with optional auth)
router.get('/:id/comments', validateParams(mongoIdSchema), optionalAuth, CommentController.getComments);

// Protected routes with conditional rate limiting
router.post('/:id/comments', 
  ...(useRateLimit ? [commentLimiter] : []),
  validateParams(mongoIdSchema), 
  validateBody(createCommentSchema), 
  authenticateToken, 
  CommentController.createComment
);

router.put('/comments/:commentId', 
  ...(useRateLimit ? [commentLimiter] : []),
  validateParams(commentIdSchema), 
  validateBody(updateCommentSchema), 
  authenticateToken, 
  CommentController.updateComment
);

router.delete('/comments/:commentId', 
  validateParams(commentIdSchema), 
  authenticateToken, 
  CommentController.deleteComment
);

export default router;
