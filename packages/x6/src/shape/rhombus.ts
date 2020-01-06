import { Point, Rectangle } from '../geometry'
import { Shape } from './shape-base'
import { SvgCanvas2D } from '../canvas'

export class Rhombus extends Shape {
  constructor(
    bounds: Rectangle,
    fillColor: string,
    strokeColor: string,
    strokewidth: number = 1,
  ) {
    super()
    this.bounds = bounds
    this.fillColor = fillColor
    this.strokeColor = strokeColor
    this.strokeWidth = strokewidth
  }

  isRoundable() {
    return true
  }

  drawNodeShape(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    const arcSize = this.getLineArcSize()
    const hw = w / 2
    const hh = h / 2

    c.begin()
    this.drawPoints(
      c,
      [
        new Point(x + hw, y),
        new Point(x + w, y + hh),
        new Point(x + hw, y + h),
        new Point(x, y + hh),
      ],
      this.rounded,
      arcSize,
      true,
    )

    c.fillAndStroke()
  }
}
