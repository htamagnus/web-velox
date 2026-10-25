'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import { EASE } from './reveal';
import RollingValue from './rolling-value';
import SplitWords from './split-words';
import { ROUTE, minutesFor, type Mode } from './modes';

type Props = { mode: Mode; onStart: () => void; loading: boolean };

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
  transition: { duration: 0.8, delay, ease: EASE },
});

// o fechamento como pôster: o título sobe palavra por palavra, a linha de cima lembra a bike escolhida
export default function Close({ mode, onStart, loading }: Props) {
  const { t } = useTexts('landing.cta');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });

  return (
    <section className="close grain">
      <div className="close__photo photo--duotone">
        <Image src="/images/cta-bike.jpg" alt="" fill sizes="100vw" />
      </div>
      <div className="close__over">
        <div className="container close__inner">
          <motion.p className="close__eyebrow" {...rise(0)}>
            {tApp(`speedModal.options.${mode.id}.label`)} · {fmt.format(mode.speed)} km/h ·{' '}
            {ROUTE.km} km → <RollingValue value={minutesFor(mode.speed)} format={hm} />
          </motion.p>
          <SplitWords text={t('title')} />
          <motion.p className="lead" {...rise(0.35)}>
            {t('subtitle')}
          </motion.p>
          <motion.div {...rise(0.45)}>
            <button
              type="button"
              className="btn btn--primary btn--big"
              onClick={onStart}
              disabled={loading}
              aria-busy={loading}
            >
              {t('button')}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
