'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import polyline from '@mapbox/polyline';
import { toast } from 'sonner';

import {
  Map,
  TrendingUp,
  TrendingDown,
  TimerIcon,
  RouteIcon,
  BikeIcon,
  GaugeIcon,
  ArrowLeft,
  Flame,
} from 'lucide-react';

import { useTexts } from '@/helpers/use-texts';
import { getModalityLabel } from '@/helpers/modality.helper';
import ApiVeloxService from '@/providers/api-velox.provider';

import Loader from '@/components/ui/loader/loader';
import GoogleMiniMap from '@/components/mini-map/google-mini-map';
import { useProtectedRoute } from '@/hooks/use-protected-route';

export default function SavedRoutesPage() {
  useProtectedRoute()
  const api = new ApiVeloxService();
  const [routes, setRoutes] = useState<SaveRouteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTexts('savedRoutes');
  const tPage = useTexts('savedRoutesPage').t;
  const router = useRouter();

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const data = await api.getSavedRoutes();
        setRoutes(data);
      } catch (error) {
        toast.error(t('error'));
      } finally {
        setLoading(false);
      }
    }

    fetchRoutes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6 space-y-6">
        <Map size={96} stroke="#bfd572" className="mb-4" />
        <h2 className="text-2xl font-semibold text-white">
          {t('emptyTitle') || 'Você ainda não criou nenhuma rota'}
        </h2>
        <p className="text-copy-light">
          {t('emptyDescription') || 'Que tal começar agora e planejar seu próximo percurso?'}
        </p>
        <button
          onClick={() => router.push('/calculate')}
          className="bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-content font-semibold py-3 px-8 rounded-xl transition-all duration-300 ease-out shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] hover:brightness-105"
        >
          {t('ctaCreate') || 'Criar rota'}
        </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {routes.map((route, index) => {
          const decoded = polyline.decode(route.polyline) as [number, number][];
          const iconProps = { size: 16, stroke: '#bfd572' };
  
          const routeInfoItems = [
            {
              icon: <TimerIcon {...iconProps} />,
              label: `${Math.floor(route.estimatedTimeMinutes / 60)}h ${route.estimatedTimeMinutes % 60}min`,
            },
            {
              icon: <RouteIcon {...iconProps} />,
              label: `${route.distanceKm.toFixed(1)} km`,
            },
            {
              icon: <TrendingUp {...iconProps} />,
              label: `+${route.elevationGain} m`,
            },
            {
              icon: <TrendingDown {...iconProps} />,
              label: `-${route.elevationLoss} m`,
            },
            {
              icon: <BikeIcon {...iconProps} />,
              label: `${t('modalityLabel')} ${getModalityLabel(route.modality)}`,
            },
            {
              icon: <GaugeIcon {...iconProps} />,
              label: `${t('averageSpeed')} ${route.averageSpeedUsed} km/h`,
            },
            {
              icon: <Flame {...iconProps} />,
              label: `${route.estimatedCalories} kcal`,
            },
          ];
  
          return (
            <div
              key={index}
              className="shadow-lg p-4 bg-white/5 backdrop-blur-md rounded-2xl space-y-2"
            >
              <GoogleMiniMap polyline={decoded} />
  
              <div className="p-4 space-y-2">
                <div className="text-copy text-lg">
                  {tPage('routeFrom')} {route.origin} para {route.destination}
                </div>
  
                <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                  {routeInfoItems.map(({ icon, label }, i) => (
                    <div key={i} className="flex items-center gap-2 text-copy-light">
                      {icon} {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
