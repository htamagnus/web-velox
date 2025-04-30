import { ArrowDown, ArrowUp, Calendar } from "lucide-react";
import StepNumericSelector from "../step-numeric-selector";
import { StepProps } from "@/interfaces/step.interface";
import { useTexts } from "@/helpers/use-texts";

export default function StepAge(props: StepProps) {
  const { t } = useTexts('onboarding.age')
  return (
    <StepNumericSelector
      title={t('title')}
      subtitle={t('subtitle')}
      iconTitle={<Calendar />}
      unit={t('unit')}
      min={8}
      max={100}
      iconUp={<ArrowUp className="w-5 h-5" color="black" />}
      iconDown={<ArrowDown className="w-5 h-5" color="black" />}
      {...props}
      note={t('note')}
    />
  )
}
