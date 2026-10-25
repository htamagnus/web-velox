'use client';

import { motion } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import { EASE } from '@/components/landing/reveal';

interface ProgressBarProps {
  steps: string[];
  current: number;
}

// a faixa de segmentos do hero: um traço por passo, o atual acende e os feitos ficam cheios
export function ProgressBar({ steps, current }: ProgressBarProps) {
  const { t } = useTexts('onboarding.progress');

  return (
    <ol className="onb__progress">
      {steps.map((key, i) => (
        <li key={key} aria-current={i === current ? 'step' : undefined} data-done={i < current || undefined}>
          <span className="onb__progress-bar">
            {i <= current && (
              <motion.span
                className="onb__progress-fill"
                initial={{ scaleX: i === current ? 0 : 1 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            )}
          </span>
          <span className="onb__progress-name">{t(key)}</span>
        </li>
      ))}
    </ol>
  );
}
