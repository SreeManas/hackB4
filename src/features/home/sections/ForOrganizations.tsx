import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { InquiryModal } from '@/features/services/components/InquiryModal';
import { organizations, sectionIds } from '../content';
import { HomeSection } from '../components/HomeSection';

/** Compact B2B strip (decision D5): colleges, corporates and sponsors → the existing inquiry flow. */
export function ForOrganizations() {
  const [service, setService] = useState<string | null>(null);

  return (
    <HomeSection id={sectionIds.organizations}>
      <SectionHeading
        eyebrow={organizations.eyebrow}
        title={organizations.title}
        description={organizations.description}
        action={
          <Button to={organizations.allServices.to} variant="tertiary" arrow>
            {organizations.allServices.label}
          </Button>
        }
      />

      <Stagger className="grid gap-px overflow-hidden rounded-[4px] border border-white/10 bg-white/10 md:grid-cols-3">
        {organizations.columns.map((col, i) => (
          <StaggerItem key={col.audience} className="h-full">
            <div className="group flex h-full flex-col bg-[#070707]/90 p-8 transition-colors duration-500 hover:bg-[#0e0e0e] sm:p-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.14em] text-white/45 uppercase">{col.audience}</span>
                <span className="font-mono text-[11px] text-white/25 tabular-nums">0{i + 1}</span>
              </div>
              <h3 className="mt-10 font-display text-xl tracking-[0.05em] uppercase transition-transform duration-500 ease-cinematic group-hover:translate-x-1">
                {col.title}
              </h3>
              <ul className="mt-6 flex flex-col gap-3 text-sm text-white/60">
                {col.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-white/30" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                <Button variant="secondary" size="sm" arrow onClick={() => setService(col.service)}>
                  Talk to us
                  <span className="sr-only"> about {col.title.toLowerCase()}</span>
                </Button>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <InquiryModal service={service} onClose={() => setService(null)} />
    </HomeSection>
  );
}
