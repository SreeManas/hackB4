import { prisma } from '../config/prisma';
import { toBuilderDto, type BuilderDto } from '../utils/serializers';

/**
 * Public builders must have opted in to being featured (is_featured) and be open to joining a team.
 * Both flags are always required, so `?featured=true` and the plain listing are equivalent.
 */
export async function listBuilders(): Promise<BuilderDto[]> {
  const rows = await prisma.builder.findMany({
    where: { openToTeam: true, isFeatured: true },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
  });
  return rows.map(toBuilderDto);
}
