import { Plan } from './plan.entity';

export interface IPlanRepository {
  findLatestVersion(projectId: string, sheetName: string): Promise<Plan | null>;
  save(plan: Plan): Promise<Plan>;
  findByProject(projectId: string): Promise<Plan[]>;
}
