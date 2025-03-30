'use client'

import React, { useState } from 'react'
import ApiVeloxService from '@/providers/api-velox.provider'
import { registerSchema } from '@/validations/register-schema'
import { ApiError } from '@/errors/api-errors'

export default function RegisterForm() {
  const apiVelox = new ApiVeloxService()
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [globalError, setGlobalError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFieldErrors({})
    setGlobalError('')
    setSuccess('')
    setLoading(true)

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const rawData = {
      email: formData.get('email')?.toString().trim() ?? '',
      password: formData.get('password')?.toString().trim() ?? '',
    }

    const result = registerSchema.safeParse(rawData)

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
      await apiVelox.register(validData)
      setSuccess('Usuário registrado com sucesso!')
      form.reset()
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'EMAIL_ALREADY_EXISTS') {
          setFieldErrors({ email: 'Este e-mail já está em uso.' })
        } else if (err.message) {
          setGlobalError(err.message)
        } else {
          setGlobalError('Erro inesperado. Tente novamente.')
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

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Registrar'}
      </button>

      {globalError && <p className="text-center text-sm text-red-600">{globalError}</p>}
      {success && <p className="text-center text-sm text-green-600">{success}</p>}
    </form>
  )
}
