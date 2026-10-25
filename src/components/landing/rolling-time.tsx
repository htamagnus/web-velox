'use client';

import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { hm } from '@/helpers/format-minutes';
import { EASE } from './reveal';

type Props = { minutes: number; duration?: number; className?: string };

// um tempo que roda como cronômetro até o novo valor em vez de trocar seco
export default function RollingTime({ minutes, duration = 0.9, className }: Props) {
  const value = useMotionValue(minutes);
  const text = useTransform(value, (v) => hm(Math.round(v)));
  useEffect(() => {
    const controls = animate(value, minutes, { duration, ease: EASE });
    return () => controls.stop();
  }, [minutes, duration, value]);
  return <motion.span className={className}>{text}</motion.span>;
}
