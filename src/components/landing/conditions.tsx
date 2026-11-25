'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';
import Reveal, { EASE } from './reveal';
import SplitWords from './split-words';
import RollingValue from './rolling-value';

// um dia de exemplo, hora a hora; os limites são os mesmos que o app usa pra avisar
const HOURS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const TEMP = [15, 15, 18, 21, 24, 27, 29, 31, 32, 32, 30, 27, 24, 22, 20, 19];
const RAIN = [5, 5, 10, 10, 15, 20, 30, 35, 40, 50, 65, 75, 80, 85, 70, 55];
const WIND = [6, 7, 9, 10, 11, 12, 13, 14, 16, 19, 23, 26, 28, 27, 24, 20];
const DELAY = [1, 2, 3, 9, 16, 10, 7, 8, 7, 6, 8, 12, 18, 20, 16, 9];
const LIMITS = { rain: 70, tempMin: 10, tempMax: 30, wind: 25, intense: 5, congested: 15 };
const START = 2; // 07:00
const DWELL = 2400;

const last = HOURS.length - 1;
const clock = (h: number) => `${String(h).padStart(2, '0')}:00`;
// o desenho vive num quadro de 1000 × 100 esticado; os traços não escalam
const x = (i: number) => (i / last) * 1000;
const y = (v: number, max: number) => 100 - (v / max) * 100;
const line = (data: number[], max: number) => data.map((v, i) => `${x(i)},${y(v, max)}`).join(' ');
const trafficLevel = (delay: number) =>
  delay >= LIMITS.congested ? 'congested' : delay >= LIMITS.intense ? 'intense' : 'normal';
const trafficTone = (delay: number) =>
  delay >= LIMITS.congested ? 'is-alert' : delay >= LIMITS.intense ? 'is-mid' : '';

