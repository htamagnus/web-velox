'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MousePointerClick } from 'lucide-react';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { Modality } from '@/interfaces/routes.interface';
import { EASE } from '@/components/landing/reveal';
import { SPRING, shortLabel } from '@/components/app/motion';
import Segmented from '@/components/app/segmented';
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

// o formulário da folha: a saída e a chegada ligadas por um fio, a bike em segmentos e o botão grande embaixo
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
      className="plan"
      onSubmit={(e) => {
        e.preventDefault();
        onStart();
      }}
    >
      <h1 className="drawer__title">
        {['title1', 'title2'].map((key, i) => (
          <span key={key} className="hero__line">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: EASE }}
            >
              {t(key)}
            </motion.span>
          </span>
        ))}
      </h1>

      <div className="stops">
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
      {!(originLabel && destinationLabel) && (
        <p className="plan__hint">
          <MousePointerClick size={16} aria-hidden="true" />
          {t('mapHint')}
        </p>
      )}

      <div className="plan__bikes">
        <span className="section__label">{tApp('speedModal.title')}</span>
        <Segmented
          id="plan-bike"
          label={tApp('speedModal.title')}
          value={modality}
          onChange={onSelectModality}
          options={BIKES.map((m) => ({
            value: m,
            label: shortLabel(tApp(`speedModal.options.${m}.label`)),
            // sem média nessa bike não dá pra calcular: o segmento leva pro perfil
            ...(speeds[m] > 0
              ? { meta: `${fmt.format(speeds[m])} km/h` }
              : { meta: `${tApp('speedModal.configure')} →`, href: '/profile' }),
          }))}
        />
      </div>

      <motion.button
        type="submit"
        className="btn btn--primary btn--big plan__submit"
        disabled={!canCalculate || isCalculatingRoute}
        aria-busy={isCalculatingRoute}
        whileTap={{ scale: 0.97 }}
        transition={SPRING}
      >
        {isCalculatingRoute ? t('planning') : t('plan')}
        {!isCalculatingRoute && <ArrowRight size={22} strokeWidth={2.6} aria-hidden="true" />}
      </motion.button>
    </form>
  );
}
