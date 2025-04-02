
'use client'

import Button from '@/components/ui/button/button'
import React from 'react'

interface StepWeightProps {
  value: number
  onChange: (value: number) => void
  onNext: () => void
  onBack?: () => void
}

export default function StepWeight({ value, onChange, onNext, onBack }: StepWeightProps) {
  return (
    <div className="w-full max-w-xs text-center">
      <h2 className="text-2xl font-bold mb-2">What Is Your Weight?</h2>
      <p className="text-sm text-gray-300 mb-6">
        Informe seu peso para estimarmos melhor seu desempenho.
      </p>

      <div className="relative h-64 w-20 mx-auto bg-purple-500 rounded-xl flex items-center justify-center mb-6">
  <div className="absolute inset-0 flex flex-col justify-between p-2">
    {Array.from({ length: 21 }, (_, i) => (
      <div key={i} className="w-full h-[1px] bg-white opacity-50" />
    ))}
  </div>

  <div className="absolute -left-20 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
    <span className="text-4xl font-extrabold leading-none">{value}</span>
    <span className="text-sm">kg</span>
  </div>

  <div className="absolute w-full h-1 bg-white top-1/2 transform -translate-y-1/2" />
</div>


      <div className="flex justify-center gap-6 mb-4">
        <button
          onClick={() => onChange(value - 1)}
          className="bg-white text-gray-900 rounded-full w-10 h-10 text-xl font-bold"
        >
          -
        </button>
        <button
          onClick={() => onChange(value + 1)}
          className="bg-white text-gray-900 rounded-full w-10 h-10 text-xl font-bold"
        >
          +
        </button>
      </div>

      <div className="flex gap-4 justify-center">
      {onBack && (
        <button onClick={onBack} className="text-sm text-purple-400 underline">
          Voltar
        </button>
      )}
        <Button
          onClick={onNext}
          variant="secondary"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
