'use client';

import { useTexts } from '@/helpers/use-texts';
import StepNumericSelector from '../step-numeric-selector';
import { StepProps } from '@/interfaces/step.interface';
import { Zap } from 'lucide-react';

export default function StepSpeedRoad({ value, onChange, onNext, onBack }: StepProps) {
  const { t } = useTexts('onboarding.speedRoad');

  return (
    <StepNumericSelector
      title={t('title')}
      subtitle={t('subtitle')}
      iconTitle={<Zap />}
      value={value}
      min={0}
      max={50}
      unit="km/h"
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
      note={t('note')}
    />
  );
}
