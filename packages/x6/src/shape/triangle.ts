import { Point, Rectangle } from '../geometry'
import { SvgCanvas2D } from '../canvas'
import { Actor } from './actor'

export class Triangle extends Actor {
  constructor(
    bounds: Rectangle,
    fillColor: string,
    strokeColor: string,
    strokewidth: number = 1,
  ) {
    super(bounds, fillColor, strokeColor, strokewidth)
  }

  isRoundable() {
    return true
  }

  redrawPath(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    const arcSize = this.getLineArcSize()
    this.drawPoints(
      c,
      [new Point(0, 0), new Point(w, 0.5 * h), new Point(0, h)],
      this.rounded,
      arcSize,
      true,
    )
  }
}
