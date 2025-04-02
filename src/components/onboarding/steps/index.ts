
'use client'

import { CreateAthleteDto } from '@/interfaces/athlete.interface'
import StepWeight from './step-weight'
import StepHeight from './step-height'

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
    Component: StepHeight,
    prop: 'height'
  },
  {
    key: 'weight',
    Component: StepWeight,
    prop: 'weight'
  }
]
