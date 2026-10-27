'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import polyline from '@mapbox/polyline';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import ApiVeloxService from '@/providers/api-velox.provider';
import { ApiError } from '@/errors/api-errors';
import GoogleRouteMap from '@/components/map/google-route-map';
import RoutePlannerPanel from '@/components/planner/route-planner-panel';
import RouteSheet, { RouteOption } from '@/components/planner/route-sheet';
import LanguageSelector from '@/components/language-selector/language-selector';
import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay';
import { EASE } from '@/components/landing/reveal';
import { Athlete } from '@/interfaces/athlete.interface';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useTexts } from '@/helpers/use-texts';
import { GetPlannedRouteInputDto, GetPlannedRouteResponseDto, Modality, GetTrafficOutputDto, GetWeatherOutputDto } from '@/interfaces/routes.interface';
import { archivo } from '../fonts';

type RouteData = GetPlannedRouteResponseDto & {
  decodedPolyline: [number, number][];
};

export default function CalculateRoutePage() {
  useProtectedRoute();
  const api = useMemo(() => new ApiVeloxService(), []);
  const { t } = useTexts('calculate');
  const tPanel = useTexts('plannerPanel').t;

  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [originLabel, setOriginLabel] = useState<string | null>(null);
  const [destinationLabel, setDestinationLabel] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  // as rotas desta busca que já foram salvas: o botão vira link pra não duplicar na lista
  const [savedIndexes, setSavedIndexes] = useState<number[]>([]);
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

  // o trânsito só depende de origem e destino: uma busca por cálculo, não a cada troca de alternativa (gasta cota do google)
  useEffect(() => {
    if (!userData || !routeData) return;

    setIsLoadingTraffic(true);
    api
      .getTraffic(userData.id, routeData.polyline, originLabel!, destinationLabel!)
      .then(setTrafficData, () => setTrafficData(null))
      .finally(() => setIsLoadingTraffic(false));
  }, [userData, routeData, originLabel, destinationLabel, api]);

  // o clima usa o meio da rota escolhida, então acompanha a alternativa; é openweather, não gasta cota do google
  useEffect(() => {
    if (!routeOptions.length || !userData) return;

    const selectedRoute = routeOptions[selectedRouteIndex];
    const [latitude, longitude] = selectedRoute.polyline[Math.floor(selectedRoute.polyline.length / 2)];

    setIsLoadingWeather(true);
    api
      .getWeather(userData.id, latitude, longitude)
      .then(setWeatherData, () => setWeatherData(null))
      .finally(() => setIsLoadingWeather(false));
  }, [routeOptions, selectedRouteIndex, userData, api]);

  // o ponto clicado só vale com endereço: é o texto que vai pro cálculo, então sem ele o ponto nem entra
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng || (origin && destination)) return;

    const coords: [number, number] = [e.latLng.lat(), e.latLng.lng()];
    try {
      const { results } = await new google.maps.Geocoder().geocode({ location: e.latLng });
      const label = results[0]?.formatted_address;
      if (!label) throw new Error('sem endereço');

      if (!origin) {
        setOrigin(coords);
        setOriginLabel(label);
      } else {
        setDestination(coords);
        setDestinationLabel(label);
      }
    } catch {
      toast.error(t('mapPointError'));
    }
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
        elevationProfile: response.elevationProfile,
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
            elevationProfile: alt.elevationProfile,
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
      setSavedIndexes([]);
      window.scrollTo({ top: 0 });
      
    } catch (error) {
      const quota = error instanceof ApiError && error.code === 'GOOGLE_QUOTA_EXCEEDED';
      toast.error(t(quota ? 'quotaError' : 'routeError'));
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
      setSavedIndexes((prev) => [...prev, selectedRouteIndex]);
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

  if (!userData) {
    return <PageTransitionOverlay visible={true} message={t('loadingProfile')} />;
  }

  // a folha em tinta à esquerda e o mapa noturno no resto; no celular o mapa fica preso em cima
  return (
    <MotionConfig reducedMotion="user">
      <div className={`landing planner ${archivo.variable}`}>
        <header className="planner__nav">
          <Link href="/home" className="back-link">
            <ArrowLeft size={18} aria-hidden="true" />
            {tPanel('backButton')}
          </Link>
          <div className="lang">
            <LanguageSelector />
          </div>
        </header>

        <div className="planner__map">
          <GoogleRouteMap
            className="planner__canvas"
            origin={origin}
            destination={destination}
            routes={routeOptions}
            selectedRouteIndex={selectedRouteIndex}
            onRouteSelect={setSelectedRouteIndex}
            onMapClick={handleMapClick}
          />
          <div className="hero__lines" aria-hidden="true" />
        </div>

        <main className="planner__panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={routeOptions.length > 0 ? 'sheet' : 'form'}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {routeOptions.length > 0 ? (
                <RouteSheet
                  routes={routeOptions}
                  selectedIndex={selectedRouteIndex}
                  onSelect={setSelectedRouteIndex}
                  origin={originLabel!}
                  destination={destinationLabel!}
                  modality={selectedModality}
                  weather={isLoadingWeather ? undefined : weatherData?.weather}
                  traffic={isLoadingTraffic ? undefined : trafficData?.traffic}
                  onSave={handleSaveRoute}
                  saving={isSaving}
                  saved={savedIndexes.includes(selectedRouteIndex)}
                  onReset={handleReset}
                />
              ) : (
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
                  }}
                  onClearDestination={() => {
                    setDestination(null);
                    setDestinationLabel(null);
                  }}
                  onStart={handleCalculate}
                  modality={selectedModality}
                  onSelectModality={setSelectedModality}
                  speeds={{
                    general: userData.averageSpeedGeneral,
                    road: userData.averageSpeedRoad,
                    mtb: userData.averageSpeedMtb,
                  }}
                  isCalculatingRoute={isCalculatingRoute}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </MotionConfig>
  );
}
