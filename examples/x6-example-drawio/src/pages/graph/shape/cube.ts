import { Shape, SvgCanvas2D, Rectangle, ObjectExt } from '@antv/x6'

export class CubeShape extends Shape.Cylinder {
  factor: number = 20
  darkOpacity: number = 0
  darkOpacity2: number = 0

  isHtmlAllowed() {
    return false
  }

  getLabelMargins(rect: Rectangle) {
    if (ObjectExt.getBoolean(this.style, 'boundedLbl', false)) {
      const s =
        ObjectExt.getNumber(this.style, 'factor', this.factor) * this.scale
      return new Rectangle(s, s, 0, 0)
    }

    return null
  }

  drawNodeShape(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    const factor = ObjectExt.getNumber(this.style, 'factor', this.factor)
    const darkOpacity = ObjectExt.getNumber(
      this.style,
      'darkOpacity',
      this.darkOpacity,
    )
    const darkOpacity2 = ObjectExt.getNumber(
      this.style,
      'darkOpacity2',
      this.darkOpacity2,
    )
    const s = Math.max(0, Math.min(w, Math.min(h, factor)))
    const op = Math.max(-1, Math.min(1, darkOpacity))
    const op2 = Math.max(-1, Math.min(1, darkOpacity2))
    c.translate(x, y)

    c.begin()
    c.moveTo(0, 0)
    c.lineTo(w - s, 0)
    c.lineTo(w, s)
    c.lineTo(w, h)
    c.lineTo(s, h)
    c.lineTo(0, h - s)
    c.lineTo(0, 0)
    c.close()
    c.end()

    c.fillAndStroke()

    if (!this.outline) {
      c.setShadow(false)

      if (op !== 0) {
        c.setFillOpacity(Math.abs(op))
        c.setFillColor(op < 0 ? '#ffffff' : '#000000')
        c.begin()
        c.moveTo(0, 0)
        c.lineTo(w - s, 0)
        c.lineTo(w, s)
        c.lineTo(s, s)
        c.close()
        c.fill()
      }

      if (op2 !== 0) {
        c.setFillOpacity(Math.abs(op2))
        c.setFillColor(op2 < 0 ? '#ffffff' : '#000000')
        c.begin()
        c.moveTo(0, 0)
        c.lineTo(s, s)
        c.lineTo(s, h)
        c.lineTo(0, h - s)
        c.close()
        c.fill()
      }

      c.begin()
      c.moveTo(s, h)
      c.lineTo(s, s)
      c.lineTo(0, 0)
      c.moveTo(s, s)
      c.lineTo(w, s)
      c.end()
      c.stroke()
    }
  }
}

Shape.register('cube', CubeShape)
