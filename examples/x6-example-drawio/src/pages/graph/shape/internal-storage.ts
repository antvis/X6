import { Shape, SvgCanvas2D, ObjectExt, NumberExt } from '@antv/x6'

export class InternalStorageShape extends Shape.Rectangle {
  dx: number = 20
  dy: number = 20

  isHtmlAllowed() {
    return false
  }

  drawForeground(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    super.drawForeground(c, x, y, w, h)

    let inset = 0
    if (this.rounded) {
      const f = (this.style.arcSize || 0.15 * 100) / 100
      inset = Math.max(inset, Math.min(w * f, h * f))
    }

    const dx = NumberExt.clamp(
      ObjectExt.getNumber(this.style, 'dx', this.dx),
      inset,
      w,
    )
    const dy = NumberExt.clamp(
      ObjectExt.getNumber(this.style, 'dy', this.dy),
      inset,
      h,
    )

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

Shape.register('internalStorage', InternalStorageShape)
