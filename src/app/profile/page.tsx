'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { motion, MotionConfig } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import ApiVeloxService from '@/providers/api-velox.provider';
import { Athlete, UpdateAthleteDto } from '@/interfaces/athlete.interface';
import { useTexts } from '@/helpers/use-texts';

import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay';
import LanguageSelector from '@/components/language-selector/language-selector';
import SpeedField from '@/components/landing/speed-field';
import { EASE } from '@/components/landing/reveal';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { archivo } from '../fonts';

type Numeric = number | '';
type FormState = {
  name: string;
  email: string;
  age: Numeric;
  weight: Numeric;
  height: Numeric;
  speedGeneral: Numeric;
  speedRoad: Numeric;
  speedMtb: Numeric;
  isGeneralSpeedFromStrava: boolean;
};

// velocidade média real de bike; idade, peso e altura nas mesmas faixas do onboarding
const LIMITS = {
  averageSpeedRoad: [5, 60],
  averageSpeedMtb: [5, 60],
  averageSpeedGeneral: [5, 60],
  age: [8, 150],
  weight: [40, 500],
  height: [140, 300],
} as const;
type Limited = keyof typeof LIMITS;

const BIKES = [
  { field: 'speedRoad', key: 'averageSpeedRoad' },
  { field: 'speedMtb', key: 'averageSpeedMtb' },
  { field: 'speedGeneral', key: 'averageSpeedGeneral' },
] as const;
const BODY = ['age', 'weight', 'height'] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

