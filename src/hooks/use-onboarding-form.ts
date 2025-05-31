import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import ApiVeloxService from '@/providers/api-velox.provider';
import { OnboardingAthleteData } from '@/interfaces/athlete.interface';
import { ApiError } from '@/errors/api-errors';
import { toast } from 'sonner';

export function useOnboardingForm() {
  const { login, user } = useAuth();
  const router = useRouter();
  const apiVelox = new ApiVeloxService();
  
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingAthleteData>({
    age: 22,
    weight: 65,
    height: 165,
    averageSpeedRoad: 0,
    averageSpeedMtb: 0,
    averageSpeedGeneral: 0,
  });

  useEffect(() => {
    if (user?.hasCompletedOnboarding) {
      router.replace('/home');
    }
  }, [user]);

  useEffect(() => {
    const savedSpeed = sessionStorage.getItem('velox_avg_speed');
    const savedStep = sessionStorage.getItem('velox_current_step');

    if (savedSpeed) {
      const parsed = Number(savedSpeed);
      setFormData((prev) => ({
        ...prev,
        averageSpeedGeneral: parsed,
      }));
      sessionStorage.removeItem('velox_avg_speed');
    }

    if (savedStep) {
      setStep(Number(savedStep));
      sessionStorage.removeItem('velox_current_step');
    }

    setReady(true);
  }, []);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateFormData = (key: keyof OnboardingAthleteData, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await apiVelox.completeProfile(formData);

      login({
        ...user!,
        hasCompletedOnboarding: true,
      });
      
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
  };

  return {
    ready,
    loading,
    step,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    handleSubmit,
  };
} 