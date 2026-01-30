
import { Request, Response } from 'express';
import { CreateProjectUseCase } from '@/application/use-cases/create-project.use-case';
import { GetUserProjectsUseCase } from '@/application/use-cases/get-user-projects.use-case';
import { DeleteProjectUseCase } from '@/application/use-cases/delete-project.use-case';
import { PrismaProjectRepository } from '@/infrastructure/database/repositories/prisma-project.repository';
import { PrismaUserRepository } from '@/infrastructure/database/repositories/prisma-user.repository';
import { CreateProjectDto } from '@/domain/dtos/create-project.dto';
import { MaxProjectsLimitReachedError, ProjectNotFoundError } from '@/domain/errors/project.errors';

export class ProjectController {
  private createProjectUseCase: CreateProjectUseCase;
  private getUserProjectsUseCase: GetUserProjectsUseCase;
  private deleteProjectUseCase: DeleteProjectUseCase;

  constructor() {
    const projectRepository = new PrismaProjectRepository();
    const userRepository = new PrismaUserRepository();
    
    this.createProjectUseCase = new CreateProjectUseCase(projectRepository, userRepository);
    this.getUserProjectsUseCase = new GetUserProjectsUseCase(projectRepository);
    this.deleteProjectUseCase = new DeleteProjectUseCase(projectRepository);
  }

  create = async (req: Request, res: Response) => {
    try {
      // @ts-ignore - userId injected by auth middleware
      const userId = req.user.userId;
      const dto: CreateProjectDto = req.body;

      const project = await this.createProjectUseCase.execute(userId, dto);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof MaxProjectsLimitReachedError) {
        res.status(403).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  index = async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const userId = req.user.userId;
      const projects = await this.getUserProjectsUseCase.execute(userId);
      res.status(200).json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const userId = req.user.userId;
      const { id } = req.params;

      await this.deleteProjectUseCase.execute(userId, id);
      res.status(204).send();
    } catch (error) {
       if (error instanceof ProjectNotFoundError) {
           res.status(404).json({ error: error.message });
       } else {
           res.status(500).json({ error: 'Internal Server Error' });
       }
    }
  }
}
