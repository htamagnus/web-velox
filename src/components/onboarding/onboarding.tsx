'use client';

import React from 'react';
import { onboardingSteps } from './steps';
import { useOnboardingForm } from '@/hooks/use-onboarding-form';
import { ProgressBar } from './progress-bar';
import { StepContainer } from './step-container';

export default function OnboardingForm() {
  const {
    ready,
    loading,
    step,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    handleSubmit,
  } = useOnboardingForm();

  if (!ready) return null;

  const stepConfig = onboardingSteps[step];
  const StepComponent = stepConfig?.Component;
  const stepProp = stepConfig?.prop;
  const isLastStep = step === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      nextStep();
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <ProgressBar currentStep={step} totalSteps={onboardingSteps.length} />
      
      {StepComponent && (
        <StepContainer step={step}>
          <StepComponent
            value={formData[stepProp]}
            onChange={(value) => updateFormData(stepProp, value)}
            onNext={handleNext}
            onBack={step > 0 ? prevStep : undefined}
          />
        </StepContainer>
      )}
    </div>
  );
}
