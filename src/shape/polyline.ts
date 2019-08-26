import { Shape } from './shape'
import { Point } from '../struct'
import { constants } from '../common'
import { SvgCanvas2D } from '../canvas'

export class Polyline extends Shape {
  constructor(
    points: Point[],
    stroke: string,
    strokewidth: number = 1,
  ) {
    super()
    this.points = points
    this.stroke = stroke
    this.strokeWidth = strokewidth
  }

  getRotation() {
    return 0
  }

  getShapeRotation() {
    return 0
  }

  isPaintBoundsInverted() {
    return false
  }

  paintEdgeShape(c: SvgCanvas2D, pts: Point[]) {
    const prev = c.pointerEventsValue
    c.pointerEventsValue = 'stroke'

    if (this.style.curved) {
      this.paintLine(c, pts, this.rounded)
    } else {
      this.paintCurvedLine(c, pts)
    }

    c.pointerEventsValue = prev
  }

  paintLine(c: SvgCanvas2D, pts: Point[], rounded: boolean) {
    const arcSize = (this.style.arcSize || constants.LINE_ARCSIZE) / 2
    c.begin()
    this.paintPoints(c, pts, rounded, arcSize, false)
    c.stroke()
  }

  paintCurvedLine(c: SvgCanvas2D, pts: Point[]) {
    c.begin()

    const pt = pts[0]
    const len = pts.length

    c.moveTo(pt.x, pt.y)

    for (let i = 1; i < len - 2; i += 1) {
      const p0 = pts[i]
      const p1 = pts[i + 1]
      const ix = (p0.x + p1.x) / 2
      const iy = (p0.y + p1.y) / 2

      c.quadTo(p0.x, p0.y, ix, iy)
    }

    const p0 = pts[len - 2]
    const p1 = pts[len - 1]

    c.quadTo(p0.x, p0.y, p1.x, p1.y)
    c.stroke()
  }
}
