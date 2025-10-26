'use client';

import { useEffect, useMemo, useState } from 'react';
import polyline from '@mapbox/polyline';
import ApiVeloxService from '@/providers/api-velox.provider';
import GoogleRouteMap from '@/components/map/google-route-map';
import RouteSelector from '@/components/map/route-selector';
import ElevationProfile, { ElevationPoint } from '@/components/map/elevation-profile';
import RoutePlannerPanel from '@/components/planner/route-planner-panel';
import TrafficDisplay from '@/components/traffic/traffic-display';
import WeatherDisplay from '@/components/weather/weather-display';
import Button from '@/components/ui/button/button';
import { Athlete } from '@/interfaces/athlete.interface';
import { getModalityLabel } from '@/helpers/modality.helper';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { User, Gauge, Save, RotateCcw, ArrowLeft } from 'lucide-react';
import { useTexts } from '@/helpers/use-texts';
import { GetPlannedRouteInputDto, GetPlannedRouteResponseDto, Modality, GetTrafficOutputDto, GetWeatherOutputDto } from '@/interfaces/routes.interface';
import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay';
import { useRouter } from 'next/navigation';

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
  const api = useMemo(() => new ApiVeloxService(), []);
  const { t } = useTexts('calculate');
  const router = useRouter();

  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [originLabel, setOriginLabel] = useState<string | null>(null);
  const [destinationLabel, setDestinationLabel] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedModality, setSelectedModality] = useState<Modality>('general');
  const [userData, setUserData] = useState<Athlete | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [trafficData, setTrafficData] = useState<GetTrafficOutputDto | null>(null);
  const [isLoadingTraffic, setIsLoadingTraffic] = useState(false);
  const [weatherData, setWeatherData] = useState<GetWeatherOutputDto | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await api.getProfile();
        setUserData(profile);
      } catch {
        toast.error(t('profileError'));
      }
    }
    fetchProfile();
  }, [api, t]);

  // limpa qualquer rota desenhada quando um dos inputs é limpo
  useEffect(() => {
    if (!originLabel || !destinationLabel) {
      setRouteData(null);
      setRouteOptions([]);
      setSelectedRouteIndex(0);
      setTrafficData(null);
      setWeatherData(null);
    }
  }, [originLabel, destinationLabel]);

  useEffect(() => {
    const loadTrafficAndWeatherData = async () => {
      if (!routeOptions.length || !userData || !routeData) {
        return;
      }

      try {
        setIsLoadingTraffic(true);
        setIsLoadingWeather(true);
        const selectedRoute = routeOptions[selectedRouteIndex];
        const encodedPolyline = polyline.encode(selectedRoute.polyline);
        
        const traffic = await api.getTraffic(
          userData.id,
          encodedPolyline,
          originLabel!,
          destinationLabel!,
        );
        setTrafficData(traffic);

        const midpoint = Math.floor(selectedRoute.polyline.length / 2);
        const [latitude, longitude] = selectedRoute.polyline[midpoint];
        
        const weather = await api.getWeather(userData.id, latitude, longitude);
        setWeatherData(weather);
      } catch {
      } finally {
        setIsLoadingTraffic(false);
        setIsLoadingWeather(false);
      }
    };

    loadTrafficAndWeatherData();
  }, [routeOptions, userData, routeData, selectedRouteIndex, originLabel, destinationLabel, api]);

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
      
    } catch {
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
    setTrafficData(null);
  };

  return (
    <div className="relative w-full h-screen pb-40 sm:pb-48">
      <GoogleRouteMap
        origin={origin}
        destination={destination}
        routes={routeOptions}
        selectedRouteIndex={selectedRouteIndex}
        onRouteSelect={setSelectedRouteIndex}
        onMapClick={handleMapClick}
      />

      {isCalculatingRoute && (
        <PageTransitionOverlay visible={true} message={t('calculating.title')} />
      )}

      <AnimatePresence mode="wait">
        {!userData ? (
          <PageTransitionOverlay visible={true} message={t('loadingProfile')} />
        ) : routeOptions.length > 0 ? (
          <motion.div
            key="route-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-4 left-4 right-4 bg-background p-4 rounded-xl shadow-lg z-[999] text-copy max-h-[60vh] overflow-y-auto"
          >
            <div className="space-y-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-copy hover:text-primary-light transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-semibold"></span>
              </button>

              <RouteSelector
                routes={routeOptions}
                selectedIndex={selectedRouteIndex}
                onSelect={setSelectedRouteIndex}
              />
              
                {weatherData && weatherData.weather && !isLoadingWeather && (
                <WeatherDisplay weatherData={weatherData.weather} />
              )}


              {trafficData && trafficData.traffic && !isLoadingTraffic && (
                <TrafficDisplay trafficData={trafficData.traffic} />
              )}

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
                <Button
                  onClick={handleSaveRoute}
                  disabled={isSaving}
                  loading={isSaving}
                  variant="confirm"
                  className="flex-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Save size={20} />
                    {t('buttons.save')}
                  </span>
                </Button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-[#92a848]/10 border border-[#92a848] hover:bg-[#92a848] text-copy font-semibold py-3.5 px-6 rounded-xl backdrop-blur-sm transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] shadow-lg"
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
              onSelectModality={(modality) => {
                setSelectedModality(modality);
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
