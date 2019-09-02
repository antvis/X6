import { Shape } from './shape'
import { Rectangle } from '../struct'
import { SvgCanvas2D } from '../canvas'

export class EllipseShape extends Shape {
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

  paintNodeShape(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    c.ellipse(x, y, w, h)
    c.fillAndStroke()
  }
}
