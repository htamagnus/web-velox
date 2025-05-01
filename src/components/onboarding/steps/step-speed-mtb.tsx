'use client';

import { useTexts } from '@/helpers/use-texts';
import StepNumericSelector from '../step-numeric-selector';
import { StepProps } from '@/interfaces/step.interface';
import { MountainSnow } from 'lucide-react';

export default function StepSpeedMtb({ value, onChange, onNext, onBack }: StepProps) {
  const { t } = useTexts('onboarding.speedMtb');

  return (
    <StepNumericSelector
      title={t('title')}
      subtitle={t('subtitle')}
      iconTitle={<MountainSnow />}
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
