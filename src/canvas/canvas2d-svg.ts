/* tslint:disable:no-parameter-reassignment */

import * as util from '../util'
import { detector, constants } from '../common'
import { Canvas2D } from './canvas2d'
import { Rectangle, FontStyle } from '../struct'
import { Align, VAlign, Direction } from '../types'

const NS_SVG = 'http://www.w3.org/2000/svg'
const NS_XHTML = 'http://www.w3.org/1999/xhtml'
const NS_XLINK = 'http://www.w3.org/1999/xlink'

export class SvgCanvas2D extends Canvas2D {
  /**
	 * The container for the SVG content.
	 */
  root: SVGElement

  originalRoot?: SVGElement

  /**
   * The current DOM node.
   */
  elem?: SVGElement

  /**
	 * Reference to the defs section of the SVG document.
	 */
  defs: SVGDefsElement

  /**
	 * Local cache of gradients for quick lookups.
	 */
  gradients: SvgCanvas2D.Gradients

  /**
   * Specifies if create and append stylesheet to `defs`
   */
  styleEnabled: boolean

  /**
   * Specifies if use of foreignObject for HTML markup is allowed.
   */
  foEnabled: boolean = true

  /**
   * Specifies the fallback text for unsupported foreignObjects in
   * exported documents. Default is `[Object]`. If this is set to
   * null then no fallback text is added to the exported document.
   */
  foAltText: string | null = '[Object]'

  /**
   * Specifies if plain text output should match the vertical HTML alignment.
   */
  matchHtmlAlignment: boolean = true

  /**
   * Offset to be used for foreignObjects.
   */
  foOffset: number = 0

  /**
   * Offset to be used for text elements.
   */
  textOffset: number = 0

  /**
   * Offset to be used for image elements.
   */
  imageOffset: number = 0

  /**
   * Specifies if a transparent rectangle should be added on top of images
   * to absorb all pointer events.
   *
   * This is only needed in Firefox to disable control-clicks on images.
   */
  blockImagePointerEvents = false

  /**
   * Adds transparent paths for strokes.
   */
  strokeTolerance: number = 0

  /**
   * Minimum stroke width for output.
   */
  minStrokeWidth: number = 1

  /**
   * Local counter for references in SVG export.
   */
  refCount: number = 0

  /**
   * Padding to be added for text that is not wrapped to account for
   * differences in font metrics on different platforms in pixels.
   */
  fontMetricsPadding = 10

  /**
   * Value for active pointer events.
   * Default `'all'`
   */
  pointerEventsValue: string = 'all'

  constructor(root: SVGElement, styleEnabled: boolean = false) {
    super()

    this.root = root
    this.gradients = {}
    this.styleEnabled = styleEnabled

    let svg = null

    // root not in current document
    if (root.ownerDocument !== document) {
      let node = root
      while (node != null && node.nodeName.toLowerCase() !== 'svg') {
        node = node.parentNode as SVGElement
      }
      svg = node
    }

    if (svg != null) {
      // try to get defs in current svg
      const defs = svg.getElementsByTagName('defs')
      if (defs.length > 0) {
        this.defs = defs[0]
      }

      // create defs
      if (this.defs == null) {
        this.defs = this.createElement('defs') as SVGDefsElement
        util.prepend(svg, this.defs)
      }

      // add stylesheet
      if (this.styleEnabled) {
        this.defs.appendChild(this.createStylesheet())
      }
    }
  }

  reset() {
    super.reset()
    this.gradients = {}
  }

  format(value: any) {
    return parseFloat(parseFloat(value).toFixed(2))
  }

  private createStylesheet() {
    const style = this.createElement('style')
    style.setAttribute('type', 'text/css')
    util.fillElementWithText(
      style,
      'svg {' +
      `font-family: ${constants.DEFAULT_FONTFAMILY}; ` +
      `font-size: ${constants.DEFAULT_FONTSIZE}; ` +
      'fill: none; ' +
      'stroke-miterlimit: 10;}',
    )

    return style
  }

  private createElement<T extends SVGElement>(
    tagName: string,
    namespace?: string,
  ) {
    const doc = this.root.ownerDocument!
    if (doc.createElementNS != null) {
      return doc.createElementNS(namespace || NS_SVG, tagName) as T
    }

    const elem = doc.createElement(tagName)
    if (namespace != null) {
      elem.setAttribute('xmlns', namespace)
    }

    return elem as any as T
  }

  private createAlternateContent(
    fo: SVGForeignObjectElement,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    if (this.foAltText != null) {
      const s = this.state
      const alt = this.createElement('text')
      util.setAttributes(alt, {
        x: Math.round(w / 2),
        y: Math.round((h + s.fontSize) / 2),
        fill: s.fontColor || 'black',
        'text-anchor': 'middle',
        'font-size': `${s.fontSize}px`,
        'font-family': s.fontFamily,
      })

      if (FontStyle.isBold(s.fontStyle)) {
        alt.setAttribute('font-weight', 'bold')
      }

      if (FontStyle.isItalic(s.fontStyle)) {
        alt.setAttribute('font-style', 'italic')
      }

      if (FontStyle.isUnderlined(s.fontStyle)) {
        alt.setAttribute('text-decoration', 'underline')
      }

      util.fillElementWithText(alt, this.foAltText)

      return alt
    }

    return null
  }

  // #region gradient

  private createGradientId(
    startColor: string,
    stopColor: string,
    alpha1: number,
    alpha2: number,
    direction: Direction,
  ) {
    let a = startColor
    let b = stopColor

    if (a.charAt(0) === '#') {
      a = a.substring(1)
    }

    if (b.charAt(0) === '#') {
      b = b.substring(1)
    }

    a = `${a.toLowerCase()}@${alpha1}`
    b = `${b.toLowerCase()}@${alpha2}`

    // Wrong gradient directions possible?
    let dir = null

    if (direction == null || direction === 'south') {
      dir = 's'
    } else if (direction === 'east') {
      dir = 'e'
    } else {
      const tmp = startColor
      a = stopColor
      b = tmp

      if (direction === 'north') {
        dir = 's'
      } else if (direction === 'west') {
        dir = 'e'
      }
    }

    return `gradient-${a}-${b}-${dir}`
  }

