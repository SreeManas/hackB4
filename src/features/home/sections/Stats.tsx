import { FadeIn } from '@/components/motion/Reveal';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatBlock } from '@/components/product/StatBlock';
import { usePlatformStats } from '@/lib/api/queries';
import { sectionIds, stats } from '../content';
import { HomeSection } from '../components/HomeSection';

/** Editorial statistics band — figures in a report, not dashboard widgets. */
export function Stats() {
  const { data } = usePlatformStats();

  return (
    <HomeSection id={sectionIds.platform} className="py-[clamp(4rem,10vh,7rem)]">
      <FadeIn y={24}>
        <p className="mb-14 max-w-3xl text-[clamp(1.4rem,2.6vw,2.1rem)] leading-snug font-light text-white/85">
          {stats.lead}
        </p>
      </FadeIn>
      {data ? (
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {stats.items.map((s) => (
            <StatBlock key={s.key} value={data[s.key]} label={s.label} suffix={s.suffix} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5" role="status" aria-label="Loading">
          {stats.items.map((s) => (
            <Skeleton key={s.key} className="h-24" />
          ))}
        </div>
      )}
    </HomeSection>
  );
}
