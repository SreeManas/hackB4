import type { MouseEvent } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from './useMediaQuery';

const spring = { stiffness: 300, damping: 20 };

/** 3D tilt toward the cursor using motion values (no React re-renders). Desktop only. */
export function useTilt(maxDeg = 10) {
  const finePointer = useFinePointer();
  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rotateX.set(((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -maxDeg);
    rotateY.set(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * maxDeg);
  };
  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return finePointer
    ? { style: { rotateX, rotateY }, onMouseMove, onMouseLeave }
    : { style: undefined, onMouseMove: undefined, onMouseLeave: undefined };
}
