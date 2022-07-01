import { getNumber } from './util'

export interface HueRotateArgs {
  /**
   * The number of degrees around the color.
   *
   * Default `0`.
   */
  angle?: number
}

export function hueRotate(args: HueRotateArgs = {}) {
  const angle = getNumber(args.angle, 0)
  return `
      <filter>
        <feColorMatrix type="hueRotate" values="${angle}"/>
      </filter>
    `.trim()
}
