interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="absolute top-0 left-0 w-full h-2 bg-gray-700">
      <div
        className="h-full bg-primary-dark transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
} 