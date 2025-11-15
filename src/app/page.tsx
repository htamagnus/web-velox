'use client';

import LogoVelox from '@/components/ui/logo-velox/logo-velox';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay';
import {
  Bike,
  LineChart,
  Flame,
  MountainSnow,
  ArrowRight,
  CheckCheck,
  ClockAlert,
} from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Button from '@/components/ui/button/button';
import LanguageSelector from '@/components/language-selector/language-selector';
import { useTexts } from '@/helpers/use-texts';

export default function LandingPage() {
  const { t } = useTexts('landing');
  const [isPageReady, setIsPageReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const router = useRouter();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsPageReady(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const offsetX = (e.clientX / window.innerWidth - 0.5) * 20;
    const offsetY = (e.clientY / window.innerHeight - 0.5) * 20;
    x.set(offsetX);
    y.set(offsetY);
  }, [x, y]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const springX = useSpring(x, { stiffness: 50, damping: 10 });
  const springY = useSpring(y, { stiffness: 50, damping: 10 });

  const handleStart = () => {
    setShowTransition(true);
    setLoading(true);
    setTimeout(() => {
      router.push('/register');
    }, 600);
  };

  if (!isPageReady) {
    return <PageTransitionOverlay visible={true} />;
  }

  return (
    <>
      <PageTransitionOverlay visible={showTransition} />
      <main className="min-h-screen bg-background flex flex-col items-center justify-start">
        <div className="absolute top-4 right-4 z-50">
          <LanguageSelector />
        </div>
        
        {/* HERO */}
        <section className="relative w-full min-h-[80vh] flex items-center justify-center text-center text-foreground">
          {/* BACKGROUND IMAGE */}
          {/* <div className="absolute inset-0 z-0">
      <motion.img
      src="/images/hero-bike.jpg"
      alt="Ciclista em movimento"
      initial={{ scale: 1 }}
      animate={{ scale: 1.00 }}
      transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
      className="w-full h-full object-cover opacity-60"
    />

        <div className="absolute inset-0 bg-background/80" />
      </div> */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.img
              src="/images/hero-bike.jpg"
              alt="Ciclista em movimento"
              style={{
                x: springX,
                y: springY,
                scale: 1.05,
              }}
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              transition={{
                duration: 20,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'mirror',
              }}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-background/80" />
          </div>

          {/* HERO CONTENT */}
          <div className="relative z-10 flex flex-col items-center space-y-6 max-w-3xl px-4">
            <LogoVelox className="mb-6" size="lg" />

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-3xl md:text-6xl font-bold leading-tight text-copy"
            >
              {t('hero.title1')}
              <br />
              {t('hero.title2')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-lg md:text-xl max-w-2xl text-copy-light"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={handleStart}
                disabled={loading}
                loading={loading}
                variant="confirm"
                className="mt-4"
              >
                <span className="flex items-center justify-center gap-3">
                  {t('hero.cta')} <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-16 px-6 bg-gradient-to-b from-red-900/20 via-background via-emerald-900/10 to-background backdrop-blur-md">
          <div className="mx-auto flex flex-col items-center text-center space-y-24">
            {/* BLOCO PROBLEMA */}
            <div className="w-full flex flex-col items-center space-y-6">
              <ClockAlert className="w-10 h-10 text-red-400 mx-auto" />
              <motion.h2 className="text-3xl md:text-4xl font-bold text-copy">
                {t('problem.title')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 animate-pulse">
                  {' '}
                  {t('problem.titleHighlight')}{' '}
                </span>
              </motion.h2>
              <motion.div className="flex gap-6 items-center text-4xl md:text-5xl font-bold leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 animate-pulse align-middle">
                  {t('problem.timeExample')}
                </span>
                <ArrowRight className="w-7 h-7 text-copy-light translate-y-[2px]" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary-dark)] animate-pulse align-middle">
                  {t('problem.timeReal')}
                </span>
              </motion.div>
              <motion.p className="text-lg text-copy-lighter">
                {t('problem.description1')}
                <br />
                {t('problem.description2')} <span className="text-copy">{t('problem.description3')}</span>
              </motion.p>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 max-w-6xl w-full px-4 mx-auto">
                {[
                  {
                    icon: LineChart,
                    titleKey: 'problem.cards.prediction.title',
                    descKey: 'problem.cards.prediction.desc',
                  },
                  {
                    icon: ClockAlert,
                    titleKey: 'problem.cards.time.title',
                    descKey: 'problem.cards.time.desc',
                  },
                  {
                    icon: Bike,
                    titleKey: 'problem.cards.bike.title',
                    descKey: 'problem.cards.bike.desc',
                  },
                ].map((feature) => (
                  <motion.div
                    key={feature.titleKey}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 120 }}
                    viewport={{ once: true }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,255,150,0.05)] transition-all flex flex-col gap-2 text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <feature.icon className="w-6 h-6 text-red-400" />
                      <h3 className="text-xl font-bold text-copy">{t(feature.titleKey)}</h3>
                    </div>
                    <p className="text-copy-light">{t(feature.descKey)}</p>
                  </motion.div>
                ))}
              </section>
            </div>

            {/* BLOCO SOLUÇÃO */}
            <div className="w-full flex flex-col items-center space-y-6">
              <Flame className="w-10 h-10 text-primary-dark mx-auto" />
              <motion.h2 className="text-3xl md:text-4xl font-bold text-copy">
                {t('solution.title')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary-dark)] animate-pulse">
                  {t('solution.titleHighlight')}
                </span>
              </motion.h2>
              <motion.p className="text-muted-foreground text-lg text-copy-light">
                {t('solution.subtitle')}
              </motion.p>
              <div className="flex items-center gap-2 text-sm text-copy-lighter">
                <CheckCheck className="w-5 h-5 text-primary" />
                {t('solution.validation')}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 max-w-4xl px-6 mx-auto">
          {[
            {
              icon: LineChart,
              titleKey: 'features.prediction.title',
              descKey: 'features.prediction.desc',
            },
            {
              icon: Bike,
              titleKey: 'features.modality.title',
              descKey: 'features.modality.desc',
            },
            {
              icon: Flame,
              titleKey: 'features.strava.title',
              descKey: 'features.strava.desc',
            },
            {
              icon: MountainSnow,
              titleKey: 'features.elevation.title',
              descKey: 'features.elevation.desc',
            },
          ].map((feature) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, rotate: 0.2 }}
              transition={{ type: 'spring', stiffness: 120 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,255,150,0.05)] transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <feature.icon className="w-6 h-6" stroke="var(--primary)" />
                <h3 className="text-xl font-bold text-copy">{t(feature.titleKey)}</h3>
              </div>
              <p className="text-copy-light">{t(feature.descKey)}</p>
            </motion.div>
          ))}
        </section>

        <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center text-center text-foreground overflow-hidden pt-23">
          {/* BACKGROUND IMAGE */}
          <div className="absolute inset-0 z-0 overflow-hidden pt-20">
            <motion.img
              src="/images/cta-bike.jpg"
              alt="Ciclista em movimento"
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              transition={{
                duration: 20,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'mirror',
              }}
              className="w-full h-full object-cover object-[50%_30%] opacity-20 grayscale"
            />
            <div className="absolute inset-0 bg-background/80" />
          </div>

          {/* CTA CONTENT */}
          <div className="relative z-10 flex flex-col items-center space-y-6 max-w-2xl px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--copy)] to-[var(--primary-dark)] text-transparent bg-clip-text"
            >
              {t('cta.title')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl text-muted-foreground text-copy-light"
            >
              {t('cta.subtitle')}
            </motion.p>

            <motion.div
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button onClick={handleStart} variant="confirm" className="mt-4">
                <span className="flex items-center justify-center gap-3">
                  {t('cta.button')} <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </motion.div>
            <LogoVelox className="mt-10" size="md" />
          </div>
        </section>
      </main>
    </>
  );
}
