'use client'

import { useEffect, useState } from 'react'
import ApiVeloxService from '@/providers/api-velox.provider'
import { Timer, MapPin, TrendingUp, TrendingDown, TimerIcon, RouteIcon, ArrowUpIcon, ArrowDownIcon, BikeIcon, GaugeIcon } from 'lucide-react'
import Loader from '@/components/ui/loader/loader'
import polyline from '@mapbox/polyline'
import BackButton from '@/components/ui/back-button/back-button'
import { toast } from 'sonner'
import { getModalityLabel } from '@/helpers/modality.helper'
import MiniMap from '@/components/mini-map/mini-map.component'

export default function SavedRoutesPage() {
  const api = new ApiVeloxService()
  const [routes, setRoutes] = useState<SaveRouteDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const data = await api.getSavedRoutes()
        setRoutes(data)
      } catch (error) {
        console.error('Erro ao buscar rotas salvas:', error)
        toast.error('Erro ao carregar rotas')
      } finally {
        setLoading(false)
      }
    }
    fetchRoutes()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    )
  }

  if (routes.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-muted text-center">
        Nenhuma rota salva ainda.
      </div>
    )
  }

  return (
    <div className="mx-auto p-6 space-y-4">
        <BackButton />
      <h1 className="text-2xl font-bold text-foreground text-center">Minhas Rotas</h1>

      {routes.map((route, index) => {
        const decoded = polyline.decode(route.polyline) as [number, number][]
        return (
          <div
            key={index}
            className="shadow-lg max-w-xl mx-auto p-4 bg-white/5 backdrop-blur-md text-foreground rounded-2xl shadow-xl space-y-2"
          >
            <MiniMap polyline={decoded} />

            <div className="p-4 space-y-2">
              <div className="font-semibold text-lg">
                Percurso de {route.origin} para {route.destination}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-muted pt-2">
                <div className="flex items-center gap-2">
                  <TimerIcon size={16} /> {Math.floor(route.estimatedTimeMinutes / 60)}h {route.estimatedTimeMinutes % 60}min
                </div>
                <div className="flex items-center gap-2">
                  <RouteIcon size={16} /> {route.distanceKm.toFixed(1)} km
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} /> +{route.elevationGain} m
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown size={16} /> -{route.elevationLoss} m
                </div>
                <div className="flex items-center gap-2">
                  <BikeIcon size={16} /> 
                  <span className="font-semibold">Modalidade: {getModalityLabel(route.modality)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <GaugeIcon size={16} />
                  <span className="font-semibold">Velocidade Média:</span> {route.averageSpeedUsed} km/h
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
