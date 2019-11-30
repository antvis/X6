export const isNil = (val: any) => val == null
export const isNull = (val: any) => val === null

export const isString = (val: any) =>
  val instanceof String || typeof val === 'string'

export const isNumber = (val: any) =>
  val instanceof Number || typeof val === 'number'

export const isBoolean = (val: any) =>
  val instanceof Boolean || typeof val === 'boolean'

export const isUndefined = (val: any) => typeof val === 'undefined'

export function isObject(val: any) {
  if (!val) {
    return false
  }

  return typeof val === 'function' || typeof val === 'object'
}

export function isType(val: any, type: string) {
  return Object.prototype.toString.call(val) === `[object ${type}]`
}

export const isArray = (val: any) => Array.isArray(val)
export const isWindow = (val: any) => val && val === val.window
export const isNumeric = (val: any) =>
  !isArray(val) && val - parseFloat(val) + 1 >= 0
export const isFunction = (val: any) => isType(val, 'Function')

export function isArrayLike(val: any) {
  if (isArray(val)) {
    return true
  }

  if (
    isNil(val) ||
    isFunction(val) ||
    isWindow(val) ||
    isNumber(val) ||
    isString(val) ||
    isBoolean(val)
  ) {
    return false
  }

  const len = !!val && 'length' in val && val.length
  return len === 0 || (typeof len === 'number' && len > 0 && len - 1 in val)
}
