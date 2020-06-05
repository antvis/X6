import { NumberExt } from '../../util'
import { Point, Rectangle } from '../../geometry'
import { PortLayout } from './index'

export function normalizePoint(
  bbox: Rectangle,
  args: {
    x?: string | number
    y?: string | number
  } = {},
) {
  return new Point(
    NumberExt.normalizePercentage(args.x, bbox.width),
    NumberExt.normalizePercentage(args.y, bbox.height),
  )
}

export function toResult<T>(
  point: Point,
  angle?: number,
  rawArgs?: T,
): PortLayout.Result {
  return {
    angle,
    position: point.toJSON(),
    ...rawArgs,
  }
}
