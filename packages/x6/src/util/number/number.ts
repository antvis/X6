export {
  isNaN,
  isNumber,
  isFinite,
  isInteger,
  isSafeInteger,
  clamp,
  inRange,
  toFinite,
  toNumber,
  toInteger,
  toSafeInteger,
  parseInt,
} from 'lodash-es'
export { isNumeric } from '../lang/lang'

/**
 * Returns the remainder of division of `n` by `m`. You should use this
 * instead of the built-in operation as the built-in operation does not
 * properly handle negative numbers.
 */
export function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

export function random(lower: number, upper: number) {
  if (upper == null) {
    upper = lower == null ? 1 : lower // eslint-disable-line
    lower = 0 // eslint-disable-line
  } else if (upper < lower) {
    const tmp = lower
    lower = upper // eslint-disable-line
    upper = tmp // eslint-disable-line
  }
  return Math.floor(Math.random() * (upper - lower + 1) + lower)
}

export function isPercentage(val: any): val is string {
  return typeof val === 'string' && val.slice(-1) === '%'
}

export function normalizePercentage(
  num: number | string | null | undefined,
  ref: number,
) {
  if (num == null) {
    return 0
  }

  let raw: number

  if (typeof num === 'string') {
    raw = parseFloat(num)
    if (isPercentage(num)) {
      raw /= 100
      if (Number.isFinite(raw)) {
        return raw * ref
      }
    }
  } else {
    raw = num
  }

  if (!Number.isFinite(raw)) {
    return 0
  }

  if (raw > 0 && raw < 1) {
    return raw * ref
  }

  return raw
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

export type SideOptions =
  | number
  | {
      vertical?: number
      horizontal?: number
      left?: number
      top?: number
      right?: number
      bottom?: number
    }

export function normalizeSides(box?: SideOptions) {
  if (typeof box === 'object') {
    let left = 0
    let top = 0
    let right = 0
    let bottom = 0

    if (box.vertical != null && Number.isFinite(box.vertical)) {
      top = bottom = box.vertical
    }
    if (box.horizontal != null && Number.isFinite(box.horizontal)) {
      right = left = box.horizontal
    }

    if (box.left != null && Number.isFinite(box.left)) left = box.left
    if (box.top != null && Number.isFinite(box.top)) top = box.top
    if (box.right != null && Number.isFinite(box.right)) right = box.right
    if (box.bottom != null && Number.isFinite(box.bottom)) bottom = box.bottom

    return { top, right, bottom, left }
  }

  let val = 0
  if (box != null && Number.isFinite(box)) {
    val = box
  }

  return { top: val, right: val, bottom: val, left: val }
}
