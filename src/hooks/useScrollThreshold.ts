import { useEffect, useState } from 'react';

/** Becomes true (once) after the user has scrolled past `percent` of the page. */
export function useScrollThreshold(percent: number, enabled = true) {
  const [reached, setReached] = useState(false);

  useEffect(() => {
    if (!enabled || reached) return;
    const check = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable <= 0) return;
      if ((window.scrollY / scrollable) * 100 >= percent) setReached(true);
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, [percent, enabled, reached]);

  return reached;
}
