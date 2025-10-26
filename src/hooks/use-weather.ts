import { useState } from 'react'
import ApiVeloxService from '@/providers/api-velox.provider'
import { GetWeatherOutputDto } from '@/interfaces/routes.interface'

export function useWeather() {
  const [weatherData, setWeatherData] = useState<GetWeatherOutputDto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async (athleteId: string, latitude: number, longitude: number) => {
    try {
      setIsLoading(true)
      setError(null)

      const api = new ApiVeloxService()
      const data = await api.getWeather(athleteId, latitude, longitude)

      setWeatherData(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'erro ao buscar previsão'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    weatherData,
    isLoading,
    error,
    fetchWeather,
  }
}
