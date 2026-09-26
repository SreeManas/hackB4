import type { Event } from '@/lib/api/types';
import { Tag, type TagStatus } from '@/components/ui/Tag';
import { getEventTiming } from '@/lib/event-status';
import { formatCount, formatINRCompact } from '@/lib/format';
import { cn } from '@/lib/cn';
import { CardAction, CardStat, ProductCard } from './ProductCard';

const modeLabel: Record<Event['event_type'], string> = {
  virtual: 'ONLINE',
  in_person: 'ON-SITE',
  hybrid: 'HYBRID',
  pan_india: 'PAN-INDIA',
};

function teamLabel(min?: number, max?: number) {
  if (!max) return null;
  if (max === 1) return 'SOLO';
  return min && min !== max ? `TEAM ${min}–${max}` : `TEAM OF ${max}`;
}

/**
 * International event listing:  AI × FINTECH ········ ● ACTIVE
 *                               TITLE / summary / 24H · ONLINE · TEAM 2–4
 *                               1,240 BUILDERS   ₹2L PRIZE POOL
 *                               12 DAYS LEFT ··········· EXPLORE →
 */
export function HackathonCard({ event, className }: { event: Event; className?: string }) {
  const timing = getEventTiming(event);
  const status: TagStatus = timing.closing ? 'closing' : timing.status;
  const statusText = timing.closing ? 'Closing soon' : timing.status;

  const meta = [
    event.duration_hours ? `${event.duration_hours}H` : null,
    modeLabel[event.event_type],
    event.event_type === 'in_person' ? event.location.toUpperCase() : null,
    teamLabel(event.team_size_min, event.team_size_max),
  ].filter(Boolean);

  const hasStats = event.participants_count != null || event.prize_pool_inr != null;

  return (
    <ProductCard className={cn('min-h-[340px]', className)}>
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-[11px] tracking-[0.06em] text-white/55 uppercase">
          {event.tags?.length ? event.tags.join(' × ') : event.category}
        </p>
        <Tag status={status} size="sm">
          {statusText}
        </Tag>
      </div>

      <h3 className="mt-7 font-display text-[15px] leading-snug tracking-[0.06em] text-white uppercase transition-transform duration-500 ease-cinematic group-hover/card:translate-x-0.5 sm:text-base">
        {event.title}
      </h3>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/60">{event.short_summary}</p>

      <p className="mt-5 font-mono text-[11px] tracking-[0.06em] text-white/50">{meta.join('  ·  ')}</p>

      {hasStats && (
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
          {event.participants_count != null && (
            <CardStat
              value={formatCount(event.participants_count)}
              label={timing.status === 'upcoming' ? 'Registered' : 'Builders'}
            />
          )}
          {event.prize_pool_inr != null && (
            <CardStat value={formatINRCompact(event.prize_pool_inr)} label="Prize pool" />
          )}
        </dl>
      )}

      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
        <span
          className={cn(
            'font-mono text-[11px] tracking-[0.06em]',
            timing.closing ? 'text-warning' : timing.status === 'completed' ? 'text-white/40' : 'text-white/80',
          )}
        >
          {timing.label}
        </span>
        <CardAction to={`/events/${event.slug}`} srLabel={event.title}>
          {timing.status === 'completed' ? 'Results' : 'Explore'}
        </CardAction>
      </div>
    </ProductCard>
  );
}
