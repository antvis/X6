import { constants } from '../common'
import { Shape } from './shape'
import { SvgCanvas2D } from '../canvas'
import { Rectangle } from '../struct'

export class Swimlane extends Shape {
  /**
   * Default imagewidth and imageheight if an image but no imagewidth
   * and imageheight are defined in the style.
   */
  imageSize = 16
  image: string | null

  constructor(
    bounds: Rectangle,
    fill: string,
    stroke: string,
    strokewidth: number = 1,
  ) {
    super()
    this.bounds = bounds
    this.fill = fill
    this.stroke = stroke
    this.strokeWidth = strokewidth
  }

  isRoundable() {
    return true
  }

  getTitleSize() {
    return Math.max(
      0,
      this.style.startSize || constants.DEFAULT_STARTSIZE,
    )
  }

  getLabelBounds(rect: Rectangle) {
    const start = this.getTitleSize()
    const horizontal = this.isHorizontal()
    const flipH = this.style.flipH === true
    const flipV = this.style.flipV === true
    const bounds = new Rectangle(rect.x, rect.y, rect.width, rect.height)

    // East is default
    const shapeVertical = (
      this.direction === 'north' ||
      this.direction === 'south'
    )
    const realHorizontal = horizontal === !shapeVertical

    const realFlipH = !realHorizontal && flipH !== (
      this.direction === 'south' ||
      this.direction === 'west'
    )

    const realFlipV = realHorizontal && flipV !== (
      this.direction === 'south' ||
      this.direction === 'west'
    )

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

  getArcSize(w: number, h: number, start: number) {
    const f = (this.style.arcSize || constants.RECTANGLE_ROUNDING_FACTOR * 100) / 100
    return start * f * 3
  }

  isHorizontal() {
    return this.style.horizontal !== false
  }

  paintNodeShape(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    let start = this.getTitleSize()
    const fill = this.style.swimlaneFillColor || constants.NONE
    const swimlaneLine = this.style.swimlaneLine !== false

    let r = 0

    if (this.isHorizontal()) {
      start = Math.min(start, h)
    } else {
      start = Math.min(start, w)
    }

    c.translate(x, y)

    if (!this.rounded) {
      this.paintSwimlane(c, x, y, w, h, start, fill, swimlaneLine)
    } else {
      r = this.getArcSize(w, h, start)
      r = Math.min(((this.isHorizontal()) ? h : w) - start, Math.min(start, r))
      this.paintRoundedSwimlane(c, x, y, w, h, start, r, fill, swimlaneLine)
    }

    const sep = this.style.separatorColor || constants.NONE
    this.paintSeparator(c, x, y, w, h, start, sep)

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
      this.paintGlassEffect(c, 0, 0, w, start, r)
    }
  }

  paintSwimlane(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
    start: number,
    fill: string,
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
        if (fill === constants.NONE) {
          c.pointerEvents = false
        } else {
          c.setFillColor(fill)
        }

        c.begin()
        c.moveTo(0, start)
        c.lineTo(0, h)
        c.lineTo(w, h)
        c.lineTo(w, start)

        if (fill === constants.NONE) {
          c.stroke()
        } else {
          c.fillAndStroke()
        }
      }
    } else {
      c.moveTo(start, 0)
      c.lineTo(0, 0)
      c.lineTo(0, h)
      c.lineTo(start, h)
      c.fillAndStroke()

      if (start < w) {
        if (fill === constants.NONE) {
          c.pointerEvents = false
        } else {
          c.setFillColor(fill)
        }

        c.begin()
        c.moveTo(start, 0)
        c.lineTo(w, 0)
        c.lineTo(w, h)
        c.lineTo(start, h)

        if (fill === constants.NONE) {
          c.stroke()
        } else {
          c.fillAndStroke()
        }
      }
    }

    if (swimlaneLine) {
      this.paintDivider(c, x, y, w, h, start, fill === constants.NONE)
    }
  }

  paintRoundedSwimlane(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
    start: number,
    r: number,
    fill: string,
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
        if (fill === constants.NONE) {
          c.pointerEvents = false
        } else {
          c.setFillColor(fill)
        }

        c.begin()
        c.moveTo(0, start)
        c.lineTo(0, h - r)
        c.quadTo(0, h, Math.min(w / 2, r), h)
        c.lineTo(w - Math.min(w / 2, r), h)
        c.quadTo(w, h, w, h - r)
        c.lineTo(w, start)

        if (fill === constants.NONE) {
          c.stroke()
        } else {
          c.fillAndStroke()
        }
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
        if (fill === constants.NONE) {
          c.pointerEvents = false
        } else {
          c.setFillColor(fill)
        }

        c.begin()
        c.moveTo(start, h)
        c.lineTo(w - r, h)
        c.quadTo(w, h, w, h - Math.min(h / 2, r))
        c.lineTo(w, Math.min(h / 2, r))
        c.quadTo(w, 0, w - r, 0)
        c.lineTo(start, 0)

        if (fill === constants.NONE) {
          c.stroke()
        } else {
          c.fillAndStroke()
        }
      }
    }

    if (swimlaneLine) {
      this.paintDivider(c, x, y, w, h, start, fill === constants.NONE)
    }
  }

  /**
   * Paints the divider between swimlane title and content area.
   */
  paintDivider(
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
  paintSeparator(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
    start: number,
    color?: string,
  ) {
    if (color !== constants.NONE) {
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

  getImageBounds(
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
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
}
