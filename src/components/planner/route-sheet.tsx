'use client';

import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import { Modality, TrafficData, WeatherData } from '@/interfaces/routes.interface';
import RollingValue from '@/components/landing/rolling-value';
import ElevationProfile, { ElevationPoint } from '@/components/map/elevation-profile';
import WeatherDisplay from '@/components/weather/weather-display';
import TrafficDisplay from '@/components/traffic/traffic-display';

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
  onReset: () => void;
};

// o resultado como a folha técnica da landing: o tempo gigante, as rotas em faixa, os dados nas bordas
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
    [label('planner.summary.distance'), `${fmt.format(route.distanceKm)} km`],
    [label('planner.summary.elevationGain'), `${fmtInt.format(route.elevationGain)} m`],
    [label('planner.summary.elevationLoss'), `${fmtInt.format(route.elevationLoss)} m`],
    [label('planner.summary.calories'), `${fmtInt.format(route.estimatedCalories)} kcal`],
  ];

  return (
    <div className="plan__sheet">
      <div className="plan__head">
        <p className="eyebrow eyebrow--ink">
          {name(selectedIndex)}
          {route.summary && ` · ${route.summary}`}
        </p>
        <ol className="plan__ends">
          <li>{origin}</li>
          <li>{destination}</li>
        </ol>
      </div>

      <div>
        <p className="label plan__label">{label('planner.summary.time')}</p>
        <div className="plan__clock-row">
          <p className="plan__clock">
            <RollingValue value={minutes(route)} format={hm} />
          </p>
          {diff > 0 && <span className="plan__diff num">+{diff} min</span>}
        </div>
        <p className="plan__speed">
          {tApp('planner.summary.averageSpeedInfo').replace('{{speed}}', fmt.format(route.averageSpeedUsed))}{' '}
          <span>{tApp(`speedModal.options.${modality}.label`)}</span>
        </p>
      </div>

      {routes.length > 1 && (
        <div className="modes modes--ink" role="group" aria-label={t('routes')}>
          {routes.map((r, i) => (
            <button
              key={i}
              type="button"
              className="modes__item"
              aria-pressed={i === selectedIndex}
              onClick={() => onSelect(i)}
            >
              <span className="modes__bar" aria-hidden="true" />
              <span className="modes__name">{name(i)}</span>
              <span className="modes__speed num">
                {hm(minutes(r))}
                {i > 0 && minutes(r) > minutes(routes[0]) && ` · +${minutes(r) - minutes(routes[0])} min`}
              </span>
            </button>
          ))}
        </div>
      )}

      <dl className="plan__facts">
        {facts.map(([term, value]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd className="num">{value}</dd>
          </div>
        ))}
      </dl>

      {route.elevationProfile && <ElevationProfile key={selectedIndex} data={route.elevationProfile} />}

      {route.warnings && route.warnings.length > 0 && (
        <ul className="plan__warnings">
          {route.warnings.map((warning, i) => (
            <li key={i}>{warning}</li>
          ))}
        </ul>
      )}

      {(weather || traffic) && (
        <section className="plan__conditions">
          <h2 className="field__label">{t('conditions')}</h2>
          <dl>
            {weather && <WeatherDisplay weatherData={weather} />}
            {traffic && <TrafficDisplay trafficData={traffic} />}
          </dl>
        </section>
      )}

      <div className="plan__actions">
        <button type="button" className="btn btn--primary" onClick={onSave} disabled={saving} aria-busy={saving}>
          {saving ? t('buttons.saving') : t('buttons.save')}
        </button>
        <button type="button" className="btn btn--line" onClick={onReset}>
          {t('buttons.newSearch')}
        </button>
      </div>
    </div>
  );
}
