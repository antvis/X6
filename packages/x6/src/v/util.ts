export const isArray = Array.isArray
export const isString = (o: any): o is string => typeof o === 'string'
export const isObject = (o: any): o is object => typeof o === 'object'
export const isFunction = (o: any): o is Function => typeof o === 'function'
export const isUndefined = (o: any): o is undefined => typeof o === 'undefined'

export function toNumber(o: any, defaultValue: number) {
  if (o == null) {
    return defaultValue
  }

  const v = parseFloat(o)
  return isNaN(v) ? defaultValue : v
}
