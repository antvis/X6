import * as util from '../../util'
import { Style } from '../../types'
import { constants } from '../../common'

export function getFactor(
  style: Style,
  defaultFactor: number,
  size: number,
  max: number = 1,
  key: string = 'factor',
) {
  const factor = util.getNumber(style, key, defaultFactor)
  return clampFactor(factor, size, max)
}

export function clampFactor(factor: number, size: number, max: number = 1) {
  return factor > 1
    ? util.clamp(factor, 0, size * max)
    : util.clamp(factor, 0, max) * size
}

export function getLineArcSize(style: Style) {
  return (
    style.arcSize != null
      ? style.arcSize
      : constants.LINE_ARCSIZE
  ) / 2
}
