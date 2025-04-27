'use client'

import { useState } from 'react'

type SpeedChoice = 'general' | 'road' | 'mtb'

type Props = {
  onClose: () => void
  onSelect: (choice: SpeedChoice, speed: number) => void
  speeds: {
    general: number
    road: number
    mtb: number
  }
}

export default function SpeedOptions({ onClose, onSelect, speeds }: Props) {
  const [selected, setSelected] = useState<SpeedChoice>('general')

  return (
    <div className="bg-background rounded-xl p-5 mt-4 shadow-lg space-y-2">
      <h3 className="text-l font-bold text-foreground">Escolha o tipo de velocidade</h3>

      <div className="space-y-3">
        {([
          { label: 'Velocidade geral (Strava)', value: 'general', speed: speeds.general },
          { label: 'Speed (Road)', value: 'road', speed: speeds.road },
          { label: 'MTB', value: 'mtb', speed: speeds.mtb },
        ] as const).map((option) => (
          <label key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              value={option.value}
              checked={selected === option.value}
              onChange={() => setSelected(option.value)}
              className="form-radio text-blue-600"
            />
            <span className="text-foreground">
              {option.label} - {option.speed.toFixed(1)} km/h
            </span>
          </label>
        ))}
      </div>

      <p className="text-muted text-sm pt-2">
        Para alterar suas velocidades, acesse seu perfil.
      </p>
    </div>
  )
}
