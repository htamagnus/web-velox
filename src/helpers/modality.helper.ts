export function getModalityLabel(modality: Modality): string {
    switch (modality) {
      case 'road':
        return 'Speed (Road)'
      case 'mtb':
        return 'MTB (Trilha)'
      default:
        return 'Geral'
    }
  }