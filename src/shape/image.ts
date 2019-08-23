import * as util from '../util'
import { RectShape } from './rect'
import { Rectangle } from '../struct'
import { SvgCanvas2D } from '../canvas'
import { StyleNames } from '../types'
import { CellState, CellOverlay } from '../core'

export class ImageShape extends RectShape {

  image: string
  preserveImageAspect: boolean = true
  overlay?: CellOverlay

  constructor(
    bounds: Rectangle,
    image: string,
    fill?: string,
    stroke?: string,
    strokewidth?: number,
  ) {
    super(bounds, fill, stroke, strokewidth)
    this.image = image
  }

  /**
   * Disables offset in IE9 for crisper image output.
   */
  getSvgScreenOffset() {
    return 0
  }

  apply(state: CellState) {
    super.apply(state)

    this.fill = null
    this.stroke = null
    this.gradient = null

    if (this.style != null) {
      this.flipH = this.flipH || util.getBooleanFromStyle(this.style, 'imageFlipH')
      this.flipV = this.flipV || util.getBooleanFromStyle(this.style, 'imageFlipV')
      this.preserveImageAspect = util.getBooleanFromStyle(this.style, StyleNames.imageAspect, true)
    }
  }

  /**
   * Returns true if HTML is allowed for this shape.
   * This implementation always returns false.
   */
  isHtmlAllowed() {
    return !this.preserveImageAspect
  }

  /**
   * Creates and returns the HTML DOM node(s) to represent
   * this shape. This implementation falls back to <createVml>
   * so that the HTML creation is optional.
   */
  createHtml() {
    const node = document.createElement('div')
    node.style.position = 'absolute'
    return node
  }

  /**
   * Disables inherited roundable support.
   */
  isRoundable() {
    return false
  }

  /**
   * Generic background painting implementation.
   */
  paintNodeShape(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    if (this.image != null) {
      const fill = util.getValue(this.style, StyleNames.imageBackground, null)
      let stroke = util.getValue(this.style, StyleNames.imageBorder, null)

      if (fill != null) {
        // Stroke rendering required for shadow
        c.setFillColor(fill)
        c.setStrokeColor(stroke)
        c.rect(x, y, w, h)
        c.fillAndStroke()
      }

      c.image(x, y, w, h, this.image, this.preserveImageAspect, false, false)

      stroke = util.getValue(this.style, StyleNames.imageBorder, null)

      if (stroke != null) {
        c.setShadow(false)
        c.setStrokeColor(stroke)
        c.rect(x, y, w, h)
        c.stroke()
      }
    } else {
      super.paintBackground(c, x, y, w, h)
    }
  }

  /**
   * Overrides <mxShape.redraw> to preserve the aspect ratio of images.
   */
  redrawHtmlShape() {
    const elem = this.elem!

    elem.style.left = `${Math.round(this.bounds.x)}px`
    elem.style.top = `${Math.round(this.bounds.y)}`
    elem.style.width = `${Math.max(0, Math.round(this.bounds.width))}px`
    elem.style.height = `${Math.max(0, Math.round(this.bounds.height))}`

    elem.innerHTML = ''

    if (this.image != null) {
      const fill = util.getValue(this.style, StyleNames.imageBackground, null)
      const stroke = util.getValue(this.style, StyleNames.imageBorder, null)

      elem.style.backgroundColor = fill
      elem.style.borderColor = stroke

      const img = document.createElement('img')
      img.setAttribute('border', '0')
      img.style.position = 'absolute'
      img.src = this.image

      let filter = this.opacity < 100 ? `alpha(opacity=${this.opacity})` : ''
      elem.style.filter = filter

      if (this.flipH && this.flipV) {
        filter += 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2)'
      } else if (this.flipH) {
        filter += 'progid:DXImageTransform.Microsoft.BasicImage(mirror=1)'
      } else if (this.flipV) {
        filter += 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)'
      }

      if (img.style.filter !== filter) {
        img.style.filter = filter
      }

      if (this.rotation !== 0) {
        util.setPrefixedStyle(img.style, 'transform', `rotate(${this.rotation}deg)`)
      } else {
        util.setPrefixedStyle(img.style, 'transform', '')
      }

      // Known problem: IE clips top line of image for certain angles
      img.style.width = elem.style.width
      img.style.height = elem.style.height

      elem.style.backgroundImage = ''
      elem.appendChild(img)
    } else {
      this.setTransparentBackgroundImage(elem as HTMLElement)
    }
  }
}
