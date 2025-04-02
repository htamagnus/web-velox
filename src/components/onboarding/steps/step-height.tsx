'use client'

import React from 'react'

interface StepHeightProps {
  value: number
  onChange: (value: number) => void
  onNext: () => void
}

export default function StepHeight({ value, onChange, onNext }: StepHeightProps) {
  const ticks = Array.from({ length: 15 }, (_, i) => i) // 21 tracinhos

  return (
    <div className="w-full max-w-xs text-center">
      <h2 className="text-2xl font-bold mb-2">What Is Your Height?</h2>
      <p className="text-sm text-gray-300 mb-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>

      <div className="relative h-64 w-20 mx-auto rounded-xl bg-fuchsia-600 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 flex flex-col justify-between p-2">
          {ticks.map((_, i) => (
            <div
              key={i}
              className="w-full h-[1px] bg-white opacity-50"
            />
          ))}
        </div>

        <div className="absolute -left-20 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        <span className="text-4xl font-extrabold leading-none">{value}</span>
        <span className="text-sm">cm</span>
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

      <button
        onClick={onNext}
        className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold shadow-lg hover:opacity-90"
      >
        Continue
      </button>
    </div>
  )
}
