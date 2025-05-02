'use client';

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { useEffect } from 'react';

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
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'br' },
    },
    debounce: 300,
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
        <ul className="absolute top-full mt-1 w-full bg-background border border-white/10 rounded-xl max-h-48 overflow-y-auto z-50">
          {data.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion.description)}
              className="px-4 py-2 cursor-pointer hover:bg-white/10 text-white"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
