'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import { EASE } from './reveal';
import RollingValue from './rolling-value';
import { GENERIC_MINUTES, MODES, ROUTE, minutesFor, type Mode } from './modes';

type Props = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

// quanto tempo cada bike fica no pôster antes de passar pra próxima
const DWELL = 5000;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

// o hero como pôster: a foto manda, um tempo gigante no centro, os fatos pequenos nas bordas
export default function HeroPoster({ mode, onChange }: Props) {
  const { t } = useTexts('landing.hero');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  const minutes = minutesFor(mode.speed);

  // o pôster passa sozinho pelas bikes enquanto está na tela; o mouse na faixa segura, escolher uma na mão encerra
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduced = useReducedMotion();
  const [auto, setAuto] = useState(true);
  const [held, setHeld] = useState(false);
  const running = auto && inView && !held && !reduced;
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => {
      const i = MODES.findIndex((m) => m.id === mode.id);
      onChange(MODES[(i + 1) % MODES.length]);
    }, DWELL);
    return () => clearTimeout(id);
  }, [running, mode, onChange]);
  const pick = (m: Mode) => {
    setAuto(false);
    onChange(m);
  };

  const facts = [
    { value: `${ROUTE.km} km`, label: t('sample') },
    { value: `${ROUTE.climb} m`, label: t('climbLabel') },
    { value: `${fmt.format(mode.speed)} km/h`, label: t('speedLabel') },
  ];

  return (
    <div ref={ref} className="container hero__poster">
      <motion.dl className="hero__facts" {...rise(0.6)}>
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </motion.dl>

      <motion.div
        className="hero__figure"
        initial={{ opacity: 0, scale: 1.08, filter: 'blur(14px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.3, delay: 0.25, ease: EASE }}
      >
        <Image
          src="/svg/velox-logo.svg"
          alt="Velox"
          width={120}
          height={83}
          priority
          className="hero__logo"
        />
        <span className="visually-hidden" aria-live="polite">
          {hm(minutes)}
        </span>
        <p className="hero__time" aria-hidden="true">
          <RollingValue value={minutes} format={hm} />
        </p>
        <p className="hero__figure-label">{t('subtitle')}</p>
      </motion.div>

      <div className="hero__type">
        <h1>
          {['title1', 'title2'].map((key, i) => (
            <span key={key} className="hero__line">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.35 + i * 0.12, ease: EASE }}
              >
                {t(key)}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p className="hero__generic" {...rise(0.8)}>
          <span>{hm(GENERIC_MINUTES)}</span>
          {t('genericLabel')}
        </motion.p>
      </div>

      <motion.div
        className="hero__modes"
        role="group"
        aria-label={tApp('planner.summary.modality').replace(/:$/, '')}
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocusCapture={() => setHeld(true)}
        onBlurCapture={() => setHeld(false)}
        {...rise(0.95)}
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className="hero__mode"
            aria-pressed={mode.id === m.id}
            onClick={() => pick(m)}
          >
            <span className="hero__mode-bar">
              {mode.id === m.id && (
                <motion.span
                  key={running ? 'running' : 'held'}
                  className="hero__mode-fill"
                  initial={{ scaleX: running ? 0 : 1 }}
                  animate={{ scaleX: 1 }}
                  transition={
                    running
                      ? { duration: DWELL / 1000, ease: 'linear' }
                      : { duration: 0.4, ease: EASE }
                  }
                />
              )}
            </span>
            <span className="hero__mode-name">{tApp(`speedModal.options.${m.id}.label`)}</span>
            <span className="hero__mode-speed">
              {fmt.format(m.speed)} km/h · {hm(minutesFor(m.speed))}
            </span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
