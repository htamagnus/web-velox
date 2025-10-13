interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="absolute top-0 left-0 w-full h-2 bg-black/40">
      <div
        className="h-full transition-all duration-300 bg-gradient-to-r from-[#92a848] to-[#a8b87a]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
} 