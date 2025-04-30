'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ApiVeloxService from '@/providers/api-velox.provider'
import Button from '@/components/ui/button/button'
import { Athlete, UpdateAthleteDto } from '@/interfaces/athlete.interface'
import Loader from '@/components/ui/loader/loader'
import InputField from '@/components/ui/input-field/input-field'
import { motion, AnimatePresence } from 'framer-motion'
import { useTexts } from '@/helpers/use-texts'
import { ArrowLeft } from 'lucide-react'
import { FormWrapper } from '@/components/ui/form-wrapper/form-wrapper'

export default function ProfilePage() {
  const api = new ApiVeloxService()

  const [userData, setUserData] = useState<Athlete | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState<number>(0)
  const [weight, setWeight] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [speedGeneral, setSpeedGeneral] = useState<number>(0)
  const [speedRoad, setSpeedRoad] = useState<number>(0)
  const [speedMtb, setSpeedMtb] = useState<number>(0)
  const [isGeneralSpeedFromStrava, setIsGeneralSpeedFromStrava] = useState(false)
  const { t } = useTexts('profile')
  

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
        setIsGeneralSpeedFromStrava(profile.averageSpeedGeneralIsFromStrava ?? false)
      } catch (err) {
        toast.error(t('errors.loadError'))
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
      toast.info(t('errors.noChanges'))
      return
    }

    try {
      setIsSaving(true)
      await api.updateProfile(payload)
      toast.success(t('errors.updateSuccess'))
    } catch (error) {
      toast.error(t('errors.updateError'))
    } finally {
      setIsSaving(false)
    }
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={48}/>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
    <motion.div
      key="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto p-6 space-y-6"
    >
    <div className="max-w-xl mx-auto p-6 space-y-6">
          <Button
        className="absolute top-6 left-4"
        variant="back"
        aria-label="Voltar"
      >
        < ArrowLeft />
      </Button>
      <h1 className="title-primary text-primary text-center">{t('title')}</h1>
      <FormWrapper>
        <InputField label={t('name.label')} name="name" value={name} onChange={(e) => setName(e.target.value)} />
        <InputField label={t('email.label')} name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField label={t('age.label')} name="age" type="number" value={age.toString()} onChange={(e) => setAge(Number(e.target.value))} />
        <InputField label={t('weight.label')} name="weight" type="number" value={weight.toString()} onChange={(e) => setWeight(Number(e.target.value))} />
        <InputField label={t('height.label')} name="height" type="number" value={height.toString()} onChange={(e) => setHeight(Number(e.target.value))} />
        <InputField label={t('speedGeneral.label')} name="speedGeneral" type="number" value={speedGeneral.toString()} onChange={(e) => setSpeedGeneral(Number(e.target.value))} />
        {isGeneralSpeedFromStrava && (
          <p className="text-sm text-yellow-400 mt-1">
            {t('speedGeneral.stravaNote')}
          </p>
        )}
        <InputField label={t('speedRoad.label')} name="speedRoad" type="number" value={speedRoad.toString()} onChange={(e) => setSpeedRoad(Number(e.target.value))} />
        <InputField label={t('speedMtb.label')} name="speedMtb" type="number" value={speedMtb.toString()} onChange={(e) => setSpeedMtb(Number(e.target.value))} />
      </FormWrapper>
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
    </motion.div>
  </AnimatePresence>
  )
}

