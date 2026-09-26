import { useDeferredValue, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';
import { FadeIn } from '@/components/motion/Reveal';
import { ScrollAdPopup } from '@/features/engagement/ScrollAdPopup';
import { PushOptIn } from '@/features/engagement/PushOptIn';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useEvents } from '@/lib/api/queries';
import { EventCard } from './components/EventCard';
import { EventFilters } from './components/EventFilters';
import { EVENT_CATEGORIES } from './categories';
import { EventSearch } from './components/EventSearch';

const GRID = 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,350px),1fr))] gap-8';

export default function EventsPage() {
  // Category lives in the URL (?category=hackathon) so filtered views are shareable.
  const [params, setParams] = useSearchParams();
  const requested = params.get('category') ?? 'all';
  const category = EVENT_CATEGORIES.some((c) => c.id === requested) ? requested : 'all';
  const { data: events, isPending, isError, refetch, isPlaceholderData } = useEvents(category);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const visible = useMemo(
    () =>
      (events ?? []).filter(
        (e) =>
          !deferredQuery ||
          [e.title, e.short_summary, e.location, e.event_type].some((f) => f.toLowerCase().includes(deferredQuery)),
      ),
    [events, deferredQuery],
  );

  useDocumentMeta({
    title: 'Events',
    description: 'Discover global hackathons, placement drives, workshops and open-source sprints hosted by HACKB4.',
  });

  const setCategory = (id: string) =>
    setParams(id === 'all' ? {} : { category: id }, { replace: true, preventScrollReset: true });

  return (
    <PageTransition>
      <Container className="pb-16">
        <PageHeader
          title="EVENTS"
          subtitle="Discover global hackathons, placement drives, and open source sprints designed to push the boundaries of technology."
        />
        <FadeIn delay={0.4}>
          <EventFilters active={category} onChange={setCategory} />
          <EventSearch value={query} onChange={setQuery} resultCount={events ? visible.length : undefined} />
        </FadeIn>

        {isPending ? (
          <SkeletonGrid count={3} gridClassName={GRID} itemClassName="h-[450px]" />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : visible.length === 0 ? (
          <p className="py-16 text-center text-muted">
            {deferredQuery ? `No events match “${query}”.` : 'No events in this category yet — check back soon.'}
          </p>
        ) : (
          <div
            className={`${GRID} transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}
            aria-busy={isPlaceholderData}
          >
            <AnimatePresence initial={false}>
              {visible.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </Container>

      <ScrollAdPopup page="/events" />
      <PushOptIn />
    </PageTransition>
  );
}
