import { DomUtil } from '../dom'
import { StringExt, Color } from '../util'
import { Point, Rectangle } from '../geometry'
import { Align, VAlign, WritingDirection } from '../types'
import { SvgCanvas2D } from '../canvas'
import { Shape } from './shape-base'
import { State } from '../core/state'
import { FontStyle } from '../enum'
import { globals } from '../option'

export class Text extends Shape {
  value: HTMLElement | string
  align: Align
  verticalAlign: VAlign
  fontColor: string
  borderColor?: string
  backgroundColor?: string

  fontFamily: string
  fontSize: number
  fontStyle: number

  spacing: number
  spacingTop: number
  spacingRight: number
  spacingBottom: number
  spacingLeft: number
  horizontal: boolean

  wrap: boolean
  clipped: boolean
  overflow: string
  textDirection: WritingDirection
  margin: { x: number; y: number }

  private lastUnscaledWidth: number
  private offsetWidth: number | null
  private offsetHeight: number | null
  private unrotatedBoundingBox: Rectangle | null

  constructor(
    txt: HTMLElement | string,
    bounds: Rectangle,
    {
      align,
      valign,
      fontColor,
      borderColor,
      backgroundColor,
      fontFamily,
      fontSize,
      fontStyle,
      textDirection,

      spacing,
      spacingTop,
      spacingRight,
      spacingBottom,
      spacingLeft,

      wrap,
      clipped,
      overflow,
      horizontal,
    }: Text.Options,
  ) {
    super()
    this.value = txt
    this.bounds = bounds

    this.align = align != null ? align : 'center'
    this.verticalAlign = valign != null ? valign : 'middle'

    this.fontColor = fontColor != null ? fontColor : globals.defaultFontColor
    this.borderColor = borderColor
    this.backgroundColor = backgroundColor

    this.fontFamily =
      fontFamily != null ? fontFamily : globals.defaultFontFamily
    this.fontSize = fontSize != null ? fontSize : globals.defaultFontSize
    this.fontStyle = fontStyle != null ? fontStyle : globals.defaultFontStyle
    this.textDirection = textDirection

    this.spacing = parseInt((spacing as any) || 2, 10)
    this.spacingTop = this.spacing + parseInt((spacingTop as any) || 0, 10)
    this.spacingRight = this.spacing + parseInt((spacingRight as any) || 0, 10)
    this.spacingBottom =
      this.spacing + parseInt((spacingBottom as any) || 0, 10)
    this.spacingLeft = this.spacing + parseInt((spacingLeft as any) || 0, 10)

    this.wrap = wrap != null ? wrap : false
    this.clipped = clipped != null ? clipped : false
    this.overflow = overflow != null ? overflow : 'visible'
    this.horizontal = horizontal != null ? horizontal : true

    this.rotation = 0
    this.updateMargin()
  }

  /**
   * Specifies if linefeeds in HTML labels should be replaced with BR tags.
   *
   * Default is `true`.
   */
  replaceLinefeeds: boolean = true

  /**
   * Rotation for vertical text.
   *
   * Default is `-90` (bottom to top).
   */
  verticalTextRotation: number = -90

  /**
   * Specifies if the string size should be measured in `updateBoundingBox`
   * if the label is clipped and the label position is center and middle.
   *
   * If this is `true`, then the bounding box will be set to `bounds`.
   *
   * Default is `true`.
   */
  ignoreClippedStringSize: boolean = true

  /**
   * Specifies if the actual string size should be measured. If disabled the
   * `boundingBox` will not ignore the actual size of the string, otherwise
   * `bounds` will be used instead.
   *
   * Default is `false`.
   */
  ignoreStringSize: boolean = false

  /**
   * Specifies the padding to be added to the text width for the bounding box.
   * This is needed to make sure no clipping is applied to borders.
   */
  textWidthPadding: number = 3

  /**
   * Contains the last rendered text value. Used for caching.
   */
  lastValue: HTMLElement | string | null = null

  /**
   * Specifies if caching for HTML labels should be enabled.
   *
   * Default is `true`.
   */
  cacheEnabled: boolean = true

  isHtmlAllowed() {
    return true
  }

  getSvgScreenOffset() {
    return 0
  }

  isValidBounds() {
    return (
      !isNaN(this.scale) &&
      isFinite(this.scale) &&
      this.scale > 0 &&
      this.bounds != null &&
      !isNaN(this.bounds.x) &&
      !isNaN(this.bounds.y) &&
      !isNaN(this.bounds.width) &&
      !isNaN(this.bounds.height)
    )
  }

