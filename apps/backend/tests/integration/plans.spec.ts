import request from 'supertest';
import app from '../../src/app';
import { prisma } from '@/infrastructure/database/prisma';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';

// Mock Prisma
jest.mock('@/infrastructure/database/prisma', () => ({
  prisma: {
    plan: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    projectMember: {
      findUnique: jest.fn(),
    },
    project: {
        findUnique: jest.fn()
    },
    $transaction: jest.fn((callback) => callback(prisma))
  },
}));

describe('Plan Integration', () => {
  const projectId = 'project-123';
  const userId = 'user-123';
  const plansUrl = `/api/projects/${projectId}/plans`;
  let validToken: string;

  beforeAll(() => {
    validToken = jwt.sign({ userId, email: 'test@example.com', role: 'CLIENT' }, env.JWT_SECRET, {
      expiresIn: '1h',
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/projects/:projectId/plans', () => {
    it('should create version 1 for a new sheet name', async () => {
      // Arrange
      const planData = { sheetName: 'Ground Floor' };

      // Mock Permissions (Owner)
      (prisma.projectMember.findUnique as jest.Mock).mockResolvedValue({
        projectId,
        userId,
        role: 'OWNER',
      });

      // Mock Project existence
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: projectId });

      // Mock Existing Plan check (None found)
      (prisma.plan.findFirst as jest.Mock).mockResolvedValue(null);

      // Mock Creation
      const createdPlan = {
        id: 'plan-1',
        projectId,
        sheetName: planData.sheetName,
        version: 1,
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.plan.create as jest.Mock).mockResolvedValue(createdPlan);

      // Act
      const response = await request(app)
        .post(plansUrl)
        .set('Authorization', `Bearer ${validToken}`)
        .send(planData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({
        sheetName: 'Ground Floor',
        version: 1
      }));
    });

    it('should create version 2 for an existing sheet name', async () => {
      // Arrange
      const planData = { sheetName: 'Ground Floor' };

      // Mock Permissions (Editor)
      (prisma.projectMember.findUnique as jest.Mock).mockResolvedValue({
        projectId,
        userId,
        role: 'EDITOR',
      });

      // Mock Project existence
       (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: projectId });

      // Mock Existing Plan check (Found v1)
      (prisma.plan.findFirst as jest.Mock).mockResolvedValue({
        projectId,
        sheetName: planData.sheetName,
        version: 1
      });

      // Mock Creation
      const createdPlan = {
        id: 'plan-2',
        projectId,
        sheetName: planData.sheetName,
        version: 2,
        status: 'DRAFT',
      };
      (prisma.plan.create as jest.Mock).mockResolvedValue(createdPlan);

      // Act
      const response = await request(app)
        .post(plansUrl)
        .set('Authorization', `Bearer ${validToken}`)
        .send(planData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.version).toBe(2);
    });

    it('should return 403 Forbidden for Viewer role', async () => {
      // Arrange
      const planData = { sheetName: 'Roof' };

      // Mock Permissions (Viewer)
      (prisma.projectMember.findUnique as jest.Mock).mockResolvedValue({
        projectId,
        userId,
        role: 'VIEWER',
      });

       // Mock Project existence
       (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: projectId });

      // Act
      const response = await request(app)
        .post(plansUrl)
        .set('Authorization', `Bearer ${validToken}`)
        .send(planData);

      // Assert
      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/projects/:projectId/plans', () => {
    it('should return plans grouped by sheetName', async () => {
      // Arrange
      // Mock Permissions (Viewer is allowed)
      (prisma.projectMember.findUnique as jest.Mock).mockResolvedValue({
        projectId,
        userId,
        role: 'VIEWER',
      });

      // Mock Project existence
       (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: projectId });

      // Mock Plans
      const plans = [
        { id: '1', sheetName: 'Ground', version: 1, projectId, status: 'ARCHIVED', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', sheetName: 'Ground', version: 2, projectId, status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() },
        { id: '3', sheetName: 'Roof', version: 1, projectId, status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() },
      ];
      
      (prisma.plan.findMany as jest.Mock).mockResolvedValue(plans);

      // Act
      const response = await request(app)
        .get(plansUrl)
        .set('Authorization', `Bearer ${validToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('Ground');
      expect(response.body.Ground).toHaveLength(2);
      expect(response.body).toHaveProperty('Roof');
      expect(response.body.Roof).toHaveLength(1);
    });
  });
});
