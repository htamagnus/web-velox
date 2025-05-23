'use client';

import { useLoadScript } from '@react-google-maps/api';
import Loader from '@/components/ui/loader/loader';

export default function GoogleMapsLoader({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={32} />
      </div>
    );
  }

  return <>{children}</>;
}
