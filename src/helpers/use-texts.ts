import ptMessages from '../messages/pt.json'
import enMessages from '../messages/en.json'
import { useCallback } from 'react'
import { useLocale } from '@/contexts/locale-context'

type NestedMessages = Record<string, unknown>

const messagesMap = {
  pt: ptMessages as unknown as NestedMessages,
  en: enMessages as unknown as NestedMessages,
}

export function useTexts(basePath?: string) {
  const { locale } = useLocale()
  
  const t = useCallback((path: string): string => {
    const messages = messagesMap[locale]
    const fullPath = basePath ? `${basePath}.${path}` : path
    const keys = fullPath.split('.')
    let result: unknown = messages

    for (const key of keys) {
      if (typeof result !== 'object' || result === null) {
        console.warn(`texto não encontrado para a chave: "${fullPath}"`)
        return fullPath
      }
      const current = (result as NestedMessages)[key]
      if (current === undefined) {
        console.warn(`texto não encontrado para a chave: "${fullPath}"`)
        return fullPath
      }
      result = current
    }

    return typeof result === 'string' ? result : fullPath
  }, [basePath, locale])

  return { t }
}
