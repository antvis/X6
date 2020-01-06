/* tslint:disable:no-parameter-reassignment */

import { DomUtil } from '../../dom'
import { StringExt } from '../../util'
import { Rectangle } from '../../geometry'
import { globals } from '../../option'
import { FontStyle } from '../../enum'
import { Align, VAlign } from '../../types'
import { SvgCanvas2DBase } from './base'
import { SvgCanvas2D } from './index'

export class SvgCanvas2DText extends SvgCanvas2DBase {
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
   * Specifies if text output should be enabled.
   *
   * Default is `true`.
   */
  textEnabled = true

  /**
   * Offset to be used for text elements.
   */
  textOffset: number = 0

  /**
   * Specifies if use `DomParser` to parse HTML string to XHTML.
   */
  useDomParser: boolean = true

  /**
   * Correction factor for line height in HTML output.
   *
   * Default is 1.
   */
  lineHeightCorrection: number = 1
  lineHeight: number = globals.defaultLineHeight
  absoluteLineHeight: boolean = globals.defaultAbsoluteLineHeight

  /**
   * Specifies if offsetWidth and offsetHeight should be cached.
   *
   * Default is true.
   *
   * This is used to speed up repaint of text in `updateText`.
   */
  cacheOffsetSize = true

  /**
   * Updates existing DOM nodes for text rendering.
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
    /**
     * <g style="cursor: move;">
     *   <g transform="translate(1061,297)scale(0.5)">
     *     <foreignObject ...>
     *       <div style="...">
     *         <div style="...">
     *           Hello
     *         </div>
     *       </div>
     *     </foreignObject>
     *   </g>
     * </g>
     */
    if (
      node != null &&
      node.firstChild != null &&
      node.firstChild.firstChild != null &&
      node.firstChild.firstChild.firstChild != null
    ) {
      // Uses outer group for opacity and transforms to
      // fix rendering order in Chrome
      const group = node.firstChild! as SVGGElement
      const fo = group.firstChild! as HTMLElement
      const div = fo.firstChild as HTMLDivElement

      const state = this.state
      x += state.tx
      y += state.ty

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
        DomUtil.getNodeName(sizeDiv.firstChild as HTMLElement) === 'div'
      ) {
        sizeDiv = sizeDiv.firstChild as HTMLDivElement
      }

      const tmp =
        (group as any).__CachedOffsetWidth__ != null
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

      ow =
        (group as any).__CachedFinalOffsetWidth__ != null
          ? (group as any).__CachedFinalOffsetWidth__
          : sizeDiv.offsetWidth

      oh =
        (group as any).__CachedFinalOffsetHeight__ != null
          ? (group as any).__CachedFinalOffsetHeight__
          : sizeDiv.offsetHeight

