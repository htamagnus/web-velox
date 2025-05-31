'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

type Props = {
  onSelect: (choice: Modality, speed: number) => void
  speeds: {
    general: number
    road: number
    mtb: number
  }
}

export default function SpeedOptions({ onSelect, speeds }: Props) {
  const [selected, setSelected] = useState<Modality>('general')

  const options = [
    { label: 'Velocidade geral (Strava)', value: 'general', speed: speeds.general },
    { label: 'Speed (Road)', value: 'road', speed: speeds.road },
    { label: 'MTB', value: 'mtb', speed: speeds.mtb },
  ]

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl space-y-2">
      <h3 className="text-lg text-primary-light font-bold">Escolha o tipo de velocidade</h3>

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
                onChange={() => {
                  setSelected(option.value as Modality)
                  if (option.speed && option.speed > 0) {
                    onSelect(option.value as Modality, option.speed) // chama o pai já
                  }
                }}                
              />
              <span className='text-copy' >{option.label} - {option.speed?.toFixed(1)} km/h</span>
            </label>
          )
        })}
      </div>

      <Tooltip id="tooltip-general" />
      <Tooltip id="tooltip-road" />
      <Tooltip id="tooltip-mtb" />

      <p className="text-xs text-copy-light pt-2">
        Para alterar suas velocidades, acesse seu perfil.
      </p>
    </div>
  )
}
