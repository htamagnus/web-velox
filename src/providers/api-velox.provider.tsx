import { ApiError } from "@/errors/api-errors"

type RegisterData = {
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

  async register(userData: RegisterData): Promise<void> {
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

    return
  }
  
}
