'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion, useSpring, useTransform } from 'framer-motion';

const MAX = 60;
const C = 120;
const R = 96;
const START = 135;
const SWEEP = 270;

const at = (n: number, r = R) => {
  const rad = ((START + (Math.min(Math.max(n, 0), MAX) / MAX) * SWEEP) * Math.PI) / 180;
  return [C + r * Math.cos(rad), C + r * Math.sin(rad)];
};
const [SX, SY] = at(0);
const [EX, EY] = at(MAX);
const ARC = `M ${SX} ${SY} A ${R} ${R} 0 1 1 ${EX} ${EY}`;
const TICKS = Array.from({ length: MAX / 5 + 1 }, (_, i) => i * 5);

type Props = {
  value: number;
  format: (n: number) => string;
  unit: string;
  label: string;
};

// o velocímetro: arco, ponteiro e número andam na mesma mola até a média da bike escolhida
export default function SpeedGauge({ value, format, unit, label }: Props) {
  const reduced = useReducedMotion();
  const speed = useSpring(0, { stiffness: 55, damping: 14 });
  useEffect(() => {
    if (reduced) speed.jump(value);
    else speed.set(value);
  }, [value, reduced, speed]);

  const length = useTransform(speed, (n) => Math.min(1, Math.max(0.002, n / MAX)));
  const dotX = useTransform(speed, (n) => at(n)[0]);
  const dotY = useTransform(speed, (n) => at(n)[1]);
  const text = useTransform(speed, (n) => format(Math.round(n * 10) / 10));

  return (
    <div className="gauge">
      <svg viewBox="0 0 240 240" aria-hidden="true">
        {TICKS.map((n) => {
          const [x1, y1] = at(n, R - 18);
          const [x2, y2] = at(n, R - (n % 20 ? 24 : 30));
          return <line key={n} x1={x1} y1={y1} x2={x2} y2={y2} className={n % 20 ? 'gauge__tick' : 'gauge__tick is-major'} />;
        })}
        <path d={ARC} className="gauge__track" />
        <motion.path d={ARC} className="gauge__arc" style={{ pathLength: length }} />
        <motion.circle cx={dotX} cy={dotY} r="7" className="gauge__dot" />
      </svg>
      <p className="gauge__read">
        <motion.span className="gauge__value">{text}</motion.span>
        <span className="gauge__unit">{unit}</span>
        <span className="gauge__label">{label}</span>
      </p>
    </div>
  );
}
