import { bbox } from './bbox'
import { offset, getStrokeWidth } from './util'
import { ConnectionPoint } from './index'
import { FunctionExt } from '../../util'

export interface RectangleOptions extends ConnectionPoint.StrokedOptions {}

/**
 * Places the connection point at the intersection between the
 * link path end segment and the element's unrotated bbox.
 */
export const rect: ConnectionPoint.Definition<RectangleOptions> = function (
  line,
  view,
  magnet,
  options,
  type,
) {
  const cell = view.cell
  const angle = cell.isNode() ? cell.getAngle() : 0
  if (angle === 0) {
    return FunctionExt.call(bbox, this, line, view, magnet, options, type)
  }

  const bboxRaw = view.getUnrotatedBBoxOfElement(magnet)
  if (options.stroked) {
    bboxRaw.inflate(getStrokeWidth(magnet) / 2)
  }
  const center = bboxRaw.getCenter()
  const lineRaw = line.clone().rotate(angle, center)
  const intersections = lineRaw.setLength(1e6).intersect(bboxRaw)
  const p =
    intersections && intersections.length
      ? lineRaw.start.closest(intersections)!.rotate(-angle, center)
      : line.end
  return offset(p, line.start, options.offset)
}
