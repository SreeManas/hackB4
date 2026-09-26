import { useCallback } from 'react';
import { useLenis } from '@/app/providers/lenis';

/** Offset so a section heading lands below the fixed navbar. */
const NAV_OFFSET = -96;

/** Smooth-scroll to a section by id (through Lenis when active), then move focus there for keyboard users. */
export function useScrollToSection() {
  const lenis = useLenis();
  return useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const focus = () => el.focus({ preventScroll: true });
      if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.4, onComplete: focus });
      else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        focus();
      }
    },
    [lenis],
  );
}
