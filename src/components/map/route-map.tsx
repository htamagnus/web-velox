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
}

function ClickHandler({ onMapClick }: { onMapClick: MapProps['onMapClick'] }) {
  useMapEvents({
    click: onMapClick,
  })
  return null
}

export default function RouteMap({
  origin,
  destination,
  polyline,
  onMapClick,
}: MapProps) {
  const center = origin ?? [-28.678, -49.369]

  return (
    <MapContainer
      center={{ lat: center[0], lng: center[1] }}
      zoom={13}
      className="h-[70vh] w-full rounded-xl shadow-lg"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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
