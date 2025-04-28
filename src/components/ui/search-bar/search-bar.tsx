'use client'

import { useState, useEffect } from 'react'
import Loader from '../loader/loader'

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
  initialValue?: string | null
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
  const [hasSelected, setHasSelected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialValue) {
      setQuery(initialValue)
      setHasSelected(true) // se já veio preenchido, já está selecionado
    }
  }, [initialValue])

  useEffect(() => {
    if (hasSelected) return

    if (query.length < 3) {
      setResults([])
      return
    }

    if (typingTimeout) clearTimeout(typingTimeout)

      const timeout = setTimeout(async () => {
        try {
          setIsLoading(true) // começa loading
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}`
          )
          const data = await res.json()
          setResults(data.slice(0, 5))
        } catch (error) {
          console.error('Erro ao buscar sugestões:', error)
        } finally {
          setIsLoading(false) // encerra loading
        }
      }, 400)      

    setTypingTimeout(timeout)
  }, [query, hasSelected])

  const handleSelect = (item: Suggestion) => {
    const coords: [number, number] = [parseFloat(item.lat), parseFloat(item.lon)]
    const label = formatAddress(item)

    setResults([])
    setQuery(label)
    setHasSelected(true)
    onSelect(coords, label)
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (results.length > 0) {
        handleSelect(results[0])
      } else {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}`
          )
          const data: Suggestion[] = await res.json()
          if (data.length > 0) handleSelect(data[0])
        } catch (error) {
          console.error('Erro na busca (Enter):', error)
        }
      }
    }
  }

  const handleEdit = () => {
    setHasSelected(false)
    setQuery('')
    setResults([])
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          readOnly={hasSelected} // readonly depois de escolher
          className="bg-transparent text-white placeholder:text-gray-400 outline-none flex-1 px-2 py-2"
        />

        {isLoading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Loader size={16} />
        </div>
      )}

        {!isLoading && hasSelected && (
          <button
            onClick={handleEdit}
            className="ml-2 text-xs text-gray-400 underline"
          >
            Editar
          </button>
        )}
      </div>

      {results.length > 0 && !hasSelected && (
        <ul className="absolute mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-50 max-h-60 overflow-y-auto animate-fade-in">
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
