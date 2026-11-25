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

type Props = {
  to: number;
  prefix?: string;
  format?: (n: number) => string;
  duration?: number;
};

export default function CountUp({ to, prefix = '', format, duration = 1.1 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduced = useReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(value, (v) =>
    format ? format(Math.round(v)) : `${prefix}${Math.round(v)}`,
  );

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration, ease: EASE });
    return () => controls.stop();
  }, [inView, reduced, to, value, duration]);

  return <motion.span ref={ref}>{text}</motion.span>;
}
