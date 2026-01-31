import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/infrastructure/database/prisma';
import { ProjectRole } from '@prisma/client';

export const ensureProjectPermission = (allowedRoles: ProjectRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore - 'user' is populated by authMiddleware
    const userId = req.user?.userId; 
    const projectId = req.params.projectId || req.body.projectId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    try {
      // 1. Check if user is member of the project
      const membership = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
      });

      if (!membership) {
        // Double check if user is the architect (owner) of the project directly 
        // usually Owner is also in members, but let's be safe or just strictly use members.
        // The Schema has 'ProjectMember', created at project creation. 
        // Let's assume strict membership.
        return res.status(403).json({ error: 'Access denied' });
      }

      // 2. Check role
      if (!allowedRoles.includes(membership.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};
