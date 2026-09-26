import type { ReactNode } from 'react';
import { FadeIn, RevealText } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

/** Standard inner-page heading block (title reveal + subtitle fade). */
export function PageHeader({ title, subtitle, align = 'left', className }: PageHeaderProps) {
  const centered = align === 'center';
  return (
    <header className={cn('mt-16 mb-16', centered && 'text-center', className)}>
      <RevealText>
        <h1 className="mb-4 text-[clamp(2.5rem,6vw,5rem)] leading-tight font-light tracking-[0.05em] uppercase">
          {title}
        </h1>
      </RevealText>
      {subtitle && (
        <FadeIn delay={0.2}>
          <p className={cn('max-w-[600px] text-lg leading-relaxed text-muted', centered && 'mx-auto')}>{subtitle}</p>
        </FadeIn>
      )}
    </header>
  );
}
