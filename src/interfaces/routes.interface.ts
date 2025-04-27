type GetPlannedRouteInputDto = {
    origin: string
    destination: string
    modality: 'road' | 'mtb' | 'general'
  }
  
  type GetPlannedRouteResponseDto = {
    distanceKm: number
    estimatedTimeMinutes: number
    estimatedCalories: number
    elevationGain: number
    elevationLoss: number
    polyline: string
  }
  