import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { signupSchema, loginSchema } from '../validation/auth.schema.js';
import { authLimiter } from '../middlewares/rate-limit.middleware.js';

const router = Router();

// Apply auth rate limiting to all auth routes
router.use(authLimiter);

// Public routes
router.post('/signup', validateBody(signupSchema), AuthController.signup);
router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/me', authenticateToken, AuthController.me);

// Public user profile
router.get('/users/:username', AuthController.getUserProfile);

export default router;
