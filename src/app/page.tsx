'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Saira_Condensed, Albert_Sans, JetBrains_Mono } from 'next/font/google';
import { MapPin, Navigation } from 'lucide-react';
import { motion, MotionConfig } from 'framer-motion';
import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay';
import LanguageSelector from '@/components/language-selector/language-selector';
import HeroPoster from '@/components/landing/hero-poster';
import Reveal, { EASE } from '@/components/landing/reveal';
import CountUp from '@/components/landing/count-up';
import SpeedField from '@/components/landing/speed-field';
import Ticker from '@/components/landing/ticker';
import Race from '@/components/landing/race';
import Routes from '@/components/landing/routes';
import Conditions from '@/components/landing/conditions';
import Close from '@/components/landing/close';
import { MODES, minutesFor, type Mode } from '@/components/landing/modes';
import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';

const saira = Saira_Condensed({ weight: '800', subsets: ['latin'], variable: '--font-saira' });
const albert = Albert_Sans({ subsets: ['latin'], variable: '--font-albert' });
const jetbrains = JetBrains_Mono({
  weight: '500',
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

// as figuras saem do exemplo da página: 2h10 contra 1h20 em 30 km
const PAINS = [
  { key: 'prediction', value: 50, prefix: '+' },
  { key: 'time', value: 14 },
  { key: 'bike', value: 3 },
];
const FEATURES = ['prediction', 'modality', 'strava', 'elevation'];
const MOCK_MODES = ['road', 'mtb', 'general'];

// valores de exemplo do mock; o print do planner redesenhado substitui o slot inteiro
const SAMPLE = { distanceKm: 30, speedKmh: 22.5, gain: 200, loss: 180, kcal: 640 };
const SAMPLE_PROFILE =
  '0,90 10,86.5 20,80.8 30,74.2 40,77.3 50,71.5 60,63.2 70,53.5 80,45.2 90,48.3 100,39.9 110,32.5 120,25 130,28.5 140,20.2 150,14 160,18 170,24.1 180,29.4 190,25.9 200,33.3 210,40.8 220,46.9 230,52.2 240,57.1 250,63.2 260,68 270,73.7 280,77.7 290,80.3 300,81.2';

export default function LandingPage() {
  const { t } = useTexts('landing');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
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

  const label = (key: string) => tApp(key).replace(/:$/, '');
  // o farol: a posição do mouse vira --mx/--my e o scrim abre em volta dela
  const spotlight = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  const speed = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en').format(SAMPLE.speedKmh);

  return (
    <>
      <PageTransitionOverlay visible={showTransition} />
      <MotionConfig reducedMotion="user">
        <div className={`landing ${saira.variable} ${albert.variable} ${jetbrains.variable}`}>
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

            <section className="pains">
              <div className="container">
                <Reveal>
                  <h2>
                    {t('problem.title')} {t('problem.titleHighlight')}
                  </h2>
                </Reveal>
                <ul className="pains__sheet">
                  {PAINS.map((pain, i) => (
                    <li key={pain.key} className="pains__cell">
                      <Reveal delay={0.1 + i * 0.12}>
                        <p
                          className={[
                            'pains__figure figure',
                            i === 0 && 'is-plate',
                            i < 2 && 'is-amber',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <CountUp to={pain.value} prefix={pain.prefix} />
                          <span>{t(`problem.cards.${pain.key}.unit`)}</span>
                        </p>
                        <h3>{t(`problem.cards.${pain.key}.title`)}</h3>
                        <p>{t(`problem.cards.${pain.key}.desc`)}</p>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <Race mode={mode} />

            <section className="product grain" id="produto">
              <div className="container">
                <Reveal>
                  <div className="product__head">
                    <h2>
                      {t('solution.title')} {t('solution.titleHighlight')}
                    </h2>
                    <div className="product__aside">
                      <p className="lead">{t('solution.subtitle')}</p>
                      <p className="product__note">{t('solution.validation')}</p>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <figure className="result">
                    <div className="result__modes">
                      {MOCK_MODES.map((mode, i) => (
                        <span
                          key={mode}
                          className={i === 0 ? 'result__mode is-on' : 'result__mode'}
                        >
                          {tApp(`speedModal.options.${mode}.label`)}
                        </span>
                      ))}
                    </div>
                    <div className="result__route">
                      <ul className="result__places">
                        <li>
                          <Navigation size={16} aria-hidden="true" />
                          {tApp('plannerPanel.originPlaceholder')}
                        </li>
                        <li>
                          <MapPin size={16} aria-hidden="true" />
                          {t('mock.destination')}
                        </li>
                      </ul>
                      <div className="result__profile">
                        <p className="result__label">{tApp('elevationProfile.title')}</p>
                        <motion.svg
                          viewBox="0 0 300 100"
                          preserveAspectRatio="none"
                          role="img"
                          aria-label={tApp('elevationProfile.title')}
                          initial={{ clipPath: 'inset(0 100% 0 0)' }}
                          whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                          transition={{ duration: 2.2, ease: EASE }}
                        >
                          <polygon points={`0,100 ${SAMPLE_PROFILE} 300,100`} />
                          <polyline points={SAMPLE_PROFILE} />
                        </motion.svg>
                        <p className="result__axis">
                          <span>0 km</span>
                          <span>{SAMPLE.distanceKm} km</span>
                        </p>
                      </div>
                    </div>
                    <div className="result__read">
                      <div>
                        <p className="result__label">{label('planner.summary.time')}</p>
                        <p className="result__time">
                          <span>
                            <CountUp to={minutesFor(SAMPLE.speedKmh)} format={hm} duration={2.2} />
                          </span>
                        </p>
                        <p className="result__speed">
                          {tApp('planner.summary.averageSpeedInfo').replace('{{speed}}', speed)}
                        </p>
                      </div>
                      <dl className="result__facts">
                        <div>
                          <dt>{label('planner.summary.distance')}</dt>
                          <dd>{SAMPLE.distanceKm} km</dd>
                        </div>
                        <div>
                          <dt>{label('planner.summary.elevationGain')}</dt>
                          <dd>{SAMPLE.gain} m</dd>
                        </div>
                        <div>
                          <dt>{label('planner.summary.elevationLoss')}</dt>
                          <dd>{SAMPLE.loss} m</dd>
                        </div>
                        <div>
                          <dt>{label('planner.summary.calories')}</dt>
                          <dd>{SAMPLE.kcal} kcal</dd>
                        </div>
                      </dl>
                      <div className="result__actions">
                        <span>{tApp('planner.buttons.saveRoute')}</span>
                        <span>{tApp('planner.buttons.newRoute')}</span>
                      </div>
                    </div>
                  </figure>
                </Reveal>

                <Reveal>
                  <ul className="features__grid">
                    {FEATURES.map((key) => (
                      <li key={key} className="features__cell">
                        <h3>{t(`features.${key}.title`)}</h3>
                        <p>{t(`features.${key}.desc`)}</p>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </section>

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
