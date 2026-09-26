import { forwardRef } from 'react';
import { Button } from '@/components/ui/Button';
import { FadeIn, RevealText } from '@/components/motion/Reveal';
import { useComingSoon } from '@/components/product/coming-soon-context';
import { finalCta } from '../content';

/** Back to the cinematic identity: the veil lifts (ScrollVeil watches this section) and the statement reveals word by word. */
export const FinalCta = forwardRef<HTMLElement>(function FinalCta(_, ref) {
  const openComingSoon = useComingSoon();

  return (
    <section ref={ref} className="relative flex min-h-svh items-center justify-center px-6 py-32 text-center">
      <div className="flex flex-col items-center">
        <h2 className="flex flex-wrap justify-center gap-x-[0.35em] font-display text-[clamp(2.5rem,9vw,8rem)] leading-none tracking-[0.12em] [text-shadow:0_4px_30px_rgba(0,0,0,0.8)]">
          {finalCta.title.map((w, i) => (
            <RevealText key={w} delay={i * 0.15}>
              <span className="block">{w}</span>
            </RevealText>
          ))}
        </h2>
        <FadeIn delay={0.5} y={20}>
          <div className="mt-14 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Button variant="primary" size="lg" arrow magnetic onClick={() => openComingSoon('account')}>
              {finalCta.primary}
            </Button>
            <Button to={finalCta.secondary.to} variant="secondary" size="lg">
              {finalCta.secondary.label}
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
});
