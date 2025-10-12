'use client';

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { useEffect, useState } from 'react';
import { MapPin, Building2, Home } from 'lucide-react';

type Props = {
  icon?: React.ReactNode;
  placeholder: string;
  initialValue?: string;
  onSelect: (coords: [number, number], label: string) => void;
};

export default function AutocompleteInput({
  icon,
  placeholder,
  initialValue,
  onSelect,
}: Props) {
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(
            new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            )
          );
        },
      );
    }
  }, []);

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'br' },
      location: userLocation || undefined,
      radius: 50000, // 50km de raio
      language: 'pt-BR',
      types: ['geocode', 'establishment'],
    },
    debounce: 300,
    callbackName: 'initGoogleMaps',
  });

  useEffect(() => {
    if (initialValue) setValue(initialValue, false);
  }, [initialValue]);

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    const results = await getGeocode({ address: description });
    const { lat, lng } = await getLatLng(results[0]);

    onSelect([lat, lng], description);
  };

  const getIconForType = (types: string[]) => {
    if (types.includes('establishment') || types.includes('point_of_interest')) {
      return <Building2 size={16} className="text-primary-light" />;
    }
    if (types.includes('street_address') || types.includes('route')) {
      return <Home size={16} className="text-primary-light" />;
    }
    return <MapPin size={16} className="text-primary-light" />;
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-3 rounded-xl">
        {icon}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={!ready}
          className="bg-transparent outline-none w-full text-white placeholder:text-gray-400"
        />
      </div>

      {status === 'OK' && (
        <ul className="absolute top-full mt-1 w-full bg-background border border-white/10 rounded-xl max-h-60 overflow-y-auto z-50 shadow-xl">
          {data.map((suggestion) => {
            const mainText = suggestion.structured_formatting.main_text;
            const secondaryText = suggestion.structured_formatting.secondary_text;
            
            return (
              <li
                key={suggestion.place_id}
                onClick={() => handleSelect(suggestion.description)}
                className="px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0 flex items-start gap-3"
              >
                <div className="mt-0.5">
                  {getIconForType(suggestion.types)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">
                    {mainText}
                  </div>
                  {secondaryText && (
                    <div className="text-gray-400 text-sm truncate">
                      {secondaryText}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
