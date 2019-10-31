import * as util from '../../util'
import { Actor } from '../../shape'
import { SvgCanvas2D } from '../../canvas'
import { Rectangle } from '../../struct'
import { registerShape } from '../../core'
import { getFactor } from './util'

export class TapeShape extends Actor {
  factor: number = 0.4

  getLabelMargins(rect: Rectangle) {
    if (util.getBoolean(this.style, 'boundedLbl', false)) {
      const w = rect.width
      const h = rect.height

      if (this.direction == null ||
        this.direction === 'east' ||
        this.direction === 'west'
      ) {
        const dy = getFactor(this.style, this.factor, h)
        return new Rectangle(rect.x, rect.y + dy, w, h - 2 * dy)
      }

      const dx = getFactor(this.style, this.factor, w)

      return new Rectangle(rect.x + dx, rect.y, w - 2 * dx, h)
    }

    return null
  }

  redrawPath(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    const dy = getFactor(this.style, this.factor, h)
    const fy = 1.4

    c.moveTo(0, dy / 2)
    c.quadTo(w / 4, dy * fy, w / 2, dy / 2)
    c.quadTo(w * 3 / 4, dy * (1 - fy), w, dy / 2)
    c.lineTo(w, h - dy / 2)
    c.quadTo(w * 3 / 4, h - dy * fy, w / 2, h - dy / 2)
    c.quadTo(w / 4, h - dy * (1 - fy), 0, h - dy / 2)
    c.lineTo(0, dy / 2)
    c.close()
    c.end()
  }
}

registerShape('tape', TapeShape)
