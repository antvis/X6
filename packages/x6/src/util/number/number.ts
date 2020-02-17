export {
  isNumber,
  isFinite,
  isNaN,
  isInteger,
  isSafeInteger,
  clamp,
  inRange,
  toFinite,
  toNumber,
  toInteger,
  toSafeInteger,
  parseInt,
} from 'lodash'

export { isNumeric } from '../lang/lang'

/**
 * Returns the remainder of division of `n` by `m`. You should use this
 * instead of the built-in operation as the built-in operation does not
 * properly handle negative numbers.
 */
export function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

export function isPercentage(val: any): val is string {
  return typeof val === 'string' && val.slice(-1) === '%'
}

export function parseCssNumeric(val: string, units?: string | string[]) {
  function getUnit(regexp: string) {
    const matches = new RegExp(`(?:\\d+(?:\\.\\d+)*)(${regexp})$`).exec(val)
    if (!matches) {
      return null
    }

    return matches[1]
  }

  const number = parseFloat(val)

  if (Number.isNaN(number)) {
    return null
  }

  // determine the unit
  let regexp: string
  if (units == null) {
    // accept any unit, as well as no unit
    regexp = '[A-Za-z]*'
  } else if (Array.isArray(units)) {
    if (units.length === 0) {
      return null
    }

    regexp = units.join('|')
  } else if (typeof units === 'string') {
    regexp = units
  }

  const unit = getUnit(regexp!)

  if (unit === null) {
    return null
  }

  return {
    unit,
    value: number,
  }
}
