import { useState } from "react"

type SpeedChoice = 'general' | 'road' | 'mtb'

type Props = {
  onClose: () => void
  onSelect: (choice: SpeedChoice) => void
}

export default function SpeedOptions({ onClose, onSelect }: Props) {
  const [selected, setSelected] = useState<SpeedChoice>('general')

  const handleConfirm = () => {
    onSelect(selected)
    onClose()
  }

  return (
    <div className="bg-black rounded-xl p-4 mt-4 shadow-md space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Escolha o tipo de velocidade</h2>

      <div className="space-y-2">
        {[
          { label: 'Velocidade geral (Strava)', value: 'general' },
          { label: 'Speed (Road)', value: 'road' },
          { label: 'MTB', value: 'mtb' },
        ].map((option) => (
          <label key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              value={option.value}
              checked={selected === option.value}
              onChange={() => setSelected(option.value as SpeedChoice)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleConfirm}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}
