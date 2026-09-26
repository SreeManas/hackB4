import { prisma } from '../config/prisma';
import { toActivityDto, type ActivityDto } from '../utils/serializers';

/** Newest first. */
export async function listActivity(limit: number): Promise<ActivityDto[]> {
  const rows = await prisma.activity.findMany({
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: limit,
  });
  return rows.map(toActivityDto);
}
