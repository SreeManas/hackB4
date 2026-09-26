import { useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { LenisContext } from './lenis';

/** One app-wide Lenis instance (smooth scroll on every page). Disabled for reduced-motion users. */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoRaf: true,
    });
    setLenis(instance);
    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
