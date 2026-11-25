'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import { SPRING } from './motion';

export function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 64rem)');
    const update = () => setWide(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return wide;
}

// no desktop, um painel flutuando sobre o mapa; no celular, a folha de baixo que o puxador abre e fecha
export default function Sheet({ children, expandable }: { children: ReactNode; expandable: boolean }) {
  const { t } = useTexts('app.sheet');
  const wide = useWide();
  const [open, setOpen] = useState(false);
  // arrastar o puxador também solta um clique no fim; o clique só vale quando não houve arrasto
  const dragged = useRef(false);

  useEffect(() => {
    if (!expandable) setOpen(false);
  }, [expandable]);

  const height = wide || !expandable ? 'auto' : open ? '92%' : '50%';

  return (
    <motion.aside
      className="drawer"
      initial={{ y: 48, opacity: 0 }}
      animate={{ y: 0, opacity: 1, height }}
      transition={SPRING}
    >
      {expandable && !wide && (
        <motion.button
          type="button"
          className="drawer__handle"
          aria-expanded={open}
          aria-label={t(open ? 'collapse' : 'expand')}
          onPanStart={() => (dragged.current = true)}
          onPanEnd={(_, info) => setOpen(info.offset.y < 0)}
          onClick={() => {
            if (!dragged.current) setOpen((v) => !v);
            dragged.current = false;
          }}
        >
          <span />
        </motion.button>
      )}
      <div className="drawer__body">{children}</div>
    </motion.aside>
  );
}
