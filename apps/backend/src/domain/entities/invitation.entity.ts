export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED';

export class Invitation {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly email: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly status: InvitationStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
