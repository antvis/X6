import { offset, getStrokeWidth } from './util'
import { ConnectionPoint } from './index'

export interface BBoxOptions extends ConnectionPoint.StrokedOptions {}

/**
 * Places the connection point at the intersection between the edge
 * path end segment and the target node bbox.
 */
export const bbox: ConnectionPoint.Definition<BBoxOptions> = function (
  line,
  view,
  magnet,
  options,
) {
  const bbox = view.getBBoxOfElement(magnet)
  if (options.stroked) {
    bbox.inflate(getStrokeWidth(magnet) / 2)
  }
  const intersections = line.intersect(bbox)
  const p =
    intersections && intersections.length
      ? line.start.closest(intersections)!
      : line.end
  return offset(p, line.start, options.offset)
}
