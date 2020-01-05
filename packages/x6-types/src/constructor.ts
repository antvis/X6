export type GetConstructorArgs<T> = T extends new (...args: infer U) => any
  ? U
  : never
