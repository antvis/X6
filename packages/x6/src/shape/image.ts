import { Rectangle } from '../geometry'
import { DomUtil } from '../dom'
import { RectangleShape } from './rectangle'
import { SvgCanvas2D } from '../canvas'
import { Overlay } from '../struct'
import { State } from '../core/state'

export class ImageShape extends RectangleShape {
  image: string
  preserveImageAspect: boolean = true
  overlay?: Overlay

  constructor(
    bounds: Rectangle,
    image: string,
    fillColor?: string | null,
    strokeColor?: string | null,
    strokewidth?: number | null,
  ) {
    super(bounds, fillColor, strokeColor, strokewidth)
    this.image = image
  }

  /**
   * Disables offset in IE9 for crisper image output.
   */
  getSvgScreenOffset() {
    return 0
  }

  apply(state: State) {
    super.apply(state)

    this.fillColor = null
    this.strokeColor = null
    this.gradientColor = null

    if (this.style != null) {
      this.flipH = this.flipH || !!this.style.imageFlipH
      this.flipV = this.flipV || !!this.style.imageFlipV
      this.preserveImageAspect = this.style.imageAspect !== false
    }
  }

  isHtmlAllowed() {
    return !this.preserveImageAspect
  }

  isRoundable() {
    return false
  }

  createHtmlDiv() {
    const node = document.createElement('div')
    node.style.position = 'absolute'
    return node
  }

  drawNodeShape(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    if (this.image != null) {
      const fillColor = this.style.imageBackgroundColor
      const strokeColor = this.style.imageBorderColor

      if (fillColor != null) {
        // Stroke rendering required for shadow
        c.setFillColor(fillColor)
        c.setStrokeColor(strokeColor)
        c.rect(x, y, w, h)
        c.fillAndStroke()
      }

      c.image(x, y, w, h, this.image, this.preserveImageAspect, false, false)

      if (strokeColor != null) {
        c.setShadow(false)
        c.setStrokeColor(strokeColor)
        c.rect(x, y, w, h)
        c.stroke()
      }
    } else {
      super.drawBackground(c, x, y, w, h)
    }
  }

  redrawHtmlShape() {
    const elem = this.elem!

    elem.style.left = `${Math.round(this.bounds.x)}px`
    elem.style.top = `${Math.round(this.bounds.y)}px`
    elem.style.width = `${Math.max(0, Math.round(this.bounds.width))}px`
    elem.style.height = `${Math.max(0, Math.round(this.bounds.height))}px`

    elem.innerHTML = ''

    if (this.image != null) {
      const fillColor = this.style.imageBackgroundColor
      const strokeColor = this.style.imageBorderColor

      elem.style.backgroundColor = fillColor || ''
      elem.style.borderColor = strokeColor || ''

      const img = document.createElement('img')
      img.setAttribute('border', '0')
      img.style.position = 'absolute'
      img.src = this.image

      let filter =
        this.opacity < 1 ? `alpha(opacity=${this.opacity * 100})` : ''

      elem.style.filter = filter

      if (this.flipH && this.flipV) {
        filter += 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2)'
      } else if (this.flipH) {
        filter += 'progid:DXImageTransform.Microsoft.BasicImage(mirror=1)'
      } else if (this.flipV) {
        filter +=
          'progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)'
      }

      if (img.style.filter !== filter) {
        img.style.filter = filter
      }

      if (this.rotation !== 0) {
        DomUtil.setPrefixedStyle(
          img.style,
          'transform',
          `rotate(${this.rotation}deg)`,
        )
      } else {
        DomUtil.setPrefixedStyle(img.style, 'transform', '')
      }

      img.style.width = elem.style.width
      img.style.height = elem.style.height

      elem.style.backgroundImage = ''
      elem.appendChild(img)
    } else {
      this.setTransparentBackgroundImage(elem as HTMLElement)
    }
  }
}
