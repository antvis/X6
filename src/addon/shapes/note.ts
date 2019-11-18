import * as util from '../../util'
import { Cylinder } from '../../shape'
import { SvgCanvas2D } from '../../canvas'
import { registerShape } from '../../core'

export class NoteShape extends Cylinder {
  factor: number = 30
  darkOpacity: number = 0

  paintNodeShape(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    const factor = util.getNumber(this.style, 'factor', this.factor)
    const darkOpacity = util.getNumber(this.style, 'darkOpacity', this.darkOpacity)
    const s = Math.max(0, Math.min(w, Math.min(h, factor)))
    const op = Math.max(-1, Math.min(1, darkOpacity))
    c.translate(x, y)

    c.begin()
    c.moveTo(0, 0)
    c.lineTo(w - s, 0)
    c.lineTo(w, s)
    c.lineTo(w, h)
    c.lineTo(0, h)
    c.lineTo(0, 0)
    c.close()
    c.end()
    c.fillAndStroke()

    if (!this.outline) {
      c.setShadow(false)

      if (op !== 0) {
        c.setFillOpacity(Math.abs(op))
        c.setFillColor((op < 0) ? '#FFFFFF' : '#000000')
        c.begin()
        c.moveTo(w - s, 0)
        c.lineTo(w - s, s)
        c.lineTo(w, s)
        c.close()
        c.fill()
      }

      c.begin()
      c.moveTo(w - s, 0)
      c.lineTo(w - s, s)
      c.lineTo(w, s)
      c.end()
      c.stroke()
    }
  }
}

registerShape('note', NoteShape)
