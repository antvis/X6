import { Color } from '../util'
import { Rectangle } from '../geometry'
import { SvgCanvas2D } from '../canvas'
import { Shape } from './shape-base'

export class RectangleShape extends Shape {
  constructor(
    bounds: Rectangle,
    fillColor?: string | null,
    strokeColor?: string | null,
    strokewidth?: number | null,
  ) {
    super()
    this.bounds = bounds
    this.fillColor = fillColor != null ? fillColor : null
    this.strokeColor = strokeColor != null ? strokeColor : null
    this.strokeWidth = strokewidth != null ? strokewidth : 1
  }

  isRoundable() {
    return true
  }

  drawBackground(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    const events = this.style.pointerEvents !== false

    if (
      events ||
      Color.isValid(this.fillColor) ||
      Color.isValid(this.strokeColor)
    ) {
      if (!events && !Color.isValid(this.fillColor)) {
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

  drawForeground(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    if (this.glass && !this.outline && Color.isValid(this.fillColor)) {
      this.drawGlassEffect(
        c,
        x,
        y,
        w,
        h,
        this.getArcSize(w + this.strokeWidth, h + this.strokeWidth),
      )
    }
  }
}
