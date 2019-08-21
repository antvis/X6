import * as util from '../util'
import { Actor } from './actor'
import { Rectangle, Point } from '../struct'
import { SvgCanvas2D } from '../canvas'

export class Triangle extends Actor {
  constructor(
    bounds: Rectangle,
    fill: string,
    stroke: string,
    strokewidth: number = 1,
  ) {
    super(bounds, fill, stroke, strokewidth)
  }

  isRoundable() {
    return true
  }

  redrawPath(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    const arcSize = util.getArcSize(this.style) / 2
    this.addPoints(
      c,
      [
        new Point(0, 0),
        new Point(w, 0.5 * h),
        new Point(0, h),
      ],
      this.isRounded,
      arcSize,
      true,
    )
  }
}
