'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ApiVeloxService from '@/providers/api-velox.provider'
import Button from '../ui/button/button'
import { ApiError } from '@/errors/api-errors'
import { CreateAthleteDto } from '@/interfaces/athlete.interface'
import { motion, AnimatePresence } from 'framer-motion'
import { onboardingSteps } from './steps'

export default function OnboardingForm() {
  const router = useRouter()
  const apiVelox = new ApiVeloxService()

  const [formData, setFormData] = useState<CreateAthleteDto>({
    age: 0,
    weight: 65,
    height: 165,
    averageSpeedRoad: 0,
    averageSpeedMtb: 0,
    averageSpeedGeneral: 0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const stepConfig = onboardingSteps[step]
  const StepComponent = stepConfig?.Component
  const stepProp = stepConfig?.prop

  const updateFormData = (key: keyof CreateAthleteDto, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const isLastStep = step === onboardingSteps.length - 1

  const handleNext = async () => {
    if (isLastStep) {
      try {
        setLoading(true)
        await apiVelox.completeProfile(formData)
        router.push('/main')
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message)
        } else {
          setError('Erro inesperado. Tente novamente.')
        }
      } finally {
        setLoading(false)
      }
    } else {
      nextStep()
    }
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await apiVelox.completeProfile(formData)
      router.push('/main')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro inesperado. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
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
        onNext={nextStep}
        onBack={step > 0 ? prevStep : undefined}
      />
    </motion.div>
  )}
</AnimatePresence>
  <div className="absolute top-0 left-0 w-full h-2 bg-gray-700">
    <div
      className="h-full bg-purple-500 transition-all duration-300"
      style={{ width: `${((step + 1) / onboardingSteps.length) * 100}%` }}
    />
  </div>

    </div>
  )
}
