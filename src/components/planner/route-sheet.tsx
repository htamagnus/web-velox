'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Flame, Ruler, TrendingDown, TrendingUp, X } from 'lucide-react';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import { Modality, TrafficData, WeatherData } from '@/interfaces/routes.interface';
import RollingValue from '@/components/landing/rolling-value';
import ElevationProfile, { ElevationPoint } from '@/components/map/elevation-profile';
import { ROUTE_COLORS } from '@/components/map/google-route-map';
import WeatherDisplay from '@/components/weather/weather-display';
import TrafficDisplay from '@/components/traffic/traffic-display';
import { ITEM, SPRING, STAGGER, shortLabel, shortPlace } from '@/components/app/motion';
import Segmented from '@/components/app/segmented';

export type RouteOption = {
  polyline: [number, number][];
  distanceKm: number;
  estimatedTimeMinutes: number;
  elevationGain: number;
  elevationLoss: number;
  estimatedCalories: number;
  averageSpeedUsed: number;
  elevationProfile?: ElevationPoint[];
  summary?: string;
  warnings?: string[];
};

type Props = {
  routes: RouteOption[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  origin: string;
  destination: string;
  modality: Modality;
  weather?: WeatherData;
  traffic?: TrafficData;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  onReset: () => void;
};

// o resultado na folha: o tempo gigante, as rotas em segmentos com a cor do traçado, os números em ladrilhos
export default function RouteSheet({
  routes,
  selectedIndex,
  onSelect,
  origin,
  destination,
  modality,
  weather,
  traffic,
  onSave,
  saving,
  saved,
  onReset,
}: Props) {
  const { t } = useTexts('calculate');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  const fmtInt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 0 });
  const label = (key: string) => tApp(key).replace(/:$/, '');
  const name = (i: number) =>
    i === 0 ? tApp('routeSelector.labels.recommended') : `${tApp('routeSelector.labels.alternative')} ${i}`;
  const minutes = (r: RouteOption) => Math.round(r.estimatedTimeMinutes);

  const route = routes[selectedIndex];
  const diff = minutes(route) - minutes(routes[0]);
  const facts = [
    { Icon: Ruler, term: label('planner.summary.distance'), value: `${fmt.format(route.distanceKm)} km` },
    { Icon: Flame, term: label('planner.summary.calories'), value: `${fmtInt.format(route.estimatedCalories)} kcal` },
    { Icon: TrendingUp, term: label('planner.summary.elevationGain'), value: `${fmtInt.format(route.elevationGain)} m` },
    { Icon: TrendingDown, term: label('planner.summary.elevationLoss'), value: `${fmtInt.format(route.elevationLoss)} m` },
  ];

  return (
    <motion.div className="result" variants={STAGGER} initial="hidden" animate="show">
      <motion.header className="result__head" variants={ITEM}>
        <p className="chip chip--accent">
          {name(selectedIndex)}
          {route.summary && ` · ${route.summary}`}
        </p>
        <motion.button
          type="button"
          className="icon-btn"
          onClick={onReset}
          aria-label={t('buttons.newSearch')}
          whileTap={{ scale: 0.85 }}
          transition={SPRING}
        >
          <X size={20} aria-hidden="true" />
        </motion.button>
      </motion.header>

      <motion.ol className="result__ends" variants={ITEM}>
        <li title={origin}>{shortPlace(origin)}</li>
        <li title={destination}>{shortPlace(destination)}</li>
      </motion.ol>

      <motion.div className="result__time" variants={ITEM}>
        <p className="result__label">{label('planner.summary.time')}</p>
        <div className="result__clock-row">
          <p className="result__clock">
            <RollingValue value={minutes(route)} format={hm} />
          </p>
          <AnimatePresence>
            {diff > 0 && (
              <motion.span
                key="diff"
                className="chip chip--amber num"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={SPRING}
              >
                +{diff} min
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="result__speed">
          {tApp('planner.summary.averageSpeedInfo').replace('{{speed}}', fmt.format(route.averageSpeedUsed))}{' '}
          <span>{shortLabel(tApp(`speedModal.options.${modality}.label`))}</span>
        </p>
      </motion.div>

      {routes.length > 1 && (
        <motion.div variants={ITEM}>
          <Segmented
            id="plan-route"
            label={t('routes')}
            value={selectedIndex}
            onChange={onSelect}
            className="seg--routes"
            options={routes.map((r, i) => ({
              value: i,
              label: i === 0 ? name(0) : `${tApp('routeSelector.labels.alt')} ${i}`,
              meta: hm(minutes(r)),
              color: ROUTE_COLORS[i % ROUTE_COLORS.length],
            }))}
          />
        </motion.div>
      )}

      <motion.dl className="tiles" variants={ITEM}>
        {facts.map(({ Icon, term, value }) => (
          <div key={term} className="tile">
            <dt>
              <Icon size={16} aria-hidden="true" />
              {term}
            </dt>
            <dd className="num">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={value}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={SPRING}
                >
                  {value}
                </motion.span>
              </AnimatePresence>
            </dd>
          </div>
        ))}
      </motion.dl>

      {route.elevationProfile && (
        <motion.div variants={ITEM}>
          <ElevationProfile key={selectedIndex} data={route.elevationProfile} />
        </motion.div>
      )}

      {route.warnings && route.warnings.length > 0 && (
        <motion.ul className="result__warnings" variants={ITEM}>
          {route.warnings.map((warning, i) => (
            <li key={i}>{warning}</li>
          ))}
        </motion.ul>
      )}

      {(weather || traffic) && (
        <motion.section className="result__conditions" variants={ITEM} initial="hidden" animate="show">
          <h2 className="section__label">{t('conditions')}</h2>
          <dl>
            {weather && <WeatherDisplay weatherData={weather} />}
            {traffic && <TrafficDisplay trafficData={traffic} />}
          </dl>
        </motion.section>
      )}

      <div className="result__actions">
        <AnimatePresence>
          {saved && (
            <motion.p
              className="result__saved"
              role="status"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
            >
              <motion.span
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 14 }}
              >
                <Check size={16} aria-hidden="true" />
              </motion.span>
              {t('saved')}
            </motion.p>
          )}
        </AnimatePresence>
        {saved ? (
          <Link href="/saved-routes" className="btn btn--primary">
            {t('buttons.seeSaved')}
          </Link>
        ) : (
          <motion.button
            type="button"
            className="btn btn--primary"
            onClick={onSave}
            disabled={saving}
            aria-busy={saving}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
          >
            {saving ? t('buttons.saving') : t('buttons.save')}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
