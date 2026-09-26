import { prisma } from '../config/prisma';
import { toProjectDto, type ProjectDto } from '../utils/serializers';

/** Display order: by project number. */
export async function listProjects({ featuredOnly }: { featuredOnly: boolean }): Promise<ProjectDto[]> {
  const rows = await prisma.project.findMany({
    where: featuredOnly ? { isFeatured: true } : {},
    include: { event: { select: { title: true } } },
    orderBy: { number: 'asc' },
  });
  return rows.map(toProjectDto);
}
