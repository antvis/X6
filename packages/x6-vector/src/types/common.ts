export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined

export const isPrimitive = (val: any): val is Primitive => {
  if (val === null || val === undefined) {
    return true
  }
  switch (typeof val) {
    case 'string':
    case 'number':
    case 'bigint':
    case 'boolean':
    case 'symbol': {
      return true
    }
    default:
      return false
  }
}

export type Falsy = false | '' | 0 | null | undefined

export const isFalsy = (val: any): val is Falsy => !val

export type Nullish = null | undefined

export const isNullish = (val: any): val is Nullish => val == null // eslint-disable-line eqeqeq

export type KeyValue<T = any> = Record<string | number, T>

// export type Attrs = Record<string, string | number | null | undefined>

export interface Class<Args extends [] = any, ReturnType = any> {
  new (...args: Args): ReturnType
}

export type Entity = Record<any, any>
