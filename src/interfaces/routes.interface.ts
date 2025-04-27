type Modality = 'general' | 'road' | 'mtb'

type GetPlannedRouteInputDto = {
  origin: string
  destination: string
  modality: Modality
}
  
type GetPlannedRouteResponseDto = {
  distanceKm: number
  estimatedTimeMinutes: number
  estimatedCalories: number
  elevationGain: number
  elevationLoss: number
  polyline: string
}

type SaveRouteDto = {
  origin: string
  destination: string
  modality: Modality
  polyline: string
  distanceKm: number
  estimatedTimeMinutes: number
  elevationGain: number
  elevationLoss: number
  estimatedCalories: number
}