import { Rectangle } from '../geometry'
import { Shape } from './shape-base'
import { SvgCanvas2D } from '../canvas'

export class Cylinder extends Shape {
  maxHeight: number = 40
  svgStrokeTolerance: number = 0

  constructor(
    bounds: Rectangle,
    fillColor: string,
    strokeColor: string,
    strokewidth: number = 1,
  ) {
    super()
    this.bounds = bounds
    this.fillColor = fillColor
    this.strokeColor = strokeColor
    this.strokeWidth = strokewidth
  }

  drawNodeShape(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    c.translate(x, y)
    c.begin()
    this.redrawPath(c, x, y, w, h, false)
    c.fillAndStroke()

    if (!this.outline || !this.style.backgroundOutline) {
      c.setShadow(false)
      c.begin()
      this.redrawPath(c, x, y, w, h, true)
      c.stroke()
    }
  }

  getCylinderSize(x: number, y: number, w: number, h: number) {
    return Math.min(this.maxHeight, Math.round(h / 5))
  }

  redrawPath(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
    isForeground?: boolean,
  ) {
    const dy = this.getCylinderSize(x, y, w, h)

    if (
      (isForeground && this.fillColor != null) ||
      (!isForeground && this.fillColor == null)
    ) {
      c.moveTo(0, dy)
      c.curveTo(0, 2 * dy, w, 2 * dy, w, dy)

      // Needs separate shapes for correct hit-detection
      if (!isForeground) {
        c.stroke()
        c.begin()
      }
    }

    if (!isForeground) {
      c.moveTo(0, dy)
      c.curveTo(0, -dy / 3, w, -dy / 3, w, dy)
      c.lineTo(w, h - dy)
      c.curveTo(w, h + dy / 3, 0, h + dy / 3, 0, h - dy)
      c.close()
    }
  }
}
