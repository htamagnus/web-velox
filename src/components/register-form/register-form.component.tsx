'use client'

import React, { useEffect, useState } from 'react'
import ApiVeloxService from '@/providers/api-velox.provider'
import { registerSchema } from '@/validations/register-schema'
import { ApiError } from '@/errors/api-errors'
import Button from '../ui/button/button'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import InputField from '../ui/input-field/input-field'
import { FormWrapper } from '../ui/form-wrapper/form-wrapper'

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
      const response = await apiVelox.registerAndLogin(validData)
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
    <FormWrapper onSubmit={handleSubmit}>
        <div>
        <InputField 
          label="Nome"
          name="name"
          placeholder="Digite seu nome"
          error={fieldErrors.name}
          required
        />
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
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (fieldErrors.password) {
              setFieldErrors((prev) => ({ ...prev, password: undefined }))
            }
          }}
          error={fieldErrors.password}
          required
        />
      </div>
      <div>
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
    </FormWrapper>
  )
}
