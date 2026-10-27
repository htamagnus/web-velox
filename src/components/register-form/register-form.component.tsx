'use client'

import React, { useState } from 'react'
import ApiVeloxService from '@/providers/api-velox.provider'
import { registerSchema } from '@/validations/register-schema'
import { ApiError } from '@/errors/api-errors'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import InputField from '../ui/input-field/input-field'
import { toast } from 'sonner'
import AuthShell from '../auth/auth-shell'
import Link from 'next/link'
import { useTexts } from '@/helpers/use-texts'
import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay'

export default function RegisterForm() {
  const apiVelox = new ApiVeloxService()
  const router = useRouter()
  const { login } = useAuth()
  const { t } = useTexts('register')
  const tForm = useTexts('registerForm').t
  const tLanding = useTexts('landing.hero').t

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
    <AuthShell title={[t('headline1'), t('headline2')]} lead={tLanding('subtitle')}>
      <form onSubmit={handleSubmit} className="auth__form">
        {loading && <PageTransitionOverlay visible={true} message={tForm('sendingButton')} />}
        <h2>{tForm('createAccountTitle')}</h2>
        <InputField
          label={t('name.label')}
          name="name"
          autoComplete="name"
          placeholder={t('name.placeholder')}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }))
          }}
          error={fieldErrors.name}
          required
          maxLength={255}
        />
        <InputField
          label={t('email.label')}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t('email.placeholder')}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
          }}
          error={fieldErrors.email}
          required
          maxLength={255}
        />
        <InputField
          label={t('password.label')}
          name="password"
          type="password"
          autoComplete="new-password"
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
          maxLength={255}
        />

        {/* a faixa de segmentos do hero: cada regra cumprida acende o seu traço */}
        <ul className="auth__checks">
          {(Object.keys(passwordChecks) as (keyof typeof passwordChecks)[]).map((key) => (
            <li key={key} data-ok={passwordChecks[key]}>
              {t(`password.requirements.${key}`)}
            </li>
          ))}
        </ul>

        <button
          type="submit"
          className="btn btn--primary btn--big auth__submit"
          disabled={isRegisterDisabled}
          aria-busy={loading}
        >
          {loading ? tForm('sendingButton') : tForm('registerButton')}
        </button>
        <p className="auth__switch">
          {t('link.alreadyAccount')}
          <Link href="/login">{t('link.login')}</Link>
        </p>
      </form>
    </AuthShell>
  )
}
