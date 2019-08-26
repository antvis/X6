import * as util from '../util'
import { Shape } from './shape'
import { Rectangle, StyleName } from '../struct'
import { SvgCanvas2D } from '../canvas'

export class DoubleEllipse extends Shape {
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

  paintBackground(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    c.ellipse(x, y, w, h)
    c.fillAndStroke()
  }

  paintForeground(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    if (!this.outline) {
      const margin = util.getNumber(
        this.style,
        StyleName.margin,
        Math.min(3 + (this.strokeWidth as number), Math.min(w / 5, h / 5)),
      )

      const xx = x + margin
      const yy = y + margin
      const ww = w - 2 * margin
      const hh = h - 2 * margin

      if (ww > 0 && hh > 0) {
        c.ellipse(xx, yy, ww, hh)
      }

      c.stroke()
    }
  }

  getLabelBounds(rect: Rectangle) {
    const defaultMargin = Math.min(
      3 + (this.strokeWidth as number),
      Math.min(rect.width / 5 / this.scale, rect.height / 5 / this.scale),
    )
    const margin = (
      util.getNumber(this.style, StyleName.margin, defaultMargin)
    ) * this.scale

    return new Rectangle(
      rect.x + margin,
      rect.y + margin,
      rect.width - 2 * margin,
      rect.height - 2 * margin,
    )
  }

}
