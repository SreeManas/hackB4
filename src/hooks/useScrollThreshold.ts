import { useEffect, useState } from 'react';

/** Becomes true (once) after the user has scrolled past `percent` of the page. */
export function useScrollThreshold(percent: number, enabled = true) {
  const [reached, setReached] = useState(false);

  useEffect(() => {
    if (!enabled || reached) return;
    let ticking = false;
    const check = () => {
      ticking = false;
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable <= 0) return;
      if ((window.scrollY / scrollable) * 100 >= percent) setReached(true);
    };
    // rAF-batched: `scrollHeight`/`clientHeight` force layout, so read them at most once per frame
    // instead of on every raw scroll event.
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    check();
    return () => window.removeEventListener('scroll', onScroll);
  }, [percent, enabled, reached]);

  return reached;
}
