import { CreateAthleteDto } from "@/interfaces/athlete.interface"
import StepHeight from "./step-height"
import StepWeight from "./step-weight"
import StepAge from "./step-age"
import StepSpeed from "./step-speed"

type NormalStep = {
    key: string
    prop: keyof CreateAthleteDto
    Component: React.FC<{
      value: number
      onChange: (value: number) => void
      onNext: () => void
      onBack?: () => void
    }>
  }
  
  type SpeedStep = {
    key: string
    props: ['averageSpeedGeneral', 'averageSpeedRoad', 'averageSpeedMtb']
    Component: React.FC<{
      values: Pick<CreateAthleteDto, 'averageSpeedGeneral' | 'averageSpeedRoad' | 'averageSpeedMtb'>
      onChange: (key: keyof CreateAthleteDto, value: number) => void
      onNext: () => void
      onBack?: () => void
    }>
  }
  
  export const onboardingSteps: (NormalStep | SpeedStep)[] = [
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
      key: 'speed',
      props: ['averageSpeedGeneral', 'averageSpeedRoad', 'averageSpeedMtb'],
      Component: StepSpeed
    }
  ]
  