'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Saira_Condensed, Albert_Sans, JetBrains_Mono } from 'next/font/google';
import { MapPin, Navigation } from 'lucide-react';
import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay';
import LanguageSelector from '@/components/language-selector/language-selector';
import HeroTimes from '@/components/landing/hero-times';
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

const PAINS = ['prediction', 'time', 'bike'];
const FEATURES = ['prediction', 'modality', 'strava', 'elevation'];
const MODES = ['road', 'mtb', 'general'];

// valores de exemplo do mock; o print do planner redesenhado substitui o slot inteiro
const SAMPLE = { time: '1h20', distanceKm: 30, speedKmh: 22.5, gain: 200, loss: 180, kcal: 640 };
const SAMPLE_PROFILE =
  '0,90 10,86.5 20,80.8 30,74.2 40,77.3 50,71.5 60,63.2 70,53.5 80,45.2 90,48.3 100,39.9 110,32.5 120,25 130,28.5 140,20.2 150,14 160,18 170,24.1 180,29.4 190,25.9 200,33.3 210,40.8 220,46.9 230,52.2 240,57.1 250,63.2 260,68 270,73.7 280,77.7 290,80.3 300,81.2';

// exemplo coerente com o back: tempo = distância ÷ média (22,5 km/h) e rótulos pelos mesmos limites
const SAMPLE_ROUTES = [
  {
    name: 'routeSelector.labels.recommended',
    summary: 'calculate.fastestRoute',
    km: 30,
    climb: 200,
    minutes: 80,
  },
  {
    name: 'routeSelector.labels.alternative',
    n: 1,
    summary: 'landing.routes.lessClimbing',
    km: 32,
    climb: 150,
    minutes: 85,
  },
  {
    name: 'routeSelector.labels.alternative',
    n: 2,
    summary: 'landing.routes.longer',
    km: 34,
    climb: 230,
    minutes: 91,
  },
];
const WEATHER_RULES = [
  ['humidity', 'rainRule'],
  ['temperature', 'temperatureRule'],
  ['wind', 'windRule'],
];
const TRAFFIC_LEVELS = ['normal', 'intense', 'congested'];