  private createSvgGradient(
    startColor: string,
    stopColor: string,
    alpha1: number,
    alpha2: number,
    direction: Direction,
  ): SVGGradientElement {
    const gradient = this.createElement('linearGradient') as SVGGradientElement
    gradient.setAttribute('x1', '0%')
    gradient.setAttribute('y1', '0%')
    gradient.setAttribute('x2', '0%')
    gradient.setAttribute('y2', '0%')

    if (direction == null || direction === 'south') {
      gradient.setAttribute('y2', '100%')
    } else if (direction === 'east') {
      gradient.setAttribute('x2', '100%')
    } else if (direction === 'north') {
      gradient.setAttribute('y1', '100%')
    } else if (direction === 'west') {
      gradient.setAttribute('x1', '100%')
    }

    const start = this.createElement('stop')
    const startStyle = (alpha1 < 1) ? ` stop-opacity: ${alpha1};` : ''
    start.setAttribute('offset', '0%')
    start.setAttribute('style', `stop-color: ${startColor};${startStyle}`)
    gradient.appendChild(start)

    const stop = this.createElement('stop')
    const stopStyle = (alpha2 < 1) ? ` stop-opacity: ${alpha2};` : ''
    stop.setAttribute('offset', '100%')
    stop.setAttribute('style', `stop-color: ${stopColor};${stopStyle}`)
    gradient.appendChild(stop)

    return gradient
  }

  getSvgGradientId(
    startColor: string,
    stopColor: string,
    alpha1: number,
    alpha2: number,
    direction: Direction,
  ): string {
    const id = this.createGradientId(
      startColor, stopColor, alpha1, alpha2, direction,
    )

    let gradient = this.gradients[id]
    if (gradient == null) {
      const svg = this.root.ownerSVGElement

      let counter = 0
      let tmpId = `${id}-${counter}`

      if (svg != null) {
        const doc = svg.ownerDocument!
        gradient = doc.getElementById(tmpId) as any as SVGGradientElement
        while (gradient != null && gradient.ownerSVGElement !== svg) {
          counter += 1
          tmpId = `${id}-${counter}`
          gradient = doc.getElementById(tmpId) as any as SVGGradientElement
        }
      } else {
        this.refCount += 1
        tmpId = `id${this.refCount}` // Uses shorter IDs for export
      }

      if (gradient == null) {
        gradient = this.createSvgGradient(
          startColor, stopColor, alpha1, alpha2, direction,
        )
        gradient.setAttribute('id', tmpId)

        if (this.defs != null) {
          this.defs.appendChild(gradient)
        } else {
          svg!.appendChild(gradient)
        }
      }

      this.gradients[id] = gradient
    }

    return gradient.getAttribute('id')!
  }

  // #endregion

  // #region addNode

  stroke() {
    this.addNode(false, true)
  }

  fill() {
    this.addNode(true, false)
  }

  fillAndStroke() {
    this.addNode(true, true)
  }

  private addNode(filled: boolean, stroked: boolean) {
    if (this.elem == null) {
      return
    }

    const s = this.state
    const elem = this.elem
    const nodeName = util.getNodeName(elem)

    if (nodeName === 'path') {
      if (this.path != null && this.path.length > 0) {
        elem.setAttribute('d', this.path.join(' '))
      } else {
        return
      }
    }

    // fill
    if (filled && s.fillColor != null) {
      this.updateFill()
    } else if (!this.styleEnabled) {
      // see: https://bugzilla.mozilla.org/show_bug.cgi?id=814952
      if (nodeName === 'ellipse' && detector.IS_FIREFOX) {
        elem.setAttribute('fill', 'transparent')
      } else {
        elem.setAttribute('fill', 'none')
      }

      // Sets the actual filled state for stroke tolerance
      filled = false
    }

    // stroke
    if (stroked && s.strokeColor != null) {
      this.updateStroke()
    } else if (!this.styleEnabled) {
      // if `styleEnabled` is `true`, we set elem style by `setAttribute`
      // may overwrite the style defined in stylesheet.
      elem.setAttribute('stroke', 'none')
    }

    if (s.transform != null && s.transform.length > 0) {
      elem.setAttribute('transform', s.transform)
    }

    if (s.shadow && s.shadowColor) {
      this.root.appendChild(this.createShadow(elem))
    }

    // tolerance
    if (this.strokeTolerance > 0 && !filled) {
      this.root.appendChild(this.createTolerance(elem))
    }

    // mouse event
    if (this.pointerEvents) {
      elem.setAttribute('pointer-events', this.pointerEventsValue)
    } else if (!this.pointerEvents && this.originalRoot == null) {
      // Enables clicks for nodes inside a link element
      elem.setAttribute('pointer-events', 'none')
    }

    // 不要将那些不可见并没有绑定事件的元素添加到文档流中
    if (
      (
        nodeName !== 'rect' &&
        nodeName !== 'path' &&
        nodeName !== 'ellipse'
      ) ||
      (
        elem.getAttribute('fill') !== 'none' &&
        elem.getAttribute('fill') !== 'transparent'
      ) ||
      elem.getAttribute('stroke') !== 'none' ||
      elem.getAttribute('pointer-events') !== 'none'
    ) {
      this.root.appendChild(elem)
    }

    this.elem = null as any
  }

  private updateFill() {
    const s = this.state
    const elem = this.elem!

    if (s.alpha < 1 || s.fillAlpha < 1) {
      elem.setAttribute('fill-opacity', `${s.alpha * s.fillAlpha}`)
    }

    if (s.fillColor != null) {
      if (s.gradientColor != null) {
        const id = this.getSvgGradientId(
          s.fillColor,
          s.gradientColor,
          s.gradientFillAlpha,
          s.gradientAlpha,
          s.gradientDirection,
        )
        util.setAttributeWithAnchor(elem, 'fill', id)
      } else {
        elem.setAttribute('fill', s.fillColor)
      }
    }
  }

  private getStrokeWidth() {
    return Math.max(
      this.minStrokeWidth,
      Math.max(0.01, this.format(this.state.strokeWidth * this.state.scale)),
    )
  }

