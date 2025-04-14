type GetPlannedRouteInputDto = {
    origin: {
      lat: number
      lng: number
    }
    destination: {
      lat: number
      lng: number
    }
    modality: 'road' | 'mtb'
  }
  
  type GetPlannedRouteResponseDto = {
    distanceKm: number
    estimatedTimeMinutes: number
    estimatedCalories: number
    elevationGain: number
    elevationLoss: number
    polyline: string
  }
  