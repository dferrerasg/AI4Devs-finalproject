import { IInvitationRepository } from '../../../domain/repositories/invitation.repository';
import { Invitation, InvitationStatus } from '../../../domain/entities/invitation.entity';
import { prisma } from '../prisma';

export class PrismaInvitationRepository implements IInvitationRepository {
  async save(invitation: Invitation): Promise<void> {
    await prisma.invitation.create({
      data: {
        id: invitation.id,
        projectId: invitation.projectId,
        email: invitation.email,
        token: invitation.token,
        expiresAt: invitation.expiresAt,
        status: invitation.status,
        createdAt: invitation.createdAt,
        updatedAt: invitation.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Invitation | null> {
    const inv = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!inv) return null;

    return new Invitation(
      inv.id,
      inv.projectId,
      inv.email,
      inv.token,
      inv.expiresAt,
      inv.status as InvitationStatus,
      inv.createdAt,
      inv.updatedAt
    );
  }

  async findByToken(token: string): Promise<Invitation | null> {
    const inv = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!inv) return null;

    return new Invitation(
      inv.id,
      inv.projectId,
      inv.email,
      inv.token,
      inv.expiresAt,
      inv.status as InvitationStatus,
      inv.createdAt,
      inv.updatedAt
    );
  }

  async findByProjectId(projectId: string): Promise<Invitation[]> {
    const invitations = await prisma.invitation.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map(
      (inv) =>
        new Invitation(
          inv.id,
          inv.projectId,
          inv.email,
          inv.token,
          inv.expiresAt,
          inv.status as InvitationStatus,
          inv.createdAt,
          inv.updatedAt
        )
    );
  }

  async update(invitation: Invitation): Promise<void> {
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        status: invitation.status,
        expiresAt: invitation.expiresAt,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.invitation.delete({
      where: { id },
    });
  }
}
