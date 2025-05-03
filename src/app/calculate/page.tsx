'use client';

import { useEffect, useState } from 'react';
import polyline from '@mapbox/polyline';
import ApiVeloxService from '@/providers/api-velox.provider';
import RouteMap from '@/components/map/route-map';
import RoutePlannerPanel from '@/components/planner/route-planner-panel';
import Button from '@/components/ui/button/button';
import { Athlete } from '@/interfaces/athlete.interface';
import { getModalityLabel } from '@/helpers/modality.helper';
import { AnimatePresence, motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  TimerIcon,
  RouteIcon,
  Flame,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProtectedRoute } from '@/hooks/use-protected-route';

type RouteData = GetPlannedRouteResponseDto & {
  decodedPolyline: [number, number][];
};

export default function CalculateRoutePage() {
  useProtectedRoute()
  const api = new ApiVeloxService();

  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [originLabel, setOriginLabel] = useState<string | null>(null);
  const [destinationLabel, setDestinationLabel] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [selectedModality, setSelectedModality] = useState<Modality>('general');
  const [averageSpeed, setAverageSpeed] = useState<number | null>(null);
  const [userData, setUserData] = useState<Athlete | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-28.678, -49.369]);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setMapCenter(coords);
      },
      (err) => {
        toast.info('Não foi possível pegar localização');
      },
    );
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await api.getProfile();
        setUserData(profile);
      } catch (err) {
        toast.error('Erro ao buscar perfil');
      }
    }
    fetchProfile();
  }, []);

  const handleMapClick = (e: { latlng: { lat: number; lng: number } }) => {
    const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
    if (!origin) {
      setOrigin(coords);
      setOriginLabel(null);
    } else if (!destination) {
      setDestination(coords);
      setDestinationLabel(null);
    }
  };

  const handleCalculate = async () => {
    if (!originLabel || !destinationLabel) {
      toast.info('Defina origem e destino antes de calcular a rota.');
      return;
    }

    const payload: GetPlannedRouteInputDto = {
      origin: originLabel,
      destination: destinationLabel,
      modality: selectedModality,
    };

    try {
      setIsCalculatingRoute(true);
      const response = await api.planRoute(payload);
      const decoded = polyline.decode(response.polyline) as [number, number][];

      setRouteData({
        ...response,
        decodedPolyline: decoded,
      });
    } catch (error) {
      toast.error('Erro ao calcular rota');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  return (
    <div className="relative w-full h-screen pb-48">
      <RouteMap
        center={mapCenter}
        origin={origin}
        destination={destination}
        polyline={routeData?.decodedPolyline ?? []}
        onMapClick={handleMapClick}
        distanceKm={routeData?.distanceKm}
        estimatedTimeMinutes={routeData?.estimatedTimeMinutes}
      />

      <AnimatePresence mode="wait">
        {!userData ? (
          <motion.div
            key="loading-profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 left-4 right-4 text-center p-4"
          >
            <div className="absolute bottom-4 left-4 right-4 text-center p-4">
              Carregando perfil...
            </div>
          </motion.div>
        ) : routeData ? (
          <motion.div
            key="route-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-4 left-4 right-4 bg-background p-4 rounded-xl shadow-lg z-[999] text-copy"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-md">
              <div className="flex items-center gap-1">
                <RouteIcon size={20} stroke="#bfd572" />
                {routeData.distanceKm.toFixed(2)} km
              </div>
              <div className="flex items-center gap-1">
                <TimerIcon size={20} stroke="#bfd572" />
                {Math.floor(routeData.estimatedTimeMinutes / 60)}h{' '}
                {routeData.estimatedTimeMinutes % 60}min
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp size={20} stroke="#bfd572" />
                {routeData.elevationGain} m
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown size={20} stroke="#bfd572" />
                {routeData.elevationLoss} m
              </div>
              <div className="flex items-center gap-1">
                <Flame size={20} stroke="#bfd572" />
                {routeData.estimatedCalories} kcal
              </div>
              <div className="flex items-center gap-1 col-span-2 sm:col-span-1">
                Modalidade: {getModalityLabel(selectedModality)},{' '}
                {routeData.averageSpeedUsed} km/h
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4 w-full mt-3">
              <Button
                variant="confirm"
                loading={isSaving}
                onClick={async () => {
                  if (!routeData) return;
                  try {
                    setIsSaving(true);
                    await api.saveRoute({
                      origin: originLabel!,
                      destination: destinationLabel!,
                      modality: selectedModality,
                      polyline: routeData.polyline,
                      distanceKm: routeData.distanceKm,
                      estimatedTimeMinutes: routeData.estimatedTimeMinutes,
                      elevationGain: routeData.elevationGain,
                      elevationLoss: routeData.elevationLoss,
                      estimatedCalories: routeData.estimatedCalories,
                      averageSpeedUsed: routeData.averageSpeedUsed,
                    });
                  } catch (error) {
                    console.error('Erro ao salvar rota:', error);
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="flex-1"
              >
                Salvar Rota
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="route-planner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-0 left-0 right-0"
          >
            <RoutePlannerPanel
              origin={origin}
              originLabel={originLabel}
              destination={destination}
              destinationLabel={destinationLabel}
              onSetOrigin={(coords, label) => {
                setOrigin(coords);
                setOriginLabel(label);
              }}
              onSetDestination={(coords, label) => {
                setDestination(coords);
                setDestinationLabel(label);
              }}
              onStart={() => handleCalculate()}
              onCancel={() => {
                setOrigin(null);
                setDestination(null);
                setRouteData(null);
              }}
              showSpeedOptions={showSpeedOptions}
              onCloseSpeedOptions={() => setShowSpeedOptions(false)}
              onSelectModality={(modality, speed) => {
                setSelectedModality(modality);
                setAverageSpeed(speed);
              }}
              speeds={{
                general: userData.averageSpeedGeneral,
                road: userData.averageSpeedRoad,
                mtb: userData.averageSpeedMtb,
              }}
              isCalculatingRoute={isCalculatingRoute}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
