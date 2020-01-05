export namespace Lang {
  export const isNull = (value: any): value is null => value === null

  export const isUndefined = (value: any): value is undefined =>
    typeof value === 'undefined'

  export const isNil = (value: any): value is null | undefined => value == null

  export const isString = (value: any): value is string =>
    value instanceof String || typeof value === 'string'

  export const isNumber = (value: any): value is number =>
    value instanceof Number || typeof value === 'number'

  export const isBoolean = (value: any): value is boolean =>
    value instanceof Boolean || typeof value === 'boolean'

  export function isObject(value: any): value is object | Function {
    if (!value) {
      return false
    }

    return typeof value === 'function' || typeof value === 'object'
  }

  export function isType(value: any, type: string) {
    return Object.prototype.toString.call(value) === `[object ${type}]`
  }

  export const isArray = (value: any): value is [] => Array.isArray(value)

  export const isWindow = (value: any): value is Window =>
    value && value === value.window

  export const isNumeric = (value: any) =>
    !isArray(value) && value - parseFloat(value) + 1 >= 0

  export const isFunction = (value: any): value is Function =>
    isType(value, 'Function')

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
}
