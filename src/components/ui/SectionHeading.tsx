import type { ReactNode } from 'react';
import { FadeIn, RevealText } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  /** Small label above the title, e.g. "/ 02 — SERVICES". */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  /** Right-side slot on wide screens, e.g. a "View all" link. */
  action?: ReactNode;
  className?: string;
}

/** Heading block for sections inside a page (the page's own <h1> comes from PageHeader). */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div
      className={cn(
        'mb-12 flex flex-col gap-6 sm:mb-16',
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-3xl', centered && 'mx-auto')}>
        {eyebrow && (
          <FadeIn y={12} duration={0.8}>
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-faint uppercase">{eyebrow}</p>
          </FadeIn>
        )}
        <RevealText>
          <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.75rem)] leading-[1.15] tracking-[0.04em] uppercase">
            {title}
          </h2>
        </RevealText>
        {description && (
          <FadeIn delay={0.15} y={20}>
            <p className={cn('mt-4 max-w-xl text-lg leading-relaxed text-muted', centered && 'mx-auto')}>
              {description}
            </p>
          </FadeIn>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
