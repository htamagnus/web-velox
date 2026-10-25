import StepNumericSelector from '../step-numeric-selector';
import { StepProps } from '@/interfaces/step.interface';
import { useTexts } from '@/helpers/use-texts';

export default function StepHeight(props: StepProps) {
  const { t } = useTexts('onboarding.height');

  return (
    <StepNumericSelector
      title={t('title')}
      subtitle={t('subtitle')}
      unit={t('unit')}
      min={140}
      max={300}
      {...props}
      note={t('note')}
    />
  );
}
