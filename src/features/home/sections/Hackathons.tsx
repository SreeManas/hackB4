import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { Tabs } from '@/components/ui/Tabs';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { HackathonCard } from '@/components/product/HackathonCard';
import { useEvents } from '@/lib/api/queries';
import type { Event } from '@/lib/api/types';
import { getEventStatus, type EventStatus } from '@/lib/event-status';
import { hackathons, sectionIds } from '../content';
import { HomeSection } from '../components/HomeSection';

const GRID = 'grid gap-5 md:grid-cols-2 xl:grid-cols-3';
const MAX_CARDS = 3;

const tabs: { id: EventStatus; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

/** Soonest-ending first for active, soonest-starting for upcoming, most recent for completed. */
const order: Record<EventStatus, (a: Event, b: Event) => number> = {
  active: (a, b) => Date.parse(a.end_date) - Date.parse(b.end_date),
  upcoming: (a, b) => Date.parse(a.start_date) - Date.parse(b.start_date),
  completed: (a, b) => Date.parse(b.end_date) - Date.parse(a.end_date),
};

export function Hackathons() {
  const { data, isPending, isError, refetch } = useEvents('hackathon');

  const byStatus = (status: EventStatus) =>
    (data ?? []).filter((e) => getEventStatus(e) === status).sort(order[status]);

  // Open on the first tab that has something to show.
  const defaultTab = tabs.find((t) => byStatus(t.id).length > 0)?.id ?? 'upcoming';

  return (
    <HomeSection id={sectionIds.hackathons}>
      <SectionHeading
        eyebrow={hackathons.eyebrow}
        title={hackathons.title}
        description={hackathons.description}
        action={
          <Button to={hackathons.viewAll.to} variant="tertiary" arrow>
            {hackathons.viewAll.label}
          </Button>
        }
      />

      {isPending ? (
        <SkeletonGrid count={3} gridClassName={GRID} itemClassName="h-[340px] rounded-[4px]" />
      ) : isError ? (
        <ErrorState message="We couldn’t load hackathons right now." onRetry={() => refetch()} />
      ) : (
        <Tabs
          // Remount once data arrives so the default tab reflects it.
          key={defaultTab}
          label="Hackathons by status"
          defaultValue={defaultTab}
          items={tabs.map((t) => {
            const list = byStatus(t.id);
            return {
              ...t,
              count: list.length,
              content: list.length ? (
                <Stagger className={GRID} stagger={0.08}>
                  {list.slice(0, MAX_CARDS).map((e) => (
                    <StaggerItem key={e.id} className="h-full">
                      <HackathonCard event={e} className="h-full" />
                    </StaggerItem>
                  ))}
                </Stagger>
              ) : (
                <EmptyState title={`No ${t.label.toLowerCase()} hackathons`} message={hackathons.empty[t.id]} />
              ),
            };
          })}
        />
      )}
    </HomeSection>
  );
}
