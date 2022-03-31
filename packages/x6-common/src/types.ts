/* eslint-disable @typescript-eslint/ban-types */
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
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
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
export interface KeyValue<T extends any = any> {
  [key: string]: T
}

export type Nilable<T> = T | null | undefined

export type ValuesType<
  T extends ReadonlyArray<any> | ArrayLike<any> | Record<any, any>,
> = T extends ReadonlyArray<any>
  ? T[number]
  : T extends ArrayLike<any>
  ? T[number]
  : T extends object
  ? T[keyof T]
  : never

export type NonUndefined<A> = A extends undefined ? never : A

export type FunctionKeys<T extends object> = {
  [K in keyof T]-?: NonUndefined<T[K]> extends Function ? K : never
}[keyof T]

// css
type Globals = '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset'
type BgPosition<TLength> =
  | TLength
  | 'bottom'
  | 'center'
  | 'left'
  | 'right'
  | 'top'
  | (string & {})
type BgSize<TLength> = TLength | 'auto' | 'contain' | 'cover' | (string & {})
type RepeatStyle =
  | 'no-repeat'
  | 'repeat'
  | 'repeat-x'
  | 'repeat-y'
  | 'round'
  | 'space'
  | (string & {})
export type BackgroundPosition<TLength = (string & {}) | 0> =
  | Globals
  | BgPosition<TLength>
  | (string & {})
export type BackgroundSize<TLength = (string & {}) | 0> =
  | Globals
  | BgSize<TLength>
  | (string & {})
export type BackgroundRepeat = Globals | RepeatStyle | (string & {})
export interface Padding {
  left: number
  top: number
  right: number
  bottom: number
}