  private updateStroke() {
    const s = this.state
    const elem = this.elem!

    elem.setAttribute('stroke', s.strokeColor!)

    if (s.alpha < 1 || s.strokeAlpha < 1) {
      elem.setAttribute('stroke-opacity', `${s.alpha * s.strokeAlpha}`)
    }

    const sw = this.getStrokeWidth()
    if (sw !== 1) {
      elem.setAttribute('stroke-width', `${sw}`)
    }

    if (util.getNodeName(elem) === 'path') {
      this.updatePathStrokeAttributes()
    }

    if (s.dashed) {
      elem.setAttribute('stroke-dasharray', this.createDashPattern(
        (s.fixDash ? 1 : s.strokeWidth) * s.scale),
      )
    }
  }

  private updatePathStrokeAttributes() {
    const s = this.state
    const elem = this.elem!

    if (s.lineJoin != null && s.lineJoin !== 'miter') {
      elem.setAttribute('stroke-linejoin', s.lineJoin)
    }

    if (s.lineCap != null && s.lineCap !== 'butt') {
      elem.setAttribute('stroke-linecap', s.lineCap)
    }

    // Miterlimit 10 is default in our document
    if (s.miterLimit != null && (!this.styleEnabled || s.miterLimit !== 10)) {
      elem.setAttribute('stroke-miterlimit', `${s.miterLimit}`)
    }
  }

  private createDashPattern(scale: number) {
    const pat = []

    if (typeof this.state.dashPattern === 'string') {
      const dash = this.state.dashPattern.split(' ')
      if (dash.length > 0) {
        for (let i = 0; i < dash.length; i += 1) {
          pat[i] = Number(dash[i]) * scale
        }
      }
    }

    return pat.join(' ')
  }

  private createShadow(elem: SVGElement) {
    const s = this.state
    const shadow = elem.cloneNode(true) as SVGElement

    // Firefox uses transparent for no fill in ellipses
    if (
      shadow.getAttribute('fill') !== 'none' &&
      (!detector.IS_FIREFOX || shadow.getAttribute('fill') !== 'transparent')
    ) {
      shadow.setAttribute('fill', s.shadowColor!)
    }

    if (shadow.getAttribute('stroke') !== 'none') {
      shadow.setAttribute('stroke', s.shadowColor!)
    }

    const tx = this.format(s.shadowDx * s.scale)
    const ty = this.format(s.shadowDy * s.scale)

    shadow.setAttribute(
      'transform',
      `translate(${tx},${ty})${s.transform || ''}`,
    )

    shadow.setAttribute('opacity', `${s.shadowAlpha}`)

    return shadow
  }

  private createTolerance(elem: SVGElement) {
    const tol = elem.cloneNode(true) as SVGElement
    const sw = (
      parseFloat(tol.getAttribute('stroke-width') || '1') +
      this.strokeTolerance
    )

    tol.setAttribute('stroke-width', `${sw}`)
    tol.setAttribute('pointer-events', 'stroke')
    tol.setAttribute('fill', 'none')
    tol.setAttribute('visibility', 'hidden')
    tol.removeAttribute('stroke-dasharray')

    // Workaround for Opera ignoring the visiblity attribute above while
    // other browsers need a stroke color to perform the hit-detection but
    // do not ignore the visibility attribute. Side-effect is that Opera's
    // hit detection for horizontal/vertical edges seems to ignore the tol.
    tol.setAttribute('stroke', (detector.IS_OT) ? 'none' : 'white')

    return tol
  }

  // #endregion

  /**
   * Sets the rotation of the canvas.
   *
   * Note that rotation cannot be concatenated.
   */
  rotate(
    deg: number,
    flipH: boolean,
    flipV: boolean,
    cx: number,
    cy: number,
  ) {
    if (deg !== 0 || flipH || flipV) {
      const s = this.state

      cx += s.tx
      cy += s.ty
      cx *= s.scale
      cy *= s.scale

      s.transform = s.transform || ''

      if (flipH && flipV) {
        deg += 180
      } else if (flipH !== flipV) {
        const tx = flipH ? cx : 0
        const sx = flipH ? -1 : 1
        const ty = flipV ? cy : 0
        const sy = flipV ? -1 : 1

        s.transform += (
          `translate(${this.format(tx)},${this.format(ty)})` +
          `scale(${this.format(sx)},${this.format(sy)})` +
          `translate(${this.format(-tx)},${this.format(-ty)})`
        )
      }

      if (flipH ? !flipV : flipV) {
        deg *= -1
      }

      if (deg !== 0) {
        s.transform += `rotate(${this.format(deg)},${this.format(cx)},${this.format(cy)})`
      }

      s.rotation = s.rotation + deg
      s.rotationCx = cx
      s.rotationCy = cy
    }
  }

  begin() {
    super.begin()
    this.elem = this.createElement('path')
  }

  rect(x: number, y: number, w: number, h: number) {
    const s = this.state
    this.elem = this.createElement('rect')
    util.setAttributes(this.elem, {
      x: this.format((x + s.tx) * s.scale),
      y: this.format((y + s.ty) * s.scale),
      width: this.format(w * s.scale),
      height: this.format(h * s.scale),
    })
  }

  roundRect(
    x: number, y: number,
    w: number, h: number,
    dx: number, dy: number,
  ) {
    this.rect(x, y, w, h)

    if (dx > 0) {
      this.elem!.setAttribute('rx', `${this.format(dx * this.state.scale)}`)
    }

    if (dy > 0) {
      this.elem!.setAttribute('ry', `${this.format(dy * this.state.scale)}`)
    }
  }

  ellipse(x: number, y: number, w: number, h: number) {
    const s = this.state
    this.elem = this.createElement('ellipse')
    util.setAttributes(this.elem, {
      cx: this.format((x + w / 2 + s.tx) * s.scale),
      cy: this.format((y + h / 2 + s.ty) * s.scale),
      rx: w / 2 * s.scale,
      ry: h / 2 * s.scale,
    })
  }

  link(href?: string | null) {
    if (href == null) {
      this.root = this.originalRoot!
    } else {
      this.originalRoot = this.root
      const a = this.createElement('a')
      if (
        a.setAttributeNS == null ||
        (
          this.root.ownerDocument !== document &&
          (document as any).documentMode == null
        )
      ) {
        a.setAttribute('xlink:href', href)
      } else {
        a.setAttributeNS(NS_XLINK, 'xlink:href', href)
      }

      this.root.appendChild(a)
      this.root = a
    }
  }

