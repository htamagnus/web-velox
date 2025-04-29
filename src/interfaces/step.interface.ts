export interface StepProps {
    value: number
    onChange: (value: number) => void
    onNext: () => void
    onBack?: () => void
  }
  