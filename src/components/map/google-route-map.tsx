'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  mapTypeId: 'terrain',
  clickableIcons: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export default function GoogleRouteMap({
  origin,
  destination,
  routes,
  selectedRouteIndex,
  onRouteSelect,
  onMapClick,
  className = 'h-[70vh] w-full rounded-xl shadow-lg',
}: GoogleRouteMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: -28.678, lng: -49.369 });
  const [previewDirections, setPreviewDirections] = useState<google.maps.DirectionsResult | null>(null);
  const routesLengthRef = useRef(routes.length);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

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
    if (!mapRef.current) return;

    const bounds = new google.maps.LatLngBounds();
    
    if (routes.length > 0) {
      for (const point of routes[selectedRouteIndex]?.polyline || []) {
        bounds.extend({ lat: point[0], lng: point[1] });
      }
    }

    if (origin) bounds.extend({ lat: origin[0], lng: origin[1] });
    if (destination) bounds.extend({ lat: destination[0], lng: destination[1] });

    if (origin || destination || routes.length > 0) {
      mapRef.current.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  }, [routes, selectedRouteIndex, origin, destination]);

  const getRouteColor = (index: number, isSelected: boolean) => {
    const colors = [
      '#92a848', // verde principal
      '#4a9eff', // azul
      '#ff8c42', // laranja
    ];
    
    const color = colors[index] || colors[0];
    return isSelected ? color : color;
  };

  const getRouteOpacity = (isSelected: boolean) => {
    return isSelected ? 1.0 : 0.4;
  };

  const getRouteWeight = (isSelected: boolean) => {
    return isSelected ? 7 : 4;
  };

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
                strokeColor: '#92a848',
                strokeOpacity: 0.5,
                strokeWeight: 4,
              },
            }}
          />
        )}

        {routes.map((route, index) => {
          const isSelected = index === selectedRouteIndex;
          const routeKey = `route-${index}-${route.polyline[0]?.[0]}-${route.polyline[0]?.[1]}-${route.polyline[route.polyline.length - 1]?.[0]}-${route.polyline[route.polyline.length - 1]?.[1]}`;
          
          return (
            <Polyline
              key={routeKey}
              path={route.polyline.map(([lat, lng]) => ({ lat, lng }))}
              options={{
                strokeColor: getRouteColor(index, isSelected),
                strokeOpacity: getRouteOpacity(isSelected),
                strokeWeight: getRouteWeight(isSelected),
                clickable: true,
                zIndex: isSelected ? 100 : 50 - index,
              }}
              onClick={() => onRouteSelect(index)}
            />
          );
        })}

        {origin && (
          <Marker
            position={{ lat: origin[0], lng: origin[1] }}
            icon={{
              url: '/icons/marker-origin.svg',
              scaledSize: new google.maps.Size(30, 30),
              anchor: new google.maps.Point(15, 30),
            }}
            title="origem"
            zIndex={200}
          />
        )}

        {destination && (
          <Marker
            position={{ lat: destination[0], lng: destination[1] }}
            icon={{
              url: '/icons/marker-destination.svg',
              scaledSize: new google.maps.Size(30, 30),
              anchor: new google.maps.Point(15, 30),
            }}
            title="destino"
            zIndex={200}
          />
        )}
      </GoogleMap>
    </div>
  );
}

