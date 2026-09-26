import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

/** Route enter/exit animation. `offsetNav` adds top padding for the fixed navbar. */
export function PageTransition({ children, offsetNav = true }: { children: ReactNode; offsetNav?: boolean }) {
  return (
    <motion.main
      id="main"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('min-h-screen w-full', offsetNav && 'pt-24 sm:pt-28')}
    >
      {children}
    </motion.main>
  );
}
