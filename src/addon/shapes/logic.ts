import { Actor } from '../../shape'
import { SvgCanvas2D } from '../../canvas'
import { registerShape } from '../../core'

export class OrShape extends Actor {
  redrawPath(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    c.moveTo(0, 0)
    c.quadTo(w, 0, w, h / 2)
    c.quadTo(w, h, 0, h)
    c.close()
    c.end()
  }
}

export class XorShape extends Actor {
  redrawPath(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    c.moveTo(0, 0)
    c.quadTo(w, 0, w, h / 2)
    c.quadTo(w, h, 0, h)
    c.quadTo(w / 2, h / 2, 0, 0)
    c.close()
    c.end()
  }
}

registerShape('or', OrShape)
registerShape('xor', XorShape)
