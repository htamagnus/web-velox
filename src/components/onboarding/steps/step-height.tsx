import { Minus, Plus, Ruler } from 'lucide-react';
import StepNumericSelector from '../step-numeric-selector';
import { StepProps } from '@/interfaces/step.interface';
import { useTexts } from '@/helpers/use-texts';

export default function StepHeight(props: StepProps) {
  const { t } = useTexts('onboarding.height');

  return (
    <StepNumericSelector
      title={t('title')}
      iconTitle={<Ruler />}
      subtitle={t('subtitle')}
      unit={t('unit')}
      min={140}
      max={300}
      displayMode="scroll"
      iconUp={<Plus className="w-5 h-5" />}
      iconDown={<Minus className="w-5 h-5" />}
      {...props}
      note={t('note')}
    />
  );
}
