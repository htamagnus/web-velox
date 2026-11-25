'use client';

import React from 'react';
import Image from 'next/image';
import { MotionConfig } from 'framer-motion';
import { archivo } from '@/app/fonts';
import LanguageSelector from '@/components/language-selector/language-selector';
import SpeedField from '@/components/landing/speed-field';
import { onboardingSteps } from './steps';
import { useOnboardingForm } from '@/hooks/use-onboarding-form';
import { ProgressBar } from './progress-bar';
import { StepContainer } from './step-container';

export default function OnboardingForm() {
  const {
    ready,
    step,
    formData,
    isFromStrava,
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
  const isSpeedGeneralStep = stepConfig?.key === 'averageSpeedGeneral';
  // nos passos de velocidade os rastros correm na média que a pessoa está escolhendo
  const streakSpeed = stepProp?.startsWith('averageSpeed') ? formData[stepProp] : 0;

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      nextStep();
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={`landing onb grain ${archivo.variable}`}>
        <SpeedField speed={streakSpeed} />
        <div className="hero__lines" aria-hidden="true" />

        <header className="container onb__nav">
          <Image src="/svg/velox-logo.svg" alt="Velox" width={56} height={39} priority />
          <div className="lang">
            <LanguageSelector />
          </div>
        </header>

        <div className="container onb__top">
          <ProgressBar steps={onboardingSteps.map((s) => s.key)} current={step} />
        </div>

        <main className="container onb__main">
          {StepComponent && (
            <StepContainer step={step}>
              <StepComponent
                value={formData[stepProp]}
                onChange={(value) => updateFormData(stepProp, value)}
                onNext={handleNext}
                onBack={step > 0 ? prevStep : undefined}
                {...(isSpeedGeneralStep && { isFromStrava })}
              />
            </StepContainer>
          )}
        </main>
      </div>
    </MotionConfig>
  );
}
