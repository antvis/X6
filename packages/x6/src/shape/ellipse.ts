import { Rectangle } from '../geometry'
import { Shape } from './shape-base'
import { SvgCanvas2D } from '../canvas'

export class EllipseShape extends Shape {
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

  drawNodeShape(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    c.ellipse(x, y, w, h)
    c.fillAndStroke()
  }
}
