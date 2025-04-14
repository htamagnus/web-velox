'use client'

import { useState, useEffect } from 'react'

type Suggestion = {
  display_name: string
  lat: string
  lon: string
  address?: {
    city?: string
    town?: string
    village?: string
    hamlet?: string
    municipality?: string
    state?: string
    region?: string
    county?: string
  }
}

type Props = {
  onSelect: (coords: [number, number], label: string) => void
  placeholder?: string
  initialValue?: [number, number]
}

function formatAddress(item: Suggestion): string {
  if (!item.address) return item.display_name

  const a = item.address
  const city = a.city || a.town || a.village || a.hamlet || a.municipality
  const state = a.state || a.region || a.county

  return city && state ? `${city}, ${state}` : item.display_name
}

export default function SearchBar({
  onSelect,
  placeholder = 'Buscar local...',
  initialValue,
}: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Suggestion[]>([])
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const [justSelected, setJustSelected] = useState(false)

  useEffect(() => {
    if (initialValue) {
      const [lat, lon] = initialValue

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`)
        .then(res => res.json())
        .then(data => {
          const label = formatAddress(data)
          setQuery(label)
        })
        .catch(err => {
          console.error('Erro ao buscar nome do local:', err)
        })
    }
  }, [initialValue])

  // autocomplete de busca
  useEffect(() => {
    if (justSelected) {
      setJustSelected(false)
      return
    }
  
    if (query.length < 3) {
      setResults([])
      return
    }
  
    if (typingTimeout) clearTimeout(typingTimeout)
  
    const timeout = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}`
      )
      const data = await res.json()
      setResults(data.slice(0, 5))
    }, 400)
  
    setTypingTimeout(timeout)
  }, [query])

  // quando usuário seleciona um item
  const handleSelect = (item: Suggestion) => {
    const coords: [number, number] = [parseFloat(item.lat), parseFloat(item.lon)]
    const label = formatAddress(item)

    setResults([]) // fecha sugestões imediatamente
    setQuery(label)
    setJustSelected(true) 
    onSelect(coords, label)
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-white placeholder:text-gray-400 outline-none flex-1 px-2 py-2"
      />

      {results.length > 0 && (
        <ul className="absolute mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-50 max-h-60 overflow-y-auto">
          {results.map((item) => (
            <li
              key={item.display_name}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
            >
              {formatAddress(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