  draw(c: SvgCanvas2D, update?: boolean) {
    // Scale is passed-through to canvas
    const s = this.scale
    const x = this.bounds.x / s
    const y = this.bounds.y / s
    const w = this.bounds.width / s
    const h = this.bounds.height / s

    this.updateTransform(c, x, y, w, h)
    this.configureCanvas(c, x, y, w, h)

    const unscaledWidth = this.state != null ? this.state.unscaledWidth : null

    if (update) {
      if (
        this.elem!.firstChild != null &&
        (unscaledWidth == null || this.lastUnscaledWidth !== unscaledWidth)
      ) {
        c.invalidateCachedOffsetSize(this.elem as SVGElement)
      }

      c.updateText(
        x,
        y,
        w,
        h,
        this.elem as SVGElement,
        this.align,
        this.verticalAlign,
        this.wrap,
        this.overflow,
        this.clipped,
        this.getTextRotation(),
      )
    } else {
      // Checks if text contains HTML markup
      const realHtml =
        DomUtil.isHtmlElement(this.value) || this.dialect === 'html'
      const fmt = realHtml ? 'html' : ''
      let val = this.value

      if (fmt === 'html' && !DomUtil.isHtmlElement(this.value)) {
        val = DomUtil.replaceTrailingNewlines(val as string, '<div><br></div>')
      }

      // Handles trailing newlines to make sure they are visible in rendering output
      val =
        !DomUtil.isHtmlElement(this.value) &&
        this.replaceLinefeeds &&
        fmt === 'html'
          ? (val as string).replace(/\n/g, '<br/>')
          : val

      let dir = this.textDirection
      if (dir === 'auto' && !realHtml) {
        dir = this.getAutoDirection()
      }

      if (dir !== 'ltr' && dir !== 'rtl') {
        dir = ''
      }

      c.drawText(
        x,
        y,
        w,
        h,
        val as string,
        this.align,
        this.verticalAlign,
        this.wrap,
        fmt,
        this.overflow,
        this.clipped,
        this.getTextRotation(),
        dir,
      )
    }

    // Needs to invalidate the cached offset widths if the geometry changes
    this.lastUnscaledWidth = unscaledWidth as number
  }

  redraw() {
    if (
      this.visible &&
      this.isValidBounds() &&
      this.cacheEnabled &&
      this.lastValue === this.value &&
      (DomUtil.isHtmlElement(this.value) || this.dialect === 'html')
    ) {
      if (DomUtil.getNodeName(this.elem!) === 'div' && this.isHtmlAllowed()) {
        this.updateSize(this.elem as HTMLElement, this.state == null)
        this.updateHtmlTransform()
        this.updateBoundingBox()
      } else {
        const canvas = this.createCanvas()
        if (
          canvas != null &&
          canvas.updateText != null &&
          canvas.invalidateCachedOffsetSize != null
        ) {
          this.draw(canvas, true)
          this.destroyCanvas(canvas)
          this.updateBoundingBox()
        } else {
          super.redraw()
        }
      }
    } else {
      super.redraw()
      if (DomUtil.isHtmlElement(this.value) || this.dialect === 'html') {
        this.lastValue = this.value
      } else {
        this.lastValue = null
      }
    }
  }

  resetStyle() {
    super.resetStyle()

    this.fontColor = 'black'
    this.align = 'center'
    this.verticalAlign = 'middle'
    this.fontFamily = 'Arial,Helvetica'
    this.fontSize = 12
    this.fontStyle = 0
    this.spacing = 2
    this.spacingTop = 2
    this.spacingRight = 2
    this.spacingBottom = 2
    this.spacingLeft = 2
    this.horizontal = true
    delete this.backgroundColor
    delete this.borderColor
    this.textDirection = ''
    delete this.margin
  }

  apply(state: State) {
    const spacing = this.spacing

    super.apply(state)

    if (this.style != null) {
      this.opacity = this.style.textOpacity || 1
      this.fontStyle = this.style.fontStyle || this.fontStyle
      this.fontFamily = this.style.fontFamily || this.fontFamily
      this.fontSize = this.style.fontSize || this.fontSize
      this.fontColor = this.style.fontColor || this.fontColor
      this.align = this.style.align || this.align
      this.verticalAlign = this.style.verticalAlign || this.verticalAlign

      this.spacing = this.style.spacing || this.spacing
      this.spacingTop =
        (this.style.spacingTop || this.spacingTop - spacing) + this.spacing
      this.spacingRight =
        (this.style.spacingRight || this.spacingRight - spacing) + this.spacing
      this.spacingBottom =
        (this.style.spacingBottom || this.spacingBottom - spacing) +
        this.spacing
      this.spacingLeft =
        (this.style.spacingLeft || this.spacingLeft - spacing) + this.spacing

      this.horizontal = this.style.horizontal || this.horizontal
      this.backgroundColor =
        this.style.labelBackgroundColor || this.backgroundColor
      this.borderColor = this.style.labelBorderColor || this.borderColor
      this.textDirection = this.style.textDirection || ''

      this.updateMargin()
    }

    delete this.flipV
    delete this.flipH
  }

