import { prisma } from '../config/prisma';
import { toTeamOpeningDto, type TeamOpeningDto } from '../utils/serializers';

/** Open teams only, newest first. */
export async function listOpenTeamOpenings(limit: number): Promise<TeamOpeningDto[]> {
  const rows = await prisma.teamOpening.findMany({
    where: { isOpen: true },
    include: { event: { select: { title: true } } },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: limit,
  });
  return rows.map(toTeamOpeningDto);
}
