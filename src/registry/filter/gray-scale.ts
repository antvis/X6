import { getNumber } from './util'

export interface GrayScaleArgs {
  /**
   * The proportion of the conversion.
   * A value of `1` is completely grayscale.
   * A value of `0` leaves the input unchanged.
   *
   * Default `1`.
   */
  amount?: number
}

export function grayScale(args: GrayScaleArgs = {}) {
  const amount = getNumber(args.amount, 1)
  const a = 0.2126 + 0.7874 * (1 - amount)
  const b = 0.7152 - 0.7152 * (1 - amount)
  const c = 0.0722 - 0.0722 * (1 - amount)
  const d = 0.2126 - 0.2126 * (1 - amount)
  const e = 0.7152 + 0.2848 * (1 - amount)
  const f = 0.0722 - 0.0722 * (1 - amount)
  const g = 0.2126 - 0.2126 * (1 - amount)
  const h = 0.0722 + 0.9278 * (1 - amount)

  return `
    <filter>
      <feColorMatrix type="matrix" values="${a} ${b} ${c} 0 0 ${d} ${e} ${f} 0 0 ${g} ${b} ${h} 0 0 0 0 0 1 0"/>
    </filter>
  `.trim()
}
