import rawMessages from '../messages/pt.json'
import { useCallback } from 'react'

type NestedMessages = Record<string, unknown>
const messages = rawMessages as unknown as NestedMessages

export function useTexts(basePath?: string) {
    const t = useCallback((path: string): string => {
      const fullPath = basePath ? `${basePath}.${path}` : path
      const keys = fullPath.split('.')
      let result: unknown = messages

      for (const key of keys) {
        if (typeof result !== 'object' || result === null) {
          console.warn(`Texto não encontrado para a chave: "${fullPath}"`)
          return fullPath
        }
        const current = (result as NestedMessages)[key]
        if (current === undefined) {
          console.warn(`Texto não encontrado para a chave: "${fullPath}"`)
          return fullPath
        }
        result = current
      }

      return typeof result === 'string' ? result : fullPath
    }, [basePath])

    return { t }
  }
