'use client'

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

type MapProps = {
  origin: [number, number] | null
  destination: [number, number] | null
  polyline: [number, number][]
  onMapClick: (e: { latlng: { lat: number; lng: number } }) => void
  distanceKm?: number
  estimatedTimeMinutes?: number
}

function ClickHandler({ onMapClick }: { onMapClick: MapProps['onMapClick'] }) {
  useMapEvents({
    click: onMapClick,
  })
  return null
}

function getMiddlePoint(points: [number, number][]): { lat: number; lng: number } | null {
  if (points.length === 0) return null;
  const middleIndex = Math.floor(points.length / 2)
  return { lat: points[middleIndex][0], lng: points[middleIndex][1] }
}

export default function RouteMap({
  origin,
  destination,
  polyline,
  onMapClick,
  distanceKm,
  estimatedTimeMinutes,
}: MapProps) {
  const center = origin ?? [-28.678, -49.369]

  return (
    <MapContainer
      center={{ lat: center[0], lng: center[1] }}
      zoom={13}
      className="h-[70vh] w-full rounded-xl shadow-lg"
    >
      <>
      {polyline.length > 0 && getMiddlePoint(polyline) && (
        <Marker
          position={getMiddlePoint(polyline)!}
          interactive={false} // se quiser que o usuário não clique
          opacity={0} // deixa o marcador invisível
        >
          <Popup
            closeButton={false}
            closeOnClick={false}
            autoClose={false}
            className="custom-popup"
          >
            <div className="text-center text-sm">
              <div><strong>{distanceKm?.toFixed(1)} km</strong></div>
              <div>{Math.floor(estimatedTimeMinutes / 60)}h {estimatedTimeMinutes % 60}min</div>
            </div>
          </Popup>
        </Marker>
        )}
      </>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO'
      />

      <ClickHandler onMapClick={onMapClick} />

      {origin && (
        <Marker position={{ lat: origin[0], lng: origin[1] }}>
          <Popup>Origem</Popup>
        </Marker>
      )}

      {destination && (
        <Marker position={{ lat: destination[0], lng: destination[1] }}>
          <Popup>Destino</Popup>
        </Marker>
      )}

      {polyline.length > 0 && (
        <Polyline
          positions={polyline.map(([lat, lng]) => ({ lat, lng }))}
          pathOptions={{ color: 'purple', weight: 5 }}
        />
      )}
    </MapContainer>
  )
}
