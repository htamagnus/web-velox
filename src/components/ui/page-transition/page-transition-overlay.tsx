'use client';

import { motion, AnimatePresence } from 'framer-motion';
import LogoVelox from '@/components/ui/logo-velox/logo-velox';
import Loader from '@/components/ui/loader/loader'; // seu loader real

export default function PageTransitionOverlay({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background z-[1000] flex flex-col items-center justify-center"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <LogoVelox size="md" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Loader size={38} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