      if (this.cacheOffsetSize) {
        const tmp = group as any
        tmp.__CachedOffsetWidth__ = tmp
        tmp.__CachedFinalOffsetWidth__ = ow
        tmp.__CachedFinalOffsetHeight__ = oh
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

      y += dy

      let tr = state.scale !== 1 ? `scale(${state.scale})` : ''

      if (state.rotation !== 0 && this.rotateHtml) {
        tr += `rotate(${state.rotation},${w / 2},${h / 2})`
        const pt = this.rotatePoint(
          (x + w / 2) * state.scale,
          (y + h / 2) * state.scale,
          state.rotation,
          state.rotationCenterX,
          state.rotationCenterY,
        )
        x = pt.x - (w * state.scale) / 2
        y = pt.y - (h * state.scale) / 2
      } else {
        x *= state.scale
        y *= state.scale
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
   * Paints the given text. Possible values for format are empty string for
   * plain text and html for HTML markup. Note that HTML markup is only
   * supported if foreignObject is supported and `foEnabled` is true.
   */
  drawText(
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
          x,
          y,
          w,
          h,
          str,
          align,
          valign,
          wrap,
          overflow,
          clip,
          rotation,
          dir,
        )
      } else {
        this.drawSVGText(
          x,
          y,
          w,
          h,
          str,
          align,
          valign,
          wrap,
          overflow,
          clip,
          rotation,
          dir,
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
    const state = this.state
    x += state.tx
    y += state.ty

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
      style += ' word-wrap: normal;'
    } else {
      style += ' white-space: nowrap;'
    }

    // Uses outer group for opacity and transforms
    const group = this.createElement('g')

    if (state.opacity < 1) {
      group.setAttribute('opacity', `${state.opacity}`)
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
      wrap && w > 0 ? 'normal' : null,
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

    // Padding avoids clipping on border and wrapping for
    // differing font metrics on platforms
    const padX = 2
    const padY = 2

    {
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
        DomUtil.getNodeName(sizeDiv.firstChild as HTMLElement) === 'div'
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
        const tmp = group as any
        tmp.__CachedOffsetWidth__ = tmp
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
        const tmp = group as any
        tmp.__CachedFinalOffsetWidth__ = ow
        tmp.__CachedFinalOffsetHeight__ = oh
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

    y += dy

    let transform = state.scale !== 1 ? `scale(${state.scale})` : ''
    if (state.rotation !== 0 && this.rotateHtml) {
      transform += `rotate(${state.rotation},${w / 2},${h / 2})`
      const p = this.rotatePoint(
        (x + w / 2) * state.scale,
        (y + h / 2) * state.scale,
        state.rotation,
        state.rotationCenterX,
        state.rotationCenterY,
      )
      x = p.x - (w * state.scale) / 2
      y = p.y - (h * state.scale) / 2
    } else {
      x *= state.scale
      y *= state.scale
    }

    if (rotation !== 0) {
      transform += `rotate(${rotation},${-dx},${-dy})`
    }

    group.setAttribute(
      'transform',
      `translate(${Math.round(x)},${Math.round(y)}) ${transform}`,
    )
    fo.setAttribute('width', `${Math.round(Math.max(1, w))}`)
    fo.setAttribute('height', `${Math.round(Math.max(1, h))}`)

    // Adds alternate content if foreignObject not supported in viewer
    if (this.root.ownerDocument !== document) {
      const alt = this.createAlternateContent(fo, x, y, w, h)
      if (alt != null) {
        fo.setAttribute(
          'requiredFeatures',
          'http://www.w3.org/TR/SVG11/feature#Extensibility',
        )
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
    clip: boolean = false,
    rotation: number = 0,
    dir: string | null = null,
  ) {
    const node = this.createElement('g')
    this.applyFont(node, align, dir)
    this.applyClip(node, clip, x, y, w, h, align, valign, overflow)

    const state = this.state
    let transform = state.transform || ''

    if (rotation !== 0) {
      const cx = this.format(x * state.scale)
      const cy = this.format(y * state.scale)
      transform += `rotate(${rotation},${cx},${cy})`
    }

    if (transform.length > 0) {
      node.setAttribute('transform', transform)
    }

    const fontSize = state.fontSize
    const lines = str.split('\n')
    const lineHeight = Math.round(fontSize * this.lineHeight)
    const textHeight = fontSize + (lines.length - 1) * lineHeight

    let cy = y + fontSize - 1

    if (valign === 'middle') {
      if (overflow === 'fill') {
        cy -= h / 2
      } else {
        const dy =
          (this.matchHtmlAlignment && clip && h > 0
            ? Math.min(textHeight, h)
            : textHeight) / 2
        cy -= dy + 1
      }
    } else if (valign === 'bottom') {
      if (overflow === 'fill') {
        cy -= h
      } else {
        const dy =
          this.matchHtmlAlignment && clip && h > 0
            ? Math.min(textHeight, h)
            : textHeight
        cy -= dy + 2
      }
    }

    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].length > 0 && lines[i].trim().length > 0) {
        const text = this.createElement('text')
        DomUtil.setAttributes(text, {
          x: this.format(x * state.scale) + this.textOffset,
          y: this.format(cy * state.scale) + this.textOffset,
        })
        DomUtil.appendText(text, lines[i])
        node.appendChild(text)
      }
      cy += lineHeight
    }

    this.root.appendChild(node)
    this.drawTextBackground(
      node,
      str,
      x,
      y,
      w,
      overflow === 'fill' ? h : textHeight,
      align,
      valign,
      overflow,
    )
  }

  private applyClip(
    node: SVGElement,
    clip: boolean,
    x: number,
    y: number,
    w: number,
    h: number,
    align: Align,
    valign: VAlign,
    overflow: string,
  ) {
    if (clip && w > 0 && h > 0) {
      const state = this.state

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

      const clip = this.createClip(
        cx * state.scale - 2,
        cy * state.scale - 2,
        w * state.scale + 4,
        h * state.scale + 4,
      )

      if (this.defs != null) {
        this.defs.appendChild(clip)
      } else {
        this.root.appendChild(clip)
      }

      const id = clip.getAttribute('id')!
      DomUtil.setAttributeWithAnchor(node, 'clip-path', id)
    }
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
    DomUtil.setAttributes(rect, { x, y, w, h })
    clip.appendChild(rect)
    return clip
  }

  private applyFont(node: SVGElement, align: Align, dir: string | null) {
    const state = this.state
    node.setAttribute('fill', state.fontColor!)
    this.applyFontStyle(node, state.fontStyle)

    if (!this.styleEnabled) {
      if (state.fontFamily != null) {
        node.setAttribute('font-family', state.fontFamily)
      }

      if (state.fontSize != null) {
        node.setAttribute('font-size', `${state.fontSize * state.scale}px`)
      }
    }

    if (state.opacity < 1) {
      node.setAttribute('opacity', `${state.opacity}`)
    }

    // Default is left
    const anchor =
      align === 'right' ? 'end' : align === 'center' ? 'middle' : 'start'

    if (anchor !== 'start') {
      node.setAttribute('text-anchor', anchor)
    }

    if (dir != null) {
      node.setAttribute('direction', dir)
    }
  }

  private applyFontStyle(elem: Element, fontStyle: number) {
    if (FontStyle.isBold(fontStyle)) {
      elem.setAttribute('font-weight', 'bold')
    }

    if (FontStyle.isItalic(fontStyle)) {
      elem.setAttribute('font-style', 'italic')
    }

    if (FontStyle.isUnderlined(fontStyle)) {
      elem.setAttribute('text-decoration', 'underline')
    }
  }

  private drawTextBackground(
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
    const state = this.state
    if (state.fontBackgroundColor != null || state.fontBorderColor != null) {
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

        bbox = new Rectangle(
          (x + 1) * state.scale,
          y * state.scale,
          (w - 2) * state.scale,
          (h + 2) * state.scale,
        )
      } else if (
        (node as any).getBBox != null &&
        this.root.ownerDocument === document
      ) {
        try {
          bbox = (node as any).getBBox()
          bbox = new Rectangle(bbox.x, bbox.y + 1, bbox.width, bbox.height)
        } catch (e) {}
      } else {
        // Computes size if not in document or no getBBox available
        const div = document.createElement('div')

        // Wrapping and clipping can be ignored here
        div.style.lineHeight = this.getLineHeight()
        div.style.fontSize = `${state.fontSize}px`
        div.style.fontFamily = state.fontFamily
        div.style.whiteSpace = 'nowrap'
        div.style.position = 'absolute'
        div.style.visibility = 'hidden'
        div.style.display = 'inline-block'
        div.style.zoom = '1'

        if (FontStyle.isBold(state.fontStyle)) {
          div.style.fontWeight = 'bold'
        }

        if (FontStyle.isItalic(state.fontStyle)) {
          div.style.fontStyle = 'italic'
        }

        str = StringExt.escape(str)
        div.innerHTML = str.replace(/\n/g, '<br/>')

        document.body.appendChild(div)
        const w = div.offsetWidth
        const h = div.offsetHeight
        DomUtil.remove(div)

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
          (x + 1) * state.scale,
          (y + 2) * state.scale,
          w * state.scale,
          (h + 1) * state.scale,
        )
      }

      if (bbox != null) {
        const n = this.createElement('rect')
        DomUtil.setAttributes(n, {
          fill: state.fontBackgroundColor || 'none',
          stroke: state.fontBorderColor || 'none',
          x: Math.floor(bbox.x - 1),
          y: Math.floor(bbox.y - 1),
          width: Math.ceil(bbox.width + 2),
          height: Math.ceil(bbox.height),
        })

        const sw =
          state.fontBorderColor != null
            ? Math.max(1, this.format(state.scale))
            : 0
        n.setAttribute('stroke-width', `${sw}`)

        // if (this.root.ownerDocument === document && util.mod(sw, 2) === 1) {
        //   n.setAttribute('transform', 'translate(0.5, 0.5)')
        // }

        node.insertBefore(n, node.firstChild)
      }
    }
  }

