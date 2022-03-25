// geometry
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

// utility-types
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K // eslint-disable-line
}[keyof T]

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never // eslint-disable-line
}[keyof T]

export type PickByValue<T, ValueType> = Pick<
  T,
  {
    [Key in keyof T]-?: T[Key] extends ValueType ? Key : never
  }[keyof T]
>

export type OmitByValue<T, ValueType> = Pick<
  T,
  {
    [Key in keyof T]-?: T[Key] extends ValueType ? never : Key
  }[keyof T]
>
