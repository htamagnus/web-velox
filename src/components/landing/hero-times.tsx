'use client';

import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import { EASE } from './reveal';
import { GENERIC_MINUTES, MODES, ROUTE, minutesFor, type Mode } from './modes';

type Props = { mode: Mode; onChange: (mode: Mode) => void };

export default function HeroTimes({ mode, onChange }: Props) {
  const { t } = useTexts('landing.hero');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();

  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  const minutes = minutesFor(mode.speed);

  // o tempo roda como cronômetro até o novo valor em vez de trocar seco
  const rolling = useMotionValue(minutes);
  const rollingText = useTransform(rolling, (v) => hm(Math.round(v)));
  useEffect(() => {
    const controls = animate(rolling, minutes, { duration: 0.7, ease: EASE });
    return () => controls.stop();
  }, [minutes, rolling]);

  return (
    <motion.div
      className="compare"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
    >
      <div className="compare__head">
        <div>
          <p className="compare__title">{t('sample')}</p>
          <p className="compare__route">
            {t('route')
              .replace('{{km}}', String(ROUTE.km))
              .replace('{{climb}}', String(ROUTE.climb))}
          </p>
        </div>
        <div
          className="compare__modes"
          role="group"
          aria-label={tApp('planner.summary.modality').replace(/:$/, '')}
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className="compare__mode"
              aria-pressed={mode.id === m.id}
              onClick={() => onChange(m)}
            >
              {mode.id === m.id && (
                <motion.span
                  layoutId="compare-pill"
                  className="compare__pill"
                  transition={{ duration: 0.35, ease: EASE }}
                />
              )}
              <span>{tApp(`speedModal.options.${m.id}.label`)}</span>
            </button>
          ))}
        </div>
      </div>
      <dl className="compare__sheet">
        <motion.div
          className="compare__row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
        >
          <dt>
            {t('genericLabel')}
            <span>{t('genericNote')}</span>
          </dt>
          <dd>{hm(GENERIC_MINUTES)}</dd>
          <div className="compare__bar" aria-hidden="true">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 1, ease: EASE }}
            />
          </div>
        </motion.div>
        <motion.div
          className="compare__row is-on"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95, ease: EASE }}
        >
          <dt>
            {t('veloxLabel')}
            <span>{t('atSpeed').replace('{{speed}}', fmt.format(mode.speed))}</span>
          </dt>
          <dd>
            <span className="visually-hidden" aria-live="polite">
              {hm(minutes)}
            </span>
            <motion.span
              key={mode.id}
              className="compare__plate"
              aria-hidden="true"
              initial={{ scale: 0.94, filter: 'brightness(1.6)' }}
              animate={{ scale: 1, filter: 'brightness(1)' }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <motion.span>{rollingText}</motion.span>
            </motion.span>
          </dd>
          <div className="compare__bar" aria-hidden="true">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: minutes / GENERIC_MINUTES }}
              transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
            />
          </div>
        </motion.div>
      </dl>
    </motion.div>
  );
}