  image(
    x: number,
    y: number,
    w: number,
    h: number,
    src: string,
    aspect: boolean = true,
    flipH: boolean = false,
    flipV: boolean = false,
  ) {
    const s = this.state

    src = this.urlConverter.toAbsolute(src)
    x += s.tx
    y += s.ty

    const img = this.createElement('image')
    util.setAttributes(img, {
      x: this.format(x * s.scale) + this.imageOffset,
      y: this.format(y * s.scale) + this.imageOffset,
      width: this.format(w * s.scale),
      height: this.format(h * s.scale),
    })

    if (img.setAttributeNS == null) {
      img.setAttribute('xlink:href', src)
    } else {
      img.setAttributeNS(NS_XLINK, 'xlink:href', src)
    }

    if (!aspect) {
      img.setAttribute('preserveAspectRatio', 'none')
    }

    if (s.alpha < 1 || s.fillAlpha < 1) {
      img.setAttribute('opacity', `${s.alpha * s.fillAlpha}`)
    }

    let transform = this.state.transform || ''
    if (flipH || flipV) {
      let sx = 1
      let sy = 1
      let tx = 0
      let ty = 0

      if (flipH) {
        sx = -1
        tx = -w - 2 * x
      }

      if (flipV) {
        sy = -1
        ty = -h - 2 * y
      }

      // adds image tansformation to existing transform
      transform += `scale(${sx},${sy})`
      transform += `translate(${tx * s.scale},${ty * s.scale})`
    }

    if (transform.length > 0) {
      img.setAttribute('transform', transform)
    }

    if (!this.pointerEvents) {
      img.setAttribute('pointer-events', 'none')
    }

    this.root.appendChild(img)

    // Disables control-clicks on images in Firefox to open in new tab
    // by putting a rect in the foreground that absorbs all events and
    // disabling all pointer-events on the original image tag.
    if (this.blockImagePointerEvents) {
      img.setAttribute('style', 'pointer-events: none;')
      const rect = this.createElement('rect')
      util.setAttributes(rect, {
        visibility: 'hidden',
        'pointer-events': 'fill',
        x: this.format(x * s.scale),
        y: this.format(y * s.scale),
        width: this.format(w * s.scale),
        height: this.format(h * s.scale),
      })
      this.root.appendChild(rect)
    }
  }

  // #region Draw text

  /**
   * Updates existing DOM nodes for text rendering.
   *
   * TODO: Merge common parts with text function below.
   */
  updateText(
    x: number,
    y: number,
    w: number,
    h: number,
    node: SVGElement,
    align: Align,
    valign: VAlign,
    wrap: boolean,
    overflow: string,
    clip: boolean = false,
    rotation: number = 0,
  ) {
    if (
      node != null &&
      node.firstChild != null &&
      node.firstChild.firstChild != null &&
      node.firstChild.firstChild.firstChild != null
    ) {
      /**
       * <g style="cursor: move;">
       *   <g transform="translate(1061,297)scale(0.5)">
       *     <foreignObject style="overflow:visible;" pointer-events="all" width="41" height="12">
       *       <div style="...">
       *         <div xmlns="http://www.w3.org/1999/xhtml" style="...">
       *           Hello
       *         </div>
       *       </div>
       *     </foreignObject>
       *   </g>
       * </g>
       */

      // Uses outer group for opacity and transforms to
      // fix rendering order in Chrome
      const group = node.firstChild! as SVGGElement
      const fo = group.firstChild! as HTMLElement
      const div = fo.firstChild as HTMLDivElement

      const s = this.state
      x += s.tx
      y += s.ty

      if (clip) {
        div.style.maxWidth = `${Math.round(w)}px`
        div.style.maxHeight = `${Math.round(h)}px`
      } else if (overflow === 'fill') {
        div.style.width = `${Math.round(w + 1)}px`
        div.style.height = `${Math.round(h + 1)}px`
      } else if (overflow === 'width') {
        div.style.width = `${Math.round(w + 1)}px`
        if (h > 0) {
          div.style.maxHeight = `${Math.round(h)}px`
        }
      }

      if (wrap && w > 0) {
        div.style.width = `${Math.round(w + 1)}px`
      }

      // Code that depends on the size which is computed after
      // the element was added to the DOM.
      let ow = 0
      let oh = 0

      // Padding avoids clipping on border and wrapping for
      // differing font metrics on platforms
      const padX = 0
      const padY = 2

      let sizeDiv: HTMLDivElement = div
      if (
        sizeDiv.firstChild != null &&
        util.getNodeName(sizeDiv.firstChild as HTMLElement) === 'div'
      ) {
        sizeDiv = sizeDiv.firstChild as HTMLDivElement
      }

      const tmp = ((group as any).__CachedOffsetWidth__ != null)
        ? (group as any).__CachedOffsetWidth__
        : sizeDiv.offsetWidth

      ow = tmp + padX

      // Recomputes the height of the element for wrapped width
      if (wrap && overflow !== 'fill') {
        if (clip) {
          ow = Math.min(ow, w)
        }

        div.style.width = `${Math.round(ow + 1)}px`
      }

      ow = ((group as any).__CachedFinalOffsetWidth__ != null)
        ? (group as any).__CachedFinalOffsetWidth__
        : sizeDiv.offsetWidth

      oh = ((group as any).__CachedFinalOffsetHeight__ != null)
        ? (group as any).__CachedFinalOffsetHeight__
        : sizeDiv.offsetHeight

      if (this.cacheOffsetSize) {
        (group as any).__CachedOffsetWidth__ = tmp;
        (group as any).__CachedFinalOffsetWidth__ = ow;
        (group as any).__CachedFinalOffsetHeight__ = oh
      }

      ow += padX
      oh -= padY

      if (clip) {
        oh = Math.min(oh, h)
        ow = Math.min(ow, w)
      }

      if (overflow === 'width') {
        h = oh
      } else if (overflow !== 'fill') {
        w = ow
        h = oh
      }

      let dx = 0
      let dy = 0

      if (align === 'center') {
        dx -= w / 2
      } else if (align === 'right') {
        dx -= w
      }

      x += dx

      if (valign === 'middle') {
        dy -= h / 2
      } else if (valign === 'bottom') {
        dy -= h
      }

      if (overflow !== 'fill' && detector.IS_FIREFOX && detector.IS_WINDOWS) {
        dy -= 2
      }

      y += dy

      let tr = (s.scale !== 1) ? `scale(${s.scale})` : ''

      if (s.rotation !== 0 && this.rotateHtml) {
        tr += `rotate(${s.rotation},${w / 2},${h / 2})`
        const pt = this.rotatePoint(
          (x + w / 2) * s.scale,
          (y + h / 2) * s.scale,
          s.rotation,
          s.rotationCx,
          s.rotationCy,
        )
        x = pt.x - w * s.scale / 2
        y = pt.y - h * s.scale / 2
      } else {
        x *= s.scale
        y *= s.scale
      }

      if (rotation !== 0) {
        tr += `rotate(${rotation},${-dx},${-dy})`
      }

      group.setAttribute(
        'transform',
        `translate(${Math.round(x)},${Math.round(y)}) ${tr}`,
      )

      fo.setAttribute('width', `${Math.round(Math.max(1, w))}`)
      fo.setAttribute('height', `${Math.round(Math.max(1, h))}`)
    }
  }

