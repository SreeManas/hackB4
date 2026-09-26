import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { BuilderCard } from '@/components/product/BuilderCard';
import { TeamOpeningCard } from '@/components/product/TeamOpeningCard';
import { useComingSoon } from '@/components/product/coming-soon-context';
import { useFeaturedBuilders, useTeamOpenings } from '@/lib/api/queries';
import { people, sectionIds } from '../content';
import { HomeSection } from '../components/HomeSection';

export function People() {
  const builders = useFeaturedBuilders();
  const openings = useTeamOpenings();
  const openComingSoon = useComingSoon();

  return (
    <HomeSection id={sectionIds.people}>
      <SectionHeading
        eyebrow={people.eyebrow}
        title={people.title}
        description={people.description}
        action={
          <Button variant="tertiary" arrow onClick={() => openComingSoon('builders')}>
            {people.viewAll}
          </Button>
        }
      />

      <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
        {/* Builders */}
        {builders.isPending ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-[260px] rounded-[4px]" />
            ))}
          </div>
        ) : builders.isError ? (
          <ErrorState onRetry={() => builders.refetch()} />
        ) : builders.data.length === 0 ? (
          <EmptyState title="No featured builders yet" message={people.emptyBuilders} />
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2">
            {builders.data.map((b) => (
              <StaggerItem key={b.id} className="h-full">
                <BuilderCard builder={b} className="h-full" />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        {/* Team finder */}
        <aside
          aria-labelledby="team-finder-title"
          className="flex flex-col rounded-[4px] border border-white/10 bg-black/30 p-5 sm:p-6"
        >
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h3 id="team-finder-title" className="text-sm font-semibold tracking-[0.14em] text-white uppercase">
                {people.teamsTitle}
              </h3>
              <p className="mt-1 text-sm text-white/50">{people.teamsText}</p>
            </div>
            {openings.data && (
              <span className="font-mono text-[11px] text-white/45 tabular-nums">
                {String(openings.data.length).padStart(2, '0')} OPEN
              </span>
            )}
          </div>

          {openings.isPending ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-[150px] rounded-[4px]" />
              ))}
            </div>
          ) : openings.isError ? (
            <ErrorState onRetry={() => openings.refetch()} />
          ) : openings.data.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/50">{people.emptyTeams}</p>
          ) : (
            <Stagger className="flex flex-col gap-3" stagger={0.1}>
              {openings.data.map((o) => (
                <StaggerItem key={o.id}>
                  <TeamOpeningCard opening={o} />
                </StaggerItem>
              ))}
            </Stagger>
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="secondary" size="sm" arrow onClick={() => openComingSoon('teams')}>
              {people.postTeam}
            </Button>
          </div>
        </aside>
      </div>
    </HomeSection>
  );
}
