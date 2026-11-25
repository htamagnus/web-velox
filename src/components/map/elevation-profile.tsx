'use client';

import { motion } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { EASE } from '@/components/landing/reveal';

export type ElevationPoint = {
  distance: number;
  elevation: number;
};

const W = 300;
const H = 100;

// o perfil como na folha técnica da landing: área em tinta clara, linha volt e o cume anotado
export default function ElevationProfile({ data }: { data: ElevationPoint[] }) {
  const { t } = useTexts('elevationProfile');
  const { locale } = useLocale();
  if (data.length < 2) return null;

  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  const elevations = data.map((p) => p.elevation);
  const min = Math.min(...elevations);
  const max = Math.max(...elevations);
  const range = max - min || 1;
  const total = data[data.length - 1].distance || 1;
  const x = (d: number) => (d / total) * W;
  const y = (e: number) => H - 6 - ((e - min) / range) * (H - 30);
  const points = data.map((p) => `${x(p.distance).toFixed(1)},${y(p.elevation).toFixed(1)}`).join(' ');
  const summit = data[elevations.indexOf(max)];
  const km = (m: number) => `${fmt.format(m / 1000)} km`;

  return (
    <figure className="plan__profile">
      <figcaption className="field__label">{t('title')}</figcaption>
      <div className="plan__plot">
        <p
          className="plan__summit"
          style={{
            left: `${Math.min(90, Math.max(10, (x(summit.distance) / W) * 100))}%`,
            top: `${(y(max) / H) * 100}%`,
          }}
        >
          <b className="num">{Math.round(max)} m</b>
        </p>
        <motion.svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={t('title')}
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <polygon points={`0,${H} ${points} ${W},${H}`} />
          <polyline points={points} />
        </motion.svg>
      </div>
      <p className="plan__axis num">
        <span>0 km</span>
        <span>{km(total / 2)}</span>
        <span>{km(total)}</span>
      </p>
    </figure>
  );
}
