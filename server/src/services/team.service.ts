import { prisma } from '../config/prisma';
import { toTeamMemberDto, type TeamMemberDto } from '../utils/serializers';

export async function listTeamMembers(): Promise<TeamMemberDto[]> {
  const rows = await prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map(toTeamMemberDto);
}
