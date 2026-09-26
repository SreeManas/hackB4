import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { sectionIds, tech } from '../content';
import { HomeSection } from '../components/HomeSection';

/** Editorial index of what builders get — rows light up on hover like entries in a technical catalogue. */
export function Tech() {
  const stackRun = [...tech.stack, ...tech.stack].join('   ·   ');

  return (
    <HomeSection id={sectionIds.tech}>
      <SectionHeading eyebrow={tech.eyebrow} title={tech.title} description={tech.description} />

      <Stagger className="border-b border-white/10" stagger={0.1}>
        {tech.rows.map((row, i) => (
          <StaggerItem key={row.title}>
            <div className="group relative grid gap-4 border-t border-white/10 py-8 transition-colors duration-500 hover:border-white/40 md:grid-cols-[5rem_1.1fr_1.4fr_auto] md:items-center md:gap-8 md:py-10">
              {/* Hover wash that sweeps in from the left. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-white/[0.05] to-transparent transition-transform duration-700 ease-cinematic group-hover:scale-x-100"
              />
              <span className="font-mono text-[11px] tracking-[0.1em] text-white/40 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-[clamp(1rem,1.8vw,1.35rem)] tracking-[0.05em] uppercase transition-transform duration-500 ease-cinematic group-hover:translate-x-2">
                {row.title}
              </h3>
              <div>
                <p className="leading-relaxed text-white/60">{row.text}</p>
                <ul aria-label={`${row.title} includes`} className="mt-4 flex flex-wrap gap-1.5">
                  {row.tags.map((t) => (
                    <li key={t}>
                      <Tag size="sm" tone="muted" className="group-hover:border-white/30 group-hover:text-white/80">
                        {t}
                      </Tag>
                    </li>
                  ))}
                </ul>
              </div>
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="hidden -translate-x-3 text-white opacity-0 transition-all duration-500 ease-cinematic group-hover:translate-x-0 group-hover:opacity-100 md:block"
              />
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Technologies ticker (not partner claims — see content.ts). */}
      <div className="mt-14 flex items-center gap-6 overflow-hidden">
        <span className="shrink-0 font-mono text-[10px] tracking-[0.16em] text-white/35 uppercase">
          {tech.stackLabel}
        </span>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <p className="sr-only">{tech.stack.join(', ')}</p>
          <div
            aria-hidden="true"
            className="inline-flex animate-marquee font-mono text-sm tracking-[0.12em] whitespace-nowrap text-white/55 [animation-duration:60s] hover:[animation-play-state:paused]"
          >
            <span className="pr-8">{stackRun}</span>
            <span className="pr-8">{stackRun}</span>
          </div>
        </div>
      </div>
    </HomeSection>
  );
}
