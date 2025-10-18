'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import {
  Map,
  ArrowLeft,
} from 'lucide-react';

import { useTexts } from '@/helpers/use-texts';
import ApiVeloxService from '@/providers/api-velox.provider';

import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import Button from '@/components/ui/button/button';
import { SaveRouteDto } from '@/interfaces/routes.interface';
import RouteCard from '@/components/route-card/route-card';

export default function SavedRoutesPage() {
  useProtectedRoute()
  const api = useMemo(() => new ApiVeloxService(), []);
  const [routes, setRoutes] = useState<SaveRouteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTexts('savedRoutes');
  const router = useRouter();

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const data = await api.getSavedRoutes();
        setRoutes(data);
      } catch {
        toast.error(t('error'));
      } finally {
        setLoading(false);
      }
    }

    fetchRoutes();
  }, [api, t]);

  if (loading) {
    return <PageTransitionOverlay visible={true} message={t('loading')} />;
  }

  if (routes.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center h-screen bg-background text-center px-6 space-y-6">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 text-copy-lighter hover:text-copy flex items-center gap-2 transition-all duration-300 ease-out p-3 -m-2 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary-light/20 blur-3xl rounded-full"></div>
          <Map size={96} className="text-primary-light relative z-10" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-bold text-white">
            {t('emptyTitle')}
          </h2>
          <p className="text-copy-light max-w-md">
            {t('emptyDescription')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={() => router.push('/calculate')} variant="confirm">
            {t('ctaCreate')}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => router.back()}
            className="text-copy-lighter hover:text-copy flex items-center gap-2 transition-all duration-300 ease-out p-3 -m-2 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-light/10 to-primary/10">
            <Map size={20} className="text-primary-light" />
            <h1 className="text-xl font-bold text-gray-100 tracking-tight">{t('title')}</h1>
          </div>
          
          <div className="w-20"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((route, index) => {
          return (
            <RouteCard
              key={index}
              route={route}
              index={index}
            />
          );
        })}
        </div>
      </div>
    </div>
  );
}
