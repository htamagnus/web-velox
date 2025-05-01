import React from 'react';
import SearchBar from '../ui/search-bar/search-bar';

type Props = {
  icon: React.ReactNode;
  placeholder: string;
  initialValue?: string;
  onSelect: (coords: [number, number], label: string) => void;
};

export default function RouteInput({ icon, placeholder, initialValue, onSelect }: Props) {
  return (
    <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
      <span className="mr-2 text-gray-300">{icon}</span>
      <SearchBar placeholder={placeholder} initialValue={initialValue} onSelect={onSelect} />
    </div>
  );
}
