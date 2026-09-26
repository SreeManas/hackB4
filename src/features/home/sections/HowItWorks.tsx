import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';
import { useComingSoon } from '@/components/product/coming-soon-context';
import { cn } from '@/lib/cn';
import { process, sectionIds } from '../content';
import { HomeSection } from '../components/HomeSection';
import { Build, Discover, Showcase, TeamUp } from '../components/ProcessVisuals';

/** One animated product glimpse per step, in order. */
const processVisuals = [Discover, TeamUp, Build, Showcase];
import { useScrollToSection } from '../useScrollToSection';

type StepLink = (typeof process.steps)[number]['link'];

function StepAction({ link }: { link: StepLink }) {
  const openComingSoon = useComingSoon();
  const scrollTo = useScrollToSection();
  if ('to' in link)
    return (
      <Button to={link.to} variant="tertiary" arrow>
        {link.label}
      </Button>
    );
  if ('feature' in link)
    return (
      <Button variant="tertiary" arrow onClick={() => openComingSoon(link.feature)}>
        {link.label}
      </Button>
    );
  return (
    <Button variant="tertiary" arrow onClick={() => scrollTo(link.anchor)}>
      {link.label}
    </Button>
  );
}

/**
 * The original sticky stacking cards (identity), now carrying the platform flow.
 * On md+ each card sticks and the next slides over it; GSAP (useHomeAnimations) scales/dims the covered
 * card and fills the progress line. On phones the cards simply stack.
 */
export function HowItWorks() {
  const total = process.steps.length;
  return (
    <HomeSection id={sectionIds.process} className="pb-[10vh]">
      <SectionHeading eyebrow={process.eyebrow} title={process.title} />
      <ol className="process-list">
        {process.steps.map((step, i) => {
          const Visual = processVisuals[i];
          const last = i === total - 1;
          return (
            <li key={step.tag} className={cn('process-item relative pb-6 md:pb-0', !last && 'md:h-[88vh]')}>
              <article
                className="process-card relative grid overflow-hidden rounded-[4px] border border-white/10 border-t-white/25 bg-[#080808]/95 p-7 sm:p-10 md:sticky md:grid-cols-[1fr_1.05fr] md:gap-12 lg:p-14"
                style={{ top: `calc(15vh + ${i * 1.25}rem)` }}
              >
                {/* Scroll progress along the left edge. */}
                <span aria-hidden="true" className="absolute top-0 left-0 h-full w-px bg-white/[0.06]">
                  <span className="process-progress block h-full w-px origin-top bg-white/60" />
                </span>
                {/* Darkens as the next card covers this one (GSAP). */}
                <span
                  aria-hidden="true"
                  className="process-dim pointer-events-none absolute inset-0 z-10 bg-black opacity-0"
                />

                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[11px] tracking-[0.1em] text-white/45 tabular-nums">
                      {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                    </span>
                    <Tag size="sm">{step.tag}</Tag>
                  </div>
                  <h3 className="mt-8 font-display text-[clamp(1.25rem,2.4vw,2rem)] leading-tight tracking-[0.05em] uppercase">
                    {step.title}
                  </h3>
                  <p className="mt-5 max-w-md leading-relaxed text-white/60">{step.text}</p>
                  <div className="mt-8 md:mt-auto md:pt-10">
                    <StepAction link={step.link} />
                  </div>
                </div>
                <div className="mt-10 md:mt-0">
                  <Visual />
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </HomeSection>
  );
}
