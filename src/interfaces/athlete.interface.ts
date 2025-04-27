export type CreateAthleteDto = {
    name: string
    email: string
    age: number
    weight: number
    height: number
    averageSpeedRoad: number
    averageSpeedMtb: number
    averageSpeedGeneral: number
}
  
export type Athlete = {
    id: string
    name: string
    email: string
    age: number
    weight: number
    height: number
    averageSpeedRoad: number
    averageSpeedMtb: number
    averageSpeedGeneral: number
    createdAt: string
    updatedAt: string
}  

export type UpdateAthleteDto = {
    name?: string
    email?: string
    age?: number
    weight?: number
    height?: number
    averageSpeedRoad?: number
    averageSpeedMtb?: number
    averageSpeedGeneral?: number
}