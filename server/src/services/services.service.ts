import { prisma } from '../config/prisma';
import { toServiceDto, type ServiceDto } from '../utils/serializers';

export async function listServices(): Promise<ServiceDto[]> {
  const rows = await prisma.service.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map(toServiceDto);
}
