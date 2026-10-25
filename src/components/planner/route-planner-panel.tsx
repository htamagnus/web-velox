'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { Modality } from '@/interfaces/routes.interface';
import { EASE } from '@/components/landing/reveal';
import AutocompleteInput from '../route-input/route-input';

const BIKES: Modality[] = ['road', 'mtb', 'general'];

type Props = {
  originLabel: string | null;
  destinationLabel: string | null;
  onSetOrigin: (coords: [number, number], label: string) => void;
  onSetDestination: (coords: [number, number], label: string) => void;
  onClearOrigin?: () => void;
  onClearDestination?: () => void;
  onStart: () => void;
  modality: Modality;
  onSelectModality: (modality: Modality) => void;
  speeds: Record<Modality, number>;
  isCalculatingRoute: boolean;
};

// o formulário como o pôster: título condensado, os dois campos em fio e a faixa de bikes
export default function RoutePlannerPanel({
  originLabel,
  destinationLabel,
  onSetOrigin,
  onSetDestination,
  onClearOrigin,
  onClearDestination,
  onStart,
  modality,
  onSelectModality,
  speeds,
  isCalculatingRoute,
}: Props) {
  const { t } = useTexts('plannerPanel');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  const canCalculate = Boolean(originLabel && destinationLabel && speeds[modality] > 0);

  return (
    <form
      className="plan__form"
      onSubmit={(e) => {
        e.preventDefault();
        onStart();
      }}
    >
      <h1>
        {['title1', 'title2'].map((key, i) => (
          <span key={key} className="hero__line">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: EASE }}
            >
              {t(key)}
            </motion.span>
          </span>
        ))}
      </h1>

      <div className="plan__fields">
        <AutocompleteInput
          label={t('originLabel')}
          placeholder={t('searchPlaceholder')}
          initialValue={originLabel ?? undefined}
          onSelect={onSetOrigin}
          onClear={onClearOrigin}
        />
        <AutocompleteInput
          label={t('destinationLabel')}
          placeholder={t('searchPlaceholder')}
          initialValue={destinationLabel ?? undefined}
          onSelect={onSetDestination}
          onClear={onClearDestination}
        />
      </div>

      <fieldset className="plan__bikes">
        <legend className="field__label">{tApp('speedModal.title')}</legend>
        <div className="modes modes--ink">
          {BIKES.map((m) =>
            speeds[m] > 0 ? (
              <button
                key={m}
                type="button"
                className="modes__item"
                aria-pressed={modality === m}
                onClick={() => onSelectModality(m)}
              >
                <span className="modes__bar" aria-hidden="true" />
                <span className="modes__name">{tApp(`speedModal.options.${m}.label`)}</span>
                <span className="modes__speed num">{fmt.format(speeds[m])} km/h</span>
              </button>
            ) : (
              // sem média nessa bike não dá pra calcular: o segmento leva pro perfil
              <Link key={m} href="/profile" className="modes__item plan__configure">
                <span className="modes__bar" aria-hidden="true" />
                <span className="modes__name">{tApp(`speedModal.options.${m}.label`)}</span>
                <span className="modes__speed">{tApp('speedModal.configure')} →</span>
              </Link>
            ),
          )}
        </div>
      </fieldset>

      <button
        type="submit"
        className="btn btn--primary btn--big plan__submit"
        disabled={!canCalculate || isCalculatingRoute}
        aria-busy={isCalculatingRoute}
      >
        {isCalculatingRoute ? t('planning') : t('plan')}
      </button>
    </form>
  );
}
