import * as util from '../util'
import { constants } from '../common'
import { Polyline } from './polyline'
import { Rectangle, Point } from '../struct'
import { SvgCanvas2D } from '../canvas'
import { StyleNames } from '../types'
import { Marker } from './marker'

export class Connector extends Polyline {
  constructor(
    points: Point[],
    stroke: string,
    strokewidth: number = 1,
  ) {
    super(points, stroke, strokewidth)
  }

  updateBoundingBox() {
    this.useSvgBoundingBox = util.getBooleanFromStyle(this.style, StyleNames.curved)
    super.updateBoundingBox()
  }

  paintEdgeShape(c: SvgCanvas2D, pts: Point[]) {
    // The indirection via functions for markers is needed in
    // order to apply the offsets before painting the line and
    // paint the markers after painting the line.
    const sourceMarker = this.createMarker(c, pts, true)
    const targetMarker = this.createMarker(c, pts, false)

    super.paintEdgeShape(c, this.points)

    // Disables shadows, dashed styles and fixes fill color for markers
    c.setFillColor(this.stroke!)
    c.setShadow(false)
    c.setDashed(false)

    if (sourceMarker != null) {
      sourceMarker()
    }

    if (targetMarker != null) {
      targetMarker()
    }
  }

  /**
   * Prepares the marker by adding offsets in pts and returning a function to
   * paint the marker.
   */
  createMarker(c: SvgCanvas2D, pts: Point[], isSource: boolean) {
    let result = null
    const len = pts.length
    const type = util.getValue(
      this.style,
      isSource ? StyleNames.startArrow : StyleNames.endArrow,
    )

    let p0 = (isSource) ? pts[1] : pts[len - 2]
    const pe = isSource ? pts[0] : pts[len - 1]

    if (type != null && p0 != null && pe != null) {
      let count = 1

      // Uses next non-overlapping point
      while (
        count < len - 1 &&
        Math.round(p0.x - pe.x) === 0 &&
        Math.round(p0.y - pe.y) === 0
      ) {
        p0 = (isSource) ? pts[1 + count] : pts[len - 2 - count]
        count += 1
      }

      // Computes the norm and the inverse norm
      const dx = pe.x - p0.x
      const dy = pe.y - p0.y

      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))

      const unitX = dx / dist
      const unitY = dy / dist

      const size = util.getNumber(
        this.style,
        isSource ? StyleNames.startSize : StyleNames.endSize,
        constants.DEFAULT_MARKERSIZE,
      )

      // Allow for stroke width in the end point used and the
      // orthogonal vectors describing the direction of the marker
      const filled = util.getBooleanFromStyle(
        this.style,
        isSource ? StyleNames.startFill : StyleNames.endFill,
        true,
      )

      result = Marker.createMarker(
        c,
        this,
        type,
        pe,
        unitX,
        unitY,
        size,
        isSource,
        this.strokewidth as number,
        filled,
      )
    }

    return result
  }

  augmentBoundingBox(bbox: Rectangle) {
    super.augmentBoundingBox(bbox)

    // Adds marker sizes
    let size = 0

    if (util.getValue(this.style, StyleNames.startArrow, constants.NONE) !== constants.NONE) {
      size = util.getNumber(this.style, StyleNames.startSize, constants.DEFAULT_MARKERSIZE) + 1
    }

    if (util.getValue(this.style, StyleNames.endArrow, constants.NONE) !== constants.NONE) {
      size = Math.max(
        size,
        util.getNumber(this.style, StyleNames.endSize, constants.DEFAULT_MARKERSIZE),
      ) + 1
    }

    bbox.grow(size * this.scale)
  }
}
