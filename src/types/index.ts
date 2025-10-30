export interface KeyValue<T = any> {
  [key: string]: T
}

export type ViewEvents = KeyValue<string | Function>
