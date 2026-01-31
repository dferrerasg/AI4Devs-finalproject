import { Router } from 'express';
import { PlanController } from '../controllers/plan.controller';
import { CreatePlanUseCase } from '@/application/use-cases/create-plan.use-case';
import { ListProjectPlansUseCase } from '@/application/use-cases/list-project-plans.use-case';
import { PrismaPlanRepository } from '@/infrastructure/database/repositories/prisma-plan.repository';
import { prisma } from '@/infrastructure/database/prisma';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ensureProjectPermission } from '../middlewares/project-permission.middleware';
import { ProjectRole } from '@prisma/client';

const router = Router({ mergeParams: true }); // Important to access :projectId from parent route

// Dependecy Injection
const planRepository = new PrismaPlanRepository(prisma);
const createPlanUseCase = new CreatePlanUseCase(planRepository);
const listProjectPlansUseCase = new ListProjectPlansUseCase(planRepository);
const planController = new PlanController(createPlanUseCase, listProjectPlansUseCase);

// Routes
// POST /api/projects/:projectId/plans
router.post(
  '/',
  authMiddleware,
  ensureProjectPermission([ProjectRole.OWNER, ProjectRole.EDITOR]),
  (req, res) => planController.create(req, res)
);

// GET /api/projects/:projectId/plans
router.get(
  '/',
  authMiddleware,
  ensureProjectPermission([ProjectRole.OWNER, ProjectRole.EDITOR, ProjectRole.VIEWER]),
  (req, res) => planController.list(req, res)
);

export { router as planRoutes };
