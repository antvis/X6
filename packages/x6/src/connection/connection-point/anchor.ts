import { offset } from './util'
import { ConnectionPoint } from './index'

export interface AnchorOptions extends ConnectionPoint.BaseOptions {}

/**
 * Places the connection point at the edge end's anchor point.
 */
export const anchor: ConnectionPoint.Definition<AnchorOptions> = function (
  line,
  view,
  magnet,
  options,
) {
  return offset(line.end, line.start, options.offset)
}
