'use client';

import { useEffect, useState } from 'react';
import ApiVeloxService from '@/providers/api-velox.provider';
import {
  Timer,
  MapPin,
  TrendingUp,
  TrendingDown,
  TimerIcon,
  RouteIcon,
  BikeIcon,
  GaugeIcon,
  ArrowLeft,
  Flame,
} from 'lucide-react';
import Loader from '@/components/ui/loader/loader';
import polyline from '@mapbox/polyline';
import BackButton from '@/components/ui/back-button/back-button';
import { toast } from 'sonner';
import { getModalityLabel } from '@/helpers/modality.helper';
import MiniMap from '@/components/mini-map/mini-map.component';
import { useTexts } from '@/helpers/use-texts';
import Button from '@/components/ui/button/button';

export default function SavedRoutesPage() {
  const api = new ApiVeloxService();
  const [routes, setRoutes] = useState<SaveRouteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTexts('savedRoutes');

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

  // TO DO: aqui criar uma mensagem incentivando a criar uma rota
  if (routes.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-center">{t('empty')}</div>
    );
  }

  return (
    <div className="mx-auto p-6 space-y-4">
      <Button variant="back" aria-label="Voltar">
        <ArrowLeft />
      </Button>
      <h1 className="title-primary">{t('title')}</h1>

      {routes.map((route, index) => {
        const decoded = polyline.decode(route.polyline) as [number, number][];
        return (
          <div
            key={index}
            className="shadow-lg max-w-xl mx-auto p-4 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl space-y-2"
          >
            <MiniMap polyline={decoded} />

            <div className="p-4 space-y-2">
              <div className="text-copy text-lg">
                Percurso de {route.origin} para {route.destination}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                <div className="flex items-center gap-2 text-copy-light">
                  <TimerIcon size={16} stroke="#bfd572" />{' '}
                  {Math.floor(route.estimatedTimeMinutes / 60)}h {route.estimatedTimeMinutes % 60}
                  min
                </div>
                <div className="flex items-center gap-2 text-copy-light">
                  <RouteIcon size={16} stroke="#bfd572" /> {route.distanceKm.toFixed(1)} km
                </div>
                <div className="flex items-center gap-2 text-copy-light">
                  <TrendingUp size={16} stroke="#bfd572" /> +{route.elevationGain} m
                </div>
                <div className="flex items-center gap-2 text-copy-light">
                  <TrendingDown size={16} stroke="#bfd572" /> -{route.elevationLoss} m
                </div>
                <div className="flex items-center gap-2 text-copy-light">
                  <BikeIcon size={16} stroke="#bfd572" />
                  <span>{t('modalityLabel')}</span> {getModalityLabel(route.modality)}
                </div>
                <div className="flex items-center gap-2 text-copy-light">
                  <GaugeIcon size={16} stroke="#bfd572" />
                  <span>{t('averageSpeed')}</span> {route.averageSpeedUsed} km/h
                </div>
                <div className="flex items-center gap-2 text-copy-light">
                  <Flame size={16} stroke="#bfd572" />
                  <span>{t('averageSpeed')}</span> {route.estimatedCalories} kcal
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
