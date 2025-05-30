import { ApiError } from "@/errors/api-errors"
import { Athlete, CreateAthleteDto, UpdateAthleteDto } from "@/interfaces/athlete.interface"
import { AuthData } from "@/interfaces/auth-data.interface"

type RegisterData = {
  name: string
  email: string
  password: string
}

type LoginData = {
  email: string
  password: string
}

type ApiErrorResponse = {
  code?: string
  message?: string
  [key: string]: any
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
    const json: ApiErrorResponse = text ? JSON.parse(text) : {}

    if (!response.ok) {
      throw new ApiError(json.message || 'Erro na requisição', response.status, json.code, json)
    }

    localStorage.setItem('velox_token', json.token)

    return json as AuthData
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
    const json: AuthData | ApiErrorResponse = text ? JSON.parse(text) : {}

    if (!response.ok) {
      throw new ApiError((json as ApiErrorResponse).message || 'Erro no login', response.status, (json as ApiErrorResponse).code, json)
    }

    localStorage.setItem('velox_token', json.token)

    return json as AuthData
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
    const json: Athlete | ApiErrorResponse = text ? JSON.parse(text) : {}
  
    if (!response.ok) {
      throw new ApiError((json as ApiErrorResponse).message || 'Erro no login', response.status, (json as ApiErrorResponse).code, json)
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
    const json = text ? JSON.parse(text) : {}
  
    if (!response.ok) {
      throw new ApiError(
        json.message || 'Erro ao buscar dados do Strava',
        response.status,
        json.code,
        json
      )
    }
  
    return json
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
    const json: ApiErrorResponse = text ? JSON.parse(text) : {}
  
    if (!response.ok) {
      throw new ApiError(json.message || 'Erro ao planejar rota', response.status, json.code, json)
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
      const json: ApiErrorResponse = text ? JSON.parse(text) : {}
      throw new ApiError(json.message || 'Erro ao salvar a rota', response.status, json.code, json)
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
    const json = text ? JSON.parse(text) : {}
  
    if (!response.ok) {
      throw new ApiError(json.message || 'Erro ao buscar perfil', response.status, json.code, json)
    }
  
    return json
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
    const json = text ? JSON.parse(text) : {}
  
    if (!response.ok) {
      throw new ApiError(json.message || 'Erro ao atualizar perfil', response.status, json.code, json)
    }
  
    return json
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
    const json = text ? JSON.parse(text) : {}
  
    if (!response.ok) {
      throw new Error(json.message || 'Erro ao buscar rotas salvas')
    }
  
    return json as SaveRouteDto[]
  }
}
