import { Color } from '../util'
import { Rectangle } from '../geometry'
import { globals } from '../option'
import { Shape } from './shape-base'
import { SvgCanvas2D } from '../canvas'

export class Swimlane extends Shape {
  image: string | null
  imageSize: number = 16

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

  isRoundable() {
    return true
  }

  isHorizontal() {
    return this.style.horizontal !== false
  }

  getTitleSize() {
    return Math.max(0, this.style.startSize || globals.defaultStartSize)
  }

  getArcSize(w: number, h: number, start: number) {
    const f = (this.style.arcSize || globals.rectangleRoundFactor * 100) / 100
    return start * f * 3
  }

  getLabelBounds(rect: Rectangle) {
    const start = this.getTitleSize()
    const horizontal = this.isHorizontal()
    const flipH = this.style.flipH === true
    const flipV = this.style.flipV === true
    const bounds = new Rectangle(rect.x, rect.y, rect.width, rect.height)

    // East is default
    const shapeVertical =
      this.direction === 'north' || this.direction === 'south'
    const realHorizontal = horizontal === !shapeVertical

    const realFlipH =
      !realHorizontal &&
      flipH !== (this.direction === 'south' || this.direction === 'west')

    const realFlipV =
      realHorizontal &&
      flipV !== (this.direction === 'south' || this.direction === 'west')

    // Shape is horizontal
    if (!shapeVertical) {
      const tmp = Math.min(bounds.height, start * this.scale)
      if (realFlipH || realFlipV) {
        bounds.y += bounds.height - tmp
      }
      bounds.height = tmp
    } else {
      const tmp = Math.min(bounds.width, start * this.scale)
      if (realFlipH || realFlipV) {
        bounds.x += bounds.width - tmp
      }
      bounds.width = tmp
    }

    return bounds
  }

  getGradientBounds(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    let start = this.getTitleSize()

    if (this.isHorizontal()) {
      start = Math.min(start, h)
      return new Rectangle(x, y, w, start)
    }

    start = Math.min(start, w)
    return new Rectangle(x, y, start, h)
  }

  drawNodeShape(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    let start = this.getTitleSize()
    const fillColor = this.style.swimlaneFillColor || 'none'
    const swimlaneLine = this.style.swimlaneLine !== false

    let r = 0

    if (this.isHorizontal()) {
      start = Math.min(start, h)
    } else {
      start = Math.min(start, w)
    }

    c.translate(x, y)

    if (!this.rounded) {
      this.drawSwimlane(c, x, y, w, h, start, fillColor, swimlaneLine)
    } else {
      r = this.getArcSize(w, h, start)
      r = Math.min((this.isHorizontal() ? h : w) - start, Math.min(start, r))
      this.drawRoundedSwimlane(c, x, y, w, h, start, r, fillColor, swimlaneLine)
    }

    const separatorColor = this.style.separatorColor || 'none'
    this.drawSeparator(c, x, y, w, h, start, separatorColor)

    if (this.image != null) {
      const bounds = this.getImageBounds(x, y, w, h)
      c.image(
        bounds.x - x,
        bounds.y - y,
        bounds.width,
        bounds.height,
        this.image,
        false,
        false,
        false,
      )
    }

    if (this.glass) {
      c.setShadow(false)
      this.drawGlassEffect(c, 0, 0, w, start, r)
    }
  }

  protected drawSwimlane(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
    start: number,
    fillColor: string,
    swimlaneLine: boolean,
  ) {
    c.begin()

    if (this.isHorizontal()) {
      c.moveTo(0, start)
      c.lineTo(0, 0)
      c.lineTo(w, 0)
      c.lineTo(w, start)
      c.fillAndStroke()

      if (start < h) {
        this.scopedDraw(c, fillColor, () => {
          c.begin()
          c.moveTo(0, start)
          c.lineTo(0, h)
          c.lineTo(w, h)
          c.lineTo(w, start)
        })
      }
    } else {
      c.moveTo(start, 0)
      c.lineTo(0, 0)
      c.lineTo(0, h)
      c.lineTo(start, h)
      c.fillAndStroke()

      if (start < w) {
        this.scopedDraw(c, fillColor, () => {
          c.begin()
          c.moveTo(start, 0)
          c.lineTo(w, 0)
          c.lineTo(w, h)
          c.lineTo(start, h)
        })
      }
    }

    if (swimlaneLine) {
      this.drawDivider(c, x, y, w, h, start, fillColor === 'none')
    }
  }

