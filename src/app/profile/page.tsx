'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Mail, Ruler, Weight, Calendar, Bike, Zap, Mountain } from 'lucide-react';
import { useRouter } from 'next/navigation';

import ApiVeloxService from '@/providers/api-velox.provider';
import { Athlete, UpdateAthleteDto } from '@/interfaces/athlete.interface';
import { useTexts } from '@/helpers/use-texts';

import Loader from '@/components/ui/loader/loader';
import { useProtectedRoute } from '@/hooks/use-protected-route';

export default function ProfilePage() {
  useProtectedRoute()
  const api = new ApiVeloxService();
  const { t } = useTexts('profile');
  const router = useRouter();

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

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Loader size={48} />
          <p className="text-copy mt-4">{t('loadingMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => router.back()}
            className="text-copy-lighter hover:text-copy flex items-center gap-2 transition-all duration-300 ease-out p-3 -m-2 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-light/10 to-primary/10">
            <User size={20} className="text-primary-light" />
            <h1 className="text-xl font-bold text-gray-100 tracking-tight">{t('title')}</h1>
          </div>
          
          <div className="w-20"></div>
        </div>

        {/* Dados Pessoais */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#1a2234] to-[#0f1419] rounded-2xl border border-copy/10 p-6 shadow-xl"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <User size={20} className="text-primary-light" />
            {t('sections.personal')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">nome</label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-primary-light/50 px-4 py-3 rounded-xl transition-all">
                <User size={18} className="text-primary-light" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-transparent outline-none w-full text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">{t('email.label')}</label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-primary-light/50 px-4 py-3 rounded-xl transition-all">
                <Mail size={18} className="text-primary-light" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-transparent outline-none w-full text-white font-medium"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Métricas Físicas */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#1a2234] to-[#0f1419] rounded-2xl border border-copy/10 p-6 shadow-xl"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Ruler size={20} className="text-primary-light" />
            {t('sections.metrics')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">{t('age.label')}</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-primary-light/50 px-4 py-3 rounded-xl transition-all">
                <Calendar size={18} className="text-primary-light flex-shrink-0" />
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                  className="bg-transparent outline-none w-full text-white font-bold text-lg"
                />
                <span className="text-xs font-semibold text-primary-light px-2 py-1 rounded">{t('age.unit')}</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">{t('weight.label')}</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-primary-light/50 px-4 py-3 rounded-xl transition-all">
                <Weight size={18} className="text-primary-light flex-shrink-0" />
                <input
                  type="number"
                  value={form.weight}
                  onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                  className="bg-transparent outline-none w-full text-white font-bold text-lg"
                />
                <span className="text-xs font-semibold text-primary-light px-2 py-1 rounded">{t('weight.unit')}</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">{t('height.label')}</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-primary-light/50 px-4 py-3 rounded-xl transition-all">
                <Ruler size={18} className="text-primary-light flex-shrink-0" />
                <input
                  type="number"
                  value={form.height}
                  onChange={(e) => handleInputChange('height', Number(e.target.value))}
                  className="bg-transparent outline-none w-full text-white font-bold text-lg"
                />
                <span className="text-xs font-semibold text-primary-light px-2 py-1 rounded">{t('height.unit')}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Velocidades das Modalidades */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#1a2234] to-[#0f1419] rounded-2xl border border-copy/10 p-6 shadow-xl"
        >
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Bike size={20} className="text-primary-light" />
            {t('sections.speeds')}
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            {t('sections.speedsDescription')}
          </p>
          
          <div className="space-y-4">
            <div className="bg-[#92a848]/10 border-2 border-[#92a848]/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#92a848]/20">
                  <Bike size={20} className="text-[#92a848]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{t('speedGeneral.label')}</h3>
                  <p className="text-xs text-gray-300">{t('speedGeneral.description')}</p>
                  {form.isGeneralSpeedFromStrava && (
                    <p className="text-xs text-[#92a848] mt-1">{t('speedGeneral.stravaSync')}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/20 border border-[#92a848]/20 px-4 py-3 rounded-lg">
                <input
                  type="number"
                  step="0.1"
                  value={form.speedGeneral}
                  onChange={(e) => handleInputChange('speedGeneral', Number(e.target.value))}
                  disabled={form.isGeneralSpeedFromStrava}
                  className="bg-transparent outline-none w-full text-white font-bold text-2xl disabled:opacity-50"
                />
                <span className="text-xs font-bold text-[#92a848] bg-[#92a848]/20 px-2.5 py-1.5 rounded whitespace-nowrap">{t('speedGeneral.unit')}</span>
              </div>
            </div>

            <div className="bg-[#4a9eff]/10 border-2 border-[#4a9eff]/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#4a9eff]/20">
                  <Zap size={20} className="text-[#4a9eff]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{t('speedRoad.label')}</h3>
                  <p className="text-xs text-gray-300">{t('speedRoad.description')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/20 border border-[#4a9eff]/20 px-4 py-3 rounded-lg">
                <input
                  type="number"
                  step="0.1"
                  value={form.speedRoad}
                  onChange={(e) => handleInputChange('speedRoad', Number(e.target.value))}
                  className="bg-transparent outline-none w-full text-white font-bold text-2xl"
                />
                <span className="text-xs font-bold text-[#4a9eff] bg-[#4a9eff]/20 px-2.5 py-1.5 rounded whitespace-nowrap">{t('speedRoad.unit')}</span>
              </div>
            </div>

            <div className="bg-[#ff8c42]/10 border-2 border-[#ff8c42]/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#ff8c42]/20">
                  <Mountain size={20} className="text-[#ff8c42]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{t('speedMtb.label')}</h3>
                  <p className="text-xs text-gray-300">{t('speedMtb.description')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/20 border border-[#ff8c42]/20 px-4 py-3 rounded-lg">
                <input
                  type="number"
                  step="0.1"
                  value={form.speedMtb}
                  onChange={(e) => handleInputChange('speedMtb', Number(e.target.value))}
                  className="bg-transparent outline-none w-full text-white font-bold text-2xl"
                />
                <span className="text-xs font-bold text-[#ff8c42] bg-[#ff8c42]/20 px-2.5 py-1.5 rounded whitespace-nowrap">{t('speedMtb.unit')}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Botão Salvar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full group relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-content font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 ease-out shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('button.saving')}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  {t('button.save')}
                </>
              )}
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
