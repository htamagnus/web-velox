'use client'

import { useEffect, useState } from 'react'
import polyline from '@mapbox/polyline'
import ApiVeloxService from '@/providers/api-velox.provider'
import RouteMap from '@/components/map/route-map'
import RoutePlannerPanel from '@/components/planner/route-planner-panel'
import Button from '@/components/ui/button/button'
import { Athlete } from '@/interfaces/athlete.interface'
import BackButton from '@/components/ui/back-button/back-button'
import { getModalityLabel } from '@/helpers/modality.helper'
import { AnimatePresence, motion } from 'framer-motion'

type RouteData = GetPlannedRouteResponseDto & {
  decodedPolyline: [number, number][]
}

export default function CalculateRoutePage() {
  const api = new ApiVeloxService()

  const [origin, setOrigin] = useState<[number, number] | null>(null)
  const [destination, setDestination] = useState<[number, number] | null>(null)
  const [originLabel, setOriginLabel] = useState<string | null>(null)
  const [destinationLabel, setDestinationLabel] = useState<string | null>(null)
  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [showSpeedOptions, setShowSpeedOptions] = useState(false)
  const [selectedModality, setSelectedModality] = useState<Modality>('general')
  const [averageSpeed, setAverageSpeed] = useState<number | null>(null)
  const [userData, setUserData] = useState<Athlete | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([-28.678, -49.369])
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false)


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setMapCenter(coords)
      },
      (err) => {
        console.warn('Não foi possível pegar localização:', err)
      }
    )
  }, [])

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await api.getProfile()
        setUserData(profile)
      } catch (err) {
        console.error('Erro ao buscar perfil:', err)
      }
    }
    fetchProfile()
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
      setIsCalculatingRoute(true)
      const response = await api.planRoute(payload)
      const decoded = polyline.decode(response.polyline) as [number, number][]
    
      setRouteData({
        ...response,
        decodedPolyline: decoded,
      })
    } catch (error) {
      console.error('Erro ao calcular rota:', error)
      alert('Não foi possível calcular a rota. Tente ajustar os nomes ou a modalidade.')
    } finally {
      setIsCalculatingRoute(false)
    }
  }

  return (
    <div className="relative w-full h-screen pb-48">
      <RouteMap
        center={mapCenter}
        origin={origin}
        destination={destination}
        polyline={routeData?.decodedPolyline ?? []}
        onMapClick={handleMapClick}
        distanceKm={routeData?.distanceKm}
        estimatedTimeMinutes={routeData?.estimatedTimeMinutes}
      />

      <AnimatePresence mode="wait">
      {!userData ? (
            <motion.div
            key="loading-profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 left-4 right-4 text-center text-muted p-4"
          >
        <div className="absolute bottom-4 left-4 right-4 text-center text-muted p-4">
          Carregando perfil...
        </div>
        </motion.div>
      ) : routeData ? (
        <motion.div
        key="route-result"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute bottom-4 left-4 right-4 bg-background text-foreground p-4 rounded-xl shadow-lg space-y-2 z-[999]"
      >
        <div className="absolute bottom-4 left-4 right-4 bg-background text-foreground p-4 rounded-xl shadow-lg space-y-2 z-[999]">
          <div><strong>Distância:</strong> {routeData.distanceKm.toFixed(2)} km</div>
          <div><strong>Tempo estimado:</strong> {Math.floor(routeData.estimatedTimeMinutes / 60)}h {routeData.estimatedTimeMinutes % 60}min</div>
          <div><strong>Ganho de elevação:</strong> {routeData.elevationGain} m</div>
          <div><strong>Perda de elevação:</strong> {routeData.elevationLoss} m</div>
          <div><strong>Calorias estimadas:</strong> {routeData.estimatedCalories} kcal</div>
          <div><strong>Modalidade:</strong> {getModalityLabel(selectedModality)}. Sua média nessa modalidade é de {routeData.averageSpeedUsed} km/h.</div>

          <div className="flex flex-col md:flex-row gap-2 pt-4">
            <Button
              variant="confirm"
              onClick={() => {
                setOrigin(null)
                setDestination(null)
                setRouteData(null)
              }}
              className="flex-1"
            >
              Nova Rota
            </Button>

            <Button
              variant="secondary"
              loading={isSaving}
              onClick={async () => {
                if (!routeData) return
                try {
                  setIsSaving(true)
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
                    averageSpeedUsed: routeData.averageSpeedUsed,
                  })
                } catch (error) {
                  console.error('Erro ao salvar rota:', error)
                } finally {
                  setIsSaving(false)
                }
              }}
              className="flex-1"
            >
              Salvar Rota
            </Button>
          </div>
        </div>
            </motion.div>
      ) : (
        <motion.div
        key="route-planner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute bottom-0 left-0 right-0"
      >
        <RoutePlannerPanel
          origin={origin}
          originLabel={originLabel}
          destination={destination}
          destinationLabel={destinationLabel}
          onSetOrigin={(coords, label) => {
            setOrigin(coords)
            setOriginLabel(label)
          }}
          onSetDestination={(coords, label) => {
            setDestination(coords)
            setDestinationLabel(label)
          }}
          onStart={() => handleCalculate()}
          onCancel={() => {
            setOrigin(null)
            setDestination(null)
            setRouteData(null)
          }}
          showSpeedOptions={showSpeedOptions}
          onCloseSpeedOptions={() => setShowSpeedOptions(false)}
          onSelectModality={(modality, speed) => {
            setSelectedModality(modality)
            setAverageSpeed(speed)
          }}
          speeds={{
            general: userData.averageSpeedGeneral,
            road: userData.averageSpeedRoad,
            mtb: userData.averageSpeedMtb,
          }}
          isCalculatingRoute={isCalculatingRoute}
        />
            </motion.div>
      )}
    </AnimatePresence>
    </div>
  )
}
