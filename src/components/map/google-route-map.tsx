'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, Polyline, Marker, DirectionsRenderer } from '@react-google-maps/api';

type RouteOption = {
  polyline: [number, number][];
  distanceKm: number;
  estimatedTimeMinutes: number;
  elevationGain: number;
  elevationLoss: number;
  estimatedCalories: number;
  summary?: string;
  warnings?: string[];
};

type GoogleRouteMapProps = {
  origin: [number, number] | null;
  destination: [number, number] | null;
  routes: RouteOption[];
  selectedRouteIndex: number;
  onRouteSelect: (index: number) => void;
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
  className?: string;
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// o mapa noturno da landing: chão em tinta, ruas um tom acima, sem pontos de interesse
const NIGHT: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#071a36' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#b4bfca' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#00082e' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#00082e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#102441' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#7d8a9a' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#273952' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#273952' }] },
];

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  backgroundColor: '#00082e',
  styles: NIGHT,
};

const ACCENT = '#bfd572';
const PAPER = '#f6f9fc';
const INK = '#00082e';

export default function GoogleRouteMap({
  origin,
  destination,
  routes,
  selectedRouteIndex,
  onRouteSelect,
  onMapClick,
  className,
}: GoogleRouteMapProps) {
  // em estado e não em ref: o mapa remonta quando as rotas chegam e o enquadramento precisa rodar de novo
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: -28.678, lng: -49.369 });
  const [previewDirections, setPreviewDirections] = useState<google.maps.DirectionsResult | null>(null);
  const routesLengthRef = useRef(routes.length);

  const onLoad = useCallback((loaded: google.maps.Map) => setMap(loaded), []);
  const onUnmount = useCallback(() => setMap(null), []);

  useEffect(() => {
    if (origin) {
      setCenter({ lat: origin[0], lng: origin[1] });
    }
  }, [origin]);

  // limpar preview quando origin ou destination forem removidos
  useEffect(() => {
    if (!origin || !destination) {
      setPreviewDirections(null);
    }
  }, [origin, destination]);

  // atualizar ref quando routes mudar
  useEffect(() => {
    routesLengthRef.current = routes.length;
  }, [routes.length]);

  // gerar preview da rota quando origem e destino estiverem definidos
  useEffect(() => {
    if (!origin || !destination || routes.length > 0) {
      setPreviewDirections(null);
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: origin[0], lng: origin[1] },
        destination: { lat: destination[0], lng: destination[1] },
        travelMode: google.maps.TravelMode.BICYCLING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setPreviewDirections(result);
        } else {
          setPreviewDirections(null);
        }
      }
    );
  }, [origin, destination, routes.length]);

  useEffect(() => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    
    if (routes.length > 0) {
      for (const point of routes[selectedRouteIndex]?.polyline || []) {
        bounds.extend({ lat: point[0], lng: point[1] });
      }
    }

    if (origin) bounds.extend({ lat: origin[0], lng: origin[1] });
    if (destination) bounds.extend({ lat: destination[0], lng: destination[1] });

    if (origin || destination || routes.length > 0) {
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  }, [map, routes, selectedRouteIndex, origin, destination]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (onMapClick && e.latLng) {
      onMapClick(e);
    }
  }, [onMapClick]);

  return (
    <div className={className}>
      <GoogleMap
        key={`map-${routes.length}-${origin?.[0]}-${origin?.[1]}`}
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
        onClick={handleMapClick}
      >
        {previewDirections && routes.length === 0 && (
          <DirectionsRenderer
            directions={previewDirections}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: ACCENT,
                strokeOpacity: 0.5,
                strokeWeight: 4,
              },
            }}
          />
        )}

        {routes.map((route, index) => {
          const isSelected = index === selectedRouteIndex;
          const routeKey = `route-${index}-${route.polyline[0]?.[0]}-${route.polyline[0]?.[1]}-${route.polyline[route.polyline.length - 1]?.[0]}-${route.polyline[route.polyline.length - 1]?.[1]}`;
          const path = route.polyline.map(([lat, lng]) => ({ lat, lng }));

          return (
            <Fragment key={routeKey}>
              {/* o brilho do traçado escolhido: uma linha larga e apagada por baixo */}
              {isSelected && (
                <Polyline
                  path={path}
                  options={{ strokeColor: ACCENT, strokeOpacity: 0.22, strokeWeight: 16, clickable: false, zIndex: 99 }}
                />
              )}
              <Polyline
                path={path}
                options={{
                  strokeColor: isSelected ? ACCENT : PAPER,
                  strokeOpacity: isSelected ? 1 : 0.35,
                  strokeWeight: isSelected ? 5 : 4,
                  clickable: true,
                  zIndex: isSelected ? 100 : 50 - index,
                }}
                onClick={() => onRouteSelect(index)}
              />
            </Fragment>
          );
        })}

        {origin && (
          <Marker
            position={{ lat: origin[0], lng: origin[1] }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: INK,
              fillOpacity: 1,
              strokeColor: PAPER,
              strokeWeight: 3,
            }}
            title="origem"
            zIndex={200}
          />
        )}

        {destination && (
          <Marker
            position={{ lat: destination[0], lng: destination[1] }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: ACCENT,
              fillOpacity: 1,
              strokeColor: INK,
              strokeWeight: 3,
            }}
            title="destino"
            zIndex={200}
          />
        )}
      </GoogleMap>
    </div>
  );
}

