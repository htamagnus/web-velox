import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { EASE } from '@/components/landing/reveal';

interface StepContainerProps {
  step: number;
  children: ReactNode;
}

export function StepContainer({ step, children }: StepContainerProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`step-${step}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="onb__stage"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
