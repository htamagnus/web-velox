'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Locale = 'pt' | 'en'

type LocaleContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

const LOCALE_STORAGE_KEY = 'velox-locale'

function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'pt'
  
  const browserLang = navigator.language.toLowerCase()
  
  if (browserLang.startsWith('en')) return 'en'
  if (browserLang.startsWith('pt')) return 'pt'
  
  return 'pt'
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('pt')

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    
    if (stored && (stored === 'pt' || stored === 'en')) {
      setLocaleState(stored)
      if (typeof window !== 'undefined') {
        document.documentElement.lang = stored === 'pt' ? 'pt-BR' : 'en'
      }
    } else {
      const detected = detectBrowserLocale()
      setLocaleState(detected)
      localStorage.setItem(LOCALE_STORAGE_KEY, detected)
      if (typeof window !== 'undefined') {
        document.documentElement.lang = detected === 'pt' ? 'pt-BR' : 'en'
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
    
    if (typeof window !== 'undefined') {
      document.documentElement.lang = newLocale === 'pt' ? 'pt-BR' : 'en'
    }
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
