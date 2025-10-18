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
import { useTexts } from '@/helpers/use-texts'
import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay'

export default function RegisterForm() {
  const apiVelox = new ApiVeloxService()
  const router = useRouter()
  const { login } = useAuth()
  const { t } = useTexts('register')
  const tForm = useTexts('registerForm').t

  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

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

      toast.success(t('toasts.success'))

      router.push('/onboarding')
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'EMAIL_ALREADY_EXISTS') toast.error(t('toasts.emailExists'))
        else if (err.code === 'INVALID_PASSWORD') toast.error(t('toasts.invalidPassword'))
        else if (err.message) toast.error(err.message || (t('toasts.unexpected')) )
      } else {
        toast.error(t('toasts.unexpected'))
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

  const isRegisterDisabled = (
    loading ||
    name.trim() === '' ||
    email.trim() === '' ||
    password.trim() === '' ||
    !passwordChecks.length ||
    !passwordChecks.uppercase ||
    !passwordChecks.number ||
    !passwordChecks.specialChar
  )

  return (
    <FormWrapper onSubmit={handleSubmit}>
      {loading && <PageTransitionOverlay visible={true} message={tForm('sendingButton')} />}
      <div className="text-center space-y-2">
      <LogoVelox size="md" /> 
      {/* <div className="relative w-full flex items-center justify-center">
        <div className="absolute w-62 h-0.5 bg-primary" />
      </div> */}

        <h2 className="text-2xl font-bold text-primary-light mt-8">{tForm('createAccountTitle')}</h2>
        <p className="text-s text-copy-light">{tForm('createAccountSubtitle')}</p>
      </div>

      <InputField 
        label={t('name.label')}
        name="name"
        placeholder={t('name.placeholder')}
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }))
        }}
        error={fieldErrors.name}
        required
      />
      <InputField 
        label={t('email.label')}
        name="email"
        type="email"
        placeholder={t('email.placeholder')}
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
        value={password}
        placeholder={t('password.placeholder')}
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
        <p className={passwordChecks.length ? 'text-green-500' : 'text-muted'}>{t('password.requirements.length')}</p>
        <p className={passwordChecks.uppercase ? 'text-green-500' : 'text-muted'}>{t('password.requirements.uppercase')}</p>
        <p className={passwordChecks.number ? 'text-green-500' : 'text-muted'}>{t('password.requirements.number')}</p>
        <p className={passwordChecks.specialChar ? 'text-green-500' : 'text-muted'}>{t('password.requirements.specialChar')}</p>
      </div>

      <Button
        type="submit"
        loading={loading}
        variant="confirm"
        disabled={isRegisterDisabled}
        className="transition-transform active:scale-95 hover:brightness-110 mt-2 w-full"
      >
        {loading ? tForm('sendingButton') : tForm('registerButton')}
      </Button>
      <div className="mt-2 text-center text-sm text-copy-light">
      {t('link.alreadyAccount')}
        <Link href="/login" className="text-primary hover:underline font-medium">
        {t('link.login')}
        </Link>
      </div>
    </FormWrapper>
  )
}
