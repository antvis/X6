import { Shape } from './shape'
import { Rectangle } from '../struct'
import { SvgCanvas2D } from '../canvas'

export class LineShape extends Shape {
  constructor(
    public bounds: Rectangle,
    public stroke: string,
    public strokewidth: number = 1,
  ) {
    super()
  }

  protected paintNodeShape(
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
