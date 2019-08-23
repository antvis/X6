import * as util from '../util'
import { constants, detector } from '../common'
import { Shape } from './shape'
import { Rectangle, Point } from '../struct'
import { Align, StyleNames, TextDirection, FontStyle } from '../types'
import { SvgCanvas2D } from '../canvas'
import { CellState } from '../core'

export class Text extends Shape {
  value: string
  color: string
  align: Align
  valign: Align
  family: string
  size: number
  fontStyle: number
  spacing: number
  spacingTop: number
  spacingRight: number
  spacingBottom: number
  spacingLeft: number
  horizontal: boolean
  background?: string
  border?: string
  wrap: boolean
  clipped: boolean
  overflow: string
  labelPadding: number
  textDirection: TextDirection
  margin: Point

  private lastUnscaledWidth: number
  private offsetWidth: number | null
  private offsetHeight: number | null
  private unrotatedBoundingBox: Rectangle | null

  constructor(
    value: string,
    bounds: Rectangle,
    {
      align,
      valign,
      color,
      family,
      size,
      fontStyle,
      spacing,
      spacingTop,
      spacingRight,
      spacingBottom,
      spacingLeft,
      horizontal,
      background,
      border,
      wrap,
      clipped,
      overflow,
      labelPadding,
      textDirection,
    }: Text.Options,
  ) {
    super()
    this.value = value
    this.bounds = bounds
    this.color = (color != null) ? color : 'black'
    this.align = (align != null) ? align : Align.center
    this.valign = (valign != null) ? valign : Align.middle
    this.family = (family != null) ? family : constants.DEFAULT_FONTFAMILY
    this.size = (size != null) ? size : constants.DEFAULT_FONTSIZE
    this.fontStyle = (fontStyle != null) ? fontStyle : constants.DEFAULT_FONTSTYLE
    this.spacing = parseInt(spacing as any || 2, 10)
    this.spacingTop = this.spacing + parseInt(spacingTop as any || 0, 10)
    this.spacingRight = this.spacing + parseInt(spacingRight as any || 0, 10)
    this.spacingBottom = this.spacing + parseInt(spacingBottom as any || 0, 10)
    this.spacingLeft = this.spacing + parseInt(spacingLeft as any || 0, 10)
    this.horizontal = (horizontal != null) ? horizontal : true
    this.background = background
    this.border = border
    this.wrap = (wrap != null) ? wrap : false
    this.clipped = (clipped != null) ? clipped : false
    this.overflow = (overflow != null) ? overflow : 'visible'
    this.labelPadding = (labelPadding != null) ? labelPadding : 0
    this.textDirection = textDirection
    this.rotation = 0
    this.updateMargin()
  }

  /**
   * Specifies the spacing to be added to the top spacing.
   *
   * Default is `0`.
   */
  baseSpacingTop: number = 0

  /**
   * Specifies the spacing to be added to the bottom spacing.
   *
   * Default is `0`.
   */
  baseSpacingBottom: number = 0

  /**
   * Specifies the spacing to be added to the left spacing.
   *
   * Default is `0`.
   */
  baseSpacingLeft: number = 0

  /**
   * Specifies the spacing to be added to the right spacing.
   *
   * Default is `0`.
   */
  baseSpacingRight: number = 0

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
  lastValue: string | null = null

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

