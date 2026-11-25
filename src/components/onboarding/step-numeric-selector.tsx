'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useTexts } from '@/helpers/use-texts';
import { EASE } from '@/components/landing/reveal';
import RollingValue from '@/components/landing/rolling-value';

interface StepNumericSelectorProps {
  title: string;
  subtitle: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack?: () => void;
  note?: string;
  extraActions?: React.ReactNode;
  disabled?: boolean;
}

// px entre dois traços da fita: um traço por unidade, um maior a cada dez
const TICK = 12;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
});

// o passo como pôster: o valor gigante em volt e, embaixo, uma fita métrica que corre sob o cursor fixo
export default function StepNumericSelector({
  title,
  subtitle,
  value,
  unit,
  min,
  max,
  onChange,
  onNext,
  onBack,
  note,
  extraActions,
  disabled = false,
}: StepNumericSelectorProps) {
  const { t } = useTexts('onboarding.actions');
  const drag = useRef<{ x: number; value: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const set = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (!disabled && clamped !== value) onChange(clamped);
  };

  const isSkippable = (value === 0 || value === min) && unit === 'km/h';

  const first = Math.ceil(min / 10) * 10;
  const majors = Array.from({ length: Math.floor((max - first) / 10) + 1 }, (_, i) => first + i * 10);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: 1,
      ArrowUp: 1,
      ArrowLeft: -1,
      ArrowDown: -1,
      PageUp: 10,
      PageDown: -10,
      Home: min - value,
      End: max - value,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    set(value + keys[e.key]);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, value };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    set(drag.current.value - Math.round((e.clientX - drag.current.x) / TICK));
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <div className="onb__step">
      <div className="onb__copy">
        <motion.h1 {...rise(0.05)}>{title}</motion.h1>
        <motion.p className="lead" {...rise(0.15)}>
          {subtitle}
        </motion.p>
        {disabled && (
          <motion.p className="onb__tag" {...rise(0.2)}>
            {t('fromStrava')}
          </motion.p>
        )}
      </div>

      <motion.p
        className="onb__figure"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.06, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
      >
        <RollingValue value={value} format={String} duration={0.4} className="onb__value" />
        {unit && <span className="onb__unit">{unit}</span>}
      </motion.p>

      <motion.div className="onb__dial" {...rise(0.25)}>
        <button
          type="button"
          className="onb__nudge"
          onClick={() => set(value - 1)}
          disabled={disabled || value <= min}
          aria-label={t('decrease')}
        >
          <Minus />
        </button>
        <div
          className="tape"
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={title}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={unit ? `${value} ${unit}` : undefined}
          aria-disabled={disabled || undefined}
          data-dragging={dragging || undefined}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div className="tape__window">
            <div
              className="tape__track"
              style={
                {
                  width: (max - min) * TICK + 1,
                  transform: `translateX(${-(value - min) * TICK}px)`,
                  '--tick': `${TICK}px`,
                  '--offset': `${(first - min) * TICK}px`,
                } as React.CSSProperties
              }
            >
              {majors.map((n) => (
                <span key={n} style={{ left: (n - min) * TICK }}>
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="onb__nudge"
          onClick={() => set(value + 1)}
          disabled={disabled || value >= max}
          aria-label={t('increase')}
        >
          <Plus />
        </button>
      </motion.div>

      <motion.div className="onb__actions" {...rise(0.35)}>
        {onBack && (
          <button type="button" className="btn btn--line" onClick={onBack}>
            {t('back')}
          </button>
        )}
        {extraActions}
        <button type="button" className="btn btn--primary btn--big" onClick={onNext}>
          {isSkippable ? t('skip') : t('continue')}
        </button>
      </motion.div>

      {note && (
        <motion.p className="onb__note" {...rise(0.45)}>
          {note}
        </motion.p>
      )}
    </div>
  );
}
