import { Router } from 'express';
import authRoutes from './auth.routes.js';
import ideaRoutes from './idea.routes.js';
import commentRoutes from './comment.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/ideas', ideaRoutes);
router.use('/ideas', commentRoutes); // Comments are nested under ideas

export default router;
