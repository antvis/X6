import * as util from '../../util'
import { Point } from '../../struct'
import { SvgCanvas2D } from '../../canvas'
import { Shape, Actor } from '../../shape'

export class CardShape extends Actor {
  factor: number = 30

  isRoundable() {
    return true
  }

  redrawPath(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    const arcSize = this.getLineArcSize()
    const factor = util.getNumber(this.style, 'factor', this.factor)
    const s = Math.max(0, Math.min(w, Math.min(h, factor)))

    this.drawPoints(
      c,
      [
        new Point(s, 0),
        new Point(w, 0),
        new Point(w, h),
        new Point(0, h),
        new Point(0, s),
      ],
      this.rounded,
      arcSize,
      true,
    )

    c.end()
  }
}

Shape.register('card', CardShape)
