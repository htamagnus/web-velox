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
        className="w-full max-w-xl mx-auto bg-gradient-to-br from-[#1a2234] to-[#0f1419] rounded-2xl border border-copy/10 p-6 shadow-xl"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
} 