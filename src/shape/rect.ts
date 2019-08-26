import * as util from '../util'
import { constants } from '../common'
import { Rectangle, StyleName } from '../struct'
import { SvgCanvas2D } from '../canvas'
import { Shape } from './shape'

export class RectShape extends Shape {
  constructor(
    bounds: Rectangle,
    fill?: string,
    stroke?: string,
    strokewidth?: number,
  ) {
    super()
    this.bounds = bounds
    this.fill = fill != null ? fill : null
    this.stroke = stroke != null ? stroke : null
    this.strokeWidth = strokewidth != null ? strokewidth : 1
  }

  protected paintBackground(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    let events = true
    if (this.style != null) {
      events = util.getBooleanFromStyle(this.style, StyleName.pointerEvents, true)
    }

    if (
      events ||
      (this.fill != null && this.fill !== constants.NONE) ||
      (this.stroke != null && this.stroke !== constants.NONE)
    ) {
      if (
        !events &&
        (this.fill == null || this.fill === constants.NONE)
      ) {
        c.pointerEvents = false
      }

      if (this.rounded) {
        const r = this.getArcSize(w, h)
        c.roundRect(x, y, w, h, r, r)
      } else {
        c.rect(x, y, w, h)
      }

      c.fillAndStroke()
    }
  }

  protected isRoundable() {
    return true
  }

  protected paintForeground(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    if (
      this.glass &&
      !this.outline &&
      this.fill != null &&
      this.fill !== constants.NONE
    ) {
      this.paintGlassEffect(
        c, x, y, w, h,
        this.getArcSize(
          w + (this.strokeWidth as number),
          h + (this.strokeWidth as number),
        ),
      )
    }
  }

}
