import { offset } from './util'
import { ConnectionPoint } from './index'

export interface AnchorOptions extends ConnectionPoint.BaseOptions {}

/**
 * Places the connection point at the edge's endpoint.
 */
export const endpoint: ConnectionPoint.Definition<AnchorOptions> = function (
  line,
  view,
  magnet,
  options,
) {
  return offset(line.end, line.start, options.offset)
}
