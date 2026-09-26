import type { Event } from '@/lib/api/types';

export type EventStatus = 'active' | 'upcoming' | 'completed';

const DAY = 1000 * 60 * 60 * 24;
/** An active event ending within this many days is flagged "closing". */
const CLOSING_DAYS = 3;

/** Derived from the dates, so the backend doesn't need to keep a status column in sync. */
export function getEventStatus(event: Pick<Event, 'start_date' | 'end_date'>, now = Date.now()): EventStatus {
  if (now < Date.parse(event.start_date)) return 'upcoming';
  if (now > Date.parse(event.end_date)) return 'completed';
  return 'active';
}

/** Whole days from now until `iso` (rounded up; 0 when it is today or past). */
const daysUntil = (iso: string, now: number) => Math.max(0, Math.ceil((Date.parse(iso) - now) / DAY));

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 'S'}`;

/** Short countdown for listings: "12 DAYS LEFT", "STARTS IN 9 DAYS", "ENDS TODAY", "ENDED". */
export function getEventTiming(event: Pick<Event, 'start_date' | 'end_date'>, now = Date.now()) {
  const status = getEventStatus(event, now);
  if (status === 'completed') return { status, closing: false, label: 'ENDED' };
  if (status === 'upcoming') {
    const d = daysUntil(event.start_date, now);
    return { status, closing: false, label: d === 0 ? 'STARTS TODAY' : `STARTS IN ${plural(d, 'DAY')}` };
  }
  const d = daysUntil(event.end_date, now);
  return { status, closing: d <= CLOSING_DAYS, label: d === 0 ? 'ENDS TODAY' : `${plural(d, 'DAY')} LEFT` };
}
