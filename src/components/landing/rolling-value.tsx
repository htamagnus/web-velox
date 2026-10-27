'use client';

import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { EASE } from './reveal';

type Props = {
  value: number;
  format: (n: number) => string;
  duration?: number;
  className?: string;
};

// um número que roda até o novo valor em vez de trocar seco
export default function RollingValue({ value, format, duration = 0.9, className }: Props) {
  const current = useMotionValue(value);
  const text = useTransform(current, (v) => format(Math.round(v)));
  useEffect(() => {
    const controls = animate(current, value, { duration, ease: EASE });
    return () => controls.stop();
  }, [value, duration, current]);
  return <motion.span className={className}>{text}</motion.span>;
}
