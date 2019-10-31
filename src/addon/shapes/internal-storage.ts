import * as util from '../../util'
import { RectangleShape } from '../../shape'
import { SvgCanvas2D } from '../../canvas'
import { registerShape } from '../../core'

export class InternalStorageShape extends RectangleShape {
  dx: number = 20
  dy: number = 20

  isHtmlAllowed() {
    return false
  }

  paintForeground(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    super.paintForeground(c, x, y, w, h)

    let inset = 0
    if (this.rounded) {
      const f = (this.style.arcSize || 0.15 * 100) / 100
      inset = Math.max(inset, Math.min(w * f, h * f))
    }

    const dx = util.clamp(util.getNumber(this.style, 'dx', this.dx), inset, w)
    const dy = util.clamp(util.getNumber(this.style, 'dy', this.dy), inset, h)

    c.begin()
    c.moveTo(x, y + dy)
    c.lineTo(x + w, y + dy)
    c.stroke()

    c.begin()
    c.moveTo(x + dx, y)
    c.lineTo(x + dx, y + h)
    c.stroke()
  }
}

registerShape('internalStorage', InternalStorageShape)
