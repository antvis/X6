import { getNumber } from './util'

export interface SepiaArgs {
  /**
   * The proportion of the conversion.
   * A value of `1` is completely sepia.
   * A value of `0` leaves the input unchanged.
   *
   * Default `1`.
   */
  amount?: number
}
export function sepia(args: SepiaArgs = {}) {
  const amount = getNumber(args.amount, 1)
  const a = 0.393 + 0.607 * (1 - amount)
  const b = 0.769 - 0.769 * (1 - amount)
  const c = 0.189 - 0.189 * (1 - amount)
  const d = 0.349 - 0.349 * (1 - amount)
  const e = 0.686 + 0.314 * (1 - amount)
  const f = 0.168 - 0.168 * (1 - amount)
  const g = 0.272 - 0.272 * (1 - amount)
  const h = 0.534 - 0.534 * (1 - amount)
  const i = 0.131 + 0.869 * (1 - amount)

  return `
      <filter>
        <feColorMatrix type="matrix" values="${a} ${b} ${c} 0 0 ${d} ${e} ${f} 0 0 ${g} ${h} ${i} 0 0 0 0 0 1 0"/>
      </filter>
    `.trim()
}
