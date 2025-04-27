'use client'

import { useEffect, useState } from 'react'
import ApiVeloxService from '@/providers/api-velox.provider'
import { Timer, MapPin, TrendingUp, TrendingDown } from 'lucide-react'
import Loader from '@/components/ui/loader/loader'
import BackButton from '@/components/ui/back-button/back-button'
import { toast } from 'sonner'

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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
        <BackButton />
      <h1 className="text-2xl font-bold text-foreground">Minhas Rotas Salvas</h1>

      {routes.length === 0 ? (
        <div className="text-muted text-center mt-10">Nenhuma rota salva ainda.</div>
      ) : (
        <div className="space-y-4">
          {routes.map((route, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md p-4 space-y-2 border border-border">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <MapPin size={18} />
                Percurso de <span className="text-purple-600">{route.origin}</span> para <span className="text-purple-600">{route.destination}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-muted pt-2">
                <div className="flex items-center gap-2">
                  <Timer size={16} />
                  {Math.floor(route.estimatedTimeMinutes / 60)}h {route.estimatedTimeMinutes % 60}min
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {route.distanceKm.toFixed(2)} km
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  +{route.elevationGain}m
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown size={16} />
                  -{route.elevationLoss}m
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
