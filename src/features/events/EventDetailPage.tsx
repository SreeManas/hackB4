import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';
import NotFoundPage from '@/features/not-found/NotFoundPage';
import { useEvent } from '@/lib/api/queries';
import { EventHero } from './components/EventHero';
import { EventInfoPanel } from './components/EventInfoPanel';
import { useEventMeta } from './useEventMeta';

export default function EventDetailPage() {
  const { slug = '' } = useParams();
  const { data: event, isPending, isError, refetch } = useEvent(slug);
  useEventMeta(event);

  if (!isPending && !isError && !event) return <NotFoundPage />;

  return (
    <PageTransition offsetNav={false}>
      <EventHero event={event} />

      <Container size="lg" className="py-16">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !event ? (
          <Skeleton className="h-64" />
        ) : (
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="mb-6 text-2xl font-semibold tracking-[0.1em]">ABOUT THE EVENT</h2>
              <div className="space-y-6 text-lg leading-loose text-white/70">
                <p>{event.detailed_description}</p>
                <p>
                  Join an elite cohort of developers and designers. Build tools that shape the future. Compete for
                  global recognition and substantial prize pools.
                </p>
              </div>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <EventInfoPanel event={event} />
            </motion.aside>
          </div>
        )}
      </Container>
    </PageTransition>
  );
}
