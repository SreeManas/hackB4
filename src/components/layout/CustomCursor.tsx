import { useEffect, useRef } from 'react';
import { useFinePointer } from '@/hooks/useMediaQuery';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, .hover-target';

/**
 * Custom cursor driven entirely by refs + requestAnimationFrame: zero React re-renders
 * on mouse move. Only mounts on devices with a real mouse; touch users keep native behaviour.
 */
export function CustomCursor() {
  const finePointer = useFinePointer();
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!finePointer) return;
    const root = rootRef.current!;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    document.documentElement.classList.add('has-custom-cursor');

    let x = -100,
      y = -100,
      frame = 0;
    root.style.opacity = '0'; // hidden until the first real mouse move
    const render = () => {
      frame = 0;
      const t = `translate3d(${x}px, ${y}px, 0)`;
      dot.style.transform = t;
      ring.style.transform = t;
    };
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      root.style.opacity = '1';
      if (!frame) frame = requestAnimationFrame(render);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const isImage = !!target.closest('img, .cursor-view');
      root.classList.toggle('cursor-hover', isImage || !!target.closest(INTERACTIVE));
      ring.dataset.label = isImage ? 'VIEW' : '';
    };
    const onLeaveWindow = () => {
      root.style.opacity = '0';
    };
    const onEnterWindow = () => {
      root.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveWindow);
    document.documentElement.addEventListener('mouseenter', onEnterWindow);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
      document.documentElement.removeEventListener('mouseenter', onEnterWindow);
    };
  }, [finePointer]);

  if (!finePointer) return null;
  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[99999] transition-opacity duration-200"
    >
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-outline" />
    </div>
  );
}
