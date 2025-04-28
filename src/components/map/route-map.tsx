'use client'

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { Icon } from 'leaflet'

const originIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
})

const destinationIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
})


type MapProps = {
  center: [number, number]
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


function FitBoundsToPolyline({ polyline }: { polyline: [number, number][] }) {
  const map = useMap()

  useEffect(() => {
    if (polyline.length > 0) {
      const bounds = polyline.map(([lat, lng]) => [lat, lng])
      map.fitBounds(bounds as any, { padding: [50, 50] })
    }
  }, [polyline, map])

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

  useEffect(() => {
    async function fixLeafletIcons() {
      const L = await import('leaflet')

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
      })
    }

    fixLeafletIcons()
  }, [])

  const center = origin ?? [-28.678, -49.369]

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
              <div><strong>{distanceKm?.toFixed(1)} km</strong></div>
              <div>{Math.floor(estimatedTimeMinutes / 60)}h {estimatedTimeMinutes % 60}min</div>
            </div>
          </Popup>
        </Marker>
        )}
      </>
      {/*
      mais escuro:
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO'
      /> */}
{/* <TileLayer
  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
  attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
/> */}
     {/* <TileLayer
     url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
    /> */}
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />

{/* <TileLayer
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
/> */}


    <FitBoundsToPolyline polyline={polyline} />


      <ClickHandler onMapClick={onMapClick} />

      {origin && (
        <Marker position={{ lat: origin[0], lng: origin[1] }} icon={destinationIcon}>
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
