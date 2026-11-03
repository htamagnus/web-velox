'use client';

import { motion } from 'framer-motion';

// o template remonta a cada troca de aba: a tela nova entra por cima da barra que ficou
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="app__screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
