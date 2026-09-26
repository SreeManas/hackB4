import type { Project } from '@/lib/api/types';
import { Tag, TagList } from '@/components/ui/Tag';
import { cn } from '@/lib/cn';
import { useComingSoon } from './coming-soon-context';
import { CardAction, ProductCard } from './ProductCard';

/**
 * PROJECT 047 ················· WINNER
 * AURA HEALTH
 * Digital twin healthcare platform
 * AI · HEALTHCARE          [FASTAPI] [REACT]
 * BUILT BY  QUANTUM CODERS ········ VIEW PROJECT →
 *
 * `feature` = the large editorial variant (adds the description, bigger title).
 */
export function ProjectCard({
  project,
  feature = false,
  className,
}: {
  project: Project;
  feature?: boolean;
  className?: string;
}) {
  const openComingSoon = useComingSoon();

  return (
    <ProductCard className={cn(feature ? 'min-h-[420px] p-8 sm:p-10' : 'min-h-[300px]', className)}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] tracking-[0.1em] text-white/45">
          PROJECT {String(project.number).padStart(3, '0')}
        </p>
        {project.award && (
          <Tag tone="inverse" size="sm">
            {project.award}
          </Tag>
        )}
      </div>

      <h3
        className={cn(
          'mt-8 font-display leading-tight tracking-[0.06em] text-white uppercase transition-transform duration-500 ease-cinematic group-hover/card:translate-x-0.5',
          feature ? 'text-[clamp(1.5rem,3vw,2.25rem)]' : 'text-lg',
        )}
      >
        {project.title}
      </h3>
      <p className={cn('mt-3 text-white/70', feature ? 'text-lg' : 'text-sm')}>{project.tagline}</p>
      {feature && project.description && (
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/50">{project.description}</p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <p className="font-mono text-[11px] tracking-[0.08em] text-white/60">{project.categories.join('  ·  ')}</p>
        <TagList items={project.tech} label="Tech stack" />
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/10 pt-5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-white/40">BUILT BY</p>
          <p className="mt-1 truncate text-sm font-semibold tracking-[0.08em] text-white uppercase">
            {project.team_name}
          </p>
          {project.hackathon_title && (
            <p className="mt-1 truncate font-mono text-[10px] text-white/40 uppercase">@ {project.hackathon_title}</p>
          )}
        </div>
        <CardAction onClick={() => openComingSoon('projects')} srLabel={project.title} className="shrink-0">
          View project
        </CardAction>
      </div>
    </ProductCard>
  );
}
