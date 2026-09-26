import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';

/**
 * Transparent product section: the site background shows through (the ScrollVeil handles readability).
 * `tabIndex={-1}` lets anchor jumps move keyboard focus here.
 */
export function HomeSection({
  id,
  children,
  className,
  containerClassName,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section
      id={id}
      tabIndex={-1}
      className={cn('home-section relative py-[clamp(6rem,16vh,11rem)] outline-none', className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
