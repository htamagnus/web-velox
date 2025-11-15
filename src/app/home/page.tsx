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
import HomeCards, { CardConfig } from '@/components/home/home-cards';
import HomeFooter, { FooterButtonConfig } from '@/components/home/home-footer';
import LanguageSelector from '@/components/language-selector/language-selector';

export default function HomePage() {
  useProtectedRoute()
  const router = useRouter();
  const { t } = useTexts('home');
  const api = useMemo(() => new ApiVeloxService(), []);
  const [userData, setUserData] = useState<Athlete | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { redirectToStrava, loading: loadingStrava } = useStravaAuth();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await api.getProfile();
        setUserData(profile);
      } catch {
        // ignora erro silenciosamente
      } finally {
        setIsReady(true);
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
                className="flex items-start gap-3 pt-4"
              >
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
                  <p className="text-copy-light text-sm mt-1">{t('subtitle')}</p>
                </div>
                <LanguageSelector />
              </motion.div>

              {isReady && <HomeCards cards={cards} loadingStrava={loadingStrava} />}
            </div>
          </main>

          <HomeFooter buttons={footerButtons} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
