'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Archivo } from 'next/font/google';
import { motion, MotionConfig } from 'framer-motion';
import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay';
import LanguageSelector from '@/components/language-selector/language-selector';
import HeroPoster from '@/components/landing/hero-poster';
import { EASE } from '@/components/landing/reveal';
import SpeedField from '@/components/landing/speed-field';
import Ticker from '@/components/landing/ticker';
import Pains from '@/components/landing/pains';
import Race from '@/components/landing/race';
import Product from '@/components/landing/product';
import Routes from '@/components/landing/routes';
import Conditions from '@/components/landing/conditions';
import Close from '@/components/landing/close';
import { MODES, type Mode } from '@/components/landing/modes';
import { useTexts } from '@/helpers/use-texts';

// uma família variável com eixo de largura: condensada nos títulos, expandida nas legendas
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo' });

export default function LandingPage() {
  const { t } = useTexts('landing');
  const [loading, setLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [mode, setMode] = useState<Mode>(MODES[0]);
  const router = useRouter();

  const handleStart = () => {
    setShowTransition(true);
    setLoading(true);
    setTimeout(() => {
      router.push('/register');
    }, 600);
  };

  // o farol: a posição do mouse vira --mx/--my e o scrim abre em volta dela
  const spotlight = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <>
      <PageTransitionOverlay visible={showTransition} />
      <MotionConfig reducedMotion="user">
        <div className={`landing ${archivo.variable}`}>
          <motion.header
            className="nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            <div className="container nav__bar">
              <div className="nav__end">
                <div className="lang nav__lang">
                  <LanguageSelector />
                </div>
                <button
                  type="button"
                  className="nav__link"
                  onClick={handleStart}
                  disabled={loading}
                >
                  {t('cta.button')}
                </button>
              </div>
            </div>
          </motion.header>

          <main>
            <section className="hero grain" onPointerMove={spotlight}>
              <figure className="hero__photo">
                <Image src="/images/hero-bike.jpg" alt="" fill priority sizes="100vw" />
              </figure>
              <SpeedField speed={mode.speed} />
              <div className="hero__lines" aria-hidden="true" />
              <HeroPoster mode={mode} onChange={setMode} />
            </section>

            <Ticker />

            <Pains />

            <Race mode={mode} />

            <Product mode={mode} onChange={setMode} />

            <Routes mode={mode} onChange={setMode} />

            <Conditions />

            <Close mode={mode} onStart={handleStart} loading={loading} />

            <Ticker />
          </main>

          <footer className="foot">
            <div className="container foot__inner">
              <Image src="/svg/velox-logo.svg" alt="Velox" width={64} height={44} />
              <div className="foot__end">
                <p className="foot__note">{t('footer.install')}</p>
                <div className="lang">
                  <LanguageSelector />
                </div>
                <p className="foot__legal">© 2026 Velox</p>
              </div>
            </div>
          </footer>
        </div>
      </MotionConfig>
    </>
  );
}
