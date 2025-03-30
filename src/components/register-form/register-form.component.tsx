'use client'

import React, { useEffect, useState } from 'react'
import ApiVeloxService from '@/providers/api-velox.provider'
import { registerSchema } from '@/validations/register-schema'
import { ApiError } from '@/errors/api-errors'
import Button from '../ui/button/button'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const apiVelox = new ApiVeloxService()
  const router = useRouter()

  const [fieldErrors, setFieldErrors] = useState<{ name?:string; email?: string; password?: string }>({})
  const [globalError, setGlobalError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFieldErrors({})
    setGlobalError('')
    setSuccess('')
    setLoading(true)

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const rawData = {
      name: formData.get('name')?.toString().trim() ?? '',
      email: formData.get('email')?.toString().trim() ?? '',
      password: formData.get('password')?.toString().trim() ?? '',
    }

    const result = registerSchema.safeParse(rawData)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      setFieldErrors({
        name: errors.name?.[0],
        email: errors.email?.[0],
        password: errors.password?.[0],
      })
      setLoading(false)
      return
    }

    const validData = result.data

    try {
      const response = await apiVelox.register(validData)
      login(response)
      router.push('/onboarding')
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

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[^A-Za-z0-9]/.test(password),
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
            <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className={`mt-1 block w-full px-4 py-2 border ${
            fieldErrors.name ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          placeholder="Digite seu nome"
          required
        />
        {fieldErrors.name && <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>}
      </div>
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
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (fieldErrors.password) {
              setFieldErrors((prev) => ({ ...prev, password: undefined }))
            }
          }}
          className={`mt-1 block w-full px-4 py-2 border ${
            fieldErrors.password ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          placeholder="Digite sua senha"
          required
        />
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p className={passwordChecks.length ? 'text-green-600' : 'text-gray-500'}>• Pelo menos 8 caracteres</p>
          <p className={passwordChecks.uppercase ? 'text-green-600' : 'text-gray-500'}>• Uma letra maiúscula</p>
          <p className={passwordChecks.number ? 'text-green-600' : 'text-gray-500'}>• Um número</p>
          <p className={passwordChecks.specialChar ? 'text-green-600' : 'text-gray-500'}>• Um caractere especial</p>
        </div>
        {fieldErrors.password && <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>}
      </div>

      <Button
        type="submit"
        loading={loading}
        variant="primary"
      >
        {loading ? 'Enviando...' : 'Registrar'}
      </Button>

      {globalError && <p className="text-center text-sm text-red-600">{globalError}</p>}
      {success && <p className="text-center text-sm text-green-600">{success}</p>}
    </form>
  )
}