  /**
   * Specifies if text output should be enabled.
   *
   * Default is `true`.
   */
  textEnabled = true

  /**
   * Paints the given text. Possible values for format are empty string for
   * plain text and html for HTML markup. Note that HTML markup is only
   * supported if foreignObject is supported and `foEnabled` is true.
   */
  text(
    x: number,
    y: number,
    w: number,
    h: number,
    str: string,
    align: Align,
    valign: VAlign,
    wrap: boolean,
    format: '' | 'html',
    overflow: string,
    clip?: boolean,
    rotation: number = 0,
    dir: string | null = null,
  ) {
    if (this.textEnabled && str != null) {
      if (this.foEnabled && format === 'html') {
        this.drawHTMLText(
          x, y, w, h,
          str, align, valign, wrap, overflow, clip, rotation, dir,
        )
      } else {
        this.drawSVGText(
          x, y, w, h,
          str, align, valign, wrap, overflow, clip, rotation, dir,
        )
      }
    }
  }

  private drawHTMLText(
    x: number,
    y: number,
    w: number,
    h: number,
    str: string,
    align: Align,
    valign: VAlign,
    wrap: boolean,
    overflow: string,
    clip?: boolean,
    rotation: number = 0,
    dir: string | null = null,
  ) {
    const s = this.state
    x += s.tx
    y += s.ty

    let style = 'vertical-align: top;'

    if (clip) {
      style += ' overflow: hidden;'
      style += ` max-width: ${Math.round(w)}px;`
      style += ` max-height: ${Math.round(h)}px;`
    } else if (overflow === 'fill') {
      style += ' overflow: hidden;'
      style += ` width: ${Math.round(w + 1)}px;`
      style += ` height: ${Math.round(h + 1)}px;`
    } else if (overflow === 'width') {
      style += ` width: ${Math.round(w + 1)}px;`
      if (h > 0) {
        style += ' overflow: hidden;'
        style += ` max-height: ${Math.round(h)}px;`
      }
    }

    if (wrap && w > 0) {
      style += ' white-space: nowrap;'
      style += ` width: ${Math.round(w + 1)}px;`
      style += ` word-wrap: ${constants.WORD_WRAP};`
    } else {
      style += ' white-space: nowrap;'
    }

    // Uses outer group for opacity and transforms to
    // fix rendering order in Chrome
    const group = this.createElement('g')

    if (s.alpha < 1) {
      group.setAttribute('opacity', `${s.alpha}`)
    }

    const fo = this.createElement('foreignObject') as SVGForeignObjectElement
    fo.setAttribute('style', 'overflow: visible;')
    fo.setAttribute('pointer-events', 'all')

    const div = this.createTextDiv(
      str,
      align,
      valign,
      style,
      overflow,
      (wrap && w > 0) ? 'normal' : null,
    ) as HTMLDivElement

    // Ignores invalid XHTML labels
    if (div == null) {
      return
    }

    if (dir != null) {
      div.setAttribute('dir', dir)
    }

    group.appendChild(fo)
    this.root.appendChild(group)

    // Code that depends on the size which is computed after
    // the element was added to the DOM.
    let ow = 0
    let oh = 0

    // Padding avoids clipping on border and wrapping for differing font metrics on platforms
    let padX = 2
    let padY = 2

    // NOTE: IE is always export as it does not support foreign objects
    if (detector.IS_IE && ((document as any).documentMode === 9)) {
      // Handles non-standard namespace for getting size in IE
      const clone = document.createElement('div')

      clone.style.cssText = div.getAttribute('style')!
      clone.style.display = (detector.IS_QUIRKS) ? 'inline' : 'inline-block'
      clone.style.position = 'absolute'
      clone.style.visibility = 'hidden'

      // Inner DIV is needed for text measuring
      const div2 = document.createElement('div')
      div2.style.display = (detector.IS_QUIRKS) ? 'inline' : 'inline-block'
      div2.style.wordWrap = constants.WORD_WRAP
      div2.innerHTML = (util.isHtmlElem(str))
        ? (str as any as HTMLElement).outerHTML
        : str
      clone.appendChild(div2)

      document.body.appendChild(clone)

      // Workaround for different box models
      if (
        (document as any).documentMode !== 8 &&
        (document as any).documentMode !== 9 &&
        s.fontBorderColor != null
      ) {
        padX += 2
        padY += 2
      }

      if (wrap && w > 0) {
        let tmp = div2.offsetWidth

        // For export, if no wrapping occurs, we add a large padding to make
        // sure there is no wrapping even if the text metrics are different.
        // This adds support for text metrics on different operating systems.
        // Disables wrapping if text is not wrapped for given width
        if (
          !clip &&
          wrap &&
          w > 0 &&
          this.root.ownerDocument !== document &&
          overflow !== 'fill'
        ) {
          const ws = clone.style.whiteSpace
          div2.style.whiteSpace = 'nowrap'

          if (tmp < div2.offsetWidth) {
            clone.style.whiteSpace = ws
          }
        }

        if (clip) {
          tmp = Math.min(tmp, w)
        }

        clone.style.width = `${tmp}px`

        // Padding avoids clipping on border
        ow = div2.offsetWidth + padX
        oh = div2.offsetHeight + padY

        // Overrides the width of the DIV via XML DOM by using the
        // clone DOM style, getting the CSS text for that and
        // then setting that on the DIV via setAttribute
        clone.style.display = 'inline-block'
        clone.style.position = ''
        clone.style.visibility = ''
        clone.style.width = `${ow}px`

        div.setAttribute('style', clone.style.cssText)
      } else {
        // Padding avoids clipping on border
        ow = div2.offsetWidth + padX
        oh = div2.offsetHeight + padY
      }

      clone.parentNode!.removeChild(clone)
      fo.appendChild(div)
    } else {
      // Uses document for text measuring during export
      if (this.root.ownerDocument !== document) {
        div.style.visibility = 'hidden'
        document.body.appendChild(div)
      } else {
        fo.appendChild(div)
      }

      let sizeDiv = div

      if (
        sizeDiv.firstChild != null &&
        util.getNodeName(sizeDiv.firstChild as HTMLElement) === 'div'
      ) {
        sizeDiv = sizeDiv.firstChild as HTMLDivElement

        if (wrap && div.style.wordWrap === 'break-word') {
          sizeDiv.style.width = '100%'
        }
      }

      let tmp = sizeDiv.offsetWidth

      // Workaround for text measuring in hidden containers
      if (tmp === 0 && div.parentNode === fo) {
        div.style.visibility = 'hidden'
        document.body.appendChild(div)

        tmp = sizeDiv.offsetWidth
      }

      if (this.cacheOffsetSize) {
        (group as any).__CachedOffsetWidth__ = tmp
      }

      // Disables wrapping if text is not wrapped for given width
      if (
        !clip &&
        wrap &&
        w > 0 &&
        this.root.ownerDocument !== document &&
        overflow !== 'fill' &&
        overflow !== 'width'
      ) {
        const ws = div.style.whiteSpace
        div.style.whiteSpace = 'nowrap'

        if (tmp < sizeDiv.offsetWidth) {
          div.style.whiteSpace = ws
        }
      }

      ow = tmp + padX - 1

      // Recomputes the height of the element for wrapped width
      if (wrap && overflow !== 'fill' && overflow !== 'width') {
        if (clip) {
          ow = Math.min(ow, w)
        }

        div.style.width = `${ow}px`
      }

      ow = sizeDiv.offsetWidth
      oh = sizeDiv.offsetHeight

      if (this.cacheOffsetSize) {
        (group as any).__CachedFinalOffsetWidth__ = ow;
        (group as any).__CachedFinalOffsetHeight__ = oh
      }

      oh -= padY

      if (div.parentNode !== fo) {
        fo.appendChild(div)
        div.style.visibility = ''
      }
    }

    if (clip) {
      oh = Math.min(oh, h)
      ow = Math.min(ow, w)
    }

    if (overflow === 'width') {
      h = oh
    } else if (overflow !== 'fill') {
      w = ow
      h = oh
    }

    if (s.alpha < 1) {
      group.setAttribute('opacity', `${s.alpha}`)
    }

    let dx = 0
    let dy = 0

    if (align === 'center') {
      dx -= w / 2
    } else if (align === 'right') {
      dx -= w
    }

    x += dx

    if (valign === 'middle') {
      dy -= h / 2
    } else if (valign === 'bottom') {
      dy -= h
    }

    // Workaround for rendering offsets
    // TODO: Check if export needs these fixes, too
    // if (this.root.ownerDocument == document)
    if (overflow !== 'fill' && detector.IS_FIREFOX && detector.IS_WINDOWS) {
      dy -= 2
    }

    y += dy

    let tr = (s.scale !== 1) ? `scale(${s.scale})` : ''

    if (s.rotation !== 0 && this.rotateHtml) {
      tr += `rotate(${s.rotation},${w / 2},${h / 2})`
      const pt = this.rotatePoint(
        (x + w / 2) * s.scale,
        (y + h / 2) * s.scale,
        s.rotation,
        s.rotationCx,
        s.rotationCy,
      )
      x = pt.x - w * s.scale / 2
      y = pt.y - h * s.scale / 2
    } else {
      x *= s.scale
      y *= s.scale
    }

    if (rotation !== 0) {
      tr += `rotate(${rotation},${-dx},${-dy})`
    }

    group.setAttribute(
      'transform',
      `translate(${Math.round(x)},${Math.round(y)}) ${tr}`,
    )
    fo.setAttribute('width', `${Math.round(Math.max(1, w))}`)
    fo.setAttribute('height', `${Math.round(Math.max(1, h))}`)

    // Adds alternate content if foreignObject not supported in viewer
    if (this.root.ownerDocument !== document) {
      const alt = this.createAlternateContent(fo, x, y, w, h)
      if (alt != null) {
        fo.setAttribute('requiredFeatures', 'http://www.w3.org/TR/SVG11/feature#Extensibility')
        const sw = this.createElement('switch')
        sw.appendChild(fo)
        sw.appendChild(alt)
        group.appendChild(sw)
      }
    }
  }

