'use client'

import React from 'react'
import Button from '@/components/ui/button/button'

interface StepWeightProps {
  value: number
  onChange: (value: number) => void
  onNext: () => void
  onBack?: () => void
}

const MIN_WEIGHT = 40
const MAX_WEIGHT = 120

export default function StepWeight({ value, onChange, onNext, onBack }: StepWeightProps) {
  const getDisplayValues = () => {
    return [
      value - 2,
      value - 1,
      value,
      value + 1,
      value + 2,
    ].filter((v) => v >= MIN_WEIGHT && v <= MAX_WEIGHT)
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-white bg-gray-900 relative px-4">
      
      {onBack && (
        <Button
          onClick={onBack}
          className="absolute top-6 left-4"
          variant="round"
          aria-label="Voltar"
        >
          ←
        </Button>
      )}

      <div className="w-full max-w-xs text-center mt-10">
        <h2 className="text-2xl font-bold mb-2">What Is Your Weight?</h2>
        <p className="text-sm text-gray-300 mb-6">
          Informe seu peso para estimarmos melhor seu desempenho.
        </p>

        <div className="relative h-60 flex flex-col items-center justify-center">
          <div className="absolute top-[calc(50%+1.5rem)] w-20 h-[1px] bg-gray-400 opacity-60 z-10" />

          <div className="space-y-2 z-20">
            {getDisplayValues().map((w) => (
              <div
                key={w}
                className={`transition-all flex items-center justify-center ${
                  w === value
                    ? 'text-4xl font-extrabold text-white'
                    : 'text-lg text-gray-400 opacity-80'
                }`}
              >
                {w}
                {w === value && (
                  <span className="ml-1 text-base font-medium text-gray-300">kg</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-6 my-6">
          <button
            onClick={() => onChange(Math.max(value - 1, MIN_WEIGHT))}
            className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-xl shadow"
            aria-label="Diminuir"
          >
            ↓
          </button>
          <button
            onClick={() => onChange(Math.min(value + 1, MAX_WEIGHT))}
            className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-xl shadow"
            aria-label="Aumentar"
          >
            ↑
          </button>
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
