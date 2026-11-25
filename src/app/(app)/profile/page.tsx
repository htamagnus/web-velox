'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { Bike, Building2, LogOut, Minus, Mountain, Plus } from 'lucide-react';

import { Athlete, UpdateAthleteDto } from '@/interfaces/athlete.interface';
import { useTexts } from '@/helpers/use-texts';
import { useAuth } from '@/contexts/auth-context';
import { useLocale } from '@/contexts/locale-context';
import SpeedField from '@/components/landing/speed-field';
import { useAppData } from '@/components/app/app-shell';
import { ITEM, SPRING, STAGGER, initials } from '@/components/app/motion';
import Segmented from '@/components/app/segmented';
import Skeleton from '@/components/app/skeleton';

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
  { field: 'speedRoad', key: 'averageSpeedRoad', Icon: Bike },
  { field: 'speedMtb', key: 'averageSpeedMtb', Icon: Mountain },
  { field: 'speedGeneral', key: 'averageSpeedGeneral', Icon: Building2 },
] as const;
const BODY = ['age', 'weight', 'height'] as const;

const fromAthlete = (profile: Athlete): FormState => ({
  name: profile.name,
  email: profile.email,
  age: profile.age ?? 0,
  weight: profile.weight ?? 0,
  height: profile.height ?? 0,
  // média 0 é bike não configurada: o campo fica vazio com o traço, não com um 0 que parece média real
  speedGeneral: profile.averageSpeedGeneral || '',
  speedRoad: profile.averageSpeedRoad || '',
  speedMtb: profile.averageSpeedMtb || '',
  isGeneralSpeedFromStrava: profile.averageSpeedGeneralIsFromStrava ?? false,
});

type NumberFieldProps = {
  id: string;
  value: Numeric;
  limits: readonly [number, number];
  unit: string;
  label: string;
  invalid: boolean;
  onChange: (value: Numeric) => void;
};

// o número com − e + redondos do lado, como um stepper de ajustes
function NumberField({ id, value, limits: [min, max], unit, label, invalid, onChange }: NumberFieldProps) {
  const { t } = useTexts('profile');
  const n = Number(value) || 0;
  // o passo encosta na faixa: de um valor em 0, o + já leva pro mínimo
  const step = (delta: number) => onChange(Math.min(max, Math.max(min, Math.round((n + delta) * 10) / 10)));

  return (
    <div className="stepper" data-invalid={invalid || undefined}>
      <motion.button
        type="button"
        aria-label={t('decrease').replace('{{label}}', label)}
        disabled={n <= min}
        onClick={() => step(-1)}
        whileTap={{ scale: 0.85 }}
        transition={SPRING}
      >
        <Minus size={18} aria-hidden="true" />
      </motion.button>
      <span className="stepper__value">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          inputMode="numeric"
          placeholder="—"
          value={value}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : undefined}
        />
        <small>{unit}</small>
      </span>
      <motion.button
        type="button"
        aria-label={t('increase').replace('{{label}}', label)}
        disabled={n >= max}
        onClick={() => step(1)}
        whileTap={{ scale: 0.85 }}
        transition={SPRING}
      >
        <Plus size={18} aria-hidden="true" />
      </motion.button>
    </div>
  );
}

