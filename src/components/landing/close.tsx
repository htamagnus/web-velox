'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import { EASE } from './reveal';
import RollingValue from './rolling-value';
import { ROUTE, minutesFor, type Mode } from './modes';

type Props = { mode: Mode; onStart: () => void; loading: boolean };

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
  transition: { duration: 0.8, delay, ease: EASE },
});

// o fechamento como pôster: o título sobe palavra por palavra, a linha em mono lembra a bike escolhida
export default function Close({ mode, onStart, loading }: Props) {
  const { t } = useTexts('landing.cta');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  const words = t('title').split(' ');
  // as palavras nascem fora da máscara, então quem decide a entrada é o título inteiro, não cada palavra
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleIn = useInView(titleRef, { once: true, margin: '0px 0px -10% 0px' });

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
          <h2 ref={titleRef}>
            {words.map((word, i) => (
              <span key={`${word}-${i}`}>
                <span className="close__word">
                  <motion.span
                    initial={{ y: '110%' }}
                    animate={{ y: titleIn ? 0 : '110%' }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.06, ease: EASE }}
                  >
                    {word}
                  </motion.span>
                </span>{' '}
              </span>
            ))}
          </h2>
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