// o perfil como o pôster: o nome gigante e as três médias em volt em cima; o corpo e a conta no papel
export default function ProfilePage() {
  useProtectedRoute()
  const api = useMemo(() => new ApiVeloxService(), []);
  const { t } = useTexts('profile');
  const { t: tApp } = useTexts();

  const [userData, setUserData] = useState<Athlete | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState<FormState>({
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
  }, [api, t]);

  const handleInputChange = (field: keyof FormState, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumericChange = (field: keyof FormState, value: string) => {
    const nextValue: Numeric = value === '' ? '' : Number(value);
    setForm((prev) => ({ ...prev, [field]: nextValue }));
  };

  const getPayload = (): UpdateAthleteDto => {
    if (!userData) return {};

    const payload: UpdateAthleteDto = {};

    if (form.name !== userData.name) payload.name = form.name;
    if (form.email !== userData.email) payload.email = form.email;
    if (form.age !== '' && form.age !== userData.age) payload.age = form.age;
    if (form.weight !== '' && form.weight !== userData.weight) payload.weight = form.weight;
    if (form.height !== '' && form.height !== userData.height) payload.height = form.height;
    if (form.speedGeneral !== '' && form.speedGeneral !== userData.averageSpeedGeneral)
      payload.averageSpeedGeneral = form.speedGeneral;
    if (form.speedRoad !== '' && form.speedRoad !== userData.averageSpeedRoad) payload.averageSpeedRoad = form.speedRoad;
    if (form.speedMtb !== '' && form.speedMtb !== userData.averageSpeedMtb) payload.averageSpeedMtb = form.speedMtb;

    return payload;
  };

  const payload = getPayload();
  const hasChanges = Object.keys(payload).length > 0;
  // só o que mudou é checado: uma média antiga em 0 (bike não configurada) não trava o resto
  const invalid = (key: Limited) => {
    const value = payload[key];
    return value !== undefined && (value < LIMITS[key][0] || value > LIMITS[key][1]);
  };
  const hasErrors = (Object.keys(LIMITS) as Limited[]).some(invalid);
  const rangeError = (key: Limited, unit: string) =>
    t('errors.range')
      .replace('{{min}}', String(LIMITS[key][0]))
      .replace('{{max}}', String(LIMITS[key][1]))
      .replace('{{unit}}', unit);

  const handleSave = async () => {
    if (!hasChanges) {
      toast.info(t('errors.noChanges'));
      return;
    }
    if (hasErrors) return;

    try {
      setIsSaving(true);
      await api.updateProfile(payload);
      // o salvo vira a nova base de comparação, senão a barra de salvar nunca some
      setUserData((prev) => (prev ? { ...prev, ...payload } : prev));
      toast.success(t('errors.updateSuccess'));
    } catch {
      toast.error(t('errors.updateError'));
    } finally {
      setIsSaving(false);
    }
  };

  if (!userData) {
    return <PageTransitionOverlay visible={true} message={t('loadingMessage')} />;
  }

  const [firstName, ...rest] = (form.name || userData.name).trim().split(/\s+/);
  const nameLines = rest.length ? [firstName, rest.join(' ')] : [firstName];

  return (
    <MotionConfig reducedMotion="user">
      <form
        className={`landing profile ${archivo.variable}`}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <section className="profile__poster grain">
          <SpeedField speed={Number(form.speedGeneral) || 0} />
          <div className="hero__lines" aria-hidden="true" />

          <header className="container profile__nav">
            <Link href="/home" className="back-link">
              <ArrowLeft size={18} aria-hidden="true" />
              {tApp('plannerPanel.backButton')}
            </Link>
            <div className="lang">
              <LanguageSelector />
            </div>
          </header>

          <div className="container profile__head">
            <motion.p className="eyebrow eyebrow--ink" {...rise(0.2)}>
              {t('title')}
            </motion.p>
            <h1>
              {nameLines.map((line, i) => (
                <span key={i} className="hero__line">
                  <motion.span
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: EASE }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p className="profile__email" {...rise(0.6)}>
              {userData.email}
            </motion.p>
          </div>

          <motion.div className="container profile__speeds" {...rise(0.75)}>
            <div className="profile__speeds-head">
              <h2 className="eyebrow eyebrow--ink">01 · {t('sections.speeds')}</h2>
              <p>{t('sections.speedsDescription')}</p>
            </div>
            <div className="profile__bikes">
              {BIKES.map(({ field, key }) => {
                const locked = field === 'speedGeneral' && form.isGeneralSpeedFromStrava;
                const wrong = invalid(key);
                return (
                  <label key={field} className="profile__bike" data-invalid={wrong || undefined}>
                    <span className="profile__bike-name">{t(`${field}.label`)}</span>
                    <input
                      type="number"
                      step="0.1"
                      min={LIMITS[key][0]}
                      max={LIMITS[key][1]}
                      inputMode="decimal"
                      className="profile__speed"
                      value={form[field]}
                      onChange={(e) => handleNumericChange(field, e.target.value)}
                      disabled={locked}
                      aria-invalid={wrong}
                      aria-describedby={wrong ? `${field}-error` : undefined}
                    />
                    <span className="profile__unit">{t(`${field}.unit`)}</span>
                    {locked && <span className="strava-tag">{tApp('home.strava.synced')}</span>}
                    {wrong && (
                      <span id={`${field}-error`} className="profile__error">
                        {rangeError(key, t(`${field}.unit`))}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </motion.div>
        </section>

        <main className="container profile__body">
          <section className="profile__section">
            <div className="profile__index">
              <h2 className="eyebrow">02 · {t('sections.metrics')}</h2>
              <p>{t('sections.metricsDescription')}</p>
            </div>
            <div className="profile__sheet">
              {BODY.map((field) => {
                const wrong = invalid(field);
                return (
                  <label key={field} className="profile__row" data-invalid={wrong || undefined}>
                    <span className="profile__row-label">{t(`${field}.label`)}</span>
                    <span className="profile__row-value">
                      <input
                        type="number"
                        min={LIMITS[field][0]}
                        max={LIMITS[field][1]}
                        inputMode="numeric"
                        className="profile__num"
                        value={form[field]}
                        onChange={(e) => handleNumericChange(field, e.target.value)}
                        aria-invalid={wrong}
                        aria-describedby={wrong ? `${field}-error` : undefined}
                      />
                      <span>{t(`${field}.unit`)}</span>
                    </span>
                    {wrong && (
                      <span id={`${field}-error`} className="profile__error">
                        {rangeError(field, t(`${field}.unit`))}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </section>

          <section className="profile__section">
            <div className="profile__index">
              <h2 className="eyebrow">03 · {t('sections.personal')}</h2>
            </div>
            <div className="profile__account">
              <div className="field">
                <label htmlFor="profile-name" className="field__label">
                  {t('name.label')}
                </label>
                <input
                  id="profile-name"
                  type="text"
                  autoComplete="name"
                  className="field__input"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="profile-email" className="field__label">
                  {t('email.label')}
                </label>
                <input
                  id="profile-email"
                  type="email"
                  autoComplete="email"
                  className="field__input"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>
          </section>
        </main>

        <motion.div
          className="profile__bar"
          initial={false}
          animate={{ y: hasChanges ? 0 : '100%' }}
          transition={{ duration: 0.5, ease: EASE }}
          inert={!hasChanges}
        >
          <div className="container profile__bar-inner">
            <p>{hasErrors ? t('errors.fixRange') : t('unsaved')}</p>
            <button type="submit" className="btn btn--primary" disabled={isSaving || hasErrors} aria-busy={isSaving}>
              {isSaving ? t('button.saving') : t('button.save')}
            </button>
          </div>
        </motion.div>
      </form>
    </MotionConfig>
  );
}
