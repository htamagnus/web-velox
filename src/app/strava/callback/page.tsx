'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ApiVeloxService from '@/providers/api-velox.provider'

export default function StravaCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const fetchSpeed = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')

      if (!code) {
        alert('Erro: código não recebido.')
        return
      }

      try {
        const api = new ApiVeloxService()
        const result = await api.getStravaAverageSpeed(code)

        const avg = Math.round(result.averageSpeedGeneral)

      // salva no sessionStorage para manter o dado mesmo com SPA routing
      sessionStorage.setItem('velox_avg_speed', avg.toString())

      // garantir que voltará pro step certo (índice 3)
      sessionStorage.setItem('velox_current_step', '3')

      alert(`Velocidade média importada: ${avg} km/h`)
      router.push('/onboarding')
      } catch (error) {
        console.error(error)
        alert('Erro ao conectar com o Strava.')
        router.push('/onboarding')
      }
    }

    fetchSpeed()
  }, [])

  return <p className="text-white p-4">Conectando com o Strava...</p>
}
