'use client';

import { useEffect, useState, useCallback, useRef, useId } from 'react';
import { X } from 'lucide-react';
import { useLocale } from '@/contexts/locale-context';
import { useTexts } from '@/helpers/use-texts';

type Props = {
  label: string;
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

// o campo de lugar como os do login: rótulo em cima, só o fio embaixo, sugestões numa lista solta
export default function AutocompleteInput({
  label,
  placeholder,
  initialValue,
  onSelect,
  onClear,
}: Props) {
  const { locale } = useLocale();
  const { t } = useTexts('plannerPanel');
  const id = useId();
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
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

    try {
      const { AutocompleteSuggestion } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;

      const request = {
        input,
        language: locale === 'pt' ? 'pt-BR' : 'en',
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
    }
  }, [ready, userLocation, locale]);

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
        requestedLanguage: locale === 'pt' ? 'pt-BR' : 'en',
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

  return (
    <div className="field place">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <div className="place__box">
        <input
          id={id}
          className="field__input"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          disabled={!ready}
          maxLength={500}
          autoComplete="off"
        />
        {value && (
          <button type="button" className="place__clear" onClick={handleClear} aria-label={t('clear')}>
            <X size={18} />
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="place__list">
          {suggestions.map((suggestion) => (
            <li key={suggestion.placeId}>
              <button type="button" className="place__option" onClick={() => handleSelect(suggestion)}>
                <b>{suggestion.mainText}</b>
                {suggestion.secondaryText && <span>{suggestion.secondaryText}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