  paint(c: SvgCanvas2D, update?: boolean) {
    // Scale is passed-through to canvas
    const s = this.scale
    const x = this.bounds.x / s
    const y = this.bounds.y / s
    const w = this.bounds.width / s
    const h = this.bounds.height / s

    this.updateTransform(c, x, y, w, h)
    this.configureCanvas(c, x, y, w, h)

    const unscaledWidth = (this.state != null) ? this.state.unscaledWidth : null

    if (update) {
      if (
        this.elem!.firstChild != null &&
        (unscaledWidth == null || this.lastUnscaledWidth !== unscaledWidth)
      ) {
        c.invalidateCachedOffsetSize(this.elem as SVGElement)
      }

      c.updateText(
        x, y, w, h,
        this.elem as SVGElement,
        this.align,
        this.valign,
        this.wrap,
        this.overflow,
        this.clipped,
        this.getTextRotation(),
      )
    } else {

      // Checks if text contains HTML markup
      const realHtml = util.isHTMLNode(this.value) || this.dialect === constants.DIALECT_STRICTHTML
      const fmt = realHtml ? 'html' : ''
      let val = this.value

      if (fmt === 'html' && !util.isHTMLNode(this.value)) {
        val = util.replaceTrailingNewlines(val, '<div><br></div>')
      }

      // Handles trailing newlines to make sure they are visible in rendering output
      val = (
        !util.isHTMLNode(this.value) &&
        this.replaceLinefeeds &&
        fmt === 'html'
      ) ? val.replace(/\n/g, '<br/>') : val

      let dir = this.textDirection
      if (dir === constants.TEXT_DIRECTION_AUTO && !realHtml) {
        dir = this.getAutoDirection()
      }

      if (
        dir !== constants.TEXT_DIRECTION_LTR &&
        dir !== constants.TEXT_DIRECTION_RTL
      ) {
        dir = TextDirection.default
      }

      c.text(
        x, y, w, h,
        val,
        this.align,
        this.valign,
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
      (
        util.isHTMLNode(this.value) ||
        this.dialect === constants.DIALECT_STRICTHTML
      )
    ) {
      if (util.getNodeName(this.elem!) === 'div' && this.isHtmlAllowed()) {
        this.updateSize(
          this.elem as HTMLElement,
          (this.state == null || this.state.view.textDiv == null))
        this.updateHtmlTransform()
        this.updateBoundingBox()
      } else {
        const canvas = this.createCanvas()
        if (
          canvas != null &&
          canvas.updateText != null &&
          canvas.invalidateCachedOffsetSize != null
        ) {
          this.paint(canvas, true)
          this.destroyCanvas(canvas)
          this.updateBoundingBox()
        } else {
          super.redraw()
        }
      }
    } else {
      super.redraw()
      if (
        util.isHTMLNode(this.value) ||
        this.dialect === constants.DIALECT_STRICTHTML
      ) {
        this.lastValue = this.value
      } else {
        this.lastValue = null
      }
    }
  }

  resetStyle() {
    super.resetStyle()

    this.color = 'black'
    this.align = Align.center
    this.valign = Align.middle
    this.family = constants.DEFAULT_FONTFAMILY
    this.size = constants.DEFAULT_FONTSIZE
    this.fontStyle = constants.DEFAULT_FONTSTYLE
    this.spacing = 2
    this.spacingTop = 2
    this.spacingRight = 2
    this.spacingBottom = 2
    this.spacingLeft = 2
    this.horizontal = true
    delete this.background
    delete this.border
    this.textDirection = constants.DEFAULT_TEXT_DIRECTION as TextDirection
    delete this.margin
  }

  apply(state: CellState) {
    const spacing = this.spacing
    super.apply(state)

    if (this.style != null) {
      this.fontStyle = util.getNumber(this.style, StyleNames.fontStyle, this.fontStyle)
      this.family = util.getValue(this.style, StyleNames.fontFamily, this.family)
      this.size = util.getValue(this.style, StyleNames.fontSize, this.size)
      this.color = util.getValue(this.style, StyleNames.fontColor, this.color)
      this.align = util.getValue(this.style, StyleNames.align, this.align)
      this.valign = util.getValue(this.style, StyleNames.verticalAlign, this.valign)
      this.spacing = util.getNumber(this.style, StyleNames.spacing, this.spacing)

      this.spacingTop = util.getNumber(
        this.style, StyleNames.spacingTop, this.spacingTop - spacing,
      ) + this.spacing

      this.spacingRight = util.getNumber(
        this.style, StyleNames.spacingRight, this.spacingRight - spacing,
      ) + this.spacing

      this.spacingBottom = util.getNumber(
        this.style, StyleNames.spacingBottom, this.spacingBottom - spacing,
      ) + this.spacing

      this.spacingLeft = util.getNumber(
        this.style, StyleNames.spacingLeft, this.spacingLeft - spacing,
      ) + this.spacing

      this.horizontal = util.getValue(this.style, StyleNames.horizontal, this.horizontal)
      this.background = util.getValue(this.style, StyleNames.labelBackgroundColor, this.background)
      this.border = util.getValue(this.style, StyleNames.labelBorderColor, this.border)
      this.textDirection = util.getValue(
        this.style, StyleNames.textDirection, constants.DEFAULT_TEXT_DIRECTION,
      ) as TextDirection

      this.opacity = util.getNumber(this.style, StyleNames.textOpacity, 100)

      this.updateMargin()
    }

    delete this.flipV
    delete this.flipH
  }

  /**
   * Used to determine the automatic text direction.
   */
  getAutoDirection(): TextDirection {
    // Looks for strong (directional) characters
    // tslint:disable-next-line
    const tmp = /[A-Za-z\u05d0-\u065f\u066a-\u06ef\u06fa-\u07ff\ufb1d-\ufdff\ufe70-\ufefc]/.exec(this.value)

    // Returns the direction defined by the character
    return (tmp != null && tmp.length > 0 && tmp[0] > 'z')
      ? constants.TEXT_DIRECTION_RTL as TextDirection
      : constants.TEXT_DIRECTION_LTR as TextDirection
  }

  updateBoundingBox() {
    this.boundingBox = this.bounds.clone()

    let elem = this.elem
    const rot = this.getTextRotation()

    const h = (this.style != null)
      ? util.getValue(this.style, StyleNames.labelPosition, constants.ALIGN_CENTER) : null

    const v = (this.style != null)
      ? util.getValue(this.style, StyleNames.verticalLabelPosition, constants.ALIGN_MIDDLE) : null

    if (
      !this.ignoreStringSize &&
      elem != null &&
      this.overflow !== 'fill' &&
      (
        !this.clipped ||
        !this.ignoreClippedStringSize ||
        h !== constants.ALIGN_CENTER ||
        v !== constants.ALIGN_MIDDLE
      )
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
            const b = (elem as HTMLElement).getBoundingClientRect()

            // Workaround for bounding box of empty string
            if (typeof this.value === 'string' && this.value === '') {
              this.boundingBox = null
            } else if (b.width === 0 && b.height === 0) {
              this.boundingBox = null
            } else {
              this.boundingBox = new Rectangle(b.left, b.top, b.width, b.height)
            }
            return
          } catch (e) { }
        }
      } else {
        // Use cached offset size
        if (this.offsetWidth != null && this.offsetHeight != null) {
          ow = this.offsetWidth * this.scale
          oh = this.offsetHeight * this.scale
        } else {
          const td = (this.state != null) ? this.state.view.textDiv : null
          // Cannot get node size while container hidden so a
          // shared temporary DIV is used for text measuring
          if (td != null) {
            this.updateFont(td)
            this.updateSize(td, false)
            this.updateInnerHtml(td)

            elem = td
          }

          let sizeDiv = elem as HTMLDivElement
          if (
            sizeDiv.firstChild != null &&
            util.getNodeName(sizeDiv.firstChild as HTMLElement) === 'div'
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
        this.boundingBox = new Rectangle(
          this.bounds.x,
          this.bounds.y,
          ow,
          oh,
        )
      }
    }

    if (this.boundingBox != null) {
      if (rot !== 0) {
        // Accounts for pre-rotated x and y
        const bbox = util.getBoundingBox(
          new Rectangle(
            this.margin.x * this.boundingBox.width,
            this.margin.y * this.boundingBox.height,
            this.boundingBox.width,
            this.boundingBox.height,
          ),
          rot,
          new Point(0, 0),
        )

        this.unrotatedBoundingBox = this.boundingBox.clone()
        this.unrotatedBoundingBox.x += this.margin.x * this.unrotatedBoundingBox.width
        this.unrotatedBoundingBox.y += this.margin.y * this.unrotatedBoundingBox.height

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
    return (this.state != null && this.state.shape != null)
      ? this.state.shape.getTextRotation()
      : 0
  }

  isPaintBoundsInverted() {
    return (
      !this.horizontal &&
      this.state != null &&
      this.state.cell.isNode()
    )
  }

  configureCanvas(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    super.configureCanvas(c, x, y, w, h)

    c.setFontColor(this.color)
    c.setFontBackgroundColor(this.background!)
    c.setFontBorderColor(this.border!)
    c.setFontFamily(this.family)
    c.setFontSize(this.size)
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
    this.updateSize(
      this.elem as HTMLElement,
      (this.state == null || this.state.view.textDiv == null),
    )

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
      util.setPrefixedStyle(
        style,
        'transformOrigin',
        `${-dx * 100}% ${-dy * 100}%`,
      )

      util.setPrefixedStyle(
        style,
        'transform',
        `translate(${dx * 100}%, ${dy * 100}%)` +
        `scale(${this.scale}) ` +
        `rotate(${theta}deg)`,
      )
    } else {
      util.setPrefixedStyle(style, 'transformOrigin', '0% 0%')
      util.setPrefixedStyle(
        style,
        'transform',
        `scale(${this.scale}) ` +
        `translate(${dx * 100}%, ${dy * 100}%)`,
      )
    }

    const left = Math.round(
      this.bounds.x -
      Math.ceil(dx * ((this.overflow !== 'fill' && this.overflow !== 'width') ? 3 : 1)),
    )

    style.left = `${left}px`
    style.top = `${Math.round(this.bounds.y - dy * (this.overflow !== 'fill' ? 3 : 1))}px`

    if (this.opacity < 100) {
      style.opacity = `${this.opacity / 100}`
    } else {
      style.opacity = ''
    }
  }

  updateInnerHtml(elt: HTMLElement) {
    if (util.isHTMLNode(this.value)) {
      elt.innerHTML = (this.value as any as HTMLElement).outerHTML
    } else {
      let val = this.value
      if (this.dialect !== constants.DIALECT_STRICTHTML) {
        val = util.escape(val)
      }

      // Handles trailing newlines to make sure they are visible in rendering output
      val = util.replaceTrailingNewlines(val, '<div>&nbsp;</div>')
      val = this.replaceLinefeeds ? val.replace(/\n/g, '<br/>') : val
      val = `<div style="display:inline-block;_display:inline;">${val}</div>`

      elt.innerHTML = val
    }
  }

  updateValue() {
    if (util.isHTMLNode(this.value)) {
      this.elem!.innerHTML = ''
      this.elem!.appendChild(this.value as any as HTMLElement)
    } else {
      let val = this.value

      if (this.dialect !== constants.DIALECT_STRICTHTML) {
        val = util.escape(val)
      }

      // Handles trailing newlines to make sure they are visible in rendering output
      val = util.replaceTrailingNewlines(val, '<div><br></div>')
      val = (this.replaceLinefeeds) ? val.replace(/\n/g, '<br/>') : val

      const bg = (this.background != null && this.background !== constants.NONE)
        ? this.background
        : null

      const bd = (this.border != null && this.border !== constants.NONE)
        ? this.border
        : null

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

        // Wrapper DIV for background, zoom needed for inline in quirks
        // and to measure wrapped font sizes in all browsers
        // FIXME: Background size in quirks mode for wrapped text
        const lh = constants.ABSOLUTE_LINE_HEIGHT
          ? `${this.size * constants.LINE_HEIGHT}px`
          : constants.LINE_HEIGHT

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
        if (
          dir === constants.TEXT_DIRECTION_AUTO &&
          this.dialect !== constants.DIALECT_STRICTHTML
        ) {
          dir = this.getAutoDirection()
        }

        if (
          dir === constants.TEXT_DIRECTION_LTR ||
          dir === constants.TEXT_DIRECTION_RTL
        ) {
          divs[divs.length - 1].setAttribute('dir', dir)
        } else {
          divs[divs.length - 1].removeAttribute('dir')
        }
      }
    }
  }

