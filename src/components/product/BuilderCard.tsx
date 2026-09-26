import type { Builder } from '@/lib/api/types';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/cn';
import { useComingSoon } from './coming-soon-context';
import { CardAction, CardStat, ProductCard } from './ProductCard';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

/**
 * Professional builder profile (GitHub × research community), not a social card:
 * monogram instead of a photo, role + stack + track record.
 */
export function BuilderCard({ builder, className }: { builder: Builder; className?: string }) {
  const openComingSoon = useComingSoon();

  return (
    <ProductCard className={cn('min-h-[260px]', className)}>
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 items-center justify-center rounded-[3px] border border-white/20 font-mono text-sm text-white/85 transition-colors duration-300 group-hover/card:border-white/50"
        >
          {initials(builder.name)}
        </span>
        {builder.open_to_team && (
          <Tag status="active" size="sm">
            Open to team
          </Tag>
        )}
      </div>

      <h3 className="mt-6 text-sm font-semibold tracking-[0.1em] text-white uppercase">{builder.name}</h3>
      <p className="mt-1 font-mono text-[11px] tracking-[0.06em] text-white/55 uppercase">
        {builder.role}
        {builder.city && <span className="text-white/35"> · {builder.city}</span>}
      </p>
      <p className="mt-4 text-sm text-white/65">{builder.stack.join(' · ')}</p>

      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
        <CardStat value={String(builder.hackathons_count).padStart(2, '0')} label="Hackathons" />
        <CardStat value={String(builder.projects_count).padStart(2, '0')} label="Projects" />
      </dl>

      <div className="mt-auto flex justify-end pt-5">
        <CardAction onClick={() => openComingSoon('builders')} srLabel={builder.name}>
          View profile
        </CardAction>
      </div>
    </ProductCard>
  );
}
