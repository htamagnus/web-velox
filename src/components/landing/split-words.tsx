'use client';

import { createElement, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { EASE } from './reveal';

type Props = {
  text: string;
  as?: 'h1' | 'h2' | 'p';
  className?: string;
  delay?: number;
};

// título que sobe palavra por palavra de dentro da máscara; quem decide a entrada é o título inteiro
export default function SplitWords({ text, as = 'h2', className, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const words = text.split(' ').map((word, i) => (
    <span key={`${word}-${i}`}>
      <span className="split__word">
        <motion.span
          initial={{ y: '110%' }}
          animate={{ y: inView ? 0 : '110%' }}
          transition={{ duration: 0.8, delay: delay + 0.1 + i * 0.05, ease: EASE }}
        >
          {word}
        </motion.span>
      </span>{' '}
    </span>
  ));
  return createElement(as, { ref, className }, words);
}
