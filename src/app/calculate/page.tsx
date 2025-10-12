'use client';

import { useEffect, useState } from 'react';
import polyline from '@mapbox/polyline';
import ApiVeloxService from '@/providers/api-velox.provider';
import GoogleRouteMap from '@/components/map/google-route-map';
import RouteSelector from '@/components/map/route-selector';
import ElevationProfile from '@/components/map/elevation-profile';
import RoutePlannerPanel from '@/components/planner/route-planner-panel';
import Button from '@/components/ui/button/button';
import { Athlete } from '@/interfaces/athlete.interface';
import { getModalityLabel } from '@/helpers/modality.helper';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { useProtectedRoute } from '@/hooks/use-protected-route';

type RouteOption = {
  polyline: [number, number][];
  distanceKm: number;
  estimatedTimeMinutes: number;
  elevationGain: number;
  elevationLoss: number;
  estimatedCalories: number;
  averageSpeedUsed: number;
  elevationProfile?: ElevationPoint[];
  summary?: string;
  warnings?: string[];
};

type RouteData = GetPlannedRouteResponseDto & {
  decodedPolyline: [number, number][];
};

export default function CalculateRoutePage() {
  useProtectedRoute();
  const api = new ApiVeloxService();

  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [originLabel, setOriginLabel] = useState<string | null>(null);
  const [destinationLabel, setDestinationLabel] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
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
        toast.info('não foi possível pegar localização');
      },
    );
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await api.getProfile();
        setUserData(profile);
      } catch (err) {
        toast.error('erro ao buscar perfil');
      }
    }
    fetchProfile();
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const coords: [number, number] = [e.latLng.lat(), e.latLng.lng()];
    if (!origin) {
      setOrigin(coords);
      setOriginLabel(null);
    } else if (!destination) {
      setDestination(coords);
      setDestinationLabel(null);
    }
  };

  const generateMockElevationProfile = (distance: number, variation = 1): ElevationPoint[] => {
    const points: ElevationPoint[] = [];
    const numPoints = 50;
    const baseElevation = 100;
    
    for (let i = 0; i <= numPoints; i++) {
      const distancePoint = (distance * 1000 * i) / numPoints;
      const elevation = baseElevation + Math.sin((i / 5) + variation) * 20 + Math.random() * 10;
      points.push({ distance: distancePoint, elevation });
    }
    
    return points;
  };


  const handleCalculate = async () => {
    if (!originLabel || !destinationLabel) {
      toast.info('defina origem e destino antes de calcular a rota.');
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

      const mainRoute: RouteOption = {
        polyline: decoded,
        distanceKm: response.distanceKm,
        estimatedTimeMinutes: response.estimatedTimeMinutes,
        elevationGain: response.elevationGain,
        elevationLoss: response.elevationLoss,
        estimatedCalories: response.estimatedCalories,
        averageSpeedUsed: response.averageSpeedUsed,
        elevationProfile: generateMockElevationProfile(response.distanceKm),
        summary: 'rota mais rápida',
      };

      const alternatives: RouteOption[] = [];
      
      if (response.alternatives && response.alternatives.length > 0) {
        for (const alt of response.alternatives) {
          const altDecoded = polyline.decode(alt.polyline) as [number, number][];
          alternatives.push({
            polyline: altDecoded,
            distanceKm: alt.distanceKm,
            estimatedTimeMinutes: alt.estimatedTimeMinutes,
            elevationGain: alt.elevationGain,
            elevationLoss: alt.elevationLoss,
            estimatedCalories: alt.estimatedCalories,
            averageSpeedUsed: alt.averageSpeedUsed,
            elevationProfile: alt.elevationProfile || generateMockElevationProfile(alt.distanceKm),
            summary: alt.summary,
            warnings: alt.warnings,
          });
        }
      }

      setRouteData({
        ...response,
        decodedPolyline: decoded,
      });
      
      setRouteOptions([mainRoute, ...alternatives]);
      setSelectedRouteIndex(0);
      
    } catch (error) {
      toast.error('erro ao calcular rota');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const handleSaveRoute = async () => {
    if (!routeData || routeOptions.length === 0) return;
    
    const selectedRoute = routeOptions[selectedRouteIndex];
    
    try {
      setIsSaving(true);
      await api.saveRoute({
        origin: originLabel!,
        destination: destinationLabel!,
        modality: selectedModality,
        polyline: polyline.encode(selectedRoute.polyline),
        distanceKm: selectedRoute.distanceKm,
        estimatedTimeMinutes: selectedRoute.estimatedTimeMinutes,
        elevationGain: selectedRoute.elevationGain,
        elevationLoss: selectedRoute.elevationLoss,
        estimatedCalories: selectedRoute.estimatedCalories,
        averageSpeedUsed: selectedRoute.averageSpeedUsed,
      });
      toast.success('rota salva com sucesso!');
    } catch (error) {
      toast.error('erro ao salvar rota');
      console.error('erro ao salvar rota:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setOriginLabel(null);
    setDestinationLabel(null);
    setRouteData(null);
    setRouteOptions([]);
    setSelectedRouteIndex(0);
  };

  return (
    <div className="relative w-full h-screen pb-48">
      <GoogleRouteMap
        origin={origin}
        destination={destination}
        routes={routeOptions}
        selectedRouteIndex={selectedRouteIndex}
        onRouteSelect={setSelectedRouteIndex}
        onMapClick={handleMapClick}
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
              carregando perfil...
            </div>
          </motion.div>
        ) : routeOptions.length > 0 ? (
          <motion.div
            key="route-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-4 left-4 right-4 bg-background p-4 rounded-xl shadow-lg z-[999] text-copy max-h-[60vh] overflow-y-auto"
          >
            <div className="space-y-4">
              <RouteSelector
                routes={routeOptions}
                selectedIndex={selectedRouteIndex}
                onSelect={setSelectedRouteIndex}
              />

              {routeOptions[selectedRouteIndex]?.elevationProfile && (
                <ElevationProfile
                  elevationData={routeOptions[selectedRouteIndex].elevationProfile!}
                  elevationGain={routeOptions[selectedRouteIndex].elevationGain}
                  elevationLoss={routeOptions[selectedRouteIndex].elevationLoss}
                />
              )}

              <div className="pt-2 border-t border-copy/10">
                <div className="text-xs text-copy/60 mb-2">
                  modalidade: {getModalityLabel(selectedModality)}, {routeOptions[selectedRouteIndex].averageSpeedUsed} km/h
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button
                    variant="confirm"
                    loading={isSaving}
                    onClick={handleSaveRoute}
                    className="flex-1"
                  >
                    salvar rota
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleReset}
                    className="flex-1"
                  >
                    nova busca
                  </Button>
                </div>
              </div>
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
              originLabel={originLabel}
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
              onCancel={() => handleReset()}
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
