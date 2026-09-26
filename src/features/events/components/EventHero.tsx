import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Event } from '@/lib/api';
import { imageSrcSet, imageUrl } from '@/lib/image';

/** Parallax banner with title block; shows a skeleton while `event` is loading. */
export function EventHero({ event }: { event?: Event | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="relative h-[70vh] min-h-[420px] overflow-hidden">
      {event && (
        <motion.div style={{ y, opacity }} className="absolute inset-0">
          <img
            src={imageUrl(event.banner_image_url, 1600)}
            srcSet={imageSrcSet(event.banner_image_url, [800, 1600, 2400])}
            sizes="100vw"
            alt=""
            // React 18 only forwards the lowercase attribute (camelCase `fetchPriority` triggers a console warning).
            {...{ fetchpriority: 'high' }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black" />
        </motion.div>
      )}

      <Container size="lg" className="absolute inset-x-0 bottom-0 z-10 pb-12">
        {event ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.1em] uppercase backdrop-blur-md">
              {event.category}
            </span>
            <h1 className="mb-4 text-[clamp(2.25rem,6vw,4.5rem)] leading-tight font-bold tracking-[-0.02em]">
              {event.title}
            </h1>
            <p className="max-w-[700px] text-lg text-white/70 sm:text-xl">{event.short_summary}</p>
          </motion.div>
        ) : (
          <Skeleton className="h-40 max-w-[700px]" />
        )}
      </Container>
    </div>
  );
}