  /**
   * Used to determine the automatic text direction.
   */
  getAutoDirection(): WritingDirection {
    // Looks for strong (directional) characters
    // tslint:disable-next-line
    const tmp = /[A-Za-z\u05d0-\u065f\u066a-\u06ef\u06fa-\u07ff\ufb1d-\ufdff\ufe70-\ufefc]/.exec(
      this.value as string,
    )

    // Returns the direction defined by the character
    return tmp != null && tmp.length > 0 && tmp[0] > 'z'
      ? ('rtl' as WritingDirection)
      : ('ltr' as WritingDirection)
  }

  updateBoundingBox() {
    this.boundingBox = this.bounds.clone()

    let elem = this.elem
    const rot = this.getTextRotation()

    const h = this.style.labelPosition || 'center'
    const v = this.style.labelVerticalPosition || 'middle'

    if (
      !this.ignoreStringSize &&
      elem != null &&
      this.overflow !== 'fill' &&
      (!this.clipped ||
        !this.ignoreClippedStringSize ||
        h !== 'center' ||
        v !== 'middle')
    ) {
      let ow = null
      let oh = null

      if ((elem as SVGElement).ownerSVGElement != null) {
        if (
          elem.firstChild != null &&
          elem.firstChild.firstChild != null &&
          elem.firstChild.firstChild.nodeName === 'foreignObject'
        ) {
          elem = elem.firstChild.firstChild as HTMLElement
          ow = parseInt(elem.getAttribute('width')!, 10) * this.scale
          oh = parseInt(elem.getAttribute('height')!, 10) * this.scale
        } else {
          try {
            const b = (elem as SVGGElement).getBBox()

            // Workaround for bounding box of empty string
            if (typeof this.value === 'string' && this.value === '') {
              this.boundingBox = null
            } else if (b.width === 0 && b.height === 0) {
              this.boundingBox = null
            } else {
              this.boundingBox = new Rectangle(b.x, b.y, b.width, b.height)
            }
            return
          } catch (e) {}
        }
      } else {
        // Use cached offset size
        if (this.offsetWidth != null && this.offsetHeight != null) {
          ow = this.offsetWidth * this.scale
          oh = this.offsetHeight * this.scale
        } else {
          let sizeDiv = elem as HTMLDivElement
          if (
            sizeDiv.firstChild != null &&
            DomUtil.getNodeName(sizeDiv.firstChild as HTMLElement) === 'div'
          ) {
            sizeDiv = sizeDiv.firstChild as HTMLDivElement
          }

          this.offsetWidth = sizeDiv.offsetWidth + this.textWidthPadding
          this.offsetHeight = sizeDiv.offsetHeight

          ow = this.offsetWidth * this.scale
          oh = this.offsetHeight * this.scale
        }
      }

      if (ow != null && oh != null) {
        this.boundingBox = new Rectangle(this.bounds.x, this.bounds.y, ow, oh)
      }
    }

    if (this.boundingBox != null) {
      if (rot !== 0) {
        // Accounts for pre-rotated x and y
        const bbox = new Rectangle(
          this.margin.x * this.boundingBox.width,
          this.margin.y * this.boundingBox.height,
          this.boundingBox.width,
          this.boundingBox.height,
        )

        bbox.rotate(rot, new Point(0, 0))

        this.unrotatedBoundingBox = this.boundingBox.clone()
        this.unrotatedBoundingBox.x +=
          this.margin.x * this.unrotatedBoundingBox.width
        this.unrotatedBoundingBox.y +=
          this.margin.y * this.unrotatedBoundingBox.height

        this.boundingBox.x += bbox.x
        this.boundingBox.y += bbox.y
        this.boundingBox.width = bbox.width
        this.boundingBox.height = bbox.height
      } else {
        this.boundingBox.x += this.margin.x * this.boundingBox.width
        this.boundingBox.y += this.margin.y * this.boundingBox.height
        this.unrotatedBoundingBox = null
      }
    }
  }

  getShapeRotation() {
    return 0
  }

