'use client';

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { useEffect, useState } from 'react';
import { MapPin, Building2, Home, X } from 'lucide-react';

type Props = {
  icon?: React.ReactNode;
  placeholder: string;
  initialValue?: string;
  onSelect: (coords: [number, number], label: string) => void;
  onClear?: () => void;
};

export default function AutocompleteInput({
  icon,
  placeholder,
  initialValue,
  onSelect,
  onClear,
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
      <div className="flex items-center gap-3 bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 focus-within:border-primary-light/50 px-4 py-3.5 rounded-xl transition-all duration-200 shadow-sm">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <input
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            setValue(newValue);
            if (newValue.trim() === '') {
              clearSuggestions();
              if (onClear) onClear();
            }
          }}
          placeholder={placeholder}
          disabled={!ready}
          className="bg-transparent outline-none w-full text-white placeholder:text-gray-400 font-medium"
        />
        {value && (
          <button
            onClick={() => {
              setValue('', false);
              clearSuggestions();
              if (onClear) onClear();
            }}
            className="flex-shrink-0 text-copy/40 hover:text-copy transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {status === 'OK' && (
        <ul className="absolute top-full mt-2 w-full bg-gradient-to-b from-[#1a2234] to-[#0f1419] border border-white/10 rounded-xl max-h-64 overflow-y-auto z-50 shadow-2xl backdrop-blur-xl">
          {data.map((suggestion) => {
            const mainText = suggestion.structured_formatting.main_text;
            const secondaryText = suggestion.structured_formatting.secondary_text;
            
            return (
              <li
                key={suggestion.place_id}
                onClick={() => handleSelect(suggestion.description)}
                className="px-4 py-3.5 cursor-pointer hover:bg-primary-light/10 transition-all duration-200 border-b border-white/5 last:border-b-0 flex items-start gap-3 group"
              >
                <div className="mt-0.5 group-hover:scale-110 transition-transform">
                  {getIconForType(suggestion.types)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold truncate group-hover:text-primary-light transition-colors">
                    {mainText}
                  </div>
                  {secondaryText && (
                    <div className="text-gray-400 text-sm truncate mt-0.5">
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
