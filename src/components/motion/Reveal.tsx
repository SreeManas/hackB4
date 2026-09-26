import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ease, viewport } from './presets';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

/** Masked slide-up reveal for headings. */
export function RevealText({ children, delay = 0, className }: Props) {
  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={viewport}
        transition={{ duration: 1.2, ease, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Fade + rise when scrolled into view. */
export function FadeIn({
  children,
  delay = 0,
  className,
  style,
  y = 50,
  duration = 1.2,
}: Props & { y?: number; duration?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration, ease, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
