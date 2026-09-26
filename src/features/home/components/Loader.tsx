import { useEffect, useState } from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';

const MIN_DURATION = 900;

/**
 * Intro loader. Progress tracks real readiness (web fonts) with a short minimum so the
 * brand moment still lands. Isolated in its own component so its per-frame updates
 * never re-render the page.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let fontsReady = false;
    let frame = 0;
    let doneTimer = 0;
    const start = performance.now();
    document.fonts?.ready.then(() => {
      fontsReady = true;
    });

    const tick = (now: number) => {
      const timeShare = Math.min(1, (now - start) / MIN_DURATION);
      // Hold at 90% until fonts are ready, then finish.
      const pct = Math.round((fontsReady || !document.fonts ? timeShare : Math.min(timeShare, 0.9)) * 100);
      setProgress(pct);
      if (pct >= 100) doneTimer = window.setTimeout(onDone, 250);
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[10001] flex flex-col items-center justify-center bg-black"
    >
      <BrandLogo className="mb-4 text-5xl" />
      <div className="text-base font-light text-white/50 tabular-nums">{String(progress).padStart(2, '0')}%</div>
    </div>
  );
}
