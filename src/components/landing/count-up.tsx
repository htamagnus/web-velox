'use client';

import { useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { EASE } from './reveal';

export default function CountUp({ to, prefix = '' }: { to: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduced = useReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => `${prefix}${Math.round(v)}`);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration: 1.1, ease: EASE });
    return () => controls.stop();
  }, [inView, reduced, to, value]);

  return <motion.span ref={ref}>{text}</motion.span>;
}
