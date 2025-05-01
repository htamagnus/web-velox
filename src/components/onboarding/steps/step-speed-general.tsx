'use client';

import { useState } from 'react';
import Button from '@/components/ui/button/button';
import StepNumericSelector from '../step-numeric-selector';
import { useTexts } from '@/helpers/use-texts';
import { Flame, Gauge } from 'lucide-react';

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
  const [loadingStrava, setLoadingStrava] = useState(false);
  const { t } = useTexts('onboarding.speedGeneral');

  const redirectToStrava = () => {
    setLoadingStrava(true);
    sessionStorage.setItem('velox_current_step', '3');
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const redirectUri = `${window.location.origin}/strava/callback`; // TO DO: melhorar essa pagina
    const scope = 'read,activity:read_all';

    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=auto&scope=${scope}`;

    window.location.href = stravaAuthUrl;
  };

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
