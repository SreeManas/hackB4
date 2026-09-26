import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { ease } from '@/components/motion/presets';
import { ProjectCard } from '@/components/product/ProjectCard';
import { useComingSoon } from '@/components/product/coming-soon-context';
import { useFeaturedProjects } from '@/lib/api/queries';
import { cn } from '@/lib/cn';
import { projects as copy, sectionIds } from '../content';
import { FilterChips } from '../components/FilterChips';
import { HomeSection } from '../components/HomeSection';

const ALL = 'All';

export function Projects() {
  const { data, isPending, isError, refetch } = useFeaturedProjects();
  const openComingSoon = useComingSoon();
  const [filter, setFilter] = useState(ALL);

  const domains = useMemo(() => [ALL, ...new Set((data ?? []).flatMap((p) => p.categories))], [data]);
  const visible = (data ?? []).filter((p) => filter === ALL || p.categories.includes(filter));

  return (
    <HomeSection id={sectionIds.projects}>
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        action={
          <Button variant="tertiary" arrow onClick={() => openComingSoon('projects')}>
            {copy.viewAll}
          </Button>
        }
      />

      {isPending ? (
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <Skeleton className="h-[440px] rounded-[4px]" />
          <div className="grid gap-5">
            <Skeleton className="h-[210px] rounded-[4px]" />
            <Skeleton className="h-[210px] rounded-[4px]" />
          </div>
        </div>
      ) : isError ? (
        <ErrorState message="We couldn’t load projects right now." onRetry={() => refetch()} />
      ) : data.length === 0 ? (
        <EmptyState title="No projects yet" message={copy.empty} />
      ) : (
        <>
          <FilterChips
            options={domains}
            value={filter}
            onChange={setFilter}
            label="Filter projects by domain"
            className="mb-8"
          />
          {visible.length ? (
            // Asymmetric editorial grid: the first project is the large feature card.
            <motion.div layout className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease }}
                    className={cn(i === 0 && visible.length > 1 && 'lg:row-span-2')}
                  >
                    <ProjectCard project={p} feature={i === 0} className="h-full" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <EmptyState title="No projects in this domain yet" />
          )}
        </>
      )}
    </HomeSection>
  );
}
