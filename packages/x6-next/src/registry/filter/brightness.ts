import { getNumber } from './util'

export interface BrightnessArgs {
  /**
   * The proportion of the conversion.
   * A value of `1` leaves the input unchanged.
   * A value of `0` will create an image that is completely black.
   *
   * Default `1`.
   */
  amount?: number
}

export function brightness(args: BrightnessArgs = {}) {
  const amount = getNumber(args.amount, 1)
  return `
    <filter>
      <feComponentTransfer>
        <feFuncR type="linear" slope="${amount}"/>
        <feFuncG type="linear" slope="${amount}"/>
        <feFuncB type="linear" slope="${amount}"/>
      </feComponentTransfer>
    </filter>
  `.trim()
}
