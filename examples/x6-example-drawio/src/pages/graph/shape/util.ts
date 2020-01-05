import { Style } from '@antv/x6'
import { ObjectExt, NumberExt } from '@antv/x6-util'

export function getFactor(
  style: Style,
  defaultFactor: number,
  size: number,
  max: number = 1,
  key: string = 'factor',
) {
  const factor = ObjectExt.getNumber(style, key, defaultFactor)
  return clampFactor(factor, size, max)
}

export function clampFactor(factor: number, size: number, max: number = 1) {
  return factor > 1
    ? NumberExt.clamp(factor, 0, size * max)
    : NumberExt.clamp(factor, 0, max) * size
}