  private drawSVGText(
    x: number,
    y: number,
    w: number,
    h: number,
    str: string,
    align: Align,
    valign: VAlign,
    wrap: boolean,
    overflow: string,
    clip?: boolean,
    rotation: number = 0,
    dir: string | null = null,
  ) {
    const s = this.state
    const size = s.fontSize
    const node = this.createElement('g')

    let tr = s.transform || ''

    this.updateFont(node)

    // Non-rotated text
    if (rotation !== 0) {
      tr += `rotate(${rotation},${this.format(x * s.scale)},${this.format(y * s.scale)})`
    }

    if (dir != null) {
      node.setAttribute('direction', dir)
    }

    if (clip && w > 0 && h > 0) {
      let cx = x
      let cy = y

      if (align === 'center') {
        cx -= w / 2
      } else if (align === 'right') {
        cx -= w
      }

      if (overflow !== 'fill') {
        if (valign === 'middle') {
          cy -= h / 2
        } else if (valign === 'bottom') {
          cy -= h
        }
      }

      // LATER: Remove spacing from clip rectangle
      const c = this.createClip(
        cx * s.scale - 2,
        cy * s.scale - 2,
        w * s.scale + 4,
        h * s.scale + 4,
      )

      if (this.defs != null) {
        this.defs.appendChild(c)
      } else {
        // Makes sure clip is removed with referencing node
        this.root.appendChild(c)
      }

      const id = c.getAttribute('id')!
      util.setAttributeWithAnchor(node, 'clip-path', id)
    }

    // Default is left
    const anchor = (align === 'right')
      ? 'end'
      : (align === 'center')
        ? 'middle'
        : 'start'

    if (anchor !== 'start') {
      node.setAttribute('text-anchor', anchor)
    }

    if (!this.styleEnabled || size !== constants.DEFAULT_FONTSIZE) {
      node.setAttribute('font-size', `${size * s.scale}px`)
    }

    if (tr.length > 0) {
      node.setAttribute('transform', tr)
    }

    if (s.alpha < 1) {
      node.setAttribute('opacity', `${s.alpha}`)
    }

    const lines = str.split('\n')
    const lineHeight = Math.round(size * constants.LINE_HEIGHT)
    const textHeight = size + (lines.length - 1) * lineHeight

    let cy = y + size - 1

    if (valign === 'middle') {
      if (overflow === 'fill') {
        cy -= h / 2
      } else {
        const dy = ((this.matchHtmlAlignment && clip && h > 0)
          ? Math.min(textHeight, h)
          : textHeight) / 2
        cy -= dy + 1
      }
    } else if (valign === 'bottom') {
      if (overflow === 'fill') {
        cy -= h
      } else {
        const dy = (this.matchHtmlAlignment && clip && h > 0)
          ? Math.min(textHeight, h)
          : textHeight
        cy -= dy + 2
      }
    }

    for (let i = 0; i < lines.length; i += 1) {
      // Workaround for bounding box of empty lines and spaces
      if (lines[i].length > 0 && lines[i].trim().length > 0) {
        const text = this.createElement('text')
        // LATER: Match horizontal HTML alignment
        util.setAttributes(text, {
          x: this.format(x * s.scale) + this.textOffset,
          y: this.format(cy * s.scale) + this.textOffset,
        })
        util.fillElementWithText(text, lines[i])
        node.appendChild(text)
      }

      cy += lineHeight
    }

    this.root.appendChild(node)

    this.addTextBackground(
      node, str,
      x, y, w, (overflow === 'fill') ? h : textHeight,
      align, valign, overflow,
    )
  }

