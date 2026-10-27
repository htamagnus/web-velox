'use client';

import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import { MODES, ROUTE, minutesFor } from './modes';

export default function Ticker() {
  const { t } = useTexts();
  const { locale } = useLocale();
  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  const items = [
    `${ROUTE.km} km · ${ROUTE.climb} m`,
    ...MODES.map(
      (m) =>
        `${t(`speedModal.options.${m.id}.label`)} ${fmt.format(m.speed)} km/h → ${hm(minutesFor(m.speed))}`,
    ),
  ];
  // a faixa é duplicada pra fechar o loop sem emenda
  const loop = [...items, ...items];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {loop.map((item, i) => (
          <span key={i} className="ticker__item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
