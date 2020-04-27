import { PortLayout } from './index'
import { normalizePoint, toResult } from './util'

export interface AbsoluteArgs {
  x?: string | number
  y?: string | number
}

export const absolute: PortLayout.Definition<AbsoluteArgs> = (
  portsPositionArgs,
  elemBBox,
) => {
  return portsPositionArgs.map(item => toResult(normalizePoint(elemBBox, item)))
}
