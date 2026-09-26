import { prisma } from '../config/prisma';
import { toEventDto, type EventDto } from '../utils/serializers';

export const EVENT_CATEGORIES = ['hackathon', 'placement', 'workshop'] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const isEventCategory = (value: unknown): value is EventCategory =>
  typeof value === 'string' && (EVENT_CATEGORIES as readonly string[]).includes(value);

/** Published events only (past ones included), soonest start first. */
export async function listPublishedEvents(category?: EventCategory): Promise<EventDto[]> {
  const rows = await prisma.event.findMany({
    where: { isPublished: true, ...(category && { category }) },
    orderBy: [{ startDate: 'asc' }, { id: 'asc' }],
  });
  return rows.map(toEventDto);
}

/** Returns null for unknown AND unpublished events, so the two are indistinguishable. */
export async function findPublishedEventBySlug(slug: string): Promise<EventDto | null> {
  // Slug column is VARCHAR(255); a NUL byte is rejected by PostgreSQL. Neither can match a real slug.
  if (slug.length === 0 || slug.length > 255 || slug.includes('\u0000')) return null;

  const row = await prisma.event.findFirst({ where: { slug, isPublished: true } });
  return row ? toEventDto(row) : null;
}
