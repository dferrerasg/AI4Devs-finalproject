import { Invitation } from '../entities/invitation.entity';

export interface IInvitationRepository {
  save(invitation: Invitation): Promise<void>;
  findById(id: string): Promise<Invitation | null>;
  findByToken(token: string): Promise<Invitation | null>;
  findByProjectId(projectId: string): Promise<Invitation[]>;
  update(invitation: Invitation): Promise<void>;
  delete(id: string): Promise<void>;
}
