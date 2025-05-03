'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ApiVeloxService from '@/providers/api-velox.provider';
import { ApiError } from '@/errors/api-errors';
import { OnboardingAthleteData } from '@/interfaces/athlete.interface';
import { motion, AnimatePresence } from 'framer-motion';
import { onboardingSteps } from './steps';
import { toast } from 'sonner';

export default function OnboardingForm() {
  const router = useRouter();
  const apiVelox = new ApiVeloxService();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedSpeed = sessionStorage.getItem('velox_avg_speed');
    const savedStep = sessionStorage.getItem('velox_current_step');

    if (savedSpeed) {
      const parsed = Number(savedSpeed);
      setFormData((prev) => {
        const updated = { ...prev, averageSpeedGeneral: parsed };
        return updated;
      });
      sessionStorage.removeItem('velox_avg_speed');
    }

    if (savedStep) {
      setStep(Number(savedStep));
      sessionStorage.removeItem('velox_current_step');
    }

    setReady(true);
  }, []);

  const [formData, setFormData] = useState<OnboardingAthleteData>({
    age: 22,
    weight: 65,
    height: 165,
    averageSpeedRoad: 0,
    averageSpeedMtb: 0,
    averageSpeedGeneral: 0,
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const stepConfig = onboardingSteps[step];
  const StepComponent = stepConfig?.Component;
  const stepProp = stepConfig?.prop;

  const updateFormData = (key: keyof OnboardingAthleteData, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isLastStep = step === onboardingSteps.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      try {
        setLoading(true);
        await apiVelox.completeProfile(formData);
        router.push('/home');
      } catch (err) {
        if (err instanceof ApiError) {
          toast.error(err.message);
        } else {
          toast.error('Erro ao completar o perfil');
        }
      } finally {
        setLoading(false);
      }
    } else {
      nextStep();
    }
  };

  if (!ready) return null;

  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <AnimatePresence mode="wait">
        {StepComponent && (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <StepComponent
              value={formData[stepProp]}
              onChange={(value) => updateFormData(stepProp, value)}
              onNext={isLastStep ? handleNext : nextStep}
              onBack={step > 0 ? prevStep : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute top-0 left-0 w-full h-2 bg-gray-700">
        <div
          className="h-full bg-primary-dark transition-all duration-300"
          style={{ width: `${((step + 1) / onboardingSteps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
