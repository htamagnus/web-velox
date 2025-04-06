import { CreateAthleteDto } from "@/interfaces/athlete.interface"
import StepHeight from "./step-height"
import StepWeight from "./step-weight"
import StepAge from "./step-age"
import StepSpeedGeneral from "./step-speed-general"

interface StepConfig {
    key: string
    Component: React.FC<{
      value: number
      onChange: (value: number) => void
      onNext: () => void
      onBack?: () => void
    }>
    prop: keyof CreateAthleteDto
  }
  
  export const onboardingSteps: StepConfig[] = [
    {
      key: 'height',
      prop: 'height',
      Component: StepHeight
    },
    {
      key: 'weight',
      prop: 'weight',
      Component: StepWeight
    },
    {
      key: 'age',
      prop: 'age',
      Component: StepAge
    },
    {
      key: 'averageSpeedGeneral',
      prop: 'averageSpeedGeneral',
      Component: StepSpeedGeneral
    }
  ]
  