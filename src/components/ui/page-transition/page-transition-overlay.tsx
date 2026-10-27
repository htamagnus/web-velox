'use client';

import { motion, AnimatePresence } from 'framer-motion';
import LogoVelox from '@/components/ui/logo-velox/logo-velox';
import { archivo } from '@/app/fonts';

export default function PageTransitionOverlay({ visible, message }: { visible: boolean; message?: string }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`landing loading ${archivo.variable} fixed inset-0 z-[1000] flex flex-col items-center justify-center`}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div className="hero__lines" aria-hidden="true" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <LogoVelox size="md" />
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="loading__spin animate-spin"
            aria-hidden="true"
          />

          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="eyebrow eyebrow--ink loading__msg"
              role="status"
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
