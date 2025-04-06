'use client'

import React from 'react'
import Button from '@/components/ui/button/button'

interface StepAgeProps {
  value: number
  onChange: (value: number) => void
  onNext: () => void
  onBack?: () => void
}

const MIN_AGE = 8
const MAX_AGE = 100

export default function StepAge({ value, onChange, onNext, onBack }: StepAgeProps) {
  const getDisplayValues = () => {
    return [
      value - 2,
      value - 1,
      value,
      value + 1,
      value + 2,
    ].filter((v) => v >= MIN_AGE && v <= MAX_AGE)
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-white bg-gray-900 relative px-4">
      
      {onBack && (
        <Button
          variant="round"
          onClick={onBack}
          className="absolute top-6 left-4"
          aria-label="Voltar"
        >
          ←
        </Button>
      )}

      <div className="w-full max-w-xs text-center mt-10">
        <h2 className="text-2xl font-bold mb-2">What Is Your Age?</h2>
        <p className="text-sm text-gray-300 mb-6">
          Informe sua idade para personalizarmos melhor sua experiência.
        </p>

        <div className="relative h-60 flex flex-col items-center justify-center">
          <div className="absolute top-[calc(50%+1.5rem)] w-20 h-[1px] bg-gray-400 opacity-60 z-10" />

          <div className="space-y-2 z-20">
            {getDisplayValues().map((age) => (
              <div
                key={age}
                className={`transition-all flex items-center justify-center ${
                  age === value
                    ? 'text-4xl font-extrabold text-white'
                    : 'text-lg text-gray-400 opacity-80'
                }`}
              >
                {age}
                {age === value && (
                  <span className="ml-1 text-base font-medium text-gray-300">anos</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-6 my-6">
          <Button
            variant="round"
            onClick={() => onChange(Math.max(value - 1, MIN_AGE))}
            aria-label="Diminuir"
          >
            ↓
          </Button>
          <Button
            variant="round"
            onClick={() => onChange(Math.min(value + 1, MAX_AGE))}
            aria-label="Aumentar"
          >
            ↑
          </Button>
        </div>

        <div className="flex justify-center">
          <Button onClick={onNext} variant="secondary">
            Continuar
          </Button>
        </div>
      </div>
    </div>
  )
}
