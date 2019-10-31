import * as util from '../../util'
import { Actor } from '../../shape'
import { SvgCanvas2D } from '../../canvas'
import { Point } from '../../struct'
import { registerShape } from '../../core'
import { getLineArcSize } from './util'

export class CardShape extends Actor {
  factor: number = 30

  isRoundable() {
    return true
  }

  redrawPath(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    const factor = util.getNumber(this.style, 'factor', this.factor)
    const s = Math.max(0, Math.min(w, Math.min(h, factor)))
    const arcSize = getLineArcSize(this.style)

    this.paintPoints(
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

registerShape('card', CardShape)
