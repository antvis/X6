export interface PointLike {
  x: number
  y: number
}
export type PointData = [number, number]
export interface Translation {
  tx: number
  ty: number
}
export interface Rotation {
  angle: number
  cx?: number
  cy?: number
}
export interface Scale {
  sx: number
  sy: number
}
export interface Size {
  width: number
  height: number
}

export type Nilable<T> = T | null | undefined
export interface KeyValue<T extends any = any> {
  [key: string]: T
}
