import StepNumericSelector from '../step-numeric-selector';
import { StepProps } from '@/interfaces/step.interface';
import { useTexts } from '@/helpers/use-texts';

export default function StepAge(props: StepProps) {
  const { t } = useTexts('onboarding.age');
  return (
    <StepNumericSelector
      title={t('title')}
      subtitle={t('subtitle')}
      unit={t('unit')}
      min={8}
      max={150}
      {...props}
      note={t('note')}
    />
  );
}
