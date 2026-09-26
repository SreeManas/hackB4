import { motion } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useTilt } from '@/hooks/useTilt';
import type { TeamMember } from '@/lib/api';
import { useTeam } from '@/lib/api/queries';

const GRID = 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-x-8 gap-y-16';

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const tilt = useTilt(8);
  return (
    <motion.figure
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group flex flex-col items-center text-center [perspective:1000px]"
    >
      <motion.div
        {...tilt}
        className="relative mb-8 aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-sm bg-surface shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
      >
        <img
          src={member.image}
          alt={`Portrait of ${member.name}`}
          width={300}
          height={400}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-110 group-hover:grayscale-0"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-6 translate-y-4 text-xs font-semibold tracking-[0.3em] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          {member.role}
        </span>
      </motion.div>
      <figcaption>
        <h3 className="mb-2 text-2xl font-semibold tracking-[0.05em]">{member.name}</h3>
        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs tracking-[0.1em] text-white/80">
          {member.role}
        </span>
      </figcaption>
    </motion.figure>
  );
}

export default function TeamPage() {
  const { data: team, isPending, isError, refetch } = useTeam();
  useDocumentMeta({
    title: 'Our Team',
    description: 'Meet the visionaries, engineers, and community builders behind HACKB4.',
  });

  return (
    <PageTransition>
      <Container className="pb-24">
        <PageHeader
          align="center"
          className="mb-24"
          title="OUR TEAM"
          subtitle="The visionaries, engineers, and community builders behind HACKB4."
        />
        {isPending ? (
          <div className={GRID}>
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="mx-auto aspect-[3/4] w-full max-w-[300px]" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : team.length === 0 ? (
          <EmptyState title="Our team profiles are coming soon" message="Please check back soon." />
        ) : (
          <div className={GRID}>
            {team.map((member, i) => (
              <MemberCard key={member.id} member={member} index={i} />
            ))}
          </div>
        )}
      </Container>
    </PageTransition>
  );
}
