'use client'

import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/button/button'

interface StepSpeedGeneralProps {
  value: number
  onChange: (value: number) => void
  onNext: () => void
  onBack?: () => void
}

const MIN_SPEED = 0
const MAX_SPEED = 50

export default function StepSpeedGeneral({ value, onChange, onNext, onBack }: StepSpeedGeneralProps) {
  const [loadingStrava, setLoadingStrava] = useState(false)

    const getDisplayValues = () => {
        const center = Math.max(MIN_SPEED + 2, Math.min(value, MAX_SPEED - 2))
    
        return [center - 2, center - 1, center, center + 1, center + 2].filter(
        (v) => v >= MIN_SPEED && v <= MAX_SPEED
        )
    }
  
  

  const redirectToStrava = () => {
    setLoadingStrava(true)
    sessionStorage.setItem('velox_current_step', '3')
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
    const redirectUri = `${window.location.origin}/strava/callback`
    const scope = 'read,activity:read_all'

    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=auto&scope=${scope}`

    window.location.href = stravaAuthUrl
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
        <h2 className="text-2xl font-bold mb-2">Sua Velocidade Média Geral</h2>
        <p className="text-sm text-gray-300 mb-6">
          Você pode informar manualmente ou importar do Strava.
        </p>

        <div className="relative h-60 flex flex-col items-center justify-center">
          <div className="absolute top-[calc(50%+1.5rem)] w-20 h-[1px] bg-gray-400 opacity-60 z-10" />

          <div className="space-y-2 z-20">
            {getDisplayValues().map((s) => (
              <div
                key={s}
                className={`transition-all flex items-center justify-center ${
                  s === value
                    ? 'text-4xl font-extrabold text-white'
                    : 'text-lg text-gray-400 opacity-80'
                }`}
              >
                {s}
                {s === value && (
                  <span className="ml-1 text-base font-medium text-gray-300">km/h</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-6 my-6">
          <button
            onClick={() => onChange(Math.max(value - 1, MIN_SPEED))}
            className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-xl shadow"
            aria-label="Diminuir"
          >
            ↓
          </button>
          <button
            onClick={() => onChange(Math.min(value + 1, MAX_SPEED))}
            className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-xl shadow"
            aria-label="Aumentar"
          >
            ↑
          </button>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <Button onClick={onNext} variant="secondary" className="w-full">
            Continuar
          </Button>
          <Button onClick={redirectToStrava} disabled={loadingStrava} className="w-full">
            {loadingStrava ? 'Redirecionando...' : 'Importar do Strava'}
          </Button>
        </div>
      </div>
    </div>
  )
}
