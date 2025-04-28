import { MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

type MiniMapProps = {
  polyline: [number, number][]
}

function FitBounds({ polyline }: { polyline: [number, number][] }) {
  const map = useMap()

  useEffect(() => {
    if (polyline.length > 0) {
      map.fitBounds(polyline as any, { padding: [3, 3] })
    }
  }, [map, polyline])

  return null
}

export default function MiniMap({ polyline }: MiniMapProps) {
  return (
    <div className="h-48 w-full rounded-lg overflow-hidden">
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        touchZoom={false}
        attributionControl={false}
        center={polyline.length > 0 ? polyline[0] : [0, 0]}
        zoom={13}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {polyline.length > 0 && (
          <Polyline
            positions={polyline}
            pathOptions={{ color: 'purple', weight: 4 }}
          />
        )}
        {/* <<< Essa parte é o segredo */}
        <FitBounds polyline={polyline} />
      </MapContainer>
    </div>
  )
}
