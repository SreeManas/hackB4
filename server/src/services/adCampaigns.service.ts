import { prisma } from '../config/prisma';
import { toAdCampaignDto, type AdCampaignDto } from '../utils/serializers';

/** One active campaign for `page` (inside its optional date window), newest first; null if none. */
export async function findActiveAdCampaign(page: string): Promise<AdCampaignDto | null> {
  // target_page is VARCHAR(100); NUL bytes are rejected by PostgreSQL. Neither can match a real page.
  if (page.length > 100 || page.includes('\u0000')) return null;

  const now = new Date();
  const row = await prisma.adCampaign.findFirst({
    where: {
      isActive: true,
      targetPage: page,
      AND: [
        { OR: [{ startDate: null }, { startDate: { lte: now } }] },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ],
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  });
  return row ? toAdCampaignDto(row) : null;
}
