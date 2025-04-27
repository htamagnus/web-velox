'use client'

import { useEffect, useState } from 'react'
import polyline from '@mapbox/polyline'
import ApiVeloxService from '@/providers/api-velox.provider'
import RouteMap from '@/components/map/route-map'
import RoutePlannerPanel from '@/components/planner/route-planner-panel'

type RouteData = GetPlannedRouteResponseDto & {
  decodedPolyline: [number, number][]
}

export default function RoutePlannerPage() {
  const api = new ApiVeloxService()

  const [origin, setOrigin] = useState<[number, number] | null>(null)
  const [destination, setDestination] = useState<[number, number] | null>(null)
  const [originLabel, setOriginLabel] = useState<string | null>(null)
  const [destinationLabel, setDestinationLabel] = useState<string | null>(null)
  const [routeData, setRouteData] = useState<RouteData | null>(null)

  const [showSpeedOptions, setShowSpeedOptions] = useState(false)
  const [selectedModality, setSelectedModality] = useState<Modality>('general')

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setOrigin(coords)
      },
      (err) => {
        console.warn('Não foi possível pegar localização:', err)
      }
    )
  }, [])

  const handleMapClick = (e: { latlng: { lat: number; lng: number } }) => {
    const coords: [number, number] = [e.latlng.lat, e.latlng.lng]
    if (!origin) {
      setOrigin(coords)
      setOriginLabel(null)
    } else if (!destination) {
      setDestination(coords)
      setDestinationLabel(null)
    }
  }

  const handleCalculate = async () => {
    console.log('📍 Origem Label:', originLabel)
    console.log('📍 Destino Label:', destinationLabel)
    if (!originLabel || !destinationLabel) {
      console.warn('Defina origem e destino antes de calcular a rota.')
      return
    }
  
    const payload: GetPlannedRouteInputDto = {
      origin: originLabel,
      destination: destinationLabel,
      modality: selectedModality,
    }
  
    try {
      const response = await api.planRoute(payload)
      const decoded = polyline.decode(response.polyline) as [number, number][]
  
      setRouteData({
        ...response,
        decodedPolyline: decoded,
      })
    } catch (error) {
      console.error('Erro ao calcular rota:', error)
      alert('Não foi possível calcular a rota. Tente ajustar os nomes ou a modalidade.')
    }
  }  

  return (
    <div className="relative w-full h-screen pb-48">
      <RouteMap
        origin={origin}
        destination={destination}
        polyline={routeData?.decodedPolyline ?? []}
        onMapClick={handleMapClick}
        distanceKm={routeData?.distanceKm}
        estimatedTimeMinutes={routeData?.estimatedTimeMinutes}
      />

      {!routeData ? (
        <RoutePlannerPanel
          origin={origin}
          destination={destination}
          onSetOrigin={(coords, label) => {
            setOrigin(coords)
            setOriginLabel(label)
          }}
          onSetDestination={(coords, label) => {
            setDestination(coords)
            setDestinationLabel(label)
          }}
          onStart={() => setShowSpeedOptions(true)}
          onCancel={() => {
            setOrigin(null)
            setDestination(null)
            setRouteData(null)
          }}
          showSpeedOptions={showSpeedOptions}
          onCloseSpeedOptions={() => setShowSpeedOptions(false)}
          onSelectModality={(modality) => {
            setSelectedModality(modality)
            handleCalculate()
          }}
        />
      ) : (
        <div className="absolute bottom-4 left-4 right-4 bg-white text-black p-4 rounded-xl shadow-lg space-y-2 z-[999]">
          <div><strong>Distância:</strong> {routeData.distanceKm.toFixed(2)} km</div>
          <div><strong>Tempo estimado:</strong> {Math.floor(routeData.estimatedTimeMinutes / 60)}h {routeData.estimatedTimeMinutes % 60}min</div>
          <div><strong>Ganho de elevação:</strong> {routeData.elevationGain} m</div>
          <div><strong>Perda de elevação:</strong> {routeData.elevationLoss} m</div>
          <div><strong>Calorias estimadas:</strong> {routeData.estimatedCalories} kcal</div>

          <div className="flex space-x-4 pt-4">
            <button
              onClick={() => {
                setOrigin(null)
                setDestination(null)
                setRouteData(null)
              }}
              className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-full font-semibold transition"
            >
              Nova Rota
            </button>

            <button
              onClick={async () => {
                if (!routeData) return
                try {
                  await api.saveRoute({
                    origin: originLabel!,
                    destination: destinationLabel!,
                    modality: selectedModality,
                    polyline: routeData.polyline,
                    distanceKm: routeData.distanceKm,
                    estimatedTimeMinutes: routeData.estimatedTimeMinutes,
                    elevationGain: routeData.elevationGain,
                    elevationLoss: routeData.elevationLoss,
                    estimatedCalories: routeData.estimatedCalories,
                  })
                } catch (error) {
                  console.error('Erro ao salvar rota:', error)
                }
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full font-semibold transition"
            >
              Salvar Rota
            </button>
          </div>

        </div>
      )}
    </div>

  )
}
