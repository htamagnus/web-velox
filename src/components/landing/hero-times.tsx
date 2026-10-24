'use client';

import { useState } from 'react';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';

const ROUTE = { km: 30, climb: 200 };
// a previsão genérica que a página já citava: mais de 2 horas pra 30 km
const GENERIC_MINUTES = 130;
// médias típicas por modalidade; a da Speed bate com a tabela de rotas abaixo (30 km → 1h20)
const MODES = [
  { id: 'road', speed: 22.5 },
  { id: 'mtb', speed: 15 },
  { id: 'general', speed: 18 },
] as const;

export default function HeroTimes() {
  const { t } = useTexts('landing.hero');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
  const [mode, setMode] = useState<(typeof MODES)[number]>(MODES[0]);

  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  const minutes = Math.round((ROUTE.km / mode.speed) * 60);

  return (
    <div className="compare">
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
              onClick={() => setMode(m)}
            >
              {tApp(`speedModal.options.${m.id}.label`)}
            </button>
          ))}
        </div>
      </div>
      <dl className="compare__sheet">
        <div className="compare__row">
          <dt>
            {t('genericLabel')}
            <span>{t('genericNote')}</span>
          </dt>
          <dd>{hm(GENERIC_MINUTES)}</dd>
        </div>
        <div className="compare__row is-on">
          <dt>
            {t('veloxLabel')}
            <span>{t('atSpeed').replace('{{speed}}', fmt.format(mode.speed))}</span>
          </dt>
          <dd aria-live="polite">{hm(minutes)}</dd>
        </div>
      </dl>
    </div>
  );
}
