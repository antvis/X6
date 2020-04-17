import { getNumber } from './util'

export interface ContrastArgs {
  /**
   * The proportion of the conversion.
   * A value of `1` leaves the input unchanged.
   * A value of `0` will create an image that is completely black.
   *
   * Default `1`.
   */
  amount?: number
}

export function contrast(args: ContrastArgs = {}) {
  const amount = getNumber(args.amount, 1)
  const amount2 = 0.5 - amount / 2

  return `
    <filter>
     <feComponentTransfer>
        <feFuncR type="linear" slope="${amount}" intercept="${amount2}"/>
        <feFuncG type="linear" slope="${amount}" intercept="${amount2}"/>
        <feFuncB type="linear" slope="${amount}" intercept="${amount2}"/>
      </feComponentTransfer>
    </filter>
  `.trim()
}
