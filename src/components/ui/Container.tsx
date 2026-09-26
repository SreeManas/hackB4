import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

const widths = { md: 'max-w-[1000px]', lg: 'max-w-[1200px]', xl: 'max-w-[1400px]' } as const;

export function Container({
  children,
  size = 'xl',
  className,
}: {
  children: ReactNode;
  size?: keyof typeof widths;
  className?: string;
}) {
  return <div className={cn('mx-auto w-full px-4 sm:px-8', widths[size], className)}>{children}</div>;
}
