import { Point, Rectangle } from '../geometry'
import { SvgCanvas2D } from '../canvas'
import { Marker } from '../marker'
import { Polyline } from './polyline'
import { globals } from '../option'

export class Connector extends Polyline {
  constructor(points: Point[], strokeColor: string, strokewidth: number = 1) {
    super(points, strokeColor, strokewidth)
  }

  updateBoundingBox() {
    this.useSvgBoundingBox = !!this.style.curved
    super.updateBoundingBox()
  }

  drawEdgeShape(c: SvgCanvas2D, points: Point[]) {
    // The indirection via functions for markers is needed in
    // order to apply the offsets before painting the line and
    // paint the markers after painting the line.
    const sourceMarker = this.createMarker(c, points, true)
    const targetMarker = this.createMarker(c, points, false)

    super.drawEdgeShape(c, points)

    // Disables shadows, dashed styles and fixes fill color for markers
    c.setFillColor(this.strokeColor!)
    c.setShadow(false)
    c.setDashed(false)

    if (sourceMarker != null) {
      sourceMarker()
    }

    if (targetMarker != null) {
      targetMarker()
    }
  }

  createMarker(c: SvgCanvas2D, points: Point[], isSource: boolean) {
    let result = null
    const len = points.length
    const name = isSource ? this.style.startArrow : this.style.endArrow

    let p0 = isSource ? points[1] : points[len - 2]
    const pe = isSource ? points[0] : points[len - 1]

    if (name != null && p0 != null && pe != null) {
      let count = 1

      // Uses next non-overlapping point
      while (
        count < len - 1 &&
        Math.round(p0.x - pe.x) === 0 &&
        Math.round(p0.y - pe.y) === 0
      ) {
        p0 = isSource ? points[1 + count] : points[len - 2 - count]
        count += 1
      }

      // Computes the norm and the inverse norm
      const dx = pe.x - p0.x
      const dy = pe.y - p0.y
      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))
      const unitX = dx / dist
      const unitY = dy / dist

      const size =
        (isSource ? this.style.startSize : this.style.endSize) ||
        globals.defaultMarkerSize

      // Allow for stroke width in the end point used and the
      // orthogonal vectors describing the direction of the marker
      const filled = isSource
        ? this.style.startFilled !== false
        : this.style.endFilled !== false

      result = Marker.createMarker({
        c,
        name,
        pe,
        unitX,
        unitY,
        size,
        isSource,
        filled,
        shape: this,
        sw: this.strokeWidth,
      })
    }

    return result
  }

  augmentBoundingBox(bbox: Rectangle) {
    super.augmentBoundingBox(bbox)

    // Adds marker sizes
    let size = 0

    if ((this.style.startArrow || 'none') !== 'none') {
      size = (this.style.startSize || globals.defaultMarkerSize) + 1
    }

    if ((this.style.endArrow || 'none') !== 'none') {
      size = Math.max(size, this.style.endSize || globals.defaultMarkerSize) + 1
    }

    bbox.inflate(size * this.scale)
  }
}
