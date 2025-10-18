'use client';

import Button from '@/components/ui/button/button';
import StepNumericSelector from '../step-numeric-selector';
import { useTexts } from '@/helpers/use-texts';
import { Flame, Gauge } from 'lucide-react';
import { useStravaAuth } from '@/hooks/use-strava-auth';

interface StepSpeedGeneralProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function StepSpeedGeneral({
  value,
  onChange,
  onNext,
  onBack,
}: StepSpeedGeneralProps) {
  const { t } = useTexts('onboarding.speedGeneral');
  const { redirectToStrava, loading: loadingStrava } = useStravaAuth();

  return (
    <StepNumericSelector
      title={t('title')}
      subtitle={t('subtitle')}
      iconTitle={<Gauge />}
      value={value}
      min={0}
      max={50}
      unit={t('unit')}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
      extraActions={
        <Button
          onClick={redirectToStrava}
          disabled={loadingStrava}
          variant="strava"
          className="mt-4"
        >
          <Flame className="w-6 h-6 mx-auto" stroke="#fc4c02aa" />
          {loadingStrava ? 'Redirecionando...' : 'Importar do Strava'}
        </Button>
      }
      note={t('note')}
    />
  );
}
