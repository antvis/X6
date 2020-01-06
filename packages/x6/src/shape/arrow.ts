import { Point, Rectangle } from '../geometry'
import { globals } from '../option'
import { Shape } from './shape-base'
import { SvgCanvas2D } from '../canvas'

export class Arrow extends Shape {
  arrowWidth: number

  constructor(
    points: Point[],
    fillColor: string,
    strokeColor: string,
    strokewidth?: number,
    arrowWidth?: number,
    spacing?: number,
    endSize?: number,
  ) {
    super()
    this.points = points
    this.fillColor = fillColor
    this.strokeColor = strokeColor
    this.strokeWidth = strokewidth != null ? strokewidth : 1
    this.arrowWidth =
      arrowWidth != null ? arrowWidth : globals.defaultArrowWidth
    this.spacing = spacing != null ? spacing : globals.defaultArrowSpacing
    this.endSize = endSize != null ? endSize : globals.defaultArrowSize
  }

  augmentBoundingBox(bbox: Rectangle) {
    super.augmentBoundingBox(bbox)
    const w = Math.max(this.arrowWidth, this.endSize as number)
    bbox.inflate((w / 2 + this.strokeWidth) * this.scale)
  }

  drawEdgeShape(c: SvgCanvas2D, points: Point[]) {
    // Geometry of arrow
    const spacing = this.spacing
    const width = this.arrowWidth
    const size = this.endSize!

    // Base vector (between end points)
    const p0 = points[0]
    const pe = points[points.length - 1]
    const dx = pe.x - p0.x
    const dy = pe.y - p0.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const length = dist - 2 * spacing - size

    // Computes the norm and the inverse norm
    const nx = dx / dist
    const ny = dy / dist
    const basex = length * nx
    const basey = length * ny
    const floorx = (width * ny) / 3
    const floory = (-width * nx) / 3

    // Computes points
    const p0x = p0.x - floorx / 2 + spacing * nx
    const p0y = p0.y - floory / 2 + spacing * ny
    const p1x = p0x + floorx
    const p1y = p0y + floory
    const p2x = p1x + basex
    const p2y = p1y + basey
    const p3x = p2x + floorx
    const p3y = p2y + floory
    // p4 not necessary
    const p5x = p3x - 3 * floorx
    const p5y = p3y - 3 * floory

    c.begin()
    c.moveTo(p0x, p0y)
    c.lineTo(p1x, p1y)
    c.lineTo(p2x, p2y)
    c.lineTo(p3x, p3y)
    c.lineTo(pe.x - spacing * nx, pe.y - spacing * ny)
    c.lineTo(p5x, p5y)
    c.lineTo(p5x + floorx, p5y + floory)
    c.close()

    c.fillAndStroke()
  }
}
