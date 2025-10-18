'use client';

import { useRouter } from 'next/navigation';
import { Map, PlusCircle, User, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useTexts } from '@/helpers/use-texts';
import { useEffect, useMemo, useState } from 'react';
import ApiVeloxService from '@/providers/api-velox.provider';
import { Athlete } from '@/interfaces/athlete.interface';
import { useStravaAuth } from '@/hooks/use-strava-auth';

type CardConfig = {
  id: string;
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  colorClass: string;
  action: () => void;
  show?: boolean;
};

type FooterButtonConfig = {
  id: string;
  icon: React.ReactNode;
  labelKey: string;
  action: () => void;
  isCenter?: boolean;
  showGlow?: boolean;
};

export default function HomePage() {
  useProtectedRoute()
  const router = useRouter();
  const { t } = useTexts('home');
  const api = useMemo(() => new ApiVeloxService(), []);
  const [userData, setUserData] = useState<Athlete | null>(null);
  const { redirectToStrava, loading: loadingStrava } = useStravaAuth();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await api.getProfile();
        setUserData(profile);
      } catch {
        // ignora erro silenciosamente
      }
    }
    fetchProfile();
  }, [api]);

  const shouldShowStravaButton = userData && !userData.averageSpeedGeneralIsFromStrava;

  const cards: CardConfig[] = [
    {
      id: 'new-route',
      icon: <PlusCircle size={42} className="text-primary-light" strokeWidth={2.5} />,
      titleKey: 'newRoute',
      descKey: 'newRouteDesc',
      colorClass: 'from-primary-light via-primary to-primary-dark hover:from-primary-light hover:via-primary hover:to-primary-dark border-primary-light/30 hover:border-primary-light/50',
      action: () => router.push('/calculate'),
      show: true,
    },
    {
      id: 'saved-routes',
      icon: <Map size={32} className="text-blue-400" strokeWidth={2.5} />,
      titleKey: 'myRoutes',
      descKey: 'myRoutesDesc',
      colorClass: 'from-blue-500/10 via-blue-600/5 to-blue-700/10 hover:from-blue-500/20 hover:via-blue-600/10 hover:to-blue-700/20 border-blue-400/30 hover:border-blue-400/50',
      action: () => router.push('/saved-routes'),
      show: true,
    },
    {
      id: 'profile',
      icon: <User size={32} className="text-purple-400" strokeWidth={2.5} />,
      titleKey: 'profile',
      descKey: 'profileDesc',
      colorClass: 'from-purple-500/10 via-purple-600/5 to-purple-700/10 hover:from-purple-500/20 hover:via-purple-600/10 hover:to-purple-700/20 border-purple-400/30 hover:border-purple-400/50',
      action: () => router.push('/profile'),
      show: true,
    },
    {
      id: 'strava',
      icon: <Flame size={32} className="text-orange-500" strokeWidth={2.5} />,
      titleKey: 'stravaImport.title',
      descKey: 'stravaImport.description',
      colorClass: 'from-orange-500/10 via-orange-600/5 to-orange-700/10 hover:from-orange-500/20 hover:via-orange-600/10 hover:to-orange-700/20 border-orange-400/30 hover:border-orange-400/50',
      action: redirectToStrava,
      show: shouldShowStravaButton || false,
    },
    {
      id: 'coming-soon',
      icon: null,
      titleKey: 'comingSoon',
      descKey: 'comingSoonDesc',
      colorClass: 'bg-none',
      action: () => {},
      show: !shouldShowStravaButton,
    },
  ];

  const visibleCards = cards.filter(card => card.show);

  const footerButtons: FooterButtonConfig[] = [
    {
      id: 'footer-routes',
      icon: <Map size={26} strokeWidth={2} />,
      labelKey: 'footer.routes',
      action: () => router.push('/saved-routes'),
      isCenter: false,
    },
    {
      id: 'footer-create',
      icon: <PlusCircle size={56} className="text-primary-content" strokeWidth={2.5} />,
      labelKey: 'footer.createRoute',
      action: () => router.push('/calculate'),
      isCenter: true,
      showGlow: true,
    },
    {
      id: 'footer-profile',
      icon: <User size={26} strokeWidth={2} />,
      labelKey: 'footer.profile',
      action: () => router.push('/profile'),
      isCenter: false,
    },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="homepage"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col min-h-screen bg-background"
      >
        <div className="flex flex-col min-h-screen bg-background">
          <main className="flex-1 p-4 pb-24">
            <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 pt-4"
              >
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
                  <p className="text-copy-light text-sm mt-1">{t('subtitle')}</p>
                </div>
              </motion.div>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                {visibleCards.map((card, index) => (
                  card.id === 'coming-soon' ? (
                    <div key={card.id} className="bg-gradient-to-br from-[#1a2234] to-[#0f1419] border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                      <div className="text-3xl font-bold text-primary-light">
                        {t(card.titleKey)}
                      </div>
                      <p className="text-copy-light text-xs">{t(card.descKey)}</p>
                    </div>
                  ) : (
                    <button
                      key={card.id}
                      onClick={card.action}
                      disabled={card.id === 'strava' && loadingStrava}
                      className={`group bg-gradient-to-br ${card.colorClass} p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border`}
                    >
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${
                          card.id === 'new-route' ? 'bg-primary-light/20' :
                          card.id === 'saved-routes' ? 'bg-blue-400/20' :
                          card.id === 'profile' ? 'bg-purple-400/20' :
                          'bg-orange-500/20'
                        }`}>
                          {card.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-base">{t(card.titleKey)}</h3>
                          <p className="text-copy-light text-xs mt-1">{t(card.descKey)}</p>
                        </div>
                      </div>
                    </button>
                  )
                ))}
              </motion.section>
            </div>
          </main>

          <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0e1a] via-[#111827] to-[#111827]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
            <div className="flex justify-around items-end px-6 py-3 pb-4 max-w-2xl mx-auto relative">
              {footerButtons.map((btn) => (
                btn.isCenter ? (
                  <button
                    key={btn.id}
                    onClick={btn.action}
                    className="flex flex-col items-center gap-1.5 cursor-pointer -mt-10 transition-all duration-300 ease-out hover:scale-110 active:scale-95 group relative"
                  >
                    {btn.showGlow && (
                      <>
                        <div className="absolute inset-0 bg-primary-light/30 blur-3xl rounded-full group-hover:bg-primary-light/50 transition-all animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-primary-light via-primary to-primary-dark p-1 rounded-[40px] shadow-2xl shadow-primary/50 group-hover:shadow-[0_0_40px_rgba(191,213,114,0.6)] transition-all border-primary-light/30 group-hover:border-primary-light/60">
                          {btn.icon}
                        </div>
                      </>
                    )}
                    <span className="text-s font-bold text-white mt-1 drop-shadow-sm">{t(btn.labelKey)}</span>
                  </button>
                ) : (
                  <button
                    key={btn.id}
                    onClick={btn.action}
                    className="flex flex-col items-center gap-1.5 cursor-pointer text-gray-400 transition-all duration-300 ease-out hover:text-primary-light active:scale-95 rounded-xl p-3 hover:bg-primary-light/10 group"
                  >
                    <span className="group-hover:scale-110 transition-transform flex items-center">
                      {btn.icon}
                    </span>
                    <span className="text-xs font-semibold">{t(btn.labelKey)}</span>
                  </button>
                )
              ))}
            </div>
          </footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
