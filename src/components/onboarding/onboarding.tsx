'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ApiVeloxService from '@/providers/api-velox.provider'
import Button from '../ui/button/button'
import { ApiError } from '@/errors/api-errors'
import { CreateAthleteDto } from '@/interfaces/athlete.interface'
import InputField from '../ui/input-field/input-field'

export default function OnboardingForm() {
  const router = useRouter()
  const apiVelox = new ApiVeloxService()

  const [formData, setFormData] = useState<CreateAthleteDto>({
    age: 0,
    weight: 0,
    height: 0,
    averageSpeedRoad: 0,
    averageSpeedMtb: 0,
    averageSpeedGeneral: 0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await apiVelox.completeProfile(formData)
      router.push('/main')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro inesperado. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-center">Complete seu perfil</h2>
      <InputField
        label="Idade"
        name="age"
        type="number"
        value={formData.age.toString()}
        onChange={handleChange}
        required
      />
      <InputField
        label="Peso (kg)"
        name="weight"
        type="number"
        value={formData.weight.toString()}
        onChange={handleChange}
        required
      />
      <InputField
        label="Altura (cm)"
        name="height"
        type="number"
        value={formData.height.toString()}
        onChange={handleChange}
        required
      />
      <InputField
        label="Velocidade média - Road (km/h)"
        name="averageSpeedRoad"
        type="number"
        value={formData.averageSpeedRoad.toString()}
        onChange={handleChange}
        required
      />
      <InputField
        label="Velocidade média - MTB (km/h)"
        name="averageSpeedMtb"
        type="number"
        value={formData.averageSpeedMtb.toString()}
        onChange={handleChange}
        required
      />
      <InputField
        label="Velocidade média - Geral (km/h)"
        name="averageSpeedGeneral"
        type="number"
        value={formData.averageSpeedGeneral.toString()}
        onChange={handleChange}
        required
      />

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <Button type="submit" loading={loading} variant="primary">
        {loading ? 'Salvando...' : 'Começar'}
      </Button>
    </form>
  )
}