export default function LandingPage() {
  const { t } = useTexts('landing');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
  const [loading, setLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    setShowTransition(true);
    setLoading(true);
    setTimeout(() => {
      router.push('/register');
    }, 600);
  };

  const label = (key: string) => tApp(key).replace(/:$/, '');
  const speed = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en').format(SAMPLE.speedKmh);

  return (
    <>
      <PageTransitionOverlay visible={showTransition} />
      <div className={`landing ${saira.variable} ${albert.variable} ${jetbrains.variable}`}>
        <header className="nav">
          <div className="container nav__bar">
            <Link href="/" className="nav__home">
              <Image src="/svg/velox-logo.svg" alt="Velox" width={48} height={33} priority />
            </Link>
            <div className="nav__end">
              <div className="lang nav__lang">
                <LanguageSelector />
              </div>
              <button type="button" className="nav__link" onClick={handleStart} disabled={loading}>
                {t('cta.button')}
              </button>
            </div>
          </div>
        </header>

        <main>
          <section className="hero">
            <figure className="hero__photo">
              <Image src="/images/hero-bike.jpg" alt="" fill priority sizes="100vw" />
            </figure>
            <div className="container hero__grid">
              <div className="hero__type">
                <h1>
                  {t('hero.title1')}
                  <br />
                  {t('hero.title2')}
                </h1>
                <p className="lead">{t('hero.subtitle')}</p>
                <div className="hero__actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={handleStart}
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {t('hero.cta')}
                  </button>
                  <a href="#produto" className="btn btn--line">
                    {t('hero.secondary')}
                  </a>
                </div>
              </div>
              <HeroTimes />
            </div>
          </section>

          <section className="pains">
            <div className="container">
              <h2>
                {t('problem.title')} {t('problem.titleHighlight')}
              </h2>
              <ul className="rows">
                {PAINS.map((key) => (
                  <li key={key} className="rows__item">
                    <h3>{t(`problem.cards.${key}.title`)}</h3>
                    <p>{t(`problem.cards.${key}.desc`)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="product" id="produto">
            <div className="container">
              <div className="product__head">
                <h2>
                  {t('solution.title')} {t('solution.titleHighlight')}
                </h2>
                <div className="product__aside">
                  <p className="lead">{t('solution.subtitle')}</p>
                  <p className="product__note">{t('solution.validation')}</p>
                </div>
              </div>

              <figure
                className="result"
                data-slot="produto"
                data-kind="product"
                data-alt="Tela de resultado do planner redesenhado: modalidade, rota, tempo estimado, distância, altimetria e calorias"
              >
                <div className="result__modes">
                  {MODES.map((mode, i) => (
                    <span key={mode} className={i === 0 ? 'result__mode is-on' : 'result__mode'}>
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
                    <svg
                      viewBox="0 0 300 100"
                      preserveAspectRatio="none"
                      role="img"
                      aria-label={tApp('elevationProfile.title')}
                    >
                      <polygon points={`0,100 ${SAMPLE_PROFILE} 300,100`} />
                      <polyline points={SAMPLE_PROFILE} />
                    </svg>
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
                      <span>{SAMPLE.time}</span>
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

              <ul className="features__grid">
                {FEATURES.map((key) => (
                  <li key={key} className="features__cell">
                    <h3>{t(`features.${key}.title`)}</h3>
                    <p>{t(`features.${key}.desc`)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="routes">
            <div className="container">
              <div className="routes__head">
                <h2>{t('routes.title')}</h2>
                <p className="lead">{t('routes.lead')}</p>
              </div>
              <table className="routes__table">
                <caption>{t('routes.caption')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('routes.colRoute')}</th>
                    <th scope="col">{t('routes.colDistance')}</th>
                    <th scope="col">{t('routes.colClimb')}</th>
                    <th scope="col">{t('routes.colTime')}</th>
                    <th scope="col">{t('routes.colDiff')}</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_ROUTES.map((route, i) => (
                    <tr key={route.km} className={i === 0 ? 'is-main' : undefined}>
                      <th scope="row">
                        <span className="routes__name">
                          {tApp(route.name)}
                          {route.n ? ` ${route.n}` : ''}
                        </span>
                        <span className="routes__summary">{tApp(route.summary)}</span>
                      </th>
                      <td data-label={t('routes.colDistance')}>{route.km} km</td>
                      <td data-label={t('routes.colClimb')}>{route.climb} m</td>
                      <td data-label={t('routes.colTime')}>
                        <span className="routes__time">{hm(route.minutes)}</span>
                      </td>
                      <td data-label={t('routes.colDiff')}>
                        {i > 0 && `+${route.minutes - SAMPLE_ROUTES[0].minutes} min`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="conditions">
            <div className="container">
              <h2>{t('conditions.title')}</h2>
              <p className="lead">{t('conditions.lead')}</p>
              <div className="conditions__grid">
                <div>
                  <h3>{t('conditions.weatherTitle')}</h3>
                  <dl className="conditions__list">
                    {WEATHER_RULES.map(([labelKey, ruleKey]) => (
                      <div key={labelKey}>
                        <dt>{tApp(`calculate.weather.${labelKey}`)}</dt>
                        <dd>{t(`conditions.${ruleKey}`)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <h3>{t('conditions.trafficTitle')}</h3>
                  <dl className="conditions__list">
                    {TRAFFIC_LEVELS.map((level) => (
                      <div key={level}>
                        <dt>{tApp(`calculate.traffic.severity.${level}`)}</dt>
                        <dd>{t(`conditions.${level}Rule`)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </section>

          <section className="close">
            <div
              className="close__photo"
              data-slot="fechamento"
              data-alt="Ciclista de estrada em velocidade, de dia"
            >
              <Image src="/images/cta-bike.jpg" alt="Ciclista em movimento" fill sizes="100vw" />
            </div>
            <div className="close__over">
              <div className="container">
                <h2>{t('cta.title')}</h2>
                <p className="lead">{t('cta.subtitle')}</p>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleStart}
                  disabled={loading}
                >
                  {t('cta.button')}
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer className="foot">
          <div className="container foot__inner">
            <Image src="/svg/velox-logo.svg" alt="Velox" width={176} height={120} />
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
    </>
  );
}