  private createClip(x: number, y: number, w: number, h: number) {
    x = Math.round(x)
    y = Math.round(y)
    w = Math.round(w)
    h = Math.round(h)

    const id = `clip-${x}-${y}-${w}-${h}`
    let counter = 0
    let tmp = `${id}-${counter}`

    while (document.getElementById(tmp) != null) {
      counter += 1
      tmp = `${id}-${counter}`
    }

    const clip = this.createElement('clipPath')
    clip.setAttribute('id', tmp)

    const rect = this.createElement('rect')
    util.setAttributes(rect, { x, y, w, h })
    clip.appendChild(rect)
    return clip
  }

  private updateFont(node: SVGElement) {
    const s = this.state
    node.setAttribute('fill', s.fontColor!)

    if (!this.styleEnabled || s.fontFamily !== constants.DEFAULT_FONTFAMILY) {
      node.setAttribute('font-family', s.fontFamily)
    }

    if (FontStyle.isBold(s.fontStyle)) {
      node.setAttribute('font-weight', 'bold')
    }

    if (FontStyle.isItalic(s.fontStyle)) {
      node.setAttribute('font-style', 'italic')
    }

    if (FontStyle.isBold(s.fontStyle)) {
      node.setAttribute('text-decoration', 'underline')
    }
  }

  private addTextBackground(
    node: SVGElement,
    str: string,
    x: number,
    y: number,
    w: number,
    h: number,
    align: Align,
    valign: VAlign,
    overflow?: string,
  ) {
    const s = this.state

    if (s.fontBackgroundColor != null || s.fontBorderColor != null) {
      let bbox = null

      if (overflow === 'fill' || overflow === 'width') {
        if (align === 'center') {
          x -= w / 2
        } else if (align === 'right') {
          x -= w
        }

        if (valign === 'middle') {
          y -= h / 2
        } else if (valign === 'bottom') {
          y -= h
        }

        bbox = new Rectangle((x + 1) * s.scale, y * s.scale, (w - 2) * s.scale, (h + 2) * s.scale)
      } else if ((node as any).getBBox != null && this.root.ownerDocument === document) {
        try {
          const ie = detector.IS_IE
          bbox = (node as any).getBBox()
          bbox = new Rectangle(
            bbox.x, bbox.y + (ie ? 0 : 1),
            bbox.width, bbox.height + (ie ? 1 : 0),
          )
        } catch (e) { }
      } else {
        // Computes size if not in document or no getBBox available
        const div = document.createElement('div')

        // Wrapping and clipping can be ignored here
        div.style.lineHeight = constants.ABSOLUTE_LINE_HEIGHT
          ? `${s.fontSize * constants.LINE_HEIGHT}px`
          : `${constants.LINE_HEIGHT}`
        div.style.fontSize = `${s.fontSize}px`
        div.style.fontFamily = s.fontFamily
        div.style.whiteSpace = 'nowrap'
        div.style.position = 'absolute'
        div.style.visibility = 'hidden'
        div.style.display = (detector.IS_QUIRKS) ? 'inline' : 'inline-block'
        div.style.zoom = '1'

        if (FontStyle.isBold(s.fontStyle)) {
          div.style.fontWeight = 'bold'
        }

        if (FontStyle.isItalic(s.fontStyle)) {
          div.style.fontStyle = 'italic'
        }

        str = util.escape(str)
        div.innerHTML = str.replace(/\n/g, '<br/>')

        document.body.appendChild(div)
        const w = div.offsetWidth
        const h = div.offsetHeight
        div.parentNode!.removeChild(div)

        if (align === 'center') {
          x -= w / 2
        } else if (align === 'right') {
          x -= w
        }

        if (valign === 'middle') {
          y -= h / 2
        } else if (valign === 'bottom') {
          y -= h
        }

        bbox = new Rectangle(
          (x + 1) * s.scale,
          (y + 2) * s.scale,
          w * s.scale,
          (h + 1) * s.scale,
        )
      }

      if (bbox != null) {
        const n = this.createElement('rect')
        util.setAttributes(n, {
          fill: s.fontBackgroundColor || 'none',
          stroke: s.fontBorderColor || 'none',
          x: Math.floor(bbox.x - 1),
          y: Math.floor(bbox.y - 1),
          width: Math.ceil(bbox.width + 2),
          height: Math.ceil(bbox.height),
        })

        const sw = (s.fontBorderColor != null)
          ? Math.max(1, this.format(s.scale))
          : 0
        n.setAttribute('stroke-width', `${sw}`)

        // Workaround for crisp rendering - only required if not exporting
        if (this.root.ownerDocument === document && util.mod(sw, 2) === 1) {
          n.setAttribute('transform', 'translate(0.5, 0.5)')
        }

        node.insertBefore(n, node.firstChild)
      }
    }
  }

