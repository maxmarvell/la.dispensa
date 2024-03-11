export type TimeAndTemperatureType = {
  hours?: number
  minutes?: number
  temperature?: number
  unit?: "C" | "K"
}

export interface BaseInstructionType {
  description: string
  step: number
  timeAndTemperature?: TimeAndTemperatureType
}