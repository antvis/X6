import { Lang } from '../lang'

export namespace NumberExt {
  export const isNumber = Lang.isNumber
  export const isNumeric = Lang.isNumeric

  /**
   * Returns the remainder of division of `n` by `m`. You should use this
   * instead of the built-in operation as the built-in operation does not
   * properly handle negative numbers.
   */
  export function mod(n: number, m: number) {
    return ((n % m) + m) % m
  }

  export function clamp(value: number, min: number, max: number) {
    if (isNaN(value)) {
      return NaN
    }

    if (isNaN(min) || isNaN(max)) {
      return 0
    }

    return min < max
      ? value < min
        ? min
        : value > max
        ? max
        : value
      : value < max
      ? max
      : value > min
      ? min
      : value
  }

  export function inRange(value: number, min: number, max: number) {
    return min < max
      ? value >= min && value <= max
      : value >= max && value <= min
  }
}