export default function Conditions() {
  const { t } = useTexts('landing.conditions');
  const { t: tApp } = useTexts();
  const [idx, setIdx] = useState(START);

  // as horas passam sozinhas enquanto a seção está na tela; o mouse segura, mexer no cursor encerra
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduced = useReducedMotion();
  const [auto, setAuto] = useState(true);
  const [held, setHeld] = useState(false);
  const running = auto && inView && !held && !reduced;
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setIdx((i) => (i + 1) % HOURS.length), DWELL);
    return () => clearTimeout(id);
  }, [running, idx]);
  const pick = (i: number) => {
    setAuto(false);
    setIdx(i);
  };

  const temp = TEMP[idx];
  const rain = RAIN[idx];
  const wind = WIND[idx];
  const delay = DELAY[idx];
  const level = trafficLevel(delay);
  const alerts = {
    rain: rain > LIMITS.rain,
    temp: temp < LIMITS.tempMin || temp > LIMITS.tempMax,
    wind: wind > LIMITS.wind,
  };
  const wait = alerts.rain || alerts.temp || alerts.wind || level === 'congested';
  const reasons = [
    alerts.rain && `${tApp('calculate.weather.humidity')} ${rain}%`,
    alerts.temp && `${tApp('calculate.weather.temperature')} ${temp} °C`,
    alerts.wind && `${tApp('calculate.weather.wind')} ${wind} km/h`,
    level !== 'normal' && `${tApp(`calculate.traffic.severity.${level}`)} · +${delay} min`,
  ].filter(Boolean);

  const lanes = [
    {
      key: 'temperature',
      label: tApp('calculate.weather.temperature'),
      data: TEMP,
      max: 40,
      unit: ' °C',
      kind: 'line',
      limits: [LIMITS.tempMin, LIMITS.tempMax],
      alert: alerts.temp,
      rule: t('temperatureRule'),
    },
    {
      key: 'humidity',
      label: tApp('calculate.weather.humidity'),
      data: RAIN,
      max: 100,
      unit: '%',
      kind: 'bars',
      limits: [LIMITS.rain],
      alert: alerts.rain,
      rule: t('rainRule'),
      tone: (v: number) => (v > LIMITS.rain ? 'is-alert' : ''),
    },
    {
      key: 'wind',
      label: tApp('calculate.weather.wind'),
      data: WIND,
      max: 50,
      unit: ' km/h',
      kind: 'line',
      limits: [LIMITS.wind],
      alert: alerts.wind,
      rule: t('windRule'),
    },
    {
      key: 'delay',
      label: t('delay'),
      data: DELAY,
      max: 30,
      unit: ' min',
      kind: 'bars',
      limits: [LIMITS.intense, LIMITS.congested],
      alert: level !== 'normal',
      rule: t(`${level}Rule`),
      tone: trafficTone,
    },
  ];
  const cursor = { '--x': `${(idx / last) * 100}%` } as CSSProperties;

  return (
    <section className="conditions">
      <div ref={ref} className="container">
        <div className="cond__head">
          <div>
            <Reveal>
              <p className="eyebrow">{tApp('landing.index.conditions')}</p>
            </Reveal>
            <SplitWords text={t('title')} />
            <Reveal delay={0.1}>
              <p className="lead">{t('lead')}</p>
            </Reveal>
          </div>
          <Reveal className="cond__pick" delay={0.15}>
            <span className="label">{t('slotsLabel')}</span>
            <span className="cond__hour" aria-live="polite">
              {clock(HOURS[idx])}
            </span>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            className="day"
            onPointerEnter={() => setHeld(true)}
            onPointerLeave={() => setHeld(false)}
            onFocusCapture={() => setHeld(true)}
            onBlurCapture={() => setHeld(false)}
          >
            {lanes.map((lane) => (
              <div key={lane.key} className="day__lane" data-alert={lane.alert || undefined}>
                <div className="day__meta">
                  <span>{lane.label}</span>
                  <RollingValue
                    value={lane.data[idx]}
                    format={(v) => `${v}${lane.unit}`}
                    className="day__value num"
                  />
                  <span className="day__limit">{lane.rule}</span>
                </div>
                <div className="day__plot">
                  <svg viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
                    {lane.kind === 'line' ? (
                      <>
                        <polygon
                          className="day__area"
                          points={`0,100 ${line(lane.data, lane.max)} 1000,100`}
                        />
                        <polyline className="day__line" points={line(lane.data, lane.max)} />
                      </>
                    ) : (
                      lane.data.map((v, i) => (
                        <rect
                          key={i}
                          className={`day__bar ${lane.tone?.(v) ?? ''}`}
                          x={x(i) - 10}
                          y={y(v, lane.max)}
                          width="20"
                          height={100 - y(v, lane.max)}
                        />
                      ))
                    )}
                    {lane.limits.map((limit) => (
                      <line
                        key={limit}
                        className="day__thr"
                        x1="0"
                        x2="1000"
                        y1={y(limit, lane.max)}
                        y2={y(limit, lane.max)}
                      />
                    ))}
                  </svg>
                  {lane.limits.map((limit) => (
                    <span
                      key={limit}
                      className="day__thr-label num"
                      style={{ top: `${y(limit, lane.max)}%` }}
                    >
                      {limit}
                      {lane.unit}
                    </span>
                  ))}
                  {lane.kind === 'line' && (
                    <i
                      className="day__mark"
                      style={{
                        left: `${(idx / last) * 100}%`,
                        top: `${y(lane.data[idx], lane.max)}%`,
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
            <div className="day__cursor" aria-hidden="true">
              <i style={cursor} />
            </div>
            <div className="day__axis">
              <span className="day__meta label">{t('slotsLabel')}</span>
              <div className="day__hours">
                {HOURS.map((h, i) => (
                  <span key={h} className="num" style={{ left: `${(i / last) * 100}%` }}>
                    {clock(h)}
                  </span>
                ))}
                <input
                  type="range"
                  className="day__range"
                  min={0}
                  max={last}
                  step={1}
                  value={idx}
                  aria-label={t('slotsLabel')}
                  aria-valuetext={clock(HOURS[idx])}
                  onPointerDown={() => setAuto(false)}
                  onChange={(e) => pick(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <motion.div
            key={idx}
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
          <p className="cond__note">{t('sampleNote')}</p>
        </Reveal>
      </div>
    </section>
  );
}
