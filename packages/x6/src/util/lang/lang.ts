export {
  isNull,
  isNil,
  isUndefined,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isArrayLike,
  isFunction,
} from 'lodash-es'

export const isWindow = (value: any): value is Window =>
  value && value === value.window

export const isNumeric = (value: any) =>
  !Array.isArray(value) && value - parseFloat(value) + 1 >= 0
