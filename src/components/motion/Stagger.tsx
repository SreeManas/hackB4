import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { durations, ease, viewport } from './presets';

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const item = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: durations.base, ease } },
});

interface StaggerProps {
  children: ReactNode;
  /** Seconds between each child. */
  stagger?: number;
  delay?: number;
  className?: string;
}

/** Reveals its <StaggerItem> children one after another when scrolled into view. */
export function Stagger({ children, stagger = 0.08, delay = 0, className }: StaggerProps) {
  return (
    <motion.div
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, y = 24, className }: { children: ReactNode; y?: number; className?: string }) {
  return (
    <motion.div variants={item(y)} className={className}>
      {children}
    </motion.div>
  );
}
