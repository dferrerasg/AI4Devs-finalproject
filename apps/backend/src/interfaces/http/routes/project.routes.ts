
import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { planRoutes } from './plan.routes';

const router = Router();
const projectController = new ProjectController();

router.use(authMiddleware);

router.post('/', projectController.create);
router.get('/', projectController.index);
router.delete('/:id', projectController.delete);

// Nested routes
router.use('/:projectId/plans', planRoutes);

export { router as projectRoutes };
