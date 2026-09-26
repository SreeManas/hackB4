import { ArrowRight } from 'lucide-react';
import { useEvents, usePlatformStats, useTeamOpenings } from '@/lib/api/queries';
import { getEventStatus } from '@/lib/event-status';
import { formatCompact } from '@/lib/format';
import { cn } from '@/lib/cn';
import { explore, sectionIds } from '../content';
import { useScrollToSection } from '../useScrollToSection';

/** Live one-liners under each word, so the identity section doubles as a map of the product. */
function useWordData() {
  const events = useEvents('hackathon').data;
  const teams = useTeamOpenings().data;
  const stats = usePlatformStats().data;
  const active = events?.filter((e) => getEventStatus(e) === 'active').length;
  return {
    IDEAS: active !== undefined ? { live: true, text: `${active} HACKATHONS ACTIVE` } : null,
    PEOPLE: teams ? { live: false, text: `${teams.length} TEAMS LOOKING FOR MEMBERS` } : null,
    TECH: { live: false, text: 'AI · APIS · CLOUD · DEV TOOLS' },
    IMPACT: stats ? { live: false, text: `${formatCompact(stats.projects)}+ PROJECTS SHIPPED` } : null,
  } as Record<string, { live: boolean; text: string } | null>;
}

/**
 * IDEAS / PEOPLE / TECH / IMPACT — the identity moment, now interactive:
 * a white fill wipes across each outlined word as it scrolls through (GSAP drives `--fill`),
 * hover / focus fills it instantly and reveals the question + live data, click jumps to the answer.
 */
export function Explore() {
  const scrollTo = useScrollToSection();
  const data = useWordData();

  return (
    <section
      id={sectionIds.explore}
      tabIndex={-1}
      className="explore-section home-section relative overflow-hidden py-[clamp(6rem,16vh,11rem)] outline-none"
    >
      <div className="mx-auto w-[92%] max-w-[1400px]">
        <h2 className="editorial-header">{explore.eyebrow}</h2>
        <ul className="flex flex-col gap-[clamp(1.5rem,4vw,3.5rem)]">
          {explore.words.map(({ word, question, target }, i) => {
            const right = i % 2 === 1;
            const meta = data[word];
            const metaId = `explore-meta-${word.toLowerCase()}`;
            return (
              <li
                key={word}
                className={cn(
                  'explore-row flex flex-col gap-3 md:items-end md:gap-10',
                  right ? 'items-end md:flex-row-reverse' : 'items-start md:flex-row',
                )}
                data-dir={right ? -1 : 1}
              >
                <button
                  type="button"
                  onClick={() => scrollTo(target)}
                  aria-describedby={metaId}
                  className="explore-word text-left"
                >
                  <span className="explore-word__outline">{word}</span>
                  <span className="explore-word__fill" aria-hidden="true">
                    {word}
                  </span>
                </button>

                <div
                  id={metaId}
                  className={cn('explore-meta flex flex-col gap-2 md:pb-[1.2vw]', right && 'items-end text-right')}
                >
                  <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.14em] text-white uppercase">
                    {!right && <ArrowRight size={14} aria-hidden="true" />}
                    {question}
                    {right && <ArrowRight size={14} aria-hidden="true" className="rotate-180" />}
                  </p>
                  {meta && (
                    <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-white/55">
                      {meta.live && (
                        <span
                          aria-hidden="true"
                          className="size-1.5 rounded-full bg-success shadow-[0_0_8px] shadow-success/60"
                        />
                      )}
                      {meta.text}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
