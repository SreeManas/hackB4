import { prisma } from '../config/prisma';
import { toStatsDto, type StatsDto } from '../utils/serializers';

/**
 * Platform totals for the home page stats band (GET /stats).
 *
 * Source of truth per field:
 * - builders:    COUNT(*) FROM builders                                    (real)
 * - hackathons:  COUNT(*) FROM events WHERE category = 'hackathon'
 *                AND is_published                                         (real)
 * - projects:    COUNT(*) FROM projects                                    (real)
 * - countries:   no country field exists anywhere in the schema - there is
 *                nothing to count, so this is 0 rather than invented.
 * - submissions: no submissions table exists (see handover/05, which flags
 *                this as an admin-maintained number, not a COUNT query) -
 *                0 rather than invented or reused from another table.
 *
 * countries/submissions are placeholders until the business supplies a real
 * source (e.g. an admin-maintained key/value table); adding one now would be
 * a schema change this task is not asking for.
 */
export async function getStats(): Promise<StatsDto> {
  const [builders, hackathons, projects] = await Promise.all([
    prisma.builder.count(),
    prisma.event.count({ where: { category: 'hackathon', isPublished: true } }),
    prisma.project.count(),
  ]);

  return toStatsDto({ builders, hackathons, projects, countries: 0, submissions: 0 });
}
