export * from './align'
export * from './style'

export interface KeyValue<T extends any = any> {
  [key: string]: T
}

export type Nullable<T> = T | null | undefined | void

export interface Padding {
  left: number
  top: number
  right: number
  bottom: number
}
