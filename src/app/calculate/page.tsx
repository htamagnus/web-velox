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
  const [routeData, setRouteData] = useState<RouteData | null>(null)

  const [showSpeedOptions, setShowSpeedOptions] = useState(false) // ✅ novo
  const [selectedModality, setSelectedModality] = useState<'general' | 'road' | 'mtb'>('general')

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
    if (!origin) setOrigin(coords)
    else if (!destination) setDestination(coords)
  }

  const handleCalculate = async () => {
    if (!origin || !destination) return

    const payload: GetPlannedRouteInputDto = {
      origin: { lat: origin[0], lng: origin[1] },
      destination: { lat: destination[0], lng: destination[1] },
      modality: selectedModality === 'general' ? 'road' : selectedModality,
    }

    const response = await api.planRoute(payload)
    const decoded = polyline.decode(response.polyline) as [number, number][]

    setRouteData({
      ...response,
      decodedPolyline: decoded,
    })
  }

  return (
    <div className="relative w-full h-screen pb-48"> {/* padding pro painel + opções */}
      <RouteMap
        origin={origin}
        destination={destination}
        polyline={routeData?.decodedPolyline ?? []}
        onMapClick={handleMapClick}
      />

      <RoutePlannerPanel
        origin={origin}
        destination={destination}
        onSetOrigin={(coords) => setOrigin(coords)}
        onSetDestination={(coords) => setDestination(coords)}
        onStart={() => setShowSpeedOptions(true)} // ✅ ativa opções
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
    </div>
  )
}
