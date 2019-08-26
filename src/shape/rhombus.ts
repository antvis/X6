import { Shape } from './shape'
import { constants } from '../common'
import { Rectangle, Point } from '../struct'
import { SvgCanvas2D } from '../canvas'

export class Rhombus extends Shape {
  constructor(
    bounds: Rectangle,
    fill: string,
    stroke: string,
    strokewidth: number = 1,
  ) {
    super()
    this.bounds = bounds
    this.fill = fill
    this.stroke = stroke
    this.strokeWidth = strokewidth
  }

  isRoundable() {
    return true
  }

  paintNodeShape(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    const arcSize = (this.style.arcSize || constants.LINE_ARCSIZE) / 2

    const hw = w / 2
    const hh = h / 2

    c.begin()
    this.paintPoints(
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
