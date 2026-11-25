'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bookmark, MountainSnow, Ruler } from 'lucide-react';
import { useStravaAuth } from '@/hooks/use-strava-auth';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { Athlete } from '@/interfaces/athlete.interface';
import { Modality } from '@/interfaces/routes.interface';
import SpeedField from '@/components/landing/speed-field';
import CountUp from '@/components/landing/count-up';
import { useAppData } from '@/components/app/app-shell';
import { ITEM, SPRING, STAGGER, initials, shortLabel } from '@/components/app/motion';
import Segmented from '@/components/app/segmented';
import SpeedGauge from '@/components/app/speed-gauge';
import RouteCard from '@/components/app/route-card';
import Skeleton from '@/components/app/skeleton';

const SPEEDS = {
  road: 'averageSpeedRoad',
  mtb: 'averageSpeedMtb',
  general: 'averageSpeedGeneral',
} as const satisfies Record<Modality, keyof Athlete>;
const BIKES = Object.keys(SPEEDS) as Modality[];

// a home como painel: o velocímetro da sua média manda, o atalho pra planejar do lado e as rotas embaixo em trilho
export default function HomePage() {
  const { t } = useTexts('home');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
  const { athlete, routes } = useAppData();
  const [bike, setBike] = useState<Modality>('general');
  const { redirectToStrava, loading: loadingStrava } = useStravaAuth();

  if (!athlete || !routes) return <Skeleton rows={3} />;

  const lang = locale === 'pt' ? 'pt-BR' : 'en';
  const fmt = new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const fmtInt = new Intl.NumberFormat(lang, { maximumFractionDigits: 0 });
  const speed = athlete[SPEEDS[bike]] ?? 0;
  const bikeLabel = (m: Modality) => tApp(`speedModal.options.${m}.label`);
  const fromStrava = bike === 'general' && athlete.averageSpeedGeneralIsFromStrava;

  const facts = [
    { Icon: Bookmark, value: routes.length, unit: '', label: t('facts.routes') },
    { Icon: Ruler, value: routes.reduce((s, r) => s + r.distanceKm, 0), unit: 'km', label: t('facts.distance') },
    { Icon: MountainSnow, value: routes.reduce((s, r) => s + r.elevationGain, 0), unit: 'm', label: t('facts.climb') },
  ];

  return (
    <motion.div className="page home" variants={STAGGER} initial="hidden" animate="show">
      <motion.header className="page__head" variants={ITEM}>
        <span className="avatar" aria-hidden="true">
          {initials(athlete.name)}
        </span>
        <div>
          <p className="page__kicker">{t('greeting').replace('{{name}}', athlete.name.split(' ')[0])}</p>
          <h1 className="page__title">
            {t('title1')} <span>{t('title2')}</span>
          </h1>
        </div>
      </motion.header>

      <motion.section className="card home__speed grain" variants={ITEM} aria-label={t('speedLabel')}>
        <figure className="home__photo">
          <Image src="/images/cta-bike.jpg" alt="" fill priority sizes="(min-width: 64rem) 60vw, 100vw" />
        </figure>
        <SpeedField speed={speed} />
        <div className="home__speed-body">
          <p className={fromStrava ? 'chip chip--strava' : 'chip'}>{fromStrava ? t('strava.synced') : t('speedLabel')}</p>
          <SpeedGauge value={speed} format={(n) => fmt.format(n)} unit="km/h" label={bikeLabel(bike)} />
          <Segmented
            id="home-bike"
            label={t('bikes')}
            value={bike}
            onChange={setBike}
            options={BIKES.map((m) => ({
              value: m,
              label: shortLabel(bikeLabel(m)),
              meta: athlete[SPEEDS[m]] ? `${fmt.format(athlete[SPEEDS[m]])} km/h` : '—',
            }))}
          />
        </div>
      </motion.section>

      <motion.div className="home__side" variants={ITEM}>
        <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} transition={SPRING}>
          <Link href="/calculate" className="cta">
            <span className="cta__text">
              <b>{t('newRoute')}</b>
              <small>{t('newRouteHint')}</small>
            </span>
            <span className="cta__go" aria-hidden="true">
              <ArrowRight size={26} strokeWidth={2.4} />
            </span>
          </Link>
        </motion.div>

        <dl className="stats">
          {facts.map(({ Icon, value, unit, label }) => (
            <div key={label} className="card stat">
              <dt>
                <Icon size={16} aria-hidden="true" />
                {label}
              </dt>
              <dd>
                <CountUp to={Math.round(value)} format={(n) => fmtInt.format(n)} />
                {unit && <small>{unit}</small>}
              </dd>
            </div>
          ))}
        </dl>

        {!athlete.averageSpeedGeneralIsFromStrava && (
          <div className="card strava">
            <span className="strava__mark" aria-hidden="true" />
            <p>{t('strava.note')}</p>
            <button
              type="button"
              className="btn btn--strava btn--small"
              onClick={redirectToStrava}
              disabled={loadingStrava}
              aria-busy={loadingStrava}
            >
              {t('strava.import')}
            </button>
          </div>
        )}
      </motion.div>

      <motion.section className="home__routes" variants={ITEM}>
        <div className="section__head">
          <h2>{t('lastRoutes')}</h2>
          {routes.length > 0 && (
            <Link href="/saved-routes" className="link">
              {t('seeAll')} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>

        {routes.length === 0 ? (
          <div className="card empty">
            <h3>{tApp('savedRoutes.emptyTitle')}</h3>
            <p>{tApp('savedRoutes.emptyDescription')}</p>
            <Link href="/calculate" className="btn btn--primary">
              {tApp('savedRoutes.ctaCreate')}
            </Link>
          </div>
        ) : (
          <ol className="home__list">
            {routes.slice(0, 6).map((route, i) => (
              <li key={route.id ?? i}>
                <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} transition={SPRING}>
                  <Link href={`/saved-routes?r=${i}`} className="card rcard">
                    <RouteCard route={route} delay={i * 0.12} />
                  </Link>
                </motion.div>
              </li>
            ))}
          </ol>
        )}
      </motion.section>
    </motion.div>
  );
}
