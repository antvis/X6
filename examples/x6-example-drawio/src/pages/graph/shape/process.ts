import { getFactor } from './util'
import { Shape, SvgCanvas2D, Direction, Rectangle, NumberExt } from '@antv/x6'

export class ProcessShape extends Shape.Rectangle {
  factor: number = 0.1
  direction: Direction

  isHtmlAllowed() {
    return false
  }

  getInset(width: number, height: number, round?: boolean) {
    let inset = getFactor(this.style, this.factor, width)

    if (this.rounded) {
      const f = (this.style.arcSize || 0.15 * 100) / 100
      inset = NumberExt.clamp(f * width, f * height, inset)
    }

    if (round) {
      inset = Math.round(inset)
    }

    return inset
  }

  getLabelBounds(rect: Rectangle) {
    const style = this.state.style
    const horizontal = style.horizontal != null ? style.horizontal : true
    if (
      horizontal ===
      (this.direction == null ||
        this.direction === 'east' ||
        this.direction === 'west')
    ) {
      const bounds = rect.clone()
      const inset = this.getInset(rect.width, rect.height)
      bounds.x += Math.round(inset)
      bounds.width -= Math.round(2 * inset)
      return bounds
    }

    return rect
  }

  drawForeground(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    const inset = this.getInset(w, h, true)

    c.begin()
    c.moveTo(x + inset, y)
    c.lineTo(x + inset, y + h)
    c.moveTo(x + w - inset, y)
    c.lineTo(x + w - inset, y + h)
    c.stroke()

    super.drawForeground(c, x, y, w, h)
  }
}

Shape.register('process', ProcessShape)
