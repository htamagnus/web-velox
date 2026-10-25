'use client';

import { motion } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import Reveal, { EASE } from './reveal';
import RollingTime from './rolling-time';
import { GENERIC_MINUTES, MODES, type Mode } from './modes';

// as três rotas do exemplo; o tempo de cada uma sai da distância pela média da bike escolhida
const ROUTES = [
  {
    name: 'routeSelector.labels.recommended',
    summary: 'calculate.fastestRoute',
    km: 30,
    climb: 200,
  },
  {
    name: 'routeSelector.labels.alternative',
    n: 1,
    summary: 'landing.routes.lessClimbing',
    km: 32,
    climb: 150,
  },
  {
    name: 'routeSelector.labels.alternative',
    n: 2,
    summary: 'landing.routes.longer',
    km: 34,
    climb: 230,
  },
];
const minutesAt = (km: number, speed: number) => Math.round((km / speed) * 60);

type Props = { mode: Mode; onChange: (mode: Mode) => void };

export default function Routes({ mode, onChange }: Props) {
  const { t } = useTexts('landing.routes');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  const base = minutesAt(ROUTES[0].km, mode.speed);

  return (
    <section className="routes">
      <div className="container">
        <Reveal>
          <div className="routes__head">
            <h2>{t('title')}</h2>
            <p className="lead">{t('lead')}</p>
            <div
              className="routes__modes"
              role="group"
              aria-label={tApp('planner.summary.modality').replace(/:$/, '')}
            >
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="routes__mode"
                  aria-pressed={mode.id === m.id}
                  onClick={() => onChange(m)}
                >
                  {tApp(`speedModal.options.${m.id}.label`)}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="routes__legend">
            <span>{t('colRoute')}</span>
            <span className="routes__generic">
              {hm(GENERIC_MINUTES)} · {tApp('landing.hero.genericLabel')}
            </span>
          </div>
          <ol className="routes__board">
            {ROUTES.map((route, i) => {
              const minutes = minutesAt(route.km, mode.speed);
              return (
                <li key={route.km} className={i === 0 ? 'routes__row is-main' : 'routes__row'}>
                  <div className="routes__name-cell">
                    <span className="routes__name">
                      {tApp(route.name)}
                      {route.n ? ` ${route.n}` : ''}
                    </span>
                    <span className="routes__summary">{tApp(route.summary)}</span>
                  </div>
                  <span className="routes__fact">
                    <b>{route.km} km</b>
                    {t('colDistance')}
                  </span>
                  <span className="routes__fact">
                    <b>{route.climb} m</b>
                    {t('colClimb')}
                  </span>
                  <span className="routes__time-cell">
                    {i > 0 && <span className="routes__diff">+{minutes - base} min</span>}
                    <RollingTime minutes={minutes} className="routes__time" />
                  </span>
                  <span className="routes__bar" aria-hidden="true">
                    <motion.span
                      className="routes__fill"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: Math.min(1, minutes / GENERIC_MINUTES) }}
                      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                      transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: EASE }}
                    />
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="routes__caption">
            {t('caption')
              .replace('{{speed}}', fmt.format(mode.speed))
              .replace('{{mode}}', tApp(`speedModal.options.${mode.id}.label`))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
