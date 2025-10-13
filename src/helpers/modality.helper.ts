import { Modality } from "@/interfaces/routes.interface"

export function getModalityLabel(modality: Modality): string {
    switch (modality) {
      case 'road':
        return 'speed (estrada)'
      case 'mtb':
        return 'mtb (trilha)'
      default:
        return 'geral (urbano)'
    }
  }