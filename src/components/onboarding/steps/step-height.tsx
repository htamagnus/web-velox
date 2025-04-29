'use client'

import React from 'react'
import { Minus, Plus } from 'lucide-react'
import Button from '@/components/ui/button/button'

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
      <h2 className="step-heading mb-2 text-copy">What Is Your <strong>Height?</strong></h2>
      <p className="step-paragraph mb-6 text-copy-light">Select your height in centimeters</p>
      <div className="relative h-[264px] w-20 mx-auto rounded-xl bg-primary mb-6 overflow-hidden">
        <div
          className="absolute w-full transition-transform duration-200"
          style={{ transform: `translateY(-${offset}px)` }}
        >
          {range.map((v) => (
            <div
              key={v}
              className={`h-6 flex items-center justify-center bg-primary-content ${
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
        className="absolute left-1/2 w-15 h-0.5 bg-black opacity-80 pointer-events-none"
        style={{
          top: `calc(50% + ${itemHeight / 2}px)`, // 50% da altura da caixa + metade do item
          transform: 'translateX(-50%)',
        }}
      />
      </div>
      <div className="flex justify-center gap-6 mb-8">
      <Button
        variant="round"
        onClick={() => value > min && onChange(value - 1)}
      >
        <Minus className="w-5 h-5" />
      </Button>
      <Button
        variant="round"
        onClick={() => value < max && onChange(value + 1)}
      >
        <Plus className="w-5 h-5" />
      </Button>

      </div>
      <Button
        onClick={onNext}
        variant="confirm"
      >
        Continue
      </Button>
    </div>
  )
}
