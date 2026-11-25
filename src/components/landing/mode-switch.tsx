'use client';

import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import { MODES, minutesFor, type Mode } from './modes';

type Props = { mode: Mode; onChange: (mode: Mode) => void; className?: string; ink?: boolean };

// a faixa de segmentos das bikes, a mesma do hero; a escolhida acende o seu traço
export default function ModeSwitch({ mode, onChange, className, ink }: Props) {
  const { t } = useTexts();
  const { locale } = useLocale();
  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  return (
    <div
      className={['modes', ink && 'modes--ink', className].filter(Boolean).join(' ')}
      role="group"
      aria-label={t('planner.summary.modality').replace(/:$/, '')}
    >
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          className="modes__item"
          aria-pressed={mode.id === m.id}
          onClick={() => onChange(m)}
        >
          <span className="modes__bar" aria-hidden="true" />
          <span className="modes__name">{t(`speedModal.options.${m.id}.label`)}</span>
          <span className="modes__speed num">
            {fmt.format(m.speed)} km/h · {hm(minutesFor(m.speed))}
          </span>
        </button>
      ))}
    </div>
  );
}
