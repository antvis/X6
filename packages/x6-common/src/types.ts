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

export type Listener = (element: Element) => void

export interface Sensor {
  element: Element
  bind: (listener: Listener) => void
  unbind: (listener: Listener) => void
  destroy: () => void
}
