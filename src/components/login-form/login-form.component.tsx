'use client'

import React, { useState } from 'react'
import ApiVeloxService from '@/providers/api-velox.provider'
import { ApiError } from '@/errors/api-errors'
import { loginSchema } from '@/validations/login-schema'
import { useAuth } from '@/contexts/auth-context'
import Button from '../ui/button/button'
import { useRouter } from 'next/navigation'
import InputField from '../ui/input-field/input-field'
import { FormWrapper } from '../ui/form-wrapper/form-wrapper'

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
    <FormWrapper onSubmit={handleSubmit}>
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-bold">Entrar no Velox</h2>
      <p className="text-sm text-muted">Acesse sua conta para começar a planejar rotas.</p>
    </div>
    <InputField
      label="E-mail"
      name="email"
      type="email"
      placeholder="Digite seu e-mail"
      error={fieldErrors.email}
      required
    />
    <InputField
      label="Senha"
      name="password"
      type="password"
      placeholder="Digite sua senha"
      error={fieldErrors.password}
      required
    />
    <Button type="submit" variant="confirm" loading={loading}>
      {loading ? 'Entrando...' : 'Entrar'}
    </Button>

    {globalError && (
      <p className="text-center text-sm text-red-500 mt-2">
        {globalError}
      </p>
    )}
  </FormWrapper>
  )
}
