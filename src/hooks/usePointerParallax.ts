import { useEffect, type RefObject } from 'react';
import { useFinePointer, usePrefersReducedMotion } from './useMediaQuery';

/**
 * Writes the cursor position (-1…1 from the centre of the viewport) into CSS variables
 * `--px` / `--py` on `ref`, eased with rAF. Style children with calc(var(--px) * Npx).
 */
export function usePointerParallax(ref: RefObject<HTMLElement>) {
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer || reducedMotion) return;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      frame = 0;

    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty('--px', cx.toFixed(4));
      el.style.setProperty('--py', cy.toFixed(4));
      frame = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
    };
  }, [ref, finePointer, reducedMotion]);
}
