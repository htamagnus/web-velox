'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Bike } from 'lucide-react';
import { useTexts } from '@/helpers/use-texts';
import { hm } from '@/helpers/format-minutes';
import { GENERIC_MINUTES, ROUTE, minutesFor, type Mode } from './modes';

// a rolagem é o tempo: do começo ao fim da seção passam os 130 min da previsão genérica
export default function Race({ mode }: { mode: Mode }) {
  const { t } = useTexts('landing.race');
  const { t: tApp } = useTexts();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  const veloxMinutes = minutesFor(mode.speed);

  const elapsed = useTransform(progress, (p) => p * GENERIC_MINUTES);
  const genericP = useTransform(elapsed, (m) => m / GENERIC_MINUTES);
  const veloxP = useTransform(elapsed, (m) => Math.min(1, m / veloxMinutes));
  const genericX = useTransform(genericP, (p) => `${p * 100}%`);
  const veloxX = useTransform(veloxP, (p) => `${p * 100}%`);
  const genericKm = useTransform(genericP, (p) => `${Math.round(p * ROUTE.km)} km`);
  const veloxKm = useTransform(veloxP, (p) => `${Math.round(p * ROUTE.km)} km`);
  const genericClock = useTransform(elapsed, (m) => hm(Math.round(m)));
  const veloxClock = useTransform(elapsed, (m) => hm(Math.min(veloxMinutes, Math.round(m))));
  const finish = useTransform(elapsed, [veloxMinutes - 4, veloxMinutes + 6], [0, 1]);
  const ghost = useTransform(finish, (v) => v * 0.28);
  const ghostX = useTransform(finish, [0, 1], ['14%', '0%']);

  const lanes = [
    {
      id: 'generic',
      name: t('generic'),
      p: genericP,
      x: genericX,
      km: genericKm,
      clock: genericClock,
    },
    {
      id: 'velox',
      name: `${t('velox')} · ${tApp(`speedModal.options.${mode.id}.label`)}`,
      p: veloxP,
      x: veloxX,
      km: veloxKm,
      clock: veloxClock,
    },
  ];

  return (
    <section ref={ref} className="race">
      <div className="race__stage grain">
        <div className="hero__lines" aria-hidden="true" />
        <div className="container race__inner">
          <div className="race__head">
            <p className="eyebrow eyebrow--ink">{tApp('landing.index.race')}</p>
            <h2>{t('title')}</h2>
            <p className="lead">
              {t('lead')
                .replace('{{km}}', String(ROUTE.km))
                .replace('{{climb}}', String(ROUTE.climb))}
            </p>
          </div>
          <div className="race__lanes">
            {lanes.map((lane) => (
              <div key={lane.id} className={`race__lane is-${lane.id}`}>
                <div className="race__meta">
                  <span className="race__name">{lane.name}</span>
                  <motion.span className="race__km">{lane.km}</motion.span>
                  <motion.span className="race__clock">{lane.clock}</motion.span>
                </div>
                <div className="race__track">
                  <motion.span className="race__fill" style={{ scaleX: lane.p }} />
                  <motion.span className="race__rider" style={{ left: lane.x }}>
                    <Bike size={22} aria-hidden="true" />
                  </motion.span>
                  {lane.id === 'velox' && (
                    <motion.span className="race__flag" style={{ opacity: finish }}>
                      {t('finished')}
                    </motion.span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="race__scale num" aria-hidden="true">
            {[0, 10, 20, 30].map((km) => (
              <span key={km} style={{ left: `${(km / ROUTE.km) * 100}%` }}>
                {km} km
              </span>
            ))}
          </p>
          <motion.p className="race__note" style={{ opacity: finish }}>
            {t('note').replace('{{diff}}', String(GENERIC_MINUTES - veloxMinutes))}
          </motion.p>
        </div>
        <motion.p className="race__ghost" style={{ opacity: ghost, x: ghostX }} aria-hidden="true">
          {hm(veloxMinutes)}
        </motion.p>
      </div>
    </section>
  );
}
