export type ApiErrorResponse = {
    code?: string
    message?: string
    [key: string]: any
  }
  
  export class ApiError extends Error {
    code?: string
    status?: number
    details?: ApiErrorResponse
  
    constructor(message: string, status?: number, code?: string, details?: ApiErrorResponse) {
      super(message)
      this.name = 'ApiError'
      this.status = status
      this.code = code
      this.details = details
    }
  }
  