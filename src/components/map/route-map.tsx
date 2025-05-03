'use client';

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Icon } from 'leaflet';

const originIcon = new Icon({
  iconUrl: '/icons/marker-origin.svg',
  iconSize: [25, 25],
  iconAnchor: [15, 30],
});

const destinationIcon = new Icon({
  iconUrl: '/icons/marker-destination.svg',
  iconSize: [25, 25],
  iconAnchor: [15, 30],
});

type MapProps = {
  center: [number, number];
  origin: [number, number] | null;
  destination: [number, number] | null;
  polyline: [number, number][];
  onMapClick: (e: { latlng: { lat: number; lng: number } }) => void;
  distanceKm?: number;
  estimatedTimeMinutes?: number;
};

function ClickHandler({ onMapClick }: { onMapClick: MapProps['onMapClick'] }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

function FitBoundsToPolyline({ polyline }: { polyline: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (polyline.length > 0) {
      const bounds = polyline.map(([lat, lng]) => [lat, lng]);
      map.fitBounds(bounds as any, { padding: [50, 50] });
    }
  }, [polyline, map]);

  return null;
}

function getMiddlePoint(points: [number, number][]): { lat: number; lng: number } | null {
  if (points.length === 0) return null;
  const middleIndex = Math.floor(points.length / 2);
  return { lat: points[middleIndex][0], lng: points[middleIndex][1] };
}

export default function RouteMap({
  origin,
  destination,
  polyline,
  onMapClick,
  distanceKm,
  estimatedTimeMinutes,
}: MapProps) {

  const center = origin ?? [-28.678, -49.369];

  return (
    <MapContainer
      center={{ lat: center[0], lng: center[1] }}
      zoom={13}
      className="h-[70vh] w-full rounded-xl shadow-lg"
      scrollWheelZoom={false}
      doubleClickZoom={false}
      dragging={true}
    >
      <>
        {polyline.length > 0 && getMiddlePoint(polyline) && (
          <Marker
            position={getMiddlePoint(polyline)!}
            interactive={false} // se quiser que o usuário não clique
            opacity={0} // deixa o marcador invisível
            icon={originIcon}
          >
            <Popup
              closeButton={false}
              closeOnClick={false}
              autoClose={false}
              className="custom-popup"
            >
              <div className="text-center text-sm">
                <div>
                  <strong>{distanceKm?.toFixed(1)} km</strong>
                </div>
                <div>
                  {Math.floor(estimatedTimeMinutes / 60)}h {estimatedTimeMinutes % 60}min
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='© OpenStreetMap contributors, © CartoDB'
      />

      <FitBoundsToPolyline polyline={polyline} />
      <ClickHandler onMapClick={onMapClick} />

      {origin && (
        <Marker position={{ lat: origin[0], lng: origin[1] }} icon={originIcon}>
          <Popup>Origem</Popup>
        </Marker>
      )}

      {destination && (
        <Marker position={{ lat: destination[0], lng: destination[1] }} icon={destinationIcon}>
          <Popup>Destino</Popup>
        </Marker>
      )}

      {polyline.length > 0 && (
        <Polyline
          positions={polyline.map(([lat, lng]) => ({ lat, lng }))}
          pathOptions={{ color: '#92a848', weight: 5 }}
        />
      )}
    </MapContainer>
  );
}
