'use client';

import { useCallback, useEffect, useRef } from 'react';
import { GoogleMap, Polyline } from '@react-google-maps/api';

type GoogleMiniMapProps = {
  polyline: [number, number][];
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  draggable: false,
  scrollwheel: false,
  disableDoubleClickZoom: true,
  mapTypeId: 'terrain',
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export default function GoogleMiniMap({ polyline }: GoogleMiniMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  useEffect(() => {
    if (!mapRef.current || polyline.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    
    for (const point of polyline) {
      bounds.extend({ lat: point[0], lng: point[1] });
    }

    mapRef.current.fitBounds(bounds, { top: 10, right: 10, bottom: 10, left: 10 });
  }, [polyline]);

  const center = polyline.length > 0 
    ? { lat: polyline[0][0], lng: polyline[0][1] }
    : { lat: -28.678, lng: -49.369 };

  return (
    <div className="h-48 w-full rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {polyline.length > 0 && (
          <Polyline
            path={polyline.map(([lat, lng]) => ({ lat, lng }))}
            options={{
              strokeColor: '#92a848',
              strokeOpacity: 1.0,
              strokeWeight: 4,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}

