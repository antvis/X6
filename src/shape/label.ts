import * as util from '../util'
import { constants } from '../common'
import { Shape } from './Shape'
import { RectShape } from './rect'
import { Rectangle } from '../struct'
import { SvgCanvas2D } from '../canvas'
import { StyleNames, Align, Direction } from '../types'

export class Label extends RectShape {
  image: string | null
  /**
   * Default width and height for the image.
   */
  imageSize: number = constants.DEFAULT_IMAGESIZE

  /**
   * Default value for image spacing.
   *
   * Default is `2`.
   */
  spacing: number = 2

  indicatorShape: any
  indicator: Shape
  indicatorImage: string | null
  indicatorColor: string | null
  indicatorStrokeColor: string | null
  indicatorGradientColor: string | null
  indicatorDirection: Direction

  /**
   * Default width and height for the indicicator.
   *
   * Default is `10`.
   */
  indicatorSize: number = 10

  /**
   * Default spacing between image and indicator.
   *
   * Default is `2`.
   */
  indicatorSpacing: number = 2

  constructor(
    bounds: Rectangle,
    image: string,
    fill: string,
    stroke: string,
    strokewidth: number = 1,
  ) {
    super(bounds, fill, stroke, strokewidth)
  }

  init(container: HTMLElement) {
    super.init(container)

    if (this.indicatorShape != null) {
      this.indicator = new this.indicatorShape()
      this.indicator.dialect = this.dialect
      this.indicator.init(this.elem!)
    }
  }

  /**
   * Reconfigures this shape. This will update the colors of the indicator
   * and reconfigure it if required.
   */
  redraw() {
    if (this.indicator != null) {
      this.indicator.fill = this.indicatorColor
      this.indicator.stroke = this.indicatorStrokeColor
      this.indicator.gradient = this.indicatorGradientColor
      this.indicator.direction = this.indicatorDirection
    }

    super.redraw()
  }

  /**
   * Returns true for non-rounded, non-rotated shapes with
   * no glass gradient and no indicator shape.
   */
  isHtmlAllowed() {
    return (
      super.isHtmlAllowed() &&
      this.indicatorColor == null &&
      this.indicatorShape == null
    )
  }

  paintForeground(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    this.paintImage(c, x, y, w, h)
    this.paintIndicator(c, x, y, w, h)

    super.paintForeground(c, x, y, w, h)
  }

  paintImage(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    if (this.image != null) {
      const bounds = this.getImageBounds(x, y, w, h)
      c.image(
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height,
        this.image,
        false,
        false,
        false,
      )
    }
  }

  getImageBounds(
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    const align = util.getValue(this.style, StyleNames.imageAlign, Align.left)
    const valign = util.getValue(this.style, StyleNames.imageVerticalAlign, Align.middle)
    const width = util.getNumber(this.style, StyleNames.imageWidth, constants.DEFAULT_IMAGESIZE)
    const height = util.getNumber(this.style, StyleNames.imageHeight, constants.DEFAULT_IMAGESIZE)
    const spacing = util.getNumber(this.style, StyleNames.spacing, this.spacing) + 5

    let x1 = x
    let y1 = y

    if (align === Align.center) {
      x1 += (w - width) / 2
    } else if (align === Align.right) {
      x1 += w - width - spacing
    } else {
      // default is left
      x1 += spacing
    }

    if (valign === Align.top) {
      y1 += spacing
    } else if (valign === Align.bottom) {
      y1 += h - height - spacing
    } else {
      // default is middle
      y1 += (h - height) / 2
    }

    return new Rectangle(x1, y1, width, height)
  }

  paintIndicator(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    if (this.indicator != null) {
      this.indicator.bounds = this.getIndicatorBounds(x, y, w, h)
      this.indicator.paint(c)
    } else if (this.indicatorImage != null) {
      const bounds = this.getIndicatorBounds(x, y, w, h)
      c.image(
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height,
        this.indicatorImage,
        false,
        false,
        false,
      )
    }
  }

  getIndicatorBounds(
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    const align = util.getValue(this.style, StyleNames.imageAlign, Align.left)
    const valign = util.getValue(this.style, StyleNames.imageVerticalAlign, Align.middle)
    const width = util.getNumber(this.style, StyleNames.indicatorWidth, this.indicatorSize)
    const height = util.getNumber(this.style, StyleNames.indicatorHeight, this.indicatorSize)
    const spacing = this.spacing + 5

    let x1 = x
    let y1 = y

    if (align === constants.ALIGN_RIGHT) {
      x1 += w - width - spacing
    } else if (align === constants.ALIGN_CENTER) {
      x1 += (w - width) / 2
    } else {
      // default is left
      x1 += spacing
    }

    if (valign === constants.ALIGN_BOTTOM) {
      y1 += h - height - spacing
    } else if (valign === constants.ALIGN_TOP) {
      y1 += spacing
    } else {
      // default is middle
      y1 += (h - height) / 2
    }

    return new Rectangle(x1, y1, width, height)
  }

  redrawHtmlShape() {
    super.redrawHtmlShape()

    // Removes all children
    if (this.elem) {
      while (this.elem.hasChildNodes()) {
        this.elem.removeChild(this.elem.lastChild!)
      }
    }

    if (this.image != null) {
      const img = document.createElement('img')
      img.style.position = 'relative'
      img.setAttribute('border', '0')

      const bounds = this.getImageBounds(
        this.bounds.x,
        this.bounds.y,
        this.bounds.width,
        this.bounds.height,
      )

      bounds.x -= this.bounds.x
      bounds.y -= this.bounds.y

      img.style.left = `${Math.round(bounds.x)}px`
      img.style.top = `${Math.round(bounds.y)}`
      img.style.width = `${Math.round(bounds.width)}`
      img.style.height = `${Math.round(bounds.height)}`

      img.src = this.image

      this.elem!.appendChild(img)
    }
  }
}
