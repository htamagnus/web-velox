'use client'

import React, { useState } from 'react'
import ApiVeloxService from '@/providers/api-velox.provider'
import { ApiError } from '@/errors/api-errors'
import { loginSchema } from '@/validations/login-schema'
import { useAuth } from '@/contexts/auth-context'
import Button from '../ui/button/button'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const apiVelox = new ApiVeloxService()
  const router = useRouter()

  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFieldErrors({})
    setGlobalError('')
    setLoading(true)

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const rawData = {
      email: formData.get('email')?.toString().trim() ?? '',
      password: formData.get('password')?.toString().trim() ?? '',
    }

    const result = loginSchema.safeParse(rawData)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      setFieldErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      })
      setLoading(false)
      return
    }

    const validData = result.data

    try {
      const response = await apiVelox.login(validData)
      login(response)
      router.push('/home')
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'INVALID_CREDENTIALS') {
          setGlobalError('E-mail ou senha inválidos.')
        } else {
          setGlobalError(err.message || 'Erro inesperado. Tente novamente.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-mail
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className={`mt-1 block w-full px-4 py-2 border ${
            fieldErrors.email ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          placeholder="Digite seu e-mail"
          required
        />
        {fieldErrors.email && <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className={`mt-1 block w-full px-4 py-2 border ${
            fieldErrors.password ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          placeholder="Digite sua senha"
          required
        />
        {fieldErrors.password && <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>}
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={false}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>

      {globalError && <p className="text-center text-sm text-red-600">{globalError}</p>}
    </form>
  )
}
