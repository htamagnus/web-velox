'use client';

import { motion } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import Reveal, { EASE } from './reveal';
import SplitWords from './split-words';
import RollingValue from './rolling-value';
import ModeSwitch from './mode-switch';
import { ROUTE, minutesFor, type Mode } from './modes';

const FEATURES = ['prediction', 'modality', 'strava', 'elevation'];
// valores de exemplo da folha; o print do planner redesenhado substitui a folha inteira
const SAMPLE = { loss: 180, kcal: 640 };
const PROFILE =
  '0,90 10,86.5 20,80.8 30,74.2 40,77.3 50,71.5 60,63.2 70,53.5 80,45.2 90,48.3 100,39.9 110,32.5 120,25 130,28.5 140,20.2 150,14 160,18 170,24.1 180,29.4 190,25.9 200,33.3 210,40.8 220,46.9 230,52.2 240,57.1 250,63.2 260,68 270,73.7 280,77.7 290,80.3 300,81.2';
const SUMMIT = PROFILE.split(' ')
  .map((p) => p.split(',').map(Number))
  .reduce((top, p) => (p[1] < top[1] ? p : top));

type Props = { mode: Mode; onChange: (mode: Mode) => void };

// o app como folha técnica: o perfil atravessa a página e os dados ficam anotados nas bordas
export default function Product({ mode, onChange }: Props) {
  const { t } = useTexts('landing');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  const label = (key: string) => tApp(key).replace(/:$/, '');
  const facts = [
    [label('planner.summary.distance'), `${ROUTE.km} km`],
    [label('planner.summary.elevationGain'), `${ROUTE.climb} m`],
    [label('planner.summary.elevationLoss'), `${SAMPLE.loss} m`],
    [label('planner.summary.calories'), `${SAMPLE.kcal} kcal`],
  ];

  return (
    <section className="product" id="produto">
      <div className="container">
        <div className="product__head">
          <div>
            <Reveal>
              <p className="eyebrow">{t('index.product')}</p>
            </Reveal>
            <SplitWords text={`${t('solution.title')} ${t('solution.titleHighlight')}`} />
          </div>
          <Reveal className="product__aside" delay={0.15}>
            <p className="lead">{t('solution.subtitle')}</p>
            <p className="product__note">{t('solution.validation')}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <figure className="sheet">
            <div className="sheet__top">
              <div>
                <p className="label">{label('planner.summary.time')}</p>
                <p className="sheet__clock" aria-live="polite">
                  <RollingValue value={minutesFor(mode.speed)} format={hm} />
                </p>
                <p className="sheet__speed">
                  {tApp('planner.summary.averageSpeedInfo').replace(
                    '{{speed}}',
                    fmt.format(mode.speed),
                  )}
                  <span className="sheet__strava">{t('product.strava')}</span>
                </p>
                <ModeSwitch mode={mode} onChange={onChange} className="sheet__modes" />
              </div>
              <dl className="sheet__facts">
                {facts.map(([name, value]) => (
                  <div key={name}>
                    <dt>{name}</dt>
                    <dd className="num">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="sheet__profile">
              <p className="sheet__summit" style={{ left: `${SUMMIT[0] / 3}%`, top: `${SUMMIT[1]}%` }}>
                <b className="num">{ROUTE.climb} m</b>
                {label('planner.summary.elevationGain')}
              </p>
              <motion.svg
                viewBox="0 0 300 100"
                preserveAspectRatio="none"
                role="img"
                aria-label={tApp('elevationProfile.title')}
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 2.2, ease: EASE }}
              >
                <polygon points={`0,100 ${PROFILE} 300,100`} />
                <polyline points={PROFILE} />
              </motion.svg>
              <p className="sheet__axis num">
                <span>0 km</span>
                <span>10 km</span>
                <span>20 km</span>
                <span>{ROUTE.km} km</span>
              </p>
            </div>
          </figure>
        </Reveal>

        <Reveal>
          <ol className="features">
            {FEATURES.map((key) => (
              <li key={key}>
                <h3>{t(`features.${key}.title`)}</h3>
                <p>{t(`features.${key}.desc`)}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
