import { getFactor } from './util'
import { Shape, SvgCanvas2D, Rectangle, ObjectExt } from '@antv/x6'

export class DocumentShape extends Shape.Actor {
  factor: number = 0.3

  getLabelMargins(rect: Rectangle) {
    if (ObjectExt.getBoolean(this.style, 'boundedLbl', false)) {
      const dy = getFactor(this.style, this.factor, rect.height)
      return new Rectangle(0, 0, 0, dy)
    }

    return null
  }

  redrawPath(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    const dy = getFactor(this.style, this.factor, h)
    const fy = 1.4

    c.moveTo(0, 0)
    c.lineTo(w, 0)
    c.lineTo(w, h - dy / 2)
    c.quadTo((w * 3) / 4, h - dy * fy, w / 2, h - dy / 2)
    c.quadTo(w / 4, h - dy * (1 - fy), 0, h - dy / 2)
    c.lineTo(0, dy / 2)
    c.close()
  }
}

Shape.register('document', DocumentShape)
