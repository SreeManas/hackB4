import type { RefObject } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * One continuous dark veil over the site background (instead of opaque per-section panels),
 * so the planet + star field stay visible through the whole page:
 *   hero → fully cinematic · content → dimmed for readability · final CTA → cinematic again.
 */
export function ScrollVeil({ finalRef }: { finalRef: RefObject<HTMLElement> }) {
  const { scrollY } = useScroll();
  const { scrollYProgress: finalProgress } = useScroll({ target: finalRef, offset: ['start end', 'center center'] });

  const intoContent = useTransform(scrollY, (y) => Math.min(1, y / (window.innerHeight * 0.9)));
  const opacity = useTransform([intoContent, finalProgress], ([a, b]: number[]) => 0.62 * a * (1 - 0.65 * b));

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.75),#000_75%)]"
    />
  );
}
