'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import polyline from '@mapbox/polyline';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import {
  Map,
  TrendingUp,
  TrendingDown,
  TimerIcon,
  RouteIcon,
  GaugeIcon,
  ArrowLeft,
  Flame,
  MapPin,
} from 'lucide-react';

import { useTexts } from '@/helpers/use-texts';
import { getModalityLabel } from '@/helpers/modality.helper';
import ApiVeloxService from '@/providers/api-velox.provider';

import Loader from '@/components/ui/loader/loader';
import GoogleMiniMap from '@/components/mini-map/google-mini-map';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import Button from '@/components/ui/button/button';
import { SaveRouteDto } from '@/interfaces/routes.interface';

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
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Loader size={48} />
        <p className="text-copy mt-4">{t('loading')}</p>
      </div>
    );
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
          const decoded = polyline.decode(route.polyline) as [number, number][];
  
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-[#1a2234] to-[#0f1419] rounded-2xl border border-copy/10 shadow-xl hover:shadow-2xl hover:border-primary-light/20 transition-all duration-300 overflow-hidden group"
            >
              <div className="relative overflow-hidden rounded-t-2xl">
                <GoogleMiniMap polyline={decoded} />
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                  <span className="text-xs font-semibold text-primary-light">
                    {getModalityLabel(route.modality)}: {route.averageSpeedUsed} km/h
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-primary-light flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-base leading-tight">
                      {route.origin}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-px flex-1 bg-gradient-to-r from-primary-light/50 to-transparent"></div>
                      <span className="text-xs text-copy/60">para</span>
                      <div className="h-px flex-1 bg-gradient-to-l from-primary-light/50 to-transparent"></div>
                    </div>
                    <p className="text-gray-300 font-medium text-base leading-tight mt-1">
                      {route.destination}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 bg-primary-light/5 border border-primary-light/10 rounded-lg p-2.5 group-hover:border-primary-light/20 transition-colors">
                    <RouteIcon size={16} className="text-primary-light" />
                    <span className="text-sm font-semibold text-white">{route.distanceKm.toFixed(1)} km</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-primary-light/5 border border-primary-light/10 rounded-lg p-2.5 group-hover:border-primary-light/20 transition-colors">
                    <TimerIcon size={16} className="text-primary-light" />
                    <span className="text-sm font-semibold text-white">
                      {Math.floor(route.estimatedTimeMinutes / 60)}h {route.estimatedTimeMinutes % 60}min
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-green-500/5 border border-green-500/10 rounded-lg p-2.5">
                    <TrendingUp size={16} className="text-green-400" />
                    <span className="text-sm font-semibold text-gray-200">+{route.elevationGain}m</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/10 rounded-lg p-2.5">
                    <TrendingDown size={16} className="text-red-400" />
                    <span className="text-sm font-semibold text-gray-200">-{route.elevationLoss}m</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-blue-500/5 border border-blue-500/10 rounded-lg p-2.5">
                    <GaugeIcon size={16} className="text-blue-400" />
                    <span className="text-sm font-semibold text-gray-200">{route.averageSpeedUsed} km/h</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-orange-500/5 border border-orange-500/10 rounded-lg p-2.5">
                    <Flame size={16} className="text-orange-400" />
                    <span className="text-sm font-semibold text-gray-200">{route.estimatedCalories} kcal</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
