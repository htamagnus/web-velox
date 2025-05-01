'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import ApiVeloxService from '@/providers/api-velox.provider';
import { Athlete, UpdateAthleteDto } from '@/interfaces/athlete.interface';
import { useTexts } from '@/helpers/use-texts';

import Button from '@/components/ui/button/button';
import Loader from '@/components/ui/loader/loader';
import InputField from '@/components/ui/input-field/input-field';
import { FormWrapper } from '@/components/ui/form-wrapper/form-wrapper';

export default function ProfilePage() {
  const api = new ApiVeloxService();
  const { t } = useTexts('profile');

  const [userData, setUserData] = useState<Athlete | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    age: 0,
    weight: 0,
    height: 0,
    speedGeneral: 0,
    speedRoad: 0,
    speedMtb: 0,
    isGeneralSpeedFromStrava: false,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await api.getProfile();
        setUserData(profile);
        setForm({
          name: profile.name,
          email: profile.email,
          age: profile.age ?? 0,
          weight: profile.weight ?? 0,
          height: profile.height ?? 0,
          speedGeneral: profile.averageSpeedGeneral ?? 0,
          speedRoad: profile.averageSpeedRoad ?? 0,
          speedMtb: profile.averageSpeedMtb ?? 0,
          isGeneralSpeedFromStrava: profile.averageSpeedGeneralIsFromStrava ?? false,
        });
      } catch {
        toast.error(t('errors.loadError'));
      }
    }

    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getPayload = (): UpdateAthleteDto => {
    if (!userData) return {};

    const payload: UpdateAthleteDto = {};

    if (form.name !== userData.name) payload.name = form.name;
    if (form.email !== userData.email) payload.email = form.email;
    if (form.age !== userData.age) payload.age = form.age;
    if (form.weight !== userData.weight) payload.weight = form.weight;
    if (form.height !== userData.height) payload.height = form.height;
    if (form.speedGeneral !== userData.averageSpeedGeneral)
      payload.averageSpeedGeneral = form.speedGeneral;
    if (form.speedRoad !== userData.averageSpeedRoad) payload.averageSpeedRoad = form.speedRoad;
    if (form.speedMtb !== userData.averageSpeedMtb) payload.averageSpeedMtb = form.speedMtb;

    return payload;
  };

  const handleSave = async () => {
    const payload = getPayload();

    if (Object.keys(payload).length === 0) {
      toast.info(t('errors.noChanges'));
      return;
    }

    try {
      setIsSaving(true);
      await api.updateProfile(payload);
      toast.success(t('errors.updateSuccess'));
    } catch {
      toast.error(t('errors.updateError'));
    } finally {
      setIsSaving(false);
    }
  };

  const inputFields = [
    { name: 'name', type: 'text', value: form.name, label: t('name.label') },
    { name: 'email', type: 'email', value: form.email, label: t('email.label') },
    { name: 'age', type: 'number', value: form.age.toString(), label: t('age.label') },
    { name: 'weight', type: 'number', value: form.weight.toString(), label: t('weight.label') },
    { name: 'height', type: 'number', value: form.height.toString(), label: t('height.label') },
    {
      name: 'speedGeneral',
      type: 'number',
      value: form.speedGeneral.toString(),
      label: t('speedGeneral.label'),
    },
    {
      name: 'speedRoad',
      type: 'number',
      value: form.speedRoad.toString(),
      label: t('speedRoad.label'),
    },
    {
      name: 'speedMtb',
      type: 'number',
      value: form.speedMtb.toString(),
      label: t('speedMtb.label'),
    },
  ];

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={48} />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="profile-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-xl mx-auto p-6 space-y-2 mt-10">
          <Button className="absolute top-6 left-4" variant="back" aria-label="Voltar">
            <ArrowLeft />
          </Button>

          <h1 className="title-primary text-primary text-center">{t('title')}</h1>

          <FormWrapper>
            {inputFields.map(({ name, type, value, label }) => (
              <InputField
                key={name}
                name={name}
                type={type}
                value={value}
                label={label}
                onChange={(e) =>
                  handleInputChange(
                    name,
                    type === 'number' ? Number(e.target.value) : e.target.value,
                  )
                }
              />
            ))}

            {form.isGeneralSpeedFromStrava && (
              <p className="text-sm text-yellow-400 mt-1">{t('speedGeneral.stravaNote')}</p>
            )}
            <div className="pt-4">
              <Button
                variant="confirm"
                onClick={handleSave}
                loading={isSaving}
                disabled={isSaving}
                className="w-full mt-4"
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
          </FormWrapper>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
