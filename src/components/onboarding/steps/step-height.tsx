'use client'

import React from 'react'

interface StepHeightProps {
  value: number
  onChange: (value: number) => void
  onNext: () => void
}

export default function StepHeight({ value, onChange, onNext }: StepHeightProps) {
  const min = 140
  const max = 200
  const visibleTicks = 11
  const itemHeight = 24
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  const centerIndex = range.findIndex((v) => v === value)
  const offset = (centerIndex - Math.floor(visibleTicks / 2)) * itemHeight

  return (
    <div className="w-full max-w-xs text-center">
      <h2 className="text-2xl font-bold mb-2">What Is Your Height?</h2>
      <p className="text-sm text-gray-300 mb-6">Select your height in centimeters</p>
      <div className="relative h-[264px] w-20 mx-auto rounded-xl bg-fuchsia-600 mb-6 overflow-hidden">
        <div
          className="absolute w-full transition-transform duration-200"
          style={{ transform: `translateY(-${offset}px)` }}
        >
          {range.map((v) => (
            <div
              key={v}
              className={`h-6 flex items-center justify-center text-white ${
                v === value ? 'text-xl font-extrabold' : 'text-sm opacity-50'
              }`}
            >
              {v === value ? (
                <div className="flex items-baseline gap-1">
                  <span>{v}</span>
                  <span className="text-xs">cm</span>
                </div>
              ) : (
                v
              )}
            </div>
          ))}
        </div>

        <div
          className="absolute left-0 w-full h-0.5 bg-white opacity-80 pointer-events-none"
          style={{ top: 'calc(50% + 12px)' }}
        />
      </div>
      <div className="flex justify-center gap-6 mb-4">
        <button
          onClick={() => value > min && onChange(value - 1)}
          className="bg-white text-gray-900 rounded-full w-10 h-10 text-xl font-bold"
        >
          -
        </button>
        <button
          onClick={() => value < max && onChange(value + 1)}
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
