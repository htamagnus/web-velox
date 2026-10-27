'use client';

import { motion } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import Reveal, { EASE } from './reveal';
import SplitWords from './split-words';
import RollingValue from './rolling-value';
import ModeSwitch from './mode-switch';
import { GENERIC_MINUTES, type Mode } from './modes';

// o mapa é um desenho num quadro de 1200 × 600: os mesmos dois pontos, três traçados
const VIEW = { w: 1200, h: 600 };
const ORIGIN = [90, 430];
const DEST = [1110, 130];
const ROUTES = [
  {
    id: 'main',
    name: 'routeSelector.labels.recommended',
    summary: 'calculate.fastestRoute',
    km: 30,
    climb: 200,
    d: 'M90 430 L230 430 L330 350 L520 340 L640 250 L820 230 L920 160 L1110 130',
    tag: [735, 320],
  },
  {
    id: 'alt1',
    name: 'routeSelector.labels.alternative',
    n: 1,
    summary: 'landing.routes.lessClimbing',
    km: 32,
    climb: 150,
    d: 'M90 430 L200 500 L480 505 L700 470 L900 380 L1010 250 L1110 130',
    tag: [430, 435],
  },
  {
    id: 'alt2',
    name: 'routeSelector.labels.alternative',
    n: 2,
    summary: 'landing.routes.longer',
    km: 34,
    climb: 230,
    d: 'M90 430 L150 300 L240 160 L420 90 L700 70 L900 60 L1030 95 L1110 130',
    tag: [560, 165],
  },
];
const minutesAt = (km: number, speed: number) => Math.round((km / speed) * 60);
const at = ([x, y]: number[]) => ({ left: `${(x / VIEW.w) * 100}%`, top: `${(y / VIEW.h) * 100}%` });

type Props = { mode: Mode; onChange: (mode: Mode) => void };

export default function Routes({ mode, onChange }: Props) {
  const { t } = useTexts('landing.routes');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  const base = minutesAt(ROUTES[0].km, mode.speed);
  const rows = ROUTES.map((route) => ({
    ...route,
    title: `${tApp(route.name)}${route.n ? ` ${route.n}` : ''}`,
    minutes: minutesAt(route.km, mode.speed),
  }));

  return (
    <section className="routes grain">
      <div className="container">
        <div className="routes__head">
          <div>
            <Reveal>
              <p className="eyebrow eyebrow--ink">{tApp('landing.index.routes')}</p>
            </Reveal>
            <SplitWords text={t('title')} />
            <Reveal delay={0.1}>
              <p className="lead">{t('lead')}</p>
            </Reveal>
          </div>
          <Reveal className="routes__modes" delay={0.15}>
            <ModeSwitch mode={mode} onChange={onChange} ink />
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="map">
            <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} preserveAspectRatio="none" aria-hidden="true">
              {rows.map((route, i) => (
                <motion.path
                  key={route.id}
                  className={i === 0 ? 'map__path is-main' : 'map__path'}
                  d={route.d}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                  transition={{ duration: 1.8, delay: 0.2 + i * 0.25, ease: EASE }}
                />
              ))}
              {rows.map((route, i) => (
                <circle
                  key={route.id}
                  className={i === 0 ? 'map__dot is-main' : 'map__dot'}
                  r={i === 0 ? 7 : 5}
                  style={{
                    offsetPath: `path("${route.d}")`,
                    // ponytail: o ritmo é só proporcional ao tempo da rota (1h20 → 8s), não uma escala real
                    animationDuration: `${route.minutes / 10}s`,
                  }}
                />
              ))}
            </svg>
            <div className="map__pin" style={at(ORIGIN)}>
              <b>{tApp('plannerPanel.originPlaceholder')}</b>
            </div>
            <div className="map__pin map__pin--end" style={at(DEST)}>
              <b>{tApp('landing.mock.destination')}</b>
            </div>
            {rows.map((route, i) => (
              <div
                key={route.id}
                className={i === 0 ? 'map__tag is-main' : 'map__tag'}
                style={at(route.tag)}
              >
                <b>{route.title}</b>
                <span>
                  {tApp(route.summary)} · {route.km} km · {route.climb} m
                </span>
                <span className="num">
                  <RollingValue value={route.minutes} format={hm} />
                  {i > 0 && <span className="map__diff">+{route.minutes - base} min</span>}
                </span>
              </div>
            ))}
          </div>
          <div className="routes__foot">
            <span>
              {t('caption')
                .replace('{{speed}}', fmt.format(mode.speed))
                .replace('{{mode}}', tApp(`speedModal.options.${mode.id}.label`))}{' '}
              {t('mapNote')}
            </span>
            <span className="routes__generic num">
              {hm(GENERIC_MINUTES)} · {tApp('landing.hero.genericLabel')}
            </span>
          </div>
          <ol className="routes__list">
            {rows.map((route, i) => (
              <li key={route.id} className={i === 0 ? 'routes__row is-main' : 'routes__row'}>
                <span className="routes__name">{route.title}</span>
                <span className="routes__time num">
                  <RollingValue value={route.minutes} format={hm} />
                  {i > 0 && <span className="routes__diff">+{route.minutes - base} min</span>}
                </span>
                <span className="routes__summary">
                  {tApp(route.summary)} · {route.km} km · {route.climb} m
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
