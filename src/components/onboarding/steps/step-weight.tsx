import { ArrowDown, ArrowUp } from "lucide-react";
import StepNumericSelector from "../step-numeric-selector";
import { StepProps } from "@/interfaces/step.interface";
import { useTexts } from "@/helpers/use-texts";

export default function StepWeight(props: StepProps) {
  const { t } = useTexts('onboarding.weight')

  return (
    <StepNumericSelector
      title={t('title')}
      subtitle={t('subtitle')}
      unit={t('unit')}
      min={40}
      max={120}
      iconUp={<ArrowUp className="w-5 h-5" color="black" />}
      iconDown={<ArrowDown className="w-5 h-5" color="black" />}
      {...props}
      note={t('note')}
    />
  )
}
