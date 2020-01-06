import { Point } from '../geometry'
import { Shape } from './shape-base'
import { SvgCanvas2D } from '../canvas'

export class Polyline extends Shape {
  constructor(
    points: Point[] = [],
    strokeColor: string | null = null,
    strokewidth: number = 1,
  ) {
    super()
    this.points = points
    this.strokeColor = strokeColor
    this.strokeWidth = strokewidth
  }

  getRotation() {
    return 0
  }

  getShapeRotation() {
    return 0
  }

  drawBoundsInverted() {
    return false
  }

  drawEdgeShape(c: SvgCanvas2D, points: Point[]) {
    const prev = c.pointerEventsValue
    c.pointerEventsValue = 'stroke'

    if (this.style.curved === true) {
      this.drawCurvedLine(c, points)
    } else {
      this.drawLine(c, points, this.rounded)
    }

    c.pointerEventsValue = prev
  }

  protected drawLine(c: SvgCanvas2D, points: Point[], rounded: boolean) {
    const arcSize = this.getLineArcSize()
    c.begin()
    this.drawPoints(c, points, rounded, arcSize, false)
    c.stroke()
  }

  protected drawCurvedLine(c: SvgCanvas2D, points: Point[]) {
    c.begin()

    const pt = points[0]
    const len = points.length

    c.moveTo(pt.x, pt.y)

    for (let i = 1; i < len - 2; i += 1) {
      const p0 = points[i]
      const p1 = points[i + 1]
      const ix = (p0.x + p1.x) / 2
      const iy = (p0.y + p1.y) / 2

      c.quadTo(p0.x, p0.y, ix, iy)
    }

    const p0 = points[len - 2]
    const p1 = points[len - 1]

    c.quadTo(p0.x, p0.y, p1.x, p1.y)
    c.stroke()
  }
}