  protected drawRoundedSwimlane(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
    start: number,
    r: number,
    fillColor: string,
    swimlaneLine: boolean,
  ) {
    c.begin()

    if (this.isHorizontal()) {
      c.moveTo(w, start)
      c.lineTo(w, r)
      c.quadTo(w, 0, w - Math.min(w / 2, r), 0)
      c.lineTo(Math.min(w / 2, r), 0)
      c.quadTo(0, 0, 0, r)
      c.lineTo(0, start)
      c.fillAndStroke()

      if (start < h) {
        this.scopedDraw(c, fillColor, () => {
          c.begin()
          c.moveTo(0, start)
          c.lineTo(0, h - r)
          c.quadTo(0, h, Math.min(w / 2, r), h)
          c.lineTo(w - Math.min(w / 2, r), h)
          c.quadTo(w, h, w, h - r)
          c.lineTo(w, start)
        })
      }
    } else {
      c.moveTo(start, 0)
      c.lineTo(r, 0)
      c.quadTo(0, 0, 0, Math.min(h / 2, r))
      c.lineTo(0, h - Math.min(h / 2, r))
      c.quadTo(0, h, r, h)
      c.lineTo(start, h)
      c.fillAndStroke()

      if (start < w) {
        this.scopedDraw(c, fillColor, () => {
          c.begin()
          c.moveTo(start, h)
          c.lineTo(w - r, h)
          c.quadTo(w, h, w, h - Math.min(h / 2, r))
          c.lineTo(w, Math.min(h / 2, r))
          c.quadTo(w, 0, w - r, 0)
          c.lineTo(start, 0)
        })
      }
    }

    if (swimlaneLine) {
      this.drawDivider(c, x, y, w, h, start, !Color.isValid(fillColor))
    }
  }

  /**
   * Paints the divider between swimlane title and content area.
   */
  protected drawDivider(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
    start: number,
    shadow?: boolean,
  ) {
    if (!shadow) {
      c.setShadow(false)
    }

    c.begin()

    if (this.isHorizontal()) {
      c.moveTo(0, start)
      c.lineTo(w, start)
    } else {
      c.moveTo(start, 0)
      c.lineTo(start, h)
    }

    c.stroke()
  }

  /**
   * Paints the vertical or horizontal separator line between swimlanes.
   */
  protected drawSeparator(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
    start: number,
    color?: string,
  ) {
    if (Color.isValid(color)) {
      c.setStrokeColor(color)
      c.setDashed(true)
      c.begin()

      if (this.isHorizontal()) {
        c.moveTo(w, start)
        c.lineTo(w, h)
      } else {
        c.moveTo(start, 0)
        c.lineTo(w, 0)
      }

      c.stroke()
      c.setDashed(false)
    }
  }

  protected getImageBounds(x: number, y: number, w: number, h: number) {
    if (this.isHorizontal()) {
      return new Rectangle(
        x + w - this.imageSize,
        y,
        this.imageSize,
        this.imageSize,
      )
    }

    return new Rectangle(x, y, this.imageSize, this.imageSize)
  }

  private scopedDraw(c: SvgCanvas2D, fillColor: string, fn: () => void) {
    const valid = Color.isValid(fillColor)
    if (valid) {
      c.setFillColor(fillColor)
    } else {
      c.pointerEvents = false
    }

    fn()

    if (valid) {
      c.fillAndStroke()
    } else {
      c.stroke()
    }
  }
}
