export interface KeyValue<T = any> {
  [key: string]: T
}

export type ViewEvents = KeyValue<string | Function>

export type OnWheelGuard = (e: WheelEvent) => boolean
export type OnWheelCallback = (
  e: WheelEvent,
  deltaX?: number,
  deltaY?: number,
) => void

export interface PointLike {
  x: number
  y: number
}
export type PointData = [number, number]

export type PointBearing = 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'N'

export type PointOptions = PointLike | PointData
