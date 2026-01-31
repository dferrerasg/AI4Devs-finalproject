import { IPlanRepository } from '@/domain/plans/plan.repository';
import { Plan } from '@/domain/plans/plan.entity';

export class ListProjectPlansUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute(projectId: string): Promise<Record<string, Plan[]>> {
    const plans = await this.planRepository.findByProject(projectId);
    
    // Group by sheetName
    const grouped: Record<string, Plan[]> = {};
    
    plans.forEach(plan => {
      if (!grouped[plan.sheetName]) {
        grouped[plan.sheetName] = [];
      }
      grouped[plan.sheetName].push(plan);
    });

    return grouped;
  }
}
