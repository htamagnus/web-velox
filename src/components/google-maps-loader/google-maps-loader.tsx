'use client';

import { useLoadScript } from '@react-google-maps/api';
import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay';

const libraries: ("places" | "routes" | "marker" | "elevation")[] = ['places', 'routes', 'marker', 'elevation'];

export default function GoogleMapsLoader({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  if (!isLoaded) {
    return <PageTransitionOverlay visible={true} />;
  }

  return <>{children}</>;
}
