'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { MapPin, Building2, Home, X } from 'lucide-react';

type Props = {
  icon?: React.ReactNode;
  placeholder: string;
  initialValue?: string;
  onSelect: (coords: [number, number], label: string) => void;
  onClear?: () => void;
};

type PlaceSuggestion = {
  placeId: string;
  mainText: string;
  secondaryText: string;
  types: string[];
  fullText: string;
};

export default function AutocompleteInput({
  icon,
  placeholder,
  initialValue,
  onSelect,
  onClear,
}: Props) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
      );
    }
  }, []);

  useEffect(() => {
    const initPlacesLibrary = async () => {
      try {
        await google.maps.importLibrary('places');
        setReady(true);
      } catch (error) {
        console.error('erro ao carregar biblioteca places:', error);
      }
    };

    if (typeof google !== 'undefined') {
      initPlacesLibrary();
    }
  }, []);

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input.trim() || !ready) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const { AutocompleteSuggestion } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;

      const request = {
        input,
        includedRegionCodes: ['BR'],
        language: 'pt-BR',
        locationBias: userLocation ? {
          center: userLocation,
          radius: 50000,
        } : undefined,
      };

      const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

      const formattedSuggestions: PlaceSuggestion[] = response.suggestions
        .filter((suggestion) => suggestion.placePrediction)
        .map((suggestion) => {
          const prediction = suggestion.placePrediction;
          if (!prediction) {
            return null;
          }
          return {
            placeId: prediction.placeId,
            mainText: prediction.mainText?.text || '',
            secondaryText: prediction.secondaryText?.text || '',
            types: prediction.types || [],
            fullText: prediction.text?.text || '',
          };
        })
        .filter((s): s is PlaceSuggestion => s !== null);

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('erro ao buscar sugestões:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [ready, userLocation]);

  const handleInputChange = (newValue: string) => {
    setValue(newValue);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (newValue.trim() === '') {
      setSuggestions([]);
      if (onClear) {
        onClear();
      }
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleSelect = async (suggestion: PlaceSuggestion) => {
    setValue(suggestion.fullText);
    setSuggestions([]);

    try {
      const { Place } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;
      const place = new Place({
        id: suggestion.placeId,
        requestedLanguage: 'pt-BR',
      });

      await place.fetchFields({
        fields: ['location'],
      });

      if (place.location) {
        const lat = place.location.lat();
        const lng = place.location.lng();
        onSelect([lat, lng], suggestion.fullText);
      }
    } catch (error) {
      console.error('erro ao obter coordenadas:', error);
    }
  };

  const handleClear = () => {
    setValue('');
    setSuggestions([]);
    if (onClear) {
      onClear();
    }
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
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          disabled={!ready}
          className="bg-transparent outline-none w-full text-white placeholder:text-gray-400 font-medium"
        />
        {value && (
          <button
            onClick={handleClear}
            className="flex-shrink-0 text-copy/40 hover:text-copy transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute top-full mt-2 w-full bg-gradient-to-b from-[#1a2234] to-[#0f1419] border border-white/10 rounded-xl max-h-64 overflow-y-auto z-50 shadow-2xl backdrop-blur-xl">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.placeId}
              onClick={() => handleSelect(suggestion)}
              className="px-4 py-3.5 cursor-pointer hover:bg-primary-light/10 transition-all duration-200 border-b border-white/5 last:border-b-0 flex items-start gap-3 group"
            >
              <div className="mt-0.5 group-hover:scale-110 transition-transform">
                {getIconForType(suggestion.types)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold truncate group-hover:text-primary-light transition-colors">
                  {suggestion.mainText}
                </div>
                {suggestion.secondaryText && (
                  <div className="text-gray-400 text-sm truncate mt-0.5">
                    {suggestion.secondaryText}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
