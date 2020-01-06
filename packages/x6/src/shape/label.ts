import { Rectangle } from '../geometry'
import { globals } from '../option'
import { Shape } from './shape-base'
import { RectangleShape } from './rectangle'
import { SvgCanvas2D } from '../canvas'
import { Direction } from '../types'

export class Label extends RectangleShape {
  image: string | null

  /**
   * Default width and height for the image.
   */
  imageSize: number = globals.defaultImageSize

  /**
   * Default value for image spacing.
   *
   * Default is `2`.
   */
  spacing: number = 2

  indicator: Shape
  indicatorShape: any
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
    fillColor: string,
    strokeColor: string,
    strokewidth: number = 1,
  ) {
    super(bounds, fillColor, strokeColor, strokewidth)
  }

  init(container: HTMLElement) {
    super.init(container)

    if (this.indicatorShape != null) {
      this.indicator = new this.indicatorShape()
      this.indicator.dialect = this.dialect
      this.indicator.init(this.elem!)
    }
  }

  redraw() {
    if (this.indicator != null) {
      this.indicator.fillColor = this.indicatorColor
      this.indicator.strokeColor = this.indicatorStrokeColor
      this.indicator.gradientColor = this.indicatorGradientColor
      this.indicator.direction = this.indicatorDirection
    }

    super.redraw()
  }

  isHtmlAllowed() {
    return (
      super.isHtmlAllowed() &&
      this.indicatorColor == null &&
      this.indicatorShape == null
    )
  }

  drawForeground(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    this.paintImage(c, x, y, w, h)
    this.paintIndicator(c, x, y, w, h)
    super.drawForeground(c, x, y, w, h)
  }

  paintImage(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
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

  getImageBounds(x: number, y: number, w: number, h: number) {
    const align = this.style.imageAlign || 'left'
    const valign = this.style.imageVerticalAlign || 'middle'
    const width = this.style.imageWidth || this.imageSize
    const height = this.style.imageHeight || this.imageSize
    const spacing = (this.style.spacing || this.spacing) + 5

    let x1 = x
    let y1 = y

    if (align === 'center') {
      x1 += (w - width) / 2
    } else if (align === 'right') {
      x1 += w - width - spacing
    } else {
      // default is left
      x1 += spacing
    }

    if (valign === 'top') {
      y1 += spacing
    } else if (valign === 'bottom') {
      y1 += h - height - spacing
    } else {
      // default is middle
      y1 += (h - height) / 2
    }

    return new Rectangle(x1, y1, width, height)
  }

  paintIndicator(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    if (this.indicator != null) {
      this.indicator.bounds = this.getIndicatorBounds(x, y, w, h)
      this.indicator.draw(c)
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

  getIndicatorBounds(x: number, y: number, w: number, h: number) {
    const align = this.style.imageAlign || 'left'
    const valign = this.style.imageVerticalAlign || 'middle'
    const width = this.style.indicatorWidth || this.indicatorSize
    const height = this.style.indicatorHeight || this.indicatorSize
    const spacing = this.spacing + 5

    let x1 = x
    let y1 = y

    if (align === 'right') {
      x1 += w - width - spacing
    } else if (align === 'center') {
      x1 += (w - width) / 2
    } else {
      // default is left
      x1 += spacing
    }

    if (valign === 'bottom') {
      y1 += h - height - spacing
    } else if (valign === 'top') {
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
