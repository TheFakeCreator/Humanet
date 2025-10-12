import { Router } from 'express';
import authRoutes from './auth.routes.js';
import ideaRoutes from './idea.routes.js';
import commentRoutes from './comment.routes.js';
import ideaFilesRoutes from './idea-files.routes.js';
import adoptionRequestRoutes from './adoption-request.routes.js';
import votingRoutes from './voting.routes.js';
import { ideaRepositoryRoutes } from './idea-repository.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/ideas', ideaRoutes);
router.use('/ideas', commentRoutes); // Comments are nested under ideas
router.use('/ideas', ideaFilesRoutes); // File system routes nested under ideas
router.use('/ideas', ideaRepositoryRoutes); // Repository integration routes
router.use('/adoption-requests', adoptionRequestRoutes); // Adoption request management
router.use('/voting', votingRoutes); // Democratic voting system

export default router;
