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

export type KeyPoint =
  | 'center'
  | 'origin'
  | 'corner'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'rightMiddle'
  | 'leftMiddle'

type CamelToKebab<S extends string> = S extends `${infer C}${infer R}`
  ? C extends Uppercase<C>
    ? `-${Lowercase<C>}${CamelToKebab<R>}`
    : `${C}${CamelToKebab<R>}`
  : S

type RemoveLeadingHyphen<S extends string> = S extends `-${infer Rest}`
  ? Rest
  : S

// 将 camelCase 转为 kebab-case
export type CamelToKebabCase<S extends string> = RemoveLeadingHyphen<
  CamelToKebab<S>
>
