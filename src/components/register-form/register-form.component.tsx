'use client'

import React, { useState } from 'react'
import ApiVeloxService from '@/providers/api-velox.provider'
import { registerSchema } from '@/validations/register-schema'
import { ApiError } from '@/errors/api-errors'
import Button from '../ui/button/button'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import InputField from '../ui/input-field/input-field'
import { FormWrapper } from '../ui/form-wrapper/form-wrapper'
import { toast } from 'sonner'
import LogoVelox from '../ui/logo-velox/logo-velox'
import Link from 'next/link'

export default function RegisterForm() {
  const apiVelox = new ApiVeloxService()
  const router = useRouter()
  const { login } = useAuth()

  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFieldErrors({})
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

      toast.success('Conta criada com sucesso! Vamos configurar seu perfil ✨')

      router.push('/onboarding')
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'EMAIL_ALREADY_EXISTS') {
          setFieldErrors({ email: 'Este e-mail já está em uso.' })
          toast.error('Este e-mail já está em uso.')
        } else if (err.code === 'INVALID_PASSWORD') {
          setFieldErrors({ password: 'Senha inválida. Tente outra.' })
          toast.error('Senha inválida. Corrija e tente novamente.')
        } else if (err.message) {
          toast.error(err.message)
        } else {
          toast.error('Erro inesperado. Tente novamente.')
        }
      } else {
        toast.error('Erro inesperado. Tente novamente.')
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
      <div className="text-center space-y-1">
      <LogoVelox className="mb-8" /> 
      {/* <div className="relative w-full flex items-center justify-center">
        <div className="absolute w-62 h-0.5 bg-primary" />
      </div> */}

        <h2 className="text-2xl font-bold text-primary-light mt-8">Criar Conta</h2>
        <p className="text-s text-copy-light">Preencha os dados abaixo para começar a usar o Velox</p>
      </div>

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
        placeholder="Digite sua senha"
        onChange={(e) => {
          setPassword(e.target.value)
          if (fieldErrors.password) {
            setFieldErrors((prev) => ({ ...prev, password: undefined }))
          }
        }}
        error={fieldErrors.password}
        required
      />

      <div className="mt-4 space-y-1 text-sm text-copy-lighter">
        <p className={passwordChecks.length ? 'text-green-500' : 'text-muted'}>• Pelo menos 8 caracteres</p>
        <p className={passwordChecks.uppercase ? 'text-green-500' : 'text-muted'}>• Uma letra maiúscula</p>
        <p className={passwordChecks.number ? 'text-green-500' : 'text-muted'}>• Um número</p>
        <p className={passwordChecks.specialChar ? 'text-green-500' : 'text-muted'}>• Um caractere especial</p>
      </div>

      <Button
        type="submit"
        loading={loading}
        variant="primary"
        className="transition-transform active:scale-95 hover:brightness-110 mt-6"
      >
        {loading ? 'Enviando...' : 'Registrar'}
      </Button>
      <div className="mt-2 text-center text-sm text-copy-light">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Clique aqui para entrar
        </Link>
      </div>
    </FormWrapper>
  )
}
