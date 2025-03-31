import { ApiError } from "@/errors/api-errors"
import { Athlete, CreateAthleteDto } from "@/interfaces/athlete.interface"

type RegisterData = {
  name: string
  email: string
  password: string
}

type LoginData = {
  email: string
  password: string
}

type LoginResponse = {
  token: string
  expiresIn: number
  athleteId: string
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

  async registerAndLogin(userData: RegisterData): Promise<LoginResponse> {
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

    return json as LoginResponse
  }

  async login(loginData: LoginData): Promise<LoginResponse> {
    const response = await fetch(`${this.url}/athlete/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify(loginData),
    })

    const text = await response.text()
    const json: LoginResponse | ApiErrorResponse = text ? JSON.parse(text) : {}

    if (!response.ok) {
      throw new ApiError((json as ApiErrorResponse).message || 'Erro no login', response.status, (json as ApiErrorResponse).code, json)
    }

    localStorage.setItem('velox_token', json.token)

    return json as LoginResponse
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
}
