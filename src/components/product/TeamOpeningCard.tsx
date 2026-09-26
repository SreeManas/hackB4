import type { TeamOpening } from '@/lib/api/types';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/cn';
import { useComingSoon } from './coming-soon-context';
import { CardAction, ProductCard } from './ProductCard';

/**
 * QUANTUM CODERS                         ▮▮▯▯ 2/4
 * @ HACKB4 GLOBAL AI CHALLENGE
 * LOOKING FOR  [AI ENGINEER] [FRONTEND DEVELOPER]
 *                                     JOIN TEAM →
 */
export function TeamOpeningCard({ opening, className }: { opening: TeamOpening; className?: string }) {
  const openComingSoon = useComingSoon();
  const open = Math.max(0, opening.team_size - opening.members_count);

  return (
    <ProductCard className={cn('p-5', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold tracking-[0.1em] text-white uppercase">{opening.team_name}</h3>
          <p className="mt-1 truncate font-mono text-[10px] text-white/45 uppercase">@ {opening.hackathon_title}</p>
        </div>
        <div
          role="img"
          className="flex shrink-0 items-center gap-2"
          aria-label={`${opening.members_count} of ${opening.team_size} members, ${open} open`}
        >
          <span aria-hidden="true" className="flex gap-0.5">
            {Array.from({ length: opening.team_size }, (_, i) => (
              <span
                key={i}
                className={cn(
                  'h-3 w-1.5 rounded-[1px]',
                  i < opening.members_count ? 'bg-white/80' : 'border border-white/25',
                )}
              />
            ))}
          </span>
          <span aria-hidden="true" className="font-mono text-[11px] text-white/60 tabular-nums">
            {opening.members_count}/{opening.team_size}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[10px] font-semibold tracking-[0.16em] text-white/40">LOOKING FOR</span>
        {opening.roles.map((role) => (
          <Tag key={role} size="sm">
            {role}
          </Tag>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <CardAction onClick={() => openComingSoon('teams')} srLabel={opening.team_name}>
          Join team
        </CardAction>
      </div>
    </ProductCard>
  );
}
