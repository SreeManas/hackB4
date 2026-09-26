import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { usePointerParallax } from '@/hooks/usePointerParallax';
import { useEvents } from '@/lib/api/queries';
import { getEventStatus } from '@/lib/event-status';
import { hero, sectionIds } from '../content';
import { useScrollToSection } from '../useScrollToSection';

/** Parallax depth per layer (px of travel at the screen edge). */
const depth = (px: number) => ({ translate: `calc(var(--px, 0) * ${px}px) calc(var(--py, 0) * ${px}px)` });

const Corner = ({ position, items }: { position: string; items: readonly string[] }) => (
  <div className={`corner-ui ${position}`} aria-hidden="true">
    <div className="flex flex-col [align-items:inherit] gap-2" style={depth(-12)}>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  </div>
);

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  usePointerParallax(ref);
  const scrollTo = useScrollToSection();
  const { data: events } = useEvents('hackathon');
  const live = events?.filter((e) => getEventStatus(e) === 'active').length ?? 0;

  return (
    <section ref={ref} className="hero-section relative flex h-svh w-full items-center justify-center p-8">
      <Corner position="top-left" items={hero.corners.topLeft} />
      <Corner position="top-right" items={hero.corners.topRight} />

      <div className="hero-center -mt-[6vh] flex flex-col items-center text-center">
        <div style={depth(24)} className="flex flex-col items-center">
          <h1 className="mb-6 text-[clamp(2.75rem,10vw,8rem)] leading-none tracking-[0.2em] [text-shadow:0_4px_30px_rgba(0,0,0,0.8)]">
            <BrandLogo className="tracking-[0.2em]" />
          </h1>
          <p
            className="font-display text-[clamp(0.8rem,1.8vw,1.15rem)] tracking-[0.4em] text-white/85"
            style={depth(10)}
          >
            {hero.headline}
          </p>
          <p
            className="mt-6 max-w-xl text-[clamp(0.95rem,1.4vw,1.1rem)] leading-relaxed text-white/55"
            style={depth(6)}
          >
            {hero.statement}
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Button to={hero.primary.to} variant="primary" size="lg" arrow magnetic>
            {hero.primary.label}
          </Button>
          <Button variant="secondary" size="lg" onClick={() => scrollTo(sectionIds.explore)}>
            {hero.secondary.label}
          </Button>
        </div>

        {live > 0 && (
          <button
            type="button"
            onClick={() => scrollTo(sectionIds.hackathons)}
            className="group mt-8 inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.12em] text-white/60 transition-colors hover:text-white"
          >
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-success/60 [animation-duration:2.4s]" />
              <span className="relative size-2 rounded-full bg-success" />
            </span>
            {live} HACKATHON{live === 1 ? '' : 'S'} LIVE NOW
            <ArrowDown size={12} aria-hidden="true" className="transition-transform group-hover:translate-y-0.5" />
          </button>
        )}
      </div>

      <Corner position="bottom-left" items={hero.corners.bottomLeft} />
      <Corner position="bottom-right" items={hero.corners.bottomRight} />

      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-white/40 sm:flex"
      >
        SCROLL
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
