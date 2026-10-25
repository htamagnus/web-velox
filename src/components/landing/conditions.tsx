'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import Reveal, { EASE } from './reveal';
import RollingValue from './rolling-value';

// um dia de exemplo em três horários; os limites são os mesmos que o app usa pra avisar
const SLOTS = [
  { id: '07:00', rain: 10, temp: 18, wind: 9, delay: 3 },
  { id: '12:00', rain: 35, temp: 31, wind: 14, delay: 8 },
  { id: '17:00', rain: 80, temp: 24, wind: 28, delay: 18 },
];
const LIMITS = { rain: 70, tempMin: 10, tempMax: 30, wind: 25, intense: 5, congested: 15 };
const LEVELS = ['normal', 'intense', 'congested'] as const;
const DWELL = 6000;

type Slot = (typeof SLOTS)[number];
const trafficLevel = (delay: number) =>
  delay >= LIMITS.congested ? 'congested' : delay >= LIMITS.intense ? 'intense' : 'normal';

export default function Conditions() {
  const { t } = useTexts('landing.conditions');
  const { t: tApp } = useTexts();
  const [slot, setSlot] = useState<Slot>(SLOTS[0]);

  // os horários passam sozinhos enquanto a seção está na tela; o mouse segura, escolher um encerra
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [auto, setAuto] = useState(true);
  const [held, setHeld] = useState(false);
  const running = auto && inView && !held && !reduced;
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => {
      const i = SLOTS.findIndex((s) => s.id === slot.id);
      setSlot(SLOTS[(i + 1) % SLOTS.length]);
    }, DWELL);
    return () => clearTimeout(id);
  }, [running, slot]);
  const pick = (s: Slot) => {
    setAuto(false);
    setSlot(s);
  };

  const alerts = {
    rain: slot.rain > LIMITS.rain,
    temp: slot.temp < LIMITS.tempMin || slot.temp > LIMITS.tempMax,
    wind: slot.wind > LIMITS.wind,
  };
  const level = trafficLevel(slot.delay);
  const wait = alerts.rain || alerts.temp || alerts.wind || level === 'congested';
  const reasons = [
    alerts.rain && `${tApp('calculate.weather.humidity')} ${slot.rain}%`,
    alerts.temp && `${tApp('calculate.weather.temperature')} ${slot.temp} °C`,
    alerts.wind && `${tApp('calculate.weather.wind')} ${slot.wind} km/h`,
    level !== 'normal' && `${tApp(`calculate.traffic.severity.${level}`)} · +${slot.delay} min`,
  ].filter(Boolean);

  const meters = [
    {
      key: 'humidity',
      value: slot.rain,
      max: 100,
      unit: '%',
      ticks: [LIMITS.rain],
      alert: alerts.rain,
      rule: t('rainRule'),
    },
    {
      key: 'temperature',
      value: slot.temp,
      max: 40,
      unit: ' °C',
      ticks: [LIMITS.tempMin, LIMITS.tempMax],
      alert: alerts.temp,
      rule: t('temperatureRule'),
    },
    {
      key: 'wind',
      value: slot.wind,
      max: 50,
      unit: ' km/h',
      ticks: [LIMITS.wind],
      alert: alerts.wind,
      rule: t('windRule'),
    },
  ];

  const meter = (m: {
    key: string;
    label: string;
    value: number;
    max: number;
    unit: string;
    ticks: number[];
    alert: boolean;
    rule?: string;
  }) => (
    <div key={m.key} className="cond__meter" data-alert={m.alert || undefined}>
      <div className="cond__meter-head">
        <span>{m.label}</span>
        <RollingValue value={m.value} format={(v) => `${v}${m.unit}`} className="cond__value" />
      </div>
      <span className="cond__track" aria-hidden="true">
        {m.ticks.map((tick) => (
          <i key={tick} className="cond__tick" style={{ left: `${(tick / m.max) * 100}%` }} />
        ))}
        <motion.span
          className="cond__fill"
          animate={{ scaleX: Math.min(1, m.value / m.max) }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </span>
      {m.rule && <span className="cond__rule">{m.rule}</span>}
    </div>
  );

  return (
    <section className="conditions">
      <div ref={ref} className="container">
        <Reveal>
          <div className="cond__head">
            <h2>{t('title')}</h2>
            <p className="lead">{t('lead')}</p>
            <div
              className="cond__slots"
              role="group"
              aria-label={t('slotsLabel')}
              onPointerEnter={() => setHeld(true)}
              onPointerLeave={() => setHeld(false)}
              onFocusCapture={() => setHeld(true)}
              onBlurCapture={() => setHeld(false)}
            >
              <span className="cond__slots-label">{t('slotsLabel')}</span>
              {SLOTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="chip"
                  aria-pressed={slot.id === s.id}
                  onClick={() => pick(s)}
                >
                  {s.id}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="cond__board">
            <div className="cond__group">
              <h3>{t('weatherTitle')}</h3>
              {meters.map((m) => meter({ ...m, label: tApp(`calculate.weather.${m.key}`) }))}
            </div>
            <div className="cond__group">
              <h3>{t('trafficTitle')}</h3>
              {meter({
                key: 'delay',
                label: t('delay'),
                value: slot.delay,
                max: 30,
                unit: ' min',
                ticks: [LIMITS.intense, LIMITS.congested],
                alert: level !== 'normal',
              })}
              <dl className="cond__levels">
                {LEVELS.map((lv) => (
                  <div key={lv} className={lv === level ? 'is-on' : undefined}>
                    <dt>{tApp(`calculate.traffic.severity.${lv}`)}</dt>
                    <dd>{t(`${lv}Rule`)}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <motion.div
              key={slot.id}
              className={wait ? 'cond__verdict is-wait' : 'cond__verdict'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <p className="cond__verdict-title">{wait ? t('wait') : t('go')}</p>
              <p className="cond__verdict-note">
                {reasons.length ? reasons.join(' · ') : t('clear')}
              </p>
            </motion.div>
          </div>
          <p className="cond__note">{t('sampleNote')}</p>
        </Reveal>
      </div>
    </section>
  );
}
