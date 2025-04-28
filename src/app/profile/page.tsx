'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ApiVeloxService from '@/providers/api-velox.provider'
import Button from '@/components/ui/button/button'
import { Athlete, UpdateAthleteDto } from '@/interfaces/athlete.interface'
import Loader from '@/components/ui/loader/loader'
import BackButton from '@/components/ui/back-button/back-button'
import InputField from '@/components/ui/input-field/input-field'

export default function ProfilePage() {
  const api = new ApiVeloxService()

  const [userData, setUserData] = useState<Athlete | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState<number>(0)
  const [weight, setWeight] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [speedGeneral, setSpeedGeneral] = useState<number>(0)
  const [speedRoad, setSpeedRoad] = useState<number>(0)
  const [speedMtb, setSpeedMtb] = useState<number>(0)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await api.getProfile()
        setUserData(profile)
        setName(profile.name)
        setEmail(profile.email)
        setAge(profile.age ?? 0)
        setWeight(profile.weight ?? 0)
        setHeight(profile.height ?? 0)
        setSpeedGeneral(profile.averageSpeedGeneral ?? 0)
        setSpeedRoad(profile.averageSpeedRoad ?? 0)
        setSpeedMtb(profile.averageSpeedMtb ?? 0)
      } catch (err) {
        console.error('Erro ao buscar perfil:', err)
        toast.error('Erro ao carregar perfil.')
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    if (!userData) return

    const payload: UpdateAthleteDto = {}

    if (name !== userData.name) payload.name = name
    if (email !== userData.email) payload.email = email
    if (age !== userData.age) payload.age = age
    if (weight !== userData.weight) payload.weight = weight
    if (height !== userData.height) payload.height = height
    if (speedGeneral !== userData.averageSpeedGeneral) payload.averageSpeedGeneral = speedGeneral
    if (speedRoad !== userData.averageSpeedRoad) payload.averageSpeedRoad = speedRoad
    if (speedMtb !== userData.averageSpeedMtb) payload.averageSpeedMtb = speedMtb

    if (Object.keys(payload).length === 0) {
      toast.info('Nenhuma alteração foi feita.')
      return
    }

    try {
      setIsSaving(true)
      await api.updateProfile(payload)
      toast.success('Alterações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error('Erro ao salvar alterações.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen text-muted">
        Carregando perfil...
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
        <BackButton />
      <h1 className="text-2xl font-bold text-foreground text-center">Meu Perfil</h1>

      <div className="shadow-lg max-w-xl mx-auto p-4 bg-white/5 backdrop-blur-md text-foreground rounded-2xl shadow-xl space-y-3">
        <InputField label="Nome" name="name" value={name} onChange={(e) => setName(e.target.value)} />
        <InputField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField label="Idade" name="age" type="number" value={age.toString()} onChange={(e) => setAge(Number(e.target.value))} />
        <InputField label="Peso (kg)" name="weight" type="number" value={weight.toString()} onChange={(e) => setWeight(Number(e.target.value))} />
        <InputField label="Altura (cm)" name="height" type="number" value={height.toString()} onChange={(e) => setHeight(Number(e.target.value))} />
        <InputField label="Velocidade Geral (km/h)" name="speedGeneral" type="number" value={speedGeneral.toString()} onChange={(e) => setSpeedGeneral(Number(e.target.value))} />
        <InputField label="Velocidade Speed (km/h)" name="speedRoad" type="number" value={speedRoad.toString()} onChange={(e) => setSpeedRoad(Number(e.target.value))} />
        <InputField label="Velocidade MTB (km/h)" name="speedMtb" type="number" value={speedMtb.toString()} onChange={(e) => setSpeedMtb(Number(e.target.value))} />
      </div>


      <div className="pt-4">
      <Button
        variant="confirm"
        onClick={handleSave}
        loading={isSaving}
        disabled={isSaving}
        className="w-full"
        >
        {isSaving ? (
            <div className="flex items-center justify-center gap-2">
            <Loader size={18} />
            Salvando...
            </div>
        ) : (
            'Salvar alterações'
        )}
        </Button>
      </div>
    </div>
  )
}

