import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { railItems } from '../content';
import { useScrollToSection } from '../useScrollToSection';

/**
 * Fixed index on the left edge (wide screens only): shows where you are on the page and jumps to any section.
 * Hidden over the hero so the opening stays purely cinematic.
 */
export function SectionRail() {
  const [active, setActive] = useState<string | null>(null);
  const scrollTo = useScrollToSection();

  useEffect(() => {
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        // The section that fills most of the middle band of the screen wins.
        const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        setActive(best && best[1] > 0 ? best[0] : null);
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] },
    );
    railItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const activeIndex = railItems.findIndex((i) => i.id === active);

  return (
    <AnimatePresence>
      {active && (
        <motion.nav
          aria-label="Page sections"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.4 }}
          className="group/rail fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 min-[1600px]:block"
        >
          <ol className="flex flex-col gap-3">
            {railItems.map((item, i) => {
              const isActive = i === activeIndex;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(item.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className="flex items-center gap-3 py-0.5 text-left"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'h-px transition-all duration-500 ease-cinematic',
                        isActive ? 'w-8 bg-white' : i < activeIndex ? 'w-4 bg-white/45' : 'w-4 bg-white/20',
                      )}
                    />
                    <span
                      className={cn(
                        'font-mono text-[10px] tracking-[0.14em] uppercase transition-all duration-300',
                        // Labels only on hover / keyboard focus, so the rail never crowds the content.
                        'opacity-0 group-focus-within/rail:opacity-100 group-hover/rail:opacity-100',
                        isActive ? 'text-white' : 'text-white/50',
                      )}
                    >
                      {String(i + 1).padStart(2, '0')} {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
