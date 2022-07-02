import { getNumber } from './util'

export interface BlurArgs {
  /**
   * Horizontal blur. Default `2`
   */
  x?: number
  /**
   * Vertical blur.
   */
  y?: number
}

export function blur(args: BlurArgs = {}) {
  const x = getNumber(args.x, 2)
  const stdDeviation =
    args.y != null && Number.isFinite(args.y) ? [x, args.y] : x

  return `
    <filter>
      <feGaussianBlur stdDeviation="${stdDeviation}"/>
    </filter>
  `.trim()
}
