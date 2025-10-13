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
import { User, Gauge, Loader2, Save, RotateCcw } from 'lucide-react';
import { useTexts } from '@/helpers/use-texts';

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
  const { t } = useTexts('calculate');

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
        toast.info(t('geolocationError'));
      },
    );
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await api.getProfile();
        setUserData(profile);
      } catch (err) {
        toast.error(t('profileError'));
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
      toast.info(t('requireOriginDestination'));
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
        summary: t('fastestRoute'),
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
      toast.error(t('routeError'));
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
      toast.success(t('routeSaved'));
    } catch (error) {
      toast.error(t('routeSaveError'));
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

      {isCalculatingRoute && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[9998] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#1a2234] to-[#0f1419] p-8 rounded-2xl shadow-2xl border border-primary-light/20"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Loader2 size={48} className="animate-spin text-primary-light" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 rounded-full bg-primary-light/20 blur-xl"
                />
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg mb-1">{t('calculating.title')}</div>
                <div className="text-copy/60 text-sm">{t('calculating.subtitle')}</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

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
              {t('loadingProfile')}
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

              <div className="relative bg-gradient-to-r from-[#92a848]/20 to-[#92a848]/10 border-l-4 border-[#92a848] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#92a848] animate-pulse"></div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#92a848]">
                    {t('personalized.title')}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-copy">
                    <User size={16} className="text-primary-light flex-shrink-0" />
                    <span>
                      {t('personalized.modality')} <span className="font-bold text-primary-light">{getModalityLabel(selectedModality)}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-copy">
                    <Gauge size={16} className="text-primary-light flex-shrink-0" />
                    <span>
                      {t('personalized.averageSpeed')} <span className="font-bold text-primary-light">{routeOptions[selectedRouteIndex].averageSpeedUsed} km/h</span>
                    </span>
                  </div>
                </div>
              </div>

              {routeOptions[selectedRouteIndex]?.elevationProfile && (
                <ElevationProfile
                  elevationData={routeOptions[selectedRouteIndex].elevationProfile!}
                  elevationGain={routeOptions[selectedRouteIndex].elevationGain}
                  elevationLoss={routeOptions[selectedRouteIndex].elevationLoss}
                />
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                <button
                  onClick={handleSaveRoute}
                  disabled={isSaving}
                  className="flex-1 group relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-content font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 ease-out shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSaving ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        {t('buttons.saving')}
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        {t('buttons.save')}
                      </>
                    )}
                  </span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-copy/10 hover:bg-copy/20 border border-copy/20 hover:border-copy/30 text-copy font-semibold py-3.5 px-6 rounded-xl backdrop-blur-sm transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <RotateCcw size={20} />
                    {t('buttons.newSearch')}
                  </span>
                </button>
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
            onClearOrigin={() => {
              setOrigin(null);
              setOriginLabel(null);
              setRouteData(null);
              setRouteOptions([]);
              setSelectedRouteIndex(0);
            }}
            onClearDestination={() => {
              setDestination(null);
              setDestinationLabel(null);
              setRouteData(null);
              setRouteOptions([]);
              setSelectedRouteIndex(0);
            }}
              onStart={() => handleCalculate()}
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
