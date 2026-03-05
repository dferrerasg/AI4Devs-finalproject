import { Request, Response, NextFunction } from 'express';

export const guestAccessMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const user = req.user;
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (user.role === 'GUEST') {
    // Extract the requested projectId from params
    const requestedProjectId = req.params.projectId || req.params.id;
    
    if (!requestedProjectId) {
      return res.status(400).json({ error: 'Project ID required' });
    }

    // Verify guest can only access their assigned project
    if (requestedProjectId !== user.projectId) {
      return res.status(403).json({ 
        error: 'Access denied: Guest can only access assigned project' 
      });
    }

    // Verify guest is only performing READ operations
    if (req.method !== 'GET') {
      return res.status(403).json({
        error: 'Access denied: Guest can only perform read operations'
      });
    }
  }
  
  return next();
};
