'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import polyline from '@mapbox/polyline';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useStravaAuth } from '@/hooks/use-strava-auth';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import ApiVeloxService from '@/providers/api-velox.provider';
import { Athlete } from '@/interfaces/athlete.interface';
import { Modality, SaveRouteDto } from '@/interfaces/routes.interface';
import LanguageSelector from '@/components/language-selector/language-selector';
import SpeedField from '@/components/landing/speed-field';
import RollingValue from '@/components/landing/rolling-value';
import Reveal, { EASE } from '@/components/landing/reveal';
import { archivo } from '../fonts';

const SPEEDS = {
  road: 'averageSpeedRoad',
  mtb: 'averageSpeedMtb',
  general: 'averageSpeedGeneral',
} as const satisfies Record<Modality, keyof Athlete>;
const BIKES = Object.keys(SPEEDS) as Modality[];

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

// o traçado da rota salva a partir da polyline, num quadrado de 100, sem mapa por baixo
function trace(encoded: string) {
  const pts = polyline.decode(encoded);
  if (pts.length < 2) return '';
  const k = Math.cos((pts[0][0] * Math.PI) / 180);
  const xs = pts.map(([, lng]) => lng * k);
  const ys = pts.map(([lat]) => -lat);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  const span = Math.max(Math.max(...xs) - x0, Math.max(...ys) - y0) || 1;
  const at = (v: number, v0: number) => (((v - v0) / span) * 100).toFixed(1);
  return xs.map((x, i) => `${at(x, x0)},${at(ys[i], y0)}`).join(' ');
}

// a home como o pôster do hero: a sua média gigante no centro, as suas rotas nas bordas e embaixo em lista
export default function HomePage() {
  useProtectedRoute();
  const { t } = useTexts('home');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
  const api = useMemo(() => new ApiVeloxService(), []);
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [routes, setRoutes] = useState<SaveRouteDto[]>([]);
  const [ready, setReady] = useState(false);
  const [bike, setBike] = useState<Modality>('general');
  const { redirectToStrava, loading: loadingStrava } = useStravaAuth();

  useEffect(() => {
    Promise.allSettled([api.getProfile(), api.getSavedRoutes()]).then(([profile, saved]) => {
      if (profile.status === 'fulfilled') setAthlete(profile.value);
      if (saved.status === 'fulfilled') setRoutes(saved.value);
      setReady(true);
    });
  }, [api]);

  if (!ready) return null;

  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  const fmtInt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 0 });
  const speed = athlete?.[SPEEDS[bike]] ?? 0;
  const bikeLabel = (m: Modality) => tApp(`speedModal.options.${m}.label`);
  const firstName = athlete?.name.split(' ')[0];

  const facts = [
    { value: fmtInt.format(routes.length), label: t('facts.routes') },
    { value: `${fmtInt.format(routes.reduce((s, r) => s + r.distanceKm, 0))} km`, label: t('facts.distance') },
    { value: `${fmtInt.format(routes.reduce((s, r) => s + r.elevationGain, 0))} m`, label: t('facts.climb') },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className={`landing home ${archivo.variable}`}>
        <motion.header
          className="nav"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          <div className="container nav__bar">
            <div className="nav__end">
              <div className="lang nav__lang">
                <LanguageSelector />
              </div>
              <Link href="/profile" className="nav__link">
                {t('profile')}
              </Link>
            </div>
          </div>
        </motion.header>

        <main>
          <section className="hero home__poster grain">
            <figure className="hero__photo">
              <Image src="/images/cta-bike.jpg" alt="" fill priority sizes="100vw" />
            </figure>
            <SpeedField speed={speed} />
            <div className="hero__lines" aria-hidden="true" />

            <div className="container hero__poster">
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
                <Image src="/svg/velox-logo.svg" alt="Velox" width={120} height={83} priority className="hero__logo" />
                {athlete && (
                  <>
                    <p className="home__speed">
                      <RollingValue value={speed * 10} format={(n) => fmt.format(n / 10)} className="hero__time" />
                      <span className="home__unit">km/h</span>
                    </p>
                    <p className="hero__figure-label">
                      {t('speedLabel')} · {bikeLabel(bike)}
                    </p>
                  </>
                )}
              </motion.div>

              {athlete && (
                <motion.div className="home__aside" {...rise(0.7)}>
                  {athlete.averageSpeedGeneralIsFromStrava ? (
                    <p className="strava-tag">{t('strava.synced')}</p>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn--strava"
                        onClick={redirectToStrava}
                        disabled={loadingStrava}
                        aria-busy={loadingStrava}
                      >
                        {t('strava.import')}
                      </button>
                      <p className="home__note">{t('strava.note')}</p>
                    </>
                  )}
                </motion.div>
              )}

              <div className="hero__type">
                <div>
                  {firstName && (
                    <motion.p className="eyebrow eyebrow--ink" {...rise(0.3)}>
                      {t('greeting').replace('{{name}}', firstName)}
                    </motion.p>
                  )}
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
                </div>
                <motion.div className="home__actions" {...rise(0.8)}>
                  <Link href="/calculate" className="btn btn--primary btn--big">
                    {t('newRoute')}
                  </Link>
                  <Link href="/saved-routes" className="btn btn--line">
                    {t('myRoutes')}
                  </Link>
                </motion.div>
              </div>

              {athlete && (
                <motion.div className="hero__modes" role="group" aria-label={t('bikes')} {...rise(0.95)}>
                  {BIKES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className="hero__mode"
                      aria-pressed={bike === m}
                      onClick={() => setBike(m)}
                    >
                      <span className="hero__mode-bar">
                        {bike === m && (
                          <motion.span
                            className="hero__mode-fill"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.4, ease: EASE }}
                          />
                        )}
                      </span>
                      <span className="hero__mode-name">{bikeLabel(m)}</span>
                      <span className="hero__mode-speed">{fmt.format(athlete[SPEEDS[m]])} km/h</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </section>

          <section className="container home__routes">
            <Reveal className="home__routes-head">
              <h2>{t('lastRoutes')}</h2>
              {routes.length > 0 && (
                <Link href="/saved-routes" className="home__all">
                  {t('seeAll')}
                </Link>
              )}
            </Reveal>

            {routes.length === 0 ? (
              <Reveal className="home__empty" delay={0.1}>
                <h3>{tApp('savedRoutes.emptyTitle')}</h3>
                <p>{tApp('savedRoutes.emptyDescription')}</p>
                <Link href="/calculate" className="btn btn--primary">
                  {tApp('savedRoutes.ctaCreate')}
                </Link>
              </Reveal>
            ) : (
              <ol className="home__list">
                {routes.slice(0, 3).map((route, i) => (
                  <li key={i}>
                    <Reveal delay={0.1 + i * 0.08}>
                      <Link href="/saved-routes" className="home__route">
                        <span className="home__route-time">{hm(Math.round(route.estimatedTimeMinutes))}</span>
                        <span className="home__route-text">
                          <h3>
                            {route.origin} <span aria-hidden="true">→</span> {route.destination}
                          </h3>
                          <span className="home__route-meta num">
                            {fmt.format(route.distanceKm)} km · +{fmtInt.format(route.elevationGain)} m ·{' '}
                            {fmtInt.format(route.estimatedCalories)} kcal · {bikeLabel(route.modality)}
                          </span>
                        </span>
                        <svg className="home__route-trace" viewBox="-4 -4 108 108" aria-hidden="true">
                          <polyline points={trace(route.polyline)} />
                        </svg>
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </main>
      </div>
    </MotionConfig>
  );
}
