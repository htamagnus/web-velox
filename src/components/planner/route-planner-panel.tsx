'use client'

import { useState } from 'react'
import { LocateFixed, Plus, RefreshCcw, X } from 'lucide-react'
import SearchBar from '../ui/search-bar/search-bar'
import SpeedOptions from '../speed-modal/speed-options'

type Props = {
  origin: [number, number] | null
  destination: [number, number] | null
  onSetOrigin: (coords: [number, number], label: string) => void
  onSetDestination: (coords: [number, number], label: string) => void
  onStart: () => void
  onCancel: () => void
  showSpeedOptions: boolean
  onCloseSpeedOptions: () => void
  onSelectModality: (modality: Modality) => void
}

export default function RoutePlannerPanel({
    origin,
    destination,
    onSetOrigin,
    onSetDestination,
    onStart,
    onCancel,
    showSpeedOptions,
    onCloseSpeedOptions,
    onSelectModality,
}: Props)   {
      console.log('showSpeedOptions:', showSpeedOptions)
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 text-white px-4 pt-4 pb-6 rounded-t-2xl z-[9999] shadow-2xl space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold flex items-center">
          <span className="mr-2">🚴‍♀️</span> Planejador de rotas
        </span>
        <button onClick={onCancel} className="text-gray-400 hover:text-white">
          <X size={18} />
        </button>
      </div>

      {/* Origem */}
      <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
        <LocateFixed size={16} className="mr-2 text-gray-300" />
        <SearchBar
          placeholder="Localização atual"
          initialValue={origin ?? undefined}
          onSelect={onSetOrigin}
        />
      </div>

      {/* Destino */}
      <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
        <Plus size={16} className="mr-2 text-gray-300" />
        <SearchBar
          placeholder="Escolher destino"
          initialValue={destination ?? undefined}
          onSelect={onSetDestination}
        />
        <button className="ml-2 text-gray-400 hover:text-white">
          <RefreshCcw size={16} />
        </button>
      </div>
        <SpeedOptions
            onClose={onCloseSpeedOptions}
            onSelect={onSelectModality}
        />
      <div className="flex justify-between pt-2">
        <button className="text-sm text-gray-300 underline">Salvar</button>
        <button
          onClick={onStart}
          className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-md"
        >
          Planejar
        </button>
        </div>
    </div>
  )
}
