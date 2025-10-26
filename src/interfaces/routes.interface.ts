export type Modality = 'general' | 'road' | 'mtb'

export enum TrafficSeverity {
  NORMAL = 'normal',
  INTENSE = 'intense',
  CONGESTED = 'congested',
}

export enum WeatherCondition {
  SUNNY = 'sunny',
  CLOUDY = 'cloudy',
  RAINY = 'rainy',
  STORMY = 'stormy',
  SNOWY = 'snowy',
}

export type WeatherAlert = {
  type: 'high_rain' | 'extreme_temp' | 'strong_wind'
  severity: 'low' | 'medium' | 'high'
  message: string
  time?: Date
}

export type WeatherData = {
  condition: WeatherCondition
  temperature: number
  rainProbability: number
  windSpeed: number
  alerts: WeatherAlert[]
  timestamp: Date
}

export type GetWeatherOutputDto = {
  weather: WeatherData
}

export type TrafficSegment = {
  startPoint: [number, number]
  endPoint: [number, number]
  severity: TrafficSeverity
  speedKmh: number
  speedLimit: number
  duration: number
}

export type TrafficData = {
  overallSeverity: TrafficSeverity
  segments: TrafficSegment[]
  updatedAt: Date
  delayMinutes: number
}

export type GetTrafficOutputDto = {
  traffic: TrafficData
}

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