import { lazy, Suspense, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { usePointerParallax } from '@/hooks/usePointerParallax';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';

const StarField = lazy(() => import('@/components/background/StarField'));

const saveData =
  typeof navigator !== 'undefined' &&
  (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

/**
 * Site-wide interactive background, mounted once and kept alive across route changes:
 *  - planet video that follows the cursor (parallax) and slowly zooms as you scroll
 *  - twinkling two-layer star field that reacts to the cursor and scroll speed
 * Reduced-motion / data-saver visitors get the static poster and no WebGL.
 */
export function GlobalBackground() {
  const isHome = useLocation().pathname === '/';
  const reducedMotion = usePrefersReducedMotion();
  const animated = !reducedMotion && !saveData;
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  usePointerParallax(rootRef);

  // Scroll-linked zoom (spring-smoothed), capped after ~1.5 screens.
  const { scrollY } = useScroll();
  const zoom = useSpring(useTransform(scrollY, [0, 1500], [1.08, 1.3], { clamp: true }), {
    stiffness: 60,
    damping: 20,
  });

  // Pause decoding when the tab is hidden.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => (document.visibilityState === 'visible' ? video.play().catch(() => undefined) : video.pause());
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [animated]);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      <motion.div style={animated ? { scale: zoom } : { scale: 1.08 }} className="absolute inset-0">
        {/* Cursor parallax: the video drifts opposite to the mouse (vars set by usePointerParallax). */}
        <div
          className="absolute -inset-[4%]"
          style={{ translate: 'calc(var(--px, 0) * -28px) calc(var(--py, 0) * -28px)' }}
        >
          {animated ? (
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              poster="/assets/videos/hero-poster.jpg"
              className="h-full w-full object-cover"
            >
              <source src="/assets/videos/hero.webm" type="video/webm" />
              <source src="/assets/videos/hero.mp4" type="video/mp4" />
            </video>
          ) : (
            <img src="/assets/videos/hero-poster.jpg" alt="" className="h-full w-full object-cover" />
          )}
        </div>
      </motion.div>

      {/* Darker veil on inner pages keeps text readable; Home stays cinematic. */}
      <div
        className={cn(
          'absolute inset-0 transition-colors duration-700',
          isHome ? 'bg-gradient-to-b from-black/30 to-black/75' : 'bg-gradient-to-b from-black/55 to-black/80',
        )}
      />
      {/* Soft light that follows the cursor. */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(600px circle at calc(50% + var(--px, 0) * 50%) calc(50% + var(--py, 0) * 50%), rgba(255,255,255,0.06), transparent 60%)',
        }}
      />

      {animated && (
        <Suspense fallback={null}>
          <StarField />
        </Suspense>
      )}
    </div>
  );
}
