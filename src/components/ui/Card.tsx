import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const variants = {
  /** Dark translucent plate — readable on top of the cinematic background without heavy blur. */
  surface: 'border border-white/[0.09] bg-black/50',
  outline: 'border border-white/15',
  /** Hairline top rule only, for editorial lists. */
  rule: 'border-t border-white/15',
} as const;

const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8 sm:p-10' } as const;

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: keyof typeof variants;
  padding?: keyof typeof paddings;
}

/** Plain content plate. Clickable product listings use `ProductCard` instead. */
export function Card({ children, variant = 'surface', padding = 'md', className, ...rest }: CardProps) {
  return (
    <div
      className={cn(variant !== 'rule' && 'rounded-[4px]', variants[variant], paddings[padding], className)}
      {...rest}
    >
      {children}
    </div>
  );
}
