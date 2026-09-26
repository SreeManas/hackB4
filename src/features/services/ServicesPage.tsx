import { useState } from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useServices } from '@/lib/api/queries';
import { InquiryModal } from './components/InquiryModal';
import { ServiceCard } from './components/ServiceCard';

const GRID = 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-8';

export default function ServicesPage() {
  const { data: services, isPending, isError, refetch } = useServices();
  const [selected, setSelected] = useState<string | null>(null);

  useDocumentMeta({
    title: 'Services',
    description:
      'Hackathon management, corporate innovation challenges, placement drives, incubation, mentorship and sponsorship services from HACKB4.',
  });

  return (
    <PageTransition>
      <Container className="pb-24">
        <PageHeader
          align="center"
          title="SERVICES"
          subtitle="Comprehensive solutions for colleges, corporates, and startups to drive innovation and community engagement."
        />
        {isPending ? (
          <SkeletonGrid count={6} gridClassName={GRID} itemClassName="h-[300px]" />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : services.length === 0 ? (
          <EmptyState title="No services to show right now" message="Please check back soon." />
        ) : (
          <div className={GRID}>
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} onSelect={() => setSelected(service.title)} />
            ))}
          </div>
        )}
      </Container>

      <InquiryModal service={selected} onClose={() => setSelected(null)} />
    </PageTransition>
  );
}
