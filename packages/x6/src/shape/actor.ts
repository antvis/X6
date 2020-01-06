import { Rectangle } from '../geometry'
import { Shape } from './shape-base'
import { SvgCanvas2D } from '../canvas'

export class Actor extends Shape {
  constructor(
    bounds: Rectangle,
    fillColor: string,
    stroke: string,
    strokewidth: number = 1,
  ) {
    super()
    this.bounds = bounds
    this.fillColor = fillColor
    this.strokeColor = stroke
    this.strokeWidth = strokewidth
  }

  drawNodeShape(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    c.translate(x, y)
    c.begin()
    this.redrawPath(c, x, y, w, h)
    c.fillAndStroke()
  }

  redrawPath(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    const f = w / 3
    c.moveTo(0, h)
    c.curveTo(0, (3 * h) / 5, 0, (2 * h) / 5, w / 2, (2 * h) / 5)
    c.curveTo(w / 2 - f, (2 * h) / 5, w / 2 - f, 0, w / 2, 0)
    c.curveTo(w / 2 + f, 0, w / 2 + f, (2 * h) / 5, w / 2, (2 * h) / 5)
    c.curveTo(w, (2 * h) / 5, w, (3 * h) / 5, w, h)
    c.close()
  }
}
