'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { motion, MotionConfig } from 'framer-motion';
import polyline from '@mapbox/polyline';
import { ArrowLeft } from 'lucide-react';

import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import { hm } from '@/helpers/format-minutes';
import { trace } from '@/helpers/trace';
import ApiVeloxService from '@/providers/api-velox.provider';
import { SaveRouteDto } from '@/interfaces/routes.interface';
import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay';
import LanguageSelector from '@/components/language-selector/language-selector';
import GoogleRouteMap from '@/components/map/google-route-map';
import { EASE } from '@/components/landing/reveal';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { archivo } from '../fonts';

// o arquivo no mesmo mapa noturno do planejador: a lista no lugar do formulário, a rota escolhida desenhada ao lado
export default function SavedRoutesPage() {
  useProtectedRoute();
  const api = useMemo(() => new ApiVeloxService(), []);
  const { t } = useTexts('savedRoutes');
  const { t: tApp } = useTexts();
  const { locale } = useLocale();
  const [routes, setRoutes] = useState<SaveRouteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    async function fetchRoutes() {
      try {
        setRoutes(await api.getSavedRoutes());
      } catch {
        toast.error(t('error'));
      } finally {
        setLoading(false);
      }
    }

    fetchRoutes();
  }, [api, t]);

  const shown = useMemo(() => {
    const route = routes[selected];
    if (!route) return null;
    const path = polyline.decode(route.polyline) as [number, number][];
    return { route: { ...route, polyline: path }, origin: path[0], destination: path[path.length - 1] };
  }, [routes, selected]);

  if (loading) {
    return <PageTransitionOverlay visible={true} message={t('loading')} />;
  }

  const fmt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 1 });
  const fmtInt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 0 });
  const km = fmtInt.format(routes.reduce((sum, r) => sum + r.distanceKm, 0));
  const title = routes.length
    ? [
        routes.length === 1 ? t('countOne') : t('count').replace('{{count}}', fmtInt.format(routes.length)),
        t('planned').replace('{{km}}', km),
      ]
    : [t('emptyTitle')];

  return (
    <MotionConfig reducedMotion="user">
      <div className={`landing planner ${archivo.variable}`}>
        <header className="planner__nav">
          <Link href="/home" className="back-link">
            <ArrowLeft size={18} aria-hidden="true" />
            {tApp('plannerPanel.backButton')}
          </Link>
          <div className="lang">
            <LanguageSelector />
          </div>
        </header>

        <div className="planner__map">
          <GoogleRouteMap
            className="planner__canvas"
            origin={shown?.origin ?? null}
            destination={shown?.destination ?? null}
            routes={shown ? [shown.route] : []}
            selectedRouteIndex={0}
            onRouteSelect={() => {}}
          />
          <div className="hero__lines" aria-hidden="true" />
        </div>

        <main className="planner__panel archive">
          <div className="archive__head">
            <motion.p
              className="eyebrow eyebrow--ink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t('title')}
            </motion.p>
            <h1>
              {title.map((line, i) => (
                <span key={i} className="hero__line">
                  <motion.span
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: EASE }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          {routes.length === 0 ? (
            <div className="archive__empty">
              <p>{t('emptyDescription')}</p>
              <Link href="/calculate" className="btn btn--primary btn--big">
                {t('ctaCreate')}
              </Link>
            </div>
          ) : (
            <ol className="archive__list">
              {routes.map((route, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + Math.min(i, 8) * 0.05, ease: EASE }}
                >
                  <button
                    type="button"
                    className="archive__route"
                    aria-pressed={i === selected}
                    onClick={() => setSelected(i)}
                  >
                    {/* o tempo e a média que gerou ele, juntos, como no relógio do planejador */}
                    <span className="archive__figure">
                      <span className="archive__time">{hm(Math.round(route.estimatedTimeMinutes))}</span>
                      <span className="archive__speed num">
                        {fmt.format(route.averageSpeedUsed)} <small>km/h</small>
                      </span>
                      <span className="archive__bike">{tApp(`speedModal.options.${route.modality}.label`)}</span>
                    </span>
                    <span className="archive__text">
                      <span className="archive__ends">
                        {route.origin} <span aria-hidden="true">→</span> {route.destination}
                      </span>
                      <span className="archive__meta num">
                        {fmt.format(route.distanceKm)} km · +{fmtInt.format(route.elevationGain)} m ·{' '}
                        {fmtInt.format(route.estimatedCalories)} kcal
                      </span>
                    </span>
                    <svg className="archive__trace" viewBox="-4 -4 108 108" aria-hidden="true">
                      <polyline points={trace(route.polyline)} />
                    </svg>
                  </button>
                </motion.li>
              ))}
            </ol>
          )}
        </main>
      </div>
    </MotionConfig>
  );
}
