'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import polyline from '@mapbox/polyline';
import { Trash2 } from 'lucide-react';

import { useTexts } from '@/helpers/use-texts';
import { useLocale } from '@/contexts/locale-context';
import GoogleRouteMap from '@/components/map/google-route-map';
import { useAppData } from '@/components/app/app-shell';
import { ITEM, SPRING, STAGGER } from '@/components/app/motion';
import Sheet, { useWide } from '@/components/app/sheet';
import RouteCard from '@/components/app/route-card';
import Skeleton from '@/components/app/skeleton';

// as rotas no mesmo mapa do planejador: a lista na folha, a escolhida desenhada atrás
export default function SavedRoutesPage() {
  const { t } = useTexts('savedRoutes');
  const { locale } = useLocale();
  const { api, routes, setRoutes } = useAppData();
  const wide = useWide();
  const [selected, setSelected] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // a home manda ?r= com a rota clicada; a ordem das duas listas é a mesma (mais nova primeiro)
  const loaded = routes !== null;
  useEffect(() => {
    const r = Number(new URLSearchParams(window.location.search).get('r'));
    if (loaded && r > 0) setSelected(r);
  }, [loaded]);

  const shown = useMemo(() => {
    const route = routes?.[selected];
    if (!route) return null;
    const path = polyline.decode(route.polyline) as [number, number][];
    return { route: { ...route, polyline: path }, origin: path[0], destination: path[path.length - 1] };
  }, [routes, selected]);

  const select = (i: number) => {
    setSelected(i);
    setConfirming(false);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      await api.deleteSavedRoute(id);
      setSelected((prev) => Math.max(0, Math.min(prev, (routes?.length ?? 1) - 2)));
      setRoutes((prev) => prev && prev.filter((route) => route.id !== id));
      setConfirming(false);
      toast.success(t('deleted'));
    } catch {
      toast.error(t('deleteError'));
    } finally {
      setDeleting(false);
    }
  };

  const fmtInt = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 0 });
  const fmtDate = new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en', { day: 'numeric', month: 'short' });
  const km = fmtInt.format((routes ?? []).reduce((sum, r) => sum + r.distanceKm, 0));

  return (
    <div className="mapview">
      <GoogleRouteMap
        className="mapview__map"
        origin={shown?.origin ?? null}
        destination={shown?.destination ?? null}
        routes={shown ? [shown.route] : []}
        selectedRouteIndex={0}
        onRouteSelect={() => {}}
        panel={wide ? 'side' : 'bottom'}
      />

      <Sheet expandable={Boolean(routes?.length)}>
        {!routes ? (
          <Skeleton rows={3} hero={false} />
        ) : (
          <div className="archive">
            <header className="archive__head">
              <h1 className="drawer__title">{t('title')}</h1>
              {routes.length > 0 && (
                <p className="archive__sum num">
                  <span className="chip">{routes.length === 1 ? t('countOne') : t('count').replace('{{count}}', String(routes.length))}</span>
                  <span className="chip">{t('planned').replace('{{km}}', km)}</span>
                </p>
              )}
            </header>

            {routes.length === 0 ? (
              <div className="card empty">
                <svg className="empty__art" viewBox="0 0 120 60" aria-hidden="true">
                  <motion.path
                    d="M8 50 C 30 50, 30 12, 56 14 S 88 46, 112 10"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], repeat: Infinity, repeatType: 'reverse', repeatDelay: 0.6 }}
                  />
                  <circle cx="8" cy="50" r="4" />
                  <circle cx="112" cy="10" r="5" className="is-end" />
                </svg>
                <h2>{t('emptyTitle')}</h2>
                <p>{t('emptyDescription')}</p>
                <Link href="/calculate" className="btn btn--primary">
                  {t('ctaCreate')}
                </Link>
              </div>
            ) : (
              <motion.ol className="archive__list" variants={STAGGER} initial="hidden" animate="show">
                <AnimatePresence initial={false}>
                  {routes.map((route, i) => (
                    <motion.li
                      key={route.id ?? i}
                      layout
                      variants={ITEM}
                      exit={{ opacity: 0, x: -48, transition: { duration: 0.25 } }}
                      className="card archive__item"
                      data-active={i === selected || undefined}
                    >
                      <motion.button
                        type="button"
                        className="rcard rcard--row"
                        aria-pressed={i === selected}
                        onClick={() => select(i)}
                        whileTap={{ scale: 0.98 }}
                        transition={SPRING}
                      >
                        <RouteCard route={route} delay={Math.min(i, 6) * 0.08} />
                        {route.createdAt && <span className="rcard__date num">{fmtDate.format(new Date(route.createdAt))}</span>}
                      </motion.button>

                      {/* excluir só aparece na rota escolhida, e pede um segundo toque antes de apagar */}
                      <AnimatePresence initial={false}>
                        {i === selected && route.id && (
                          <motion.div
                            className="archive__actions"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={SPRING}
                          >
                            <div className="archive__actions-row">
                              {confirming ? (
                                <>
                                  <span>{t('confirmDelete')}</span>
                                  <button type="button" className="archive__action" onClick={() => setConfirming(false)}>
                                    {t('cancel')}
                                  </button>
                                  <button
                                    type="button"
                                    className="archive__action archive__action--danger"
                                    onClick={() => handleDelete(route.id!)}
                                    disabled={deleting}
                                    aria-busy={deleting}
                                  >
                                    {t('confirm')}
                                  </button>
                                </>
                              ) : (
                                <button type="button" className="archive__action" onClick={() => setConfirming(true)}>
                                  <Trash2 size={16} aria-hidden="true" />
                                  {t('delete')}
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ol>
            )}
          </div>
        )}
      </Sheet>
    </div>
  );
}
