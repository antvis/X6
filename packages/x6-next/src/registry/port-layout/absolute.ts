import { PortLayout } from './index'
import { normalizePoint, toResult } from './util'

export interface AbsoluteArgs {
  x?: string | number
  y?: string | number
  angle?: number
}

export const absolute: PortLayout.Definition<AbsoluteArgs> = (
  portsPositionArgs,
  elemBBox,
) => {
  return portsPositionArgs.map(({ x, y, angle }) =>
    toResult(normalizePoint(elemBBox, { x, y }), angle || 0),
  )
}
