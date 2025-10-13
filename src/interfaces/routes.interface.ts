export type Modality = 'general' | 'road' | 'mtb'

export type GetPlannedRouteInputDto = {
  origin: string
  destination: string
  modality: Modality
}

type ElevationPoint = {
  distance: number
  elevation: number
}

type RouteAlternative = {
  distanceKm: number
  estimatedTimeMinutes: number
  estimatedCalories: number
  elevationGain: number
  elevationLoss: number
  polyline: string
  averageSpeedUsed: number
  elevationProfile?: ElevationPoint[]
  summary?: string
  warnings?: string[]
}
  
export type GetPlannedRouteResponseDto = {
  distanceKm: number
  estimatedTimeMinutes: number
  estimatedCalories: number
  elevationGain: number
  elevationLoss: number
  polyline: string
  averageSpeedUsed: number
  alternatives?: RouteAlternative[]
}

export type SaveRouteDto = {
  origin: string
  destination: string
  modality: Modality
  polyline: string
  distanceKm: number
  estimatedTimeMinutes: number
  elevationGain: number
  elevationLoss: number
  estimatedCalories: number
  averageSpeedUsed: number
}