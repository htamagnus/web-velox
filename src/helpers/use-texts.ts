import messages from '../messages/pt.json'

export function useTexts(basePath?: string) {
    function t(path: string): string {
      const fullPath = basePath ? `${basePath}.${path}` : path
      const keys = fullPath.split('.')
      let result: any = messages
  
      for (const key of keys) {
        result = result?.[key]
        if (result === undefined) {
          console.warn(`Texto não encontrado para a chave: "${fullPath}"`)
          return fullPath
        }
      }
  
      return result
    }
  
    return { t }
  }
