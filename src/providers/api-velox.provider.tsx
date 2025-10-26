import { ApiError, ApiErrorResponse } from "@/errors/api-errors"
import { Athlete, CreateAthleteDto, UpdateAthleteDto } from "@/interfaces/athlete.interface"
import { AuthData } from "@/interfaces/auth-data.interface"
import { GetPlannedRouteInputDto, GetPlannedRouteResponseDto, SaveRouteDto, GetTrafficOutputDto, GetWeatherOutputDto } from "@/interfaces/routes.interface"

type RegisterData = {
  name: string
  email: string
  password: string
}

type LoginData = {
  email: string
  password: string
}

// utilitário para checar formato de erro retornado pela api
function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return typeof value === 'object' && value !== null && ('message' in value || 'code' in value)
}

export default class ApiVeloxService {
  private url: string

  constructor() {
    this.url = process.env.NEXT_PUBLIC_VELOX_API ?? ''
  }

  async registerAndLogin(userData: RegisterData): Promise<AuthData> {
    const response = await fetch(`${this.url}/athlete/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify(userData),
    })

    const text = await response.text()
    const json: unknown = text ? JSON.parse(text) : {}

    if (!response.ok) {
      const err = isApiErrorResponse(json) ? json : { message: 'Erro na requisição' }
      throw new ApiError(err.message || 'Erro na requisição', response.status, isApiErrorResponse(json) ? json.code : undefined, isApiErrorResponse(json) ? json : undefined)
    }

    const data = json as AuthData
    localStorage.setItem('velox_token', data.token)

    return data
  }

  async login(loginData: LoginData): Promise<AuthData> {
    const response = await fetch(`${this.url}/athlete/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify(loginData),
    })

    const text = await response.text()
    const json: unknown = text ? JSON.parse(text) : {}

    if (!response.ok) {
      const err = isApiErrorResponse(json) ? json : { message: 'Erro no login' }
      throw new ApiError(err.message || 'Erro no login', response.status, isApiErrorResponse(json) ? json.code : undefined, isApiErrorResponse(json) ? json : undefined)
    }

    const data = json as AuthData
    localStorage.setItem('velox_token', data.token)

