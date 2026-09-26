import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLenis } from '@/app/providers/lenis';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scroll-driven choreography for the home page. Everything is scoped + auto-reverted on unmount.
 * Initial states are set here (not in CSS), so without JS / with reduced motion everything is simply visible.
 */
export function useHomeAnimations(scope: RefObject<HTMLElement>, ready: boolean) {
  const lenis = useLenis();
  const reducedMotion = usePrefersReducedMotion();

  // Keep ScrollTrigger in sync with Lenis' smoothed scroll position.
  useGSAP(
    () => {
      if (!lenis) return;
      return lenis.on('scroll', ScrollTrigger.update);
    },
    { dependencies: [lenis] },
  );

  // Data-driven sections change height as they load — re-measure trigger positions (debounced).
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    let t = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(el);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [scope]);

  useGSAP(
    () => {
      if (!ready || reducedMotion) return;
      const q = gsap.utils.selector(scope);

      // ---- Hero: intro, then fade away on scroll ----
      gsap
        .timeline()
        .fromTo(q('.hero-center'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }, 0.3)
        .fromTo(
          q('.corner-ui'),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power2.out' },
          0.8,
        );

      gsap
        .timeline({ scrollTrigger: { trigger: q('.hero-section')[0], start: 'top top', end: 'bottom top', scrub: 1 } })
        .to(q('.hero-center'), { y: -150, opacity: 0, ease: 'none' }, 0)
        .to(q('.corner-ui'), { y: -50, opacity: 0, ease: 'none' }, 0);

      // ---- Explore: a white fill wipes across each word; on md+ the words also drift sideways ----
      const mm = gsap.matchMedia();
      q<HTMLElement>('.explore-row').forEach((row) => {
        const word = row.querySelector<HTMLElement>('.explore-word');
        if (!word) return;
        gsap.fromTo(
          word,
          { '--fill': '0%' },
          {
            '--fill': '100%',
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top 80%', end: 'top 42%', scrub: 0.6 },
          },
        );
        ScrollTrigger.create({ trigger: row, start: 'top 45%', end: 'bottom 20%', toggleClass: 'is-filled' });
      });
      // Drift is desktop-only: on phones it would push the wide words off-screen.
      mm.add('(min-width: 768px)', () => {
        q<HTMLElement>('.explore-row').forEach((row) => {
          const dir = Number(row.dataset.dir ?? 1);
          const word = row.querySelector<HTMLElement>('.explore-word');
          if (!word) return;
          gsap.fromTo(
            word,
            { x: () => -dir * window.innerWidth * 0.06 },
            {
              x: () => dir * window.innerWidth * 0.04,
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });

      // ---- How it works: covered cards shrink + dim, progress line fills ----
      const items = q<HTMLElement>('.process-item');
      mm.add('(min-width: 768px)', () => {
        items.forEach((item, i) => {
          const card = item.querySelector('.process-card');
          const progress = item.querySelector('.process-progress');
          if (progress) {
            gsap.fromTo(
              progress,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: { trigger: item, start: 'top 60%', end: 'bottom 60%', scrub: true },
              },
            );
          }
          const next = items[i + 1];
          if (!card || !next) return;
          gsap
            .timeline({ scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true } })
            .to(card, { scale: 0.94, ease: 'none' }, 0)
            .to(card.querySelector('.process-dim'), { opacity: 0.55, ease: 'none' }, 0);
        });

        // ---- Community: pin the statement while its words light up ----
        const pin = q('.community-pin')[0];
        const words = q('.community-word');
        if (pin && words.length) {
          gsap
            .timeline({ scrollTrigger: { trigger: pin, start: 'top top', end: '+=90%', pin: true, scrub: 0.8 } })
            .fromTo(words, { opacity: 0.12 }, { opacity: 1, stagger: 0.15, ease: 'none' });
        }
      });

      // Phones: no pin, words light up as they enter.
      mm.add('(max-width: 767px)', () => {
        const words = q('.community-word');
        if (!words.length) return;
        gsap.fromTo(
          words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.12,
            ease: 'none',
            scrollTrigger: { trigger: q('.community-statement')[0], start: 'top 85%', end: 'bottom 45%', scrub: 0.8 },
          },
        );
      });
    },
    { scope, dependencies: [ready, reducedMotion], revertOnUpdate: true },
  );
}
