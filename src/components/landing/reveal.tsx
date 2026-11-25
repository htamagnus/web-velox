'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export const EASE = [0.16, 1, 0.3, 1] as const;

type Props = { children: ReactNode; delay?: number; className?: string };

export default function Reveal({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
