'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

type Streak = { x: number; y: number; w: number; a: number; color: string };

// rastros de luz de longa exposição: velocidade e comprimento seguem a média da bike escolhida
const COLORS = ['rgb(191 213 114)', 'rgb(255 190 92)', 'rgb(255 244 220)'];
const BASE_SPEED = 22.5;

export default function SpeedField({ speed }: { speed: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef(speed);
  const reduced = useReducedMotion();
  speedRef.current = speed;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    const streaks: Streak[] = [];

    const spawn = (s: Streak, anywhere = false) => {
      s.y = Math.random() * h;
      s.w = 0.6 + Math.random() * 1.8;
      s.a = 0.18 + Math.random() * 0.5;
      s.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      s.x = anywhere ? Math.random() * w : -Math.random() * w * 0.6;
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, w / 14));
      while (streaks.length < n) {
        const s = {} as Streak;
        spawn(s, true);
        streaks.push(s);
      }
      streaks.length = n;
    };
    const frame = (now: number) => {
      const dt = Math.min(48, now - last) / 16.67;
      last = now;
      const k = speedRef.current / BASE_SPEED;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      for (const s of streaks) {
        const len = (140 + 460 * k) * (0.5 + s.w * 0.5);
        s.x += (5 + 15 * k) * dt * (0.6 + s.w * 0.4);
        const grad = ctx.createLinearGradient(s.x - len, 0, s.x, 0);
        grad.addColorStop(0, 'rgb(0 0 0 / 0)');
        grad.addColorStop(1, s.color);
        ctx.strokeStyle = grad;
        ctx.globalAlpha = s.a;
        ctx.lineWidth = s.w;
        ctx.beginPath();
        ctx.moveTo(s.x - len, s.y);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        if (s.x - len > w) spawn(s);
      }
    };
    const loop = (now: number) => {
      frame(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf || reduced || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    if (reduced) frame(performance.now());
    else start();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) frame(performance.now());
    });
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  return <canvas ref={ref} className="hero__streaks" aria-hidden="true" />;
}