  /**
  * Specifies if use `DomParser` to parse HTML string to XHTML.
  */
  useDomParser: boolean

  /**
   * Converts the given HTML string to XHTML.
   */
  private convertHtml(raw: string) {
    if (this.useDomParser) {
      let html = raw
      const doc = new DOMParser().parseFromString(html, 'text/html')
      if (doc != null) {
        html = new XMLSerializer().serializeToString(doc.body)

        // Extracts body content from DOM
        if (html.substring(0, 5) === '<body') {
          html = html.substring(html.indexOf('>', 5) + 1)
        }

        if (html.substring(html.length - 7, html.length) === '</body>') {
          html = html.substring(0, html.length - 7)
        }
      }

      return html
    }

    if (
      document.implementation != null &&
      document.implementation.createDocument != null
    ) {
      const xd = document.implementation.createDocument(
        'http://www.w3.org/1999/xhtml', 'html', null,
      )
      const xb = xd.createElement('body')
      xd.documentElement.appendChild(xb)

      const div = document.createElement('div')
      div.innerHTML = raw
      let child = div.firstChild

      while (child != null) {
        const next = child.nextSibling
        xb.appendChild(xd.adoptNode(child))
        child = next
      }

      return xb.innerHTML
    }

    {
      const ta = document.createElement('textarea')

      // Handles special HTML entities < and > and double escaping
      // and converts unclosed br, hr and img tags to XHTML

      // TODO: Convert all unclosed tags
      ta.innerHTML = raw
        .replace(/&amp;/g, '&amp;amp;')
        .replace(/&#60;/g, '&amp;lt;')
        .replace(/&#62;/g, '&amp;gt;')
        .replace(/&lt;/g, '&amp;lt;')
        .replace(/&gt;/g, '&amp;gt;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

      return ta.value
        .replace(/&/g, '&amp;')
        .replace(/&amp;lt;/g, '&lt;')
        .replace(/&amp;gt;/g, '&gt;')
        .replace(/&amp;amp;/g, '&amp;')
        .replace(/<br>/g, '<br />')
        .replace(/<hr>/g, '<hr />')
        .replace(/(<img[^>]+)>/gm, '$1 />')
    }
  }

  /**
   * Correction factor for line height in HTML output.
   *
   * Default is 1.
   */
  lineHeightCorrection: number = 1

  private createTextDiv(
    str: string,
    align: Align,
    valign: VAlign,
    style: string,
    overflow: string,
    whiteSpace: string | null,
  ) {
    const s = this.state

    const lineHeight = constants.ABSOLUTE_LINE_HEIGHT
      ? (`${s.fontSize * constants.LINE_HEIGHT}px`)
      : (constants.LINE_HEIGHT * this.lineHeightCorrection)

    // Inline block for rendering HTML background over SVG in Safari
    let stl = (
      'display: inline-block; ' +
      `font-size: ${s.fontSize}px; ` +
      `font-family: ${s.fontFamily}; ` +
      `color: ${s.fontColor}; ` +
      `line-height: ${lineHeight};` +
      `${style ? ` ${style}` : ''}`
    )

    if (FontStyle.isBold(s.fontStyle)) {
      stl += ' font-weight: bold;'
    }

    if (FontStyle.isItalic(s.fontStyle)) {
      stl += ' font-style: italic;'
    }

    if (FontStyle.isUnderlined(s.fontStyle)) {
      stl += ' text-decoration: underline;'
    }

    if (align === 'center') {
      stl += ' text-align: center;'
    } else if (align === 'right') {
      stl += ' text-align: right;'
    } else {
      stl += ' text-align: left;'
    }

    let css = ''
    if (s.fontBackgroundColor != null) {
      css += ` background-color: ${util.escape(s.fontBackgroundColor)};`
    }

    if (s.fontBorderColor != null) {
      css += ` border: 1px solid ${util.escape(s.fontBorderColor)};`
    }

    let val = str

    if (!util.isHtmlElem(val)) {
      val = this.convertHtml(val)
      if (overflow !== 'fill' && overflow !== 'width') {
        // Workaround for no wrapping in HTML canvas for image
        // export if the inner HTML contains a DIV with width
        if (whiteSpace != null) {
          css += ` white-space: ${whiteSpace};`
        }

        // inner div always needed to measure wrapped text
        // tslint:disable-next-line
        val = `<div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; text-align: inherit; text-decoration: inherit; ${css}">${val}</div>`
      } else {
        stl += css
      }
    }

    // Uses DOM API where available. This cannot be used in IE to avoid
    // an opening and two (!) closing TBODY tags being added to tables.
    if (!detector.IS_IE && document.createElementNS) {
      const div = document.createElementNS(NS_XHTML, 'div')
      div.setAttribute('style', stl)

      if (util.isHtmlElem(val)) {
        const n = val as any as HTMLElement
        if (this.root.ownerDocument !== document) {
          div.appendChild(n.cloneNode(true)) // creates a copy for export
        } else {
          div.appendChild(n)
        }
      } else {
        div.innerHTML = val
      }

      return div
    }

    // Serializes for export
    if (util.isHtmlElem(val) && this.root.ownerDocument !== document) {
      val = (val as any as HTMLElement).outerHTML
    }

    return util.parseXml(
      `<div xmlns="http://www.w3.org/1999/xhtml" style="${stl}">${val}</div>`,
    ).documentElement
  }

  /**
   * Specifies if offsetWidth and offsetHeight should be cached.
   *
   * Default is true.
   *
   * This is used to speed up repaint of text in `updateText`.
   */
  cacheOffsetSize = true

  /**
   * Invalidates the cached offset size for the given node.
   */
  invalidateCachedOffsetSize(node: SVGElement) {
    delete (node.firstChild as any).__CachedOffsetWidth__
    delete (node.firstChild as any).__CachedFinalOffsetWidth__
    delete (node.firstChild as any).__CachedFinalOffsetHeight__
  }

  // #endregion
}

export namespace SvgCanvas2D {
  export type Gradients = { [key: string]: SVGGradientElement }
}
