import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { ease } from './presets';

interface CountUpProps {
  to: number;
  /** Seconds. */
  duration?: number;
  prefix?: string;
  suffix?: string;
  /** Number formatter. Default: Indian grouping ("25,000"). */
  format?: (n: number) => string;
  className?: string;
}

const defaultFormat = (n: number) => Math.round(n).toLocaleString('en-IN');

/**
 * Counts from 0 to `to` the first time it scrolls into view (stats like "12,000+ students").
 * Writes straight to the DOM, so the animation never re-renders React.
 * Screen readers and reduced-motion users get the final number immediately.
 */
export function CountUp({
  to,
  duration = 2,
  prefix = '',
  suffix = '',
  format = defaultFormat,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reducedMotion) {
      el.textContent = prefix + format(to) + suffix;
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease,
      onUpdate: (v) => (el.textContent = prefix + format(v) + suffix),
    });
    return () => controls.stop();
  }, [inView, reducedMotion, to, duration, prefix, suffix, format]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {prefix}0{suffix}
      </span>
      <span className="sr-only">{prefix + format(to) + suffix}</span>
    </span>
  );
}
