import { DomUtil } from '../../dom'
import { globals } from '../../option'
import { Direction } from '../../types'
import { Canvas2D } from '../canvas2d'
import { SvgCanvas2D } from './index'

export abstract class SvgCanvas2DBase extends Canvas2D {
  originalRoot?: SVGElement

  /**
   * The container for the SVG content.
   */
  root: SVGElement

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
   * Minimum stroke width for output.
   */
  minStrokeWidth: number = 1

  /**
   * Adds transparent paths for strokes.
   */
  strokeTolerance: number = 0

  /**
   * Value for active pointer events.
   *
   * Default `all`
   */
  pointerEventsValue: string = 'all'

  /**
   * Local counter for references in SVG export.
   */
  refCount: number = 0

  constructor(root: SVGElement, styleEnabled: boolean = false) {
    super()

    this.root = root
    this.gradients = {}
    this.styleEnabled = styleEnabled

    const svg =
      root.ownerDocument === document ? null : DomUtil.getOwnerSVG(root)

    if (svg != null) {
      // try to get defs in current svg
      const defs = svg.getElementsByTagName('defs')
      if (defs.length > 0) {
        this.defs = defs[0]
      }

      // create defs
      if (this.defs == null) {
        this.defs = this.createElement('defs') as SVGDefsElement
        DomUtil.prepend(svg, this.defs)
      }

      // add stylesheet
      if (this.styleEnabled) {
        this.defs.appendChild(this.createStylesheet())
      }
    }
  }

  format(value: any) {
    return parseFloat(parseFloat(value).toFixed(2))
  }

  protected createStylesheet() {
    const style = this.createElement('style')
    style.setAttribute('type', 'text/css')
    DomUtil.appendText(
      style,
      'svg {' +
        '  fill: none; ' +
        `  font-size: ${globals.defaultFontSize}; ` +
        `  font-family: ${globals.defaultFontFamily}; ` +
        '  stroke-miterlimit: 10;' +
        '}',
    )

    return style
  }

  protected createElement<T extends SVGElement>(
    tagName: string,
    namespace?: string,
  ) {
    const doc = this.root.ownerDocument!
    if (doc.createElementNS != null) {
      return doc.createElementNS(namespace || SvgCanvas2D.NS_SVG, tagName) as T
    }

    const elem = doc.createElement(tagName)
    if (namespace != null) {
      elem.setAttribute('xmlns', namespace)
    }

    return (elem as any) as T
  }

