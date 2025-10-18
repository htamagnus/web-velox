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
import LogoVelox from '../ui/logo-velox/logo-velox'
import { useTexts } from '@/helpers/use-texts'
import { toast } from 'sonner'
import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay'

export default function LoginForm() {
  const apiVelox = new ApiVeloxService()
  const router = useRouter()

  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const { t } = useTexts('login')
  const tForm = useTexts('loginForm').t

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFieldErrors({})
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
          toast.error(t('errors.invalidCredentials'))
        } else {
          toast.error(err.message || t('errors.unexpected'))
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormWrapper onSubmit={handleSubmit}>
      {loading && <PageTransitionOverlay visible={true} message={tForm('enteringButton')} />}
      <LogoVelox className="mb-8" size="md" /> 
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-bold text-primary-light">{t('title')}</h2>
      <p className="text-s text-copy-light">{t('subtitle')}</p>
    </div>
    <InputField
      label={t('email.label')}
      name="email"
      type="email"
      placeholder={tForm('emailPlaceholder')}
      value={email}
      onChange={(e) => {
        setEmail(e.target.value)
        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
      }}
      error={fieldErrors.email}
      required
    />
    <InputField
      label={t('password.label')}
      name="password"
      type="password"
      placeholder={tForm('passwordPlaceholder')}
      value={password}
      onChange={(e) => {
        setPassword(e.target.value)
        if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }))
      }}
      error={fieldErrors.password}
      required
    />
    <Button type="submit" variant="confirm" className='w-full mt-4 mb-4' loading={loading} disabled={loading || email.trim() === '' || password.trim() === ''}>
      {loading ? tForm('enteringButton') : tForm('enterButton')}
    </Button>
  </FormWrapper>
  )
}
