import { Shape, SvgCanvas2D } from '@antv/x6'

export class OrShape extends Shape.Actor {
  redrawPath(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    c.moveTo(0, 0)
    c.quadTo(w, 0, w, h / 2)
    c.quadTo(w, h, 0, h)
    c.close()
    c.end()
  }
}

export class XorShape extends Shape.Actor {
  redrawPath(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    c.moveTo(0, 0)
    c.quadTo(w, 0, w, h / 2)
    c.quadTo(w, h, 0, h)
    c.quadTo(w / 2, h / 2, 0, 0)
    c.close()
    c.end()
  }
}

Shape.register('or', OrShape)
Shape.register('xor', XorShape)