  protected addNode(filled: boolean, stroked: boolean) {
    if (this.elem == null) {
      return
    }

    const elem = this.elem
    const state = this.state
    const nodeName = elem.nodeName.toLowerCase()

    if (nodeName === 'path') {
      if (this.path != null && this.path.length > 0) {
        elem.setAttribute('d', this.path.join(' '))
      } else {
        return
      }
    }

    // fill
    if (filled && state.fillColor != null) {
      this.updateFill()
    } else if (!this.styleEnabled) {
      elem.setAttribute('fill', 'none')
      // tslint:disable-next-line
      filled = false // Sets the actual filled state for stroke tolerance
    }

    // stroke
    if (stroked && state.strokeColor != null) {
      this.updateStroke()
    } else if (!this.styleEnabled) {
      elem.setAttribute('stroke', 'none')
    }

    if (state.transform != null && state.transform.length > 0) {
      elem.setAttribute('transform', state.transform)
    }

    if (state.shadow && state.shadowColor) {
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

    // Do not append invisible element to document.
    const shouldAppendToDocument =
      (nodeName !== 'rect' && nodeName !== 'path' && nodeName !== 'ellipse') ||
      (elem.getAttribute('fill') !== 'none' &&
        elem.getAttribute('fill') !== 'transparent') ||
      elem.getAttribute('stroke') !== 'none' ||
      elem.getAttribute('pointer-events') !== 'none'

    if (shouldAppendToDocument) {
      this.root.appendChild(elem)
    }

    this.elem = null as any
  }

  private updateFill() {
    const elem = this.elem!
    const state = this.state

    if (state.opacity < 1 || state.fillOpacity < 1) {
      elem.setAttribute('fill-opacity', `${state.opacity * state.fillOpacity}`)
    }

    if (state.fillColor != null) {
      if (state.gradientColor != null) {
        const id = this.getSvgGradientId(
          state.fillColor,
          state.gradientColor,
          state.gradientFillOpacity,
          state.gradientOpacity,
          state.gradientDirection,
        )
        DomUtil.setAttributeWithAnchor(elem, 'fill', id)
      } else {
        elem.setAttribute('fill', state.fillColor)
      }
    }
  }

  protected getStrokeWidth() {
    return Math.max(
      this.minStrokeWidth,
      Math.max(0.01, this.format(this.state.strokeWidth * this.state.scale)),
    )
  }

  protected updateStroke() {
    const elem = this.elem!
    const state = this.state

    elem.setAttribute('stroke', state.strokeColor!)

    if (state.opacity < 1 || state.strokeOpacity < 1) {
      elem.setAttribute(
        'stroke-opacity',
        `${state.opacity * state.strokeOpacity}`,
      )
    }

    const sw = this.getStrokeWidth()
    if (sw !== 1) {
      elem.setAttribute('stroke-width', `${sw}`)
    }

    if (elem.nodeName.toLowerCase() === 'path') {
      this.updatePathStroke()
    }

    if (state.dashed) {
      elem.setAttribute(
        'stroke-dasharray',
        this.createDashPattern(
          (state.fixDash ? 1 : state.strokeWidth) * state.scale,
        ),
      )
    }
  }

  protected updatePathStroke() {
    const elem = this.elem!
    const state = this.state

    if (state.lineJoin != null && state.lineJoin !== 'miter') {
      elem.setAttribute('stroke-linejoin', state.lineJoin)
    }

    if (state.lineCap != null && state.lineCap !== 'butt') {
      elem.setAttribute('stroke-linecap', state.lineCap)
    }

    // Miterlimit 10 is default in our document
    if (
      state.miterLimit != null &&
      (!this.styleEnabled || state.miterLimit !== 10)
    ) {
      elem.setAttribute('stroke-miterlimit', `${state.miterLimit}`)
    }
  }

  protected createDashPattern(scale: number) {
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

  protected createShadow(elem: SVGElement) {
    const state = this.state
    const shadow = elem.cloneNode(true) as SVGElement

    if (shadow.getAttribute('fill') !== 'none') {
      shadow.setAttribute('fill', state.shadowColor!)
    }

    if (shadow.getAttribute('stroke') !== 'none') {
      shadow.setAttribute('stroke', state.shadowColor!)
    }

    const tx = this.format(state.shadowOffsetX * state.scale)
    const ty = this.format(state.shadowOffsetY * state.scale)

    shadow.setAttribute(
      'transform',
      `translate(${tx},${ty})${state.transform || ''}`,
    )

    shadow.setAttribute('opacity', `${state.shadowOpacity}`)

    return shadow
  }

  protected createTolerance(elem: SVGElement) {
    const tol = elem.cloneNode(true) as SVGElement
    const sw =
      parseFloat(tol.getAttribute('stroke-width') || '1') + this.strokeTolerance

    tol.setAttribute('fill', 'none')
    tol.setAttribute('stroke', 'rgba(255,255,255,0)')
    tol.setAttribute('stroke-width', `${sw}`)
    tol.setAttribute('pointer-events', 'stroke')
    tol.setAttribute('visibility', 'hidden')
    tol.removeAttribute('stroke-dasharray')

    return tol
  }

  protected createSvgGradient(
    startColor: string,
    stopColor: string,
    opacity1: number,
    opacity2: number,
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
    const startStyle = opacity1 < 1 ? `stop-opacity: ${opacity1};` : ''
    start.setAttribute('offset', '0%')
    start.setAttribute('style', `stop-color: ${startColor}; ${startStyle}`)
    gradient.appendChild(start)

    const stop = this.createElement('stop')
    const stopStyle = opacity2 < 1 ? `stop-opacity: ${opacity2};` : ''
    stop.setAttribute('offset', '100%')
    stop.setAttribute('style', `stop-color: ${stopColor}; ${stopStyle}`)
    gradient.appendChild(stop)

    return gradient
  }

  protected createGradientId(
    startColor: string,
    stopColor: string,
    opacity1: number,
    opacity2: number,
    direction: Direction,
  ) {
    const formatColor = (color: string) => {
      let ret = color
      if (ret.charAt(0) === '#') {
        ret = ret.substring(1)
      }
      return ret.toLowerCase()
    }

    let a = `${formatColor(startColor)}@${opacity1}`
    let b = `${formatColor(stopColor)}@${opacity2}`
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

  protected getSvgGradientId(
    startColor: string,
    stopColor: string,
    opacity1: number,
    opacity2: number,
    direction: Direction,
  ): string {
    const id = this.createGradientId(
      startColor,
      stopColor,
      opacity1,
      opacity2,
      direction,
    )

    let gradient = this.gradients[id]
    if (gradient == null) {
      const svg = this.root.ownerSVGElement

      let counter = 0
      let tmpId = `${id}-${counter}`

      if (svg != null) {
        const doc = svg.ownerDocument!
        gradient = (doc.getElementById(tmpId) as any) as SVGGradientElement
        while (gradient != null && gradient.ownerSVGElement !== svg) {
          counter += 1
          tmpId = `${id}-${counter}`
          gradient = (doc.getElementById(tmpId) as any) as SVGGradientElement
        }
      } else {
        this.refCount += 1
        tmpId = `id${this.refCount}` // Uses shorter IDs for export
      }

      if (gradient == null) {
        gradient = this.createSvgGradient(
          startColor,
          stopColor,
          opacity1,
          opacity2,
          direction,
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
}
