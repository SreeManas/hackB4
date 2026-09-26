import { useCallback, useRef, useState } from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { useStorage } from '@/hooks/useStorage';
import { Loader } from './components/Loader';
import { ScrollVeil } from './components/ScrollVeil';
import { SectionRail } from './components/SectionRail';
import { Community } from './sections/Community';
import { Explore } from './sections/Explore';
import { FinalCta } from './sections/FinalCta';
import { ForOrganizations } from './sections/ForOrganizations';
import { Hackathons } from './sections/Hackathons';
import { Hero } from './sections/Hero';
import { HowItWorks } from './sections/HowItWorks';
import { Marquee } from './sections/Marquee';
import { People } from './sections/People';
import { Projects } from './sections/Projects';
import { Stats } from './sections/Stats';
import { Tech } from './sections/Tech';
import { useHomeAnimations } from './useHomeAnimations';
import './home.css';

/**
 * Identity (hero, explore, community, final CTA) wrapped around the product layer
 * (stats, hackathons, process, projects, people, tech, organizations). Every section is transparent:
 * the site background runs the full length of the page, dimmed by one ScrollVeil.
 */
export default function HomePage() {
  const container = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  // The intro loader plays once per browser session, not on every visit to Home.
  const [introSeen, setIntroSeen] = useStorage('hb4_intro_seen', false, 'session');
  const [ready, setReady] = useState(introSeen || reducedMotion);
  const finishIntro = useCallback(() => {
    setIntroSeen(true);
    setReady(true);
  }, [setIntroSeen]);

  useDocumentMeta({});
  useHomeAnimations(container, ready);

  return (
    <PageTransition offsetNav={false}>
      <ScrollVeil finalRef={finalRef} />
      <div ref={container} className="relative">
        <div className="noise-overlay" aria-hidden="true" />
        {!ready && <Loader onDone={finishIntro} />}
        <SectionRail />

        <div className="relative z-10">
          <Hero />
          <Marquee />
          <Explore />
          <Stats />
          <Hackathons />
          <HowItWorks />
          <Projects />
          <People />
          <Tech />
          <Community />
          <ForOrganizations />
          <FinalCta ref={finalRef} />
        </div>
      </div>
    </PageTransition>
  );
}