  getTextRotation() {
    return this.state != null && this.state.shape != null
      ? this.state.shape.getTextRotation()
      : 0
  }

  drawBoundsInverted() {
    return !this.horizontal && this.state != null && this.state.cell.isNode()
  }

  configureCanvas(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    super.configureCanvas(c, x, y, w, h)

    c.setFontColor(this.fontColor)
    c.setFontBackgroundColor(this.backgroundColor!)
    c.setFontBorderColor(this.borderColor!)
    c.setFontFamily(this.fontFamily)
    c.setFontSize(this.fontSize)
    c.setFontStyle(this.fontStyle)
  }

  redrawHtmlShape() {
    const style = this.elem!.style

    // Resets CSS styles
    style.whiteSpace = 'normal'
    style.overflow = ''
    style.width = ''
    style.height = ''

    this.updateValue()
    this.updateFont(this.elem as HTMLElement)
    this.updateSize(this.elem as HTMLElement, this.state == null)

    this.offsetWidth = null
    this.offsetHeight = null

    this.updateHtmlTransform()
  }

  updateHtmlTransform() {
    const theta = this.getTextRotation()
    const style = this.elem!.style
    const dx = this.margin.x
    const dy = this.margin.y

    if (theta !== 0) {
      DomUtil.setPrefixedStyle(
        style,
        'transformOrigin',
        `${-dx * 100}% ${-dy * 100}%`,
      )

      DomUtil.setPrefixedStyle(
        style,
        'transform',
        `translate(${dx * 100}%, ${dy * 100}%)` +
          `scale(${this.scale}) ` +
          `rotate(${theta}deg)`,
      )
    } else {
      DomUtil.setPrefixedStyle(style, 'transformOrigin', '0% 0%')
      DomUtil.setPrefixedStyle(
        style,
        'transform',
        `scale(${this.scale}) ` + `translate(${dx * 100}%, ${dy * 100}%)`,
      )
    }

    const left = Math.round(
      this.bounds.x -
        Math.ceil(
          dx * (this.overflow !== 'fill' && this.overflow !== 'width' ? 3 : 1),
        ),
    )

    style.left = `${left}px`
    style.top = `${Math.round(
      this.bounds.y - dy * (this.overflow !== 'fill' ? 3 : 1),
    )}px`

    if (this.opacity < 1) {
      style.opacity = `${this.opacity}`
    } else {
      style.opacity = ''
    }
  }

  updateInnerHtml(elt: HTMLElement) {
    if (DomUtil.isHtmlElement(this.value)) {
      elt.innerHTML = ((this.value as any) as HTMLElement).outerHTML
    } else {
      let val = this.value
      if (this.dialect !== 'html') {
        val = StringExt.escape(val as string)
      }

      // Handles trailing newlines to make sure they are visible in rendering output
      val = DomUtil.replaceTrailingNewlines(val as string, '<div>&nbsp;</div>')
      val = this.replaceLinefeeds ? val.replace(/\n/g, '<br/>') : val
      val = `<div style="display:inline-block;_display:inline;">${val}</div>`

      elt.innerHTML = val
    }
  }

  updateValue() {
    if (DomUtil.isHtmlElement(this.value)) {
      this.elem!.innerHTML = ''
      this.elem!.appendChild((this.value as any) as HTMLElement)
    } else {
      let val = this.value

      if (this.dialect !== 'html') {
        val = StringExt.escape(val as string)
      }

      // Handles trailing newlines to make sure they are visible in rendering output
      val = DomUtil.replaceTrailingNewlines(val as string, '<div><br></div>')
      val = this.replaceLinefeeds ? val.replace(/\n/g, '<br/>') : val

      const bg = Color.isValid(this.backgroundColor)
        ? this.backgroundColor
        : null

      const bd = Color.isValid(this.borderColor) ? this.borderColor : null

      if (this.overflow === 'fill' || this.overflow === 'width') {
        if (bg != null) {
          this.elem!.style.backgroundColor = bg
        }

        if (bd != null) {
          this.elem!.style.border = `1px solid ${bd}`
        }
      } else {
        let css = ''

        if (bg != null) {
          css += `background-color: ${bg}; `
        }

        if (bd != null) {
          css += `border:1px solid ${bd}; `
        }

        const lh = `${this.fontSize * globals.defaultLineHeight}px`

        val = `<div
        style="zoom:1; ${css} display: inline-block; _display:inline;
        text-decoration:inherit; padding-bottom: 1px; padding-right: 1px;
        line-height:${lh};">${val}</div>`
      }

      this.elem!.innerHTML = val

      // Sets text direction
      const divs = this.elem!.getElementsByTagName('div')
      if (divs.length > 0) {
        let dir = this.textDirection
        if (dir === 'auto' && this.dialect !== 'html') {
          dir = this.getAutoDirection()
        }

        if (dir === 'ltr' || dir === 'rtl') {
          divs[divs.length - 1].setAttribute('dir', dir)
        } else {
          divs[divs.length - 1].removeAttribute('dir')
        }
      }
    }
  }