  updateFont(elem: HTMLElement) {
    const style = elem.style

    style.lineHeight = constants.ABSOLUTE_LINE_HEIGHT
      ? `${this.size * constants.LINE_HEIGHT}px`
      : `${constants.LINE_HEIGHT}`

    style.fontSize = `${this.size}px`
    style.fontFamily = this.family
    style.verticalAlign = 'top'
    style.color = this.color

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

    if (this.align === Align.center) {
      style.textAlign = 'center'
    } else if (this.align === Align.right) {
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

      if (!detector.IS_QUIRKS) {
        style.maxHeight = `${h}px`
        style.maxWidth = `${w}px`
      } else {
        style.width = `${w}px`
      }
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
      style.wordWrap = constants.WORD_WRAP
      style.whiteSpace = 'normal'
      style.width = `${w}px`

      if (
        enableWrap &&
        this.overflow !== 'fill' &&
        this.overflow !== 'width'
      ) {
        let sizeDiv = node

        if (
          sizeDiv.firstChild != null &&
          util.getNodeName(sizeDiv.firstChild as HTMLElement) === 'div'
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
    this.margin = util.getAlignmentAsPoint(this.align, this.valign)
  }

  getSpacing() {
    let dx = 0
    let dy = 0

    if (this.align === Align.center) {
      dx = (this.spacingLeft - this.spacingRight) / 2
    } else if (this.align === Align.right) {
      dx = -this.spacingRight - this.baseSpacingRight
    } else {
      dx = this.spacingLeft + this.baseSpacingLeft
    }

    if (this.valign === Align.middle) {
      dy = (this.spacingTop - this.spacingBottom) / 2
    } else if (this.valign === Align.bottom) {
      dy = -this.spacingBottom - this.baseSpacingBottom
    } else {
      dy = this.spacingTop + this.baseSpacingTop
    }

    return new Point(dx, dy)
  }
}

export namespace Text {
  export interface Options {
    align?: Align,
    valign?: Align,
    color?: string,
    family?: string,
    size?: number,
    fontStyle?: number,
    spacing?: number,
    spacingTop?: number,
    spacingRight?: number,
    spacingBottom?: number,
    spacingLeft?: number,
    horizontal?: boolean,
    background?: string,
    border?: string,
    wrap?: boolean,
    clipped?: boolean,
    overflow?: string,
    labelPadding?: number,
    textDirection: TextDirection
  }
}
