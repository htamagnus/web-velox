'use client';

import { motion } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import { trace } from '@/helpers/trace';
import { SavedRoute } from '@/interfaces/routes.interface';
import { shortLabel, shortPlace } from './motion';

// o miolo do cartão de rota: o traçado se desenha, o tempo grande, os dois lugares e os números miúdos
export default function RouteCard({ route, delay = 0 }: { route: SavedRoute; delay?: number }) {
  const { t } = useTexts();
  const { locale } = useLocale();
  const lang = locale === 'pt' ? 'pt-BR' : 'en';
  const fmt = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });
  const fmtInt = new Intl.NumberFormat(lang, { maximumFractionDigits: 0 });

  return (
    <>
      <svg className="rcard__trace" viewBox="-6 -6 112 112" aria-hidden="true">
        <motion.polyline
          points={trace(route.polyline)}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.2 + delay, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
      <span className="rcard__top">
        <span className="rcard__time">{hm(Math.round(route.estimatedTimeMinutes))}</span>
        <span className="chip">{shortLabel(t(`speedModal.options.${route.modality}.label`))}</span>
      </span>
      <span className="rcard__ends">
        {shortPlace(route.origin)} <span aria-hidden="true">→</span> {shortPlace(route.destination)}
      </span>
      <span className="rcard__meta num">
        {fmt.format(route.distanceKm)}&nbsp;km · +{fmtInt.format(route.elevationGain)}&nbsp;m ·{' '}
        {fmtInt.format(route.estimatedCalories)}&nbsp;kcal
      </span>
    </>
  );
}
