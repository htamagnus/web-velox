'use client';

import StepNumericSelector from '../step-numeric-selector';
import { useTexts } from '@/helpers/use-texts';
import { useStravaAuth } from '@/hooks/use-strava-auth';

interface StepSpeedGeneralProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack?: () => void;
  isFromStrava?: boolean;
}

export default function StepSpeedGeneral({
  value,
  onChange,
  onNext,
  onBack,
  isFromStrava = false,
}: StepSpeedGeneralProps) {
  const { t } = useTexts('onboarding.speedGeneral');
  const { t: tActions } = useTexts('onboarding.actions');
  const { redirectToStrava, loading: loadingStrava } = useStravaAuth();

  return (
    <StepNumericSelector
      title={t('title')}
      subtitle={t('subtitle')}
      value={value}
      min={0}
      max={200}
      unit={t('unit')}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
      disabled={isFromStrava}
      extraActions={
        <button
          type="button"
          className="btn btn--strava"
          onClick={redirectToStrava}
          disabled={loadingStrava || isFromStrava}
          aria-busy={loadingStrava}
        >
          {loadingStrava ? tActions('stravaLoading') : tActions('strava')}
        </button>
      }
      note={t('note')}
    />
  );
}
