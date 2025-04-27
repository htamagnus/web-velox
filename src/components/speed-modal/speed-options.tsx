'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

type Props = {
  onClose: () => void
  onSelect: (choice: Modality, speed?: number) => void
  speeds: {
    general: number
    road: number
    mtb: number
  }
}

export default function SpeedOptions({ onClose, onSelect, speeds }: Props) {
  const [selected, setSelected] = useState<Modality>('general')

  const handleConfirm = () => {
    if (!speeds[selected] || speeds[selected] <= 0) {
      toast.error('🚫 Velocidade inválida! Atualize no seu perfil primeiro.')
      return
    }

    onSelect(selected)
    onClose()
  }

  const options = [
    { label: 'Velocidade geral (Strava)', value: 'general', speed: speeds.general },
    { label: 'Speed (Road)', value: 'road', speed: speeds.road },
    { label: 'MTB', value: 'mtb', speed: speeds.mtb },
  ]

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/5 backdrop-blur-md text-foreground rounded-2xl shadow-xl shadow-lg space-y-2">
      <h3 className="text-l font-bold text-foreground">Escolha o tipo de velocidade</h3>

      <div className="space-y-3">
        {options.map((option) => {
          const isDisabled = !option.speed || option.speed <= 0
          return (
            <label
              key={option.value}
              className={`flex items-center space-x-3 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              data-tooltip-id={isDisabled ? `tooltip-${option.value}` : undefined}
              data-tooltip-content={isDisabled ? 'Velocidade não cadastrada. Acesse seu perfil.' : undefined}
            >
              <input
                type="radio"
                value={option.value}
                checked={selected === option.value}
                disabled={isDisabled}
                onChange={() => setSelected(option.value as Modality)}
              />
              <span>{option.label} - {option.speed?.toFixed(1)} km/h</span>
            </label>
          )
        })}
      </div>

      <Tooltip id="tooltip-general" />
      <Tooltip id="tooltip-road" />
      <Tooltip id="tooltip-mtb" />

      <p className="text-xs pt-2">
        Para alterar suas velocidades, acesse seu perfil.
      </p>
    </div>
  )
}
