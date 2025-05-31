import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface StepContainerProps {
  step: number;
  children: ReactNode;
}

export function StepContainer({ step, children }: StepContainerProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`step-${step}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
} 