  private getLineHeight() {
    return this.absoluteLineHeight
      ? `${this.state.fontSize * this.lineHeight}px`
      : `${this.lineHeight}`
  }

  private createTextDiv(
    str: string,
    align: Align,
    valign: VAlign,
    style: string,
    overflow: string,
    whiteSpace: string | null,
  ) {
    const state = this.state

    let stl =
      'display: inline-block; ' +
      `color: ${state.fontColor}; ` +
      `font-size: ${state.fontSize}px; ` +
      `font-family: ${state.fontFamily}; ` +
      `line-height: ${this.getLineHeight()};` +
      `${style ? ` ${style}` : ''}`

    if (FontStyle.isBold(state.fontStyle)) {
      stl += ' font-weight: bold;'
    }

    if (FontStyle.isItalic(state.fontStyle)) {
      stl += ' font-style: italic;'
    }

    if (FontStyle.isUnderlined(state.fontStyle)) {
      stl += ' text-decoration: underline;'
    }

    if (align === 'center') {
      stl += ' text-align: center;'
    } else if (align === 'right') {
      stl += ' text-align: right;'
    } else {
      stl += ' text-align: left;'
    }

    let bg = ''
    if (state.fontBackgroundColor != null) {
      bg += ` background-color: ${StringExt.escape(state.fontBackgroundColor)};`
    }

    if (state.fontBorderColor != null) {
      bg += ` border: 1px solid ${StringExt.escape(state.fontBorderColor)};`
    }

    let content = str

    if (!DomUtil.isHtmlElement(content)) {
      content = DomUtil.toXHTML(content, this.useDomParser)

      if (overflow !== 'fill' && overflow !== 'width') {
        if (whiteSpace != null) {
          bg += ` white-space: ${whiteSpace};`
        }

        // inner div always needed to measure wrapped text
        // tslint:disable-next-line
        const pre =
          'display: inline-block; ' +
          'text-align: inherit; ' +
          'text-decoration: inherit;'
        content = `<div style="${pre} ${bg}">${content}</div>`
      } else {
        stl += bg
      }
    }

    if (document.createElementNS) {
      const div = document.createElementNS(SvgCanvas2D.NS_XHTML, 'div')
      div.setAttribute('style', stl)

      if (DomUtil.isHtmlElement(content)) {
        const n = (content as any) as HTMLElement
        if (this.root.ownerDocument !== document) {
          // creates a copy for export
          div.appendChild(n.cloneNode(true))
        } else {
          div.appendChild(n)
        }
      } else {
        div.innerHTML = content
      }

      return div
    }

    // Serializes for export
    if (
      DomUtil.isHtmlElement(content) &&
      this.root.ownerDocument !== document
    ) {
      content = ((content as any) as HTMLElement).outerHTML
    }

    return DomUtil.parseXml(`<div style="${stl}">${content}</div>`)
      .documentElement
  }

  private createAlternateContent(
    fo: SVGForeignObjectElement,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    if (this.foAltText != null) {
      const state = this.state
      const alt = this.createElement('text')
      DomUtil.setAttributes(alt, {
        x: Math.round(w / 2),
        y: Math.round((h + state.fontSize) / 2),
        fill: state.fontColor || '#000000',
        'text-anchor': 'middle',
        'font-size': `${state.fontSize}px`,
        'font-family': state.fontFamily,
      })

      this.applyFontStyle(alt, state.fontStyle)
      DomUtil.appendText(alt, this.foAltText)

      return alt
    }

    return null
  }

  /**
   * Invalidates the cached offset size for the given node.
   */
  invalidateCachedOffsetSize(node: SVGElement) {
    delete (node.firstChild as any).__CachedOffsetWidth__
    delete (node.firstChild as any).__CachedFinalOffsetWidth__
    delete (node.firstChild as any).__CachedFinalOffsetHeight__
  }
}