// o perfil como tela de ajustes: o cartão da pessoa, as médias em controles deslizantes, o corpo e a conta em grupos
export default function ProfilePage() {
  const { t } = useTexts('profile');
  const { t: tApp } = useTexts();
  const { logout } = useAuth();
  const { locale, setLocale } = useLocale();
  const { api, athlete, setAthlete } = useAppData();
  const [form, setForm] = useState<FormState | null>(() => (athlete ? fromAthlete(athlete) : null));
  const [isSaving, setIsSaving] = useState(false);

  // na primeira visita o perfil chega depois da tela; o formulário nasce dele uma vez só
  useEffect(() => {
    if (athlete && !form) setForm(fromAthlete(athlete));
  }, [athlete, form]);

  if (!athlete || !form) return <Skeleton rows={4} />;

  const set = (field: keyof FormState, value: string | Numeric) => setForm((prev) => prev && { ...prev, [field]: value });

  const payload: UpdateAthleteDto = {};
  if (form.name !== athlete.name) payload.name = form.name;
  if (form.email !== athlete.email) payload.email = form.email;
  if (form.age !== '' && form.age !== athlete.age) payload.age = form.age;
  if (form.weight !== '' && form.weight !== athlete.weight) payload.weight = form.weight;
  if (form.height !== '' && form.height !== athlete.height) payload.height = form.height;
  if (form.speedGeneral !== '' && form.speedGeneral !== athlete.averageSpeedGeneral)
    payload.averageSpeedGeneral = form.speedGeneral;
  if (form.speedRoad !== '' && form.speedRoad !== athlete.averageSpeedRoad) payload.averageSpeedRoad = form.speedRoad;
  if (form.speedMtb !== '' && form.speedMtb !== athlete.averageSpeedMtb) payload.averageSpeedMtb = form.speedMtb;

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
      setAthlete((prev) => (prev ? { ...prev, ...payload } : prev));
      toast.success(t('errors.updateSuccess'));
    } catch {
      toast.error(t('errors.updateError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      className="page profile"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <motion.div className="profile__grid" variants={STAGGER} initial="hidden" animate="show">
        <motion.aside className="profile__side" variants={ITEM}>
          <section className="card idcard grain">
            <SpeedField speed={Number(form.speedGeneral) || 0} />
            <motion.span
              className="avatar avatar--big"
              aria-hidden="true"
              initial={{ scale: 0.6, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
            >
              {initials(form.name || athlete.name)}
            </motion.span>
            <p className="page__kicker">{t('title')}</p>
            <h1 className="idcard__name">{form.name || athlete.name}</h1>
            <p className="idcard__email">{form.email || athlete.email}</p>
            {form.isGeneralSpeedFromStrava && <p className="chip chip--strava">{tApp('home.strava.synced')}</p>}
          </section>

          <section className="group" aria-labelledby="prefs">
            <h2 id="prefs" className="group__title">
              {t('sections.preferences')}
            </h2>
            <div className="group__row">
              <span className="group__label">{t('language')}</span>
              <Segmented
                id="lang"
                label={t('language')}
                value={locale}
                onChange={setLocale}
                options={[
                  { value: 'pt', label: 'PT' },
                  { value: 'en', label: 'EN' },
                ]}
                className="seg--compact"
              />
            </div>
          </section>

          <button type="button" className="logout" onClick={logout}>
            <LogOut size={18} aria-hidden="true" />
            {t('logout')}
          </button>
        </motion.aside>

        <div className="profile__main">
          <motion.section className="profile__section" variants={ITEM}>
            <header className="section__head section__head--stack">
              <h2>{t('sections.speeds')}</h2>
              <p>{t('sections.speedsDescription')}</p>
            </header>
            <div className="bikes">
              {BIKES.map(({ field, key, Icon }) => {
                const locked = field === 'speedGeneral' && form.isGeneralSpeedFromStrava;
                const wrong = invalid(key);
                const [min, max] = LIMITS[key];
                const value = form[field];
                const fill = value === '' ? 0 : ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
                return (
                  <div key={field} className="card bike" data-invalid={wrong || undefined}>
                    <div className="bike__top">
                      <span className="bike__icon" aria-hidden="true">
                        <Icon size={18} />
                      </span>
                      <label htmlFor={field} className="bike__name">
                        {t(`${field}.label`)}
                      </label>
                      {locked && <span className="chip chip--strava">Strava</span>}
                      {!locked && value === '' && !athlete[key] && <span className="chip chip--amber">{t('unset')}</span>}
                    </div>
                    <div className="bike__value">
                      <input
                        id={field}
                        type="number"
                        step="0.1"
                        min={min}
                        max={max}
                        inputMode="decimal"
                        placeholder="—"
                        value={value}
                        disabled={locked}
                        onChange={(e) => set(field, e.target.value === '' ? '' : Number(e.target.value))}
                        aria-invalid={wrong}
                        aria-describedby={wrong ? `${field}-error` : undefined}
                      />
                      <small>{t(`${field}.unit`)}</small>
                    </div>
                    <input
                      type="range"
                      className="range"
                      min={min}
                      max={max}
                      step="0.5"
                      value={value === '' ? min : Math.min(max, Math.max(min, value))}
                      disabled={locked}
                      onChange={(e) => set(field, Number(e.target.value))}
                      aria-label={t(`${field}.label`)}
                      style={{ '--fill': `${fill}%` } as CSSProperties}
                    />
                    {wrong && (
                      <span id={`${field}-error`} className="field-error">
                        {rangeError(key, t(`${field}.unit`))}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.section>

          <motion.section className="profile__section" variants={ITEM}>
            <header className="section__head section__head--stack">
              <h2>{t('sections.metrics')}</h2>
              <p>{t('sections.metricsDescription')}</p>
            </header>
            <div className="group">
              {BODY.map((field) => {
                const wrong = invalid(field);
                return (
                  <div key={field} className="group__row" data-invalid={wrong || undefined}>
                    <label htmlFor={field} className="group__label">
                      {t(`${field}.label`)}
                    </label>
                    <NumberField
                      id={field}
                      value={form[field]}
                      limits={LIMITS[field]}
                      unit={t(`${field}.unit`)}
                      label={t(`${field}.label`)}
                      invalid={wrong}
                      onChange={(value) => set(field, value)}
                    />
                    {wrong && (
                      <span id={`${field}-error`} className="field-error">
                        {rangeError(field, t(`${field}.unit`))}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.section>

          <motion.section className="profile__section" variants={ITEM}>
            <header className="section__head section__head--stack">
              <h2>{t('sections.personal')}</h2>
            </header>
            <div className="group">
              <label className="group__row group__row--field">
                <span className="group__label">{t('name.label')}</span>
                <input
                  type="text"
                  autoComplete="name"
                  className="group__input"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                />
              </label>
              <label className="group__row group__row--field">
                <span className="group__label">{t('email.label')}</span>
                <input
                  type="email"
                  autoComplete="email"
                  className="group__input"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </label>
            </div>
          </motion.section>
        </div>
      </motion.div>

      <AnimatePresence>
        {hasChanges && (
          <motion.div
            className="savebar"
            initial={{ y: 32, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 32, opacity: 0, scale: 0.96 }}
            transition={SPRING}
          >
            <p>{hasErrors ? t('errors.fixRange') : t('unsaved')}</p>
            <button type="submit" className="btn btn--primary" disabled={isSaving || hasErrors} aria-busy={isSaving}>
              {isSaving ? t('button.saving') : t('button.save')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