  updateFont(elem: HTMLElement) {
    const style = elem.style

    style.lineHeight = `${this.fontSize * globals.defaultLineHeight}px`
    style.fontSize = `${this.fontSize}px`
    style.fontFamily = this.fontFamily
    style.verticalAlign = 'top'
    style.color = this.fontColor

    if (FontStyle.isBold(this.fontStyle)) {
      style.fontWeight = 'bold'
    } else {
      style.fontWeight = ''
    }

    if (FontStyle.isItalic(this.fontStyle)) {
      style.fontStyle = 'italic'
    } else {
      style.fontStyle = ''
    }

    if (FontStyle.isUnderlined(this.fontStyle)) {
      style.textDecoration = 'underline'
    } else {
      style.textDecoration = ''
    }

    if (this.align === 'center') {
      style.textAlign = 'center'
    } else if (this.align === 'right') {
      style.textAlign = 'right'
    } else {
      style.textAlign = 'left'
    }
  }

  updateSize(node: HTMLElement, enableWrap?: boolean) {
    const w = Math.max(0, Math.round(this.bounds.width / this.scale))
    const h = Math.max(0, Math.round(this.bounds.height / this.scale))
    const style = node.style

    // NOTE: Do not use maxWidth here because wrapping will
    // go wrong if the cell is outside of the viewable area
    if (this.clipped) {
      style.overflow = 'hidden'
      style.width = `${w}px`
    } else if (this.overflow === 'fill') {
      style.width = `${w + 1}px`
      style.height = `${h + 1}px`
      style.overflow = 'hidden'
    } else if (this.overflow === 'width') {
      style.width = `${w + 1}px`
      style.maxHeight = `${h + 1}px`
      style.overflow = 'hidden'
    }

    if (this.wrap && w > 0) {
      style.wordWrap = 'normal'
      style.whiteSpace = 'normal'
      style.width = `${w}px`

      if (enableWrap && this.overflow !== 'fill' && this.overflow !== 'width') {
        let sizeDiv = node

        if (
          sizeDiv.firstChild != null &&
          DomUtil.getNodeName(sizeDiv.firstChild as HTMLElement) === 'div'
        ) {
          sizeDiv = sizeDiv.firstChild as HTMLElement
          if (node.style.wordWrap === 'break-word') {
            sizeDiv.style.width = '100%'
          }
        }

        let tmp = sizeDiv.offsetWidth
        // Workaround for text measuring in hidden containers
        if (tmp === 0) {
          const prev = node.parentNode as HTMLElement
          node.style.visibility = 'hidden'
          document.body.appendChild(node)
          tmp = sizeDiv.offsetWidth
          node.style.visibility = ''
          prev.appendChild(node)
        }

        tmp += 3

        if (this.clipped) {
          tmp = Math.min(tmp, w)
        }

        style.width = `${tmp}px`
      }
    } else {
      style.whiteSpace = 'nowrap'
    }
  }

  updateMargin() {
    this.margin = Align.getAlignmentAsPoint(this.align, this.verticalAlign)
  }

  getSpacing() {
    let dx = 0
    let dy = 0

    if (this.align === 'center') {
      dx = (this.spacingLeft - this.spacingRight) / 2
    } else if (this.align === 'right') {
      dx = -this.spacingRight
    } else {
      dx = this.spacingLeft
    }

    if (this.verticalAlign === 'middle') {
      dy = (this.spacingTop - this.spacingBottom) / 2
    } else if (this.verticalAlign === 'bottom') {
      dy = -this.spacingBottom
    } else {
      dy = this.spacingTop
    }

    return new Point(dx, dy)
  }
}

export namespace Text {
  export interface Options {
    align?: Align
    valign?: VAlign
    fontColor?: string
    borderColor?: string
    backgroundColor?: string
    fontSize?: number
    fontStyle?: number
    fontFamily?: string
    textDirection: WritingDirection

    spacing?: number
    spacingTop?: number
    spacingRight?: number
    spacingBottom?: number
    spacingLeft?: number

    wrap?: boolean
    clipped?: boolean
    overflow?: string
    horizontal?: boolean
  }
}
