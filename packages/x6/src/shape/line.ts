import { Rectangle } from '../geometry'
import { Shape } from './shape-base'
import { SvgCanvas2D } from '../canvas'

export class Line extends Shape {
  constructor(
    public bounds: Rectangle,
    public strokeColor: string,
    public strokeWidth: number = 1,
  ) {
    super()
  }

  protected drawNodeShape(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    const mid = y + h / 2
    c.begin()
    c.moveTo(x, mid)
    c.lineTo(x + w, mid)
    c.stroke()
  }
}
