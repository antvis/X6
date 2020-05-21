export type Nilable<T> = T | null | undefined

export interface KeyValue<T extends any = any> {
  [key: string]: T
}

export interface Padding {
  left: number
  top: number
  right: number
  bottom: number
}

export interface Size {
  width: number
  height: number
}