    return data
  }

  async completeProfile(data: CreateAthleteDto): Promise<Athlete> {
    const token = localStorage.getItem('velox_token')
  
    const response = await fetch(`${this.url}/athlete/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
  
    const text = await response.text()
    const json: unknown = text ? JSON.parse(text) : {}

    if (!response.ok) {
      const err = isApiErrorResponse(json) ? json : { message: 'Erro no login' }
      throw new ApiError(err.message || 'Erro no login', response.status, isApiErrorResponse(json) ? json.code : undefined, isApiErrorResponse(json) ? json : undefined)
    }

    return json as Athlete
  }

  async getStravaAverageSpeed(code: string): Promise<{ averageSpeedGeneral: number }> {
    const token = localStorage.getItem('velox_token')
  
    const response = await fetch(`${this.url}/athlete/strava/average-speed?code=${code}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  
    const text = await response.text()
    const json: unknown = text ? JSON.parse(text) : {}

    if (!response.ok) {
      const err = isApiErrorResponse(json) ? json : { message: 'Erro ao buscar dados do Strava' }
      throw new ApiError(err.message || 'Erro ao buscar dados do Strava', response.status, isApiErrorResponse(json) ? json.code : undefined, isApiErrorResponse(json) ? json : undefined)
    }
  
    return json as { averageSpeedGeneral: number }
  }

  async planRoute(data: GetPlannedRouteInputDto): Promise<GetPlannedRouteResponseDto> {
    const token = localStorage.getItem('velox_token')
  
    const response = await fetch(`${this.url}/athlete/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
  
    const text = await response.text()
    const json: unknown = text ? JSON.parse(text) : {}

    if (!response.ok) {
      const err = isApiErrorResponse(json) ? json : { message: 'Erro ao planejar rota' }
      throw new ApiError(err.message || 'Erro ao planejar rota', response.status, isApiErrorResponse(json) ? json.code : undefined, isApiErrorResponse(json) ? json : undefined)
    }
  
    return json as GetPlannedRouteResponseDto
  }

  async saveRoute(data: SaveRouteDto): Promise<void> {
    const token = localStorage.getItem('velox_token')
  
    const response = await fetch(`${this.url}/athlete/routes/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
  
    if (!response.ok) {
      const text = await response.text()
      const json: unknown = text ? JSON.parse(text) : {}
      const err = isApiErrorResponse(json) ? json : { message: 'Erro ao salvar a rota' }
      throw new ApiError(err.message || 'Erro ao salvar a rota', response.status, isApiErrorResponse(json) ? json.code : undefined, isApiErrorResponse(json) ? json : undefined)
    }
  }

  async getProfile(): Promise<Athlete> {
    const token = localStorage.getItem('velox_token')
    
    const response = await fetch(`${this.url}/athlete/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  
    const text = await response.text()
    const json: unknown = text ? JSON.parse(text) : {}

    if (!response.ok) {
      const err = isApiErrorResponse(json) ? json : { message: 'Erro ao buscar perfil' }
      throw new ApiError(err.message || 'Erro ao buscar perfil', response.status, isApiErrorResponse(json) ? json.code : undefined, isApiErrorResponse(json) ? json : undefined)
    }
  
    return json as Athlete
  }  

  async updateProfile(data: Partial<UpdateAthleteDto>): Promise<UpdateAthleteDto> {
    const token = localStorage.getItem('velox_token')
  
    const response = await fetch(`${this.url}/athlete/profile/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
  
    const text = await response.text()
    const json: unknown = text ? JSON.parse(text) : {}

    if (!response.ok) {
      const err = isApiErrorResponse(json) ? json : { message: 'Erro ao atualizar perfil' }
      throw new ApiError(err.message || 'Erro ao atualizar perfil', response.status, isApiErrorResponse(json) ? json.code : undefined, isApiErrorResponse(json) ? json : undefined)
    }
  
    return json as UpdateAthleteDto
  }

  async getSavedRoutes(): Promise<SaveRouteDto[]> {
    const token = localStorage.getItem('velox_token')
  
    const response = await fetch(`${this.url}/athlete/routes/saved`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  
    const text = await response.text()
    const json: unknown = text ? JSON.parse(text) : {}

    if (!response.ok) {
      const err = isApiErrorResponse(json) ? json : { message: 'Erro ao buscar rotas salvas' }
      throw new Error((err as ApiErrorResponse).message || 'Erro ao buscar rotas salvas')
    }
  
    return json as SaveRouteDto[]
  }

  async getTraffic(athleteId: string, polyline: string, origin: string, destination: string): Promise<GetTrafficOutputDto> {
    const token = localStorage.getItem('velox_token')
  
    const response = await fetch(`${this.url}/athlete/${athleteId}/traffic/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        polyline,
        origin,
        destination,
      }),
    })
  
    const text = await response.text()
    const json: unknown = text ? JSON.parse(text) : {}

    if (!response.ok) {
      const err = isApiErrorResponse(json) ? json : { message: 'Erro ao buscar dados de tráfego' }
      throw new ApiError(err.message || 'Erro ao buscar dados de tráfego', response.status, isApiErrorResponse(json) ? json.code : undefined, isApiErrorResponse(json) ? json : undefined)
    }
  
    return json as GetTrafficOutputDto
  }

  async getWeather(athleteId: string, latitude: number, longitude: number): Promise<GetWeatherOutputDto> {
    const token = localStorage.getItem('velox_token')
  
    const response = await fetch(`${this.url}/athlete/${athleteId}/weather/forecast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        latitude,
        longitude,
      }),
    })
  
    const text = await response.text()
    const json: unknown = text ? JSON.parse(text) : {}

    if (!response.ok) {
      const err = isApiErrorResponse(json) ? json : { message: 'Erro ao buscar dados do clima' }
      throw new ApiError(err.message || 'Erro ao buscar dados do clima', response.status, isApiErrorResponse(json) ? json.code : undefined, isApiErrorResponse(json) ? json : undefined)
    }
  
    return json as GetWeatherOutputDto
  }
}
