import * as util from '../util'
import * as images from '../assets/images'
import { Stencil } from './stencil'
import { State } from '../core'
import { SvgCanvas2D } from '../canvas'
import { detector, constants, DomEvent, IDisposable } from '../common'
import { Rectangle, Point } from '../struct'
import { CellStyle, Direction, Dialect } from '../types'

export class Shape implements IDisposable {
  state: State

  /**
   * Specifies if the shape is visible.
   */
  visible: boolean = true

  /**
   * Rendering hint for configuring the canvas.
   */
  antiAlias: boolean = true

  /**
   * The dialect in which the shape is to be painted.
   */
  dialect: Dialect

  /**
   * The `Stencil` instance that defines the shape.
   */
  stencil: Stencil | null

  /**
   * Optional reference to the style of the corresponding `CellState`.
   */
  style: CellStyle

  className?: string

  /**
   * The scale in which the shape is being painted.
   */
  scale: number = 1

  /**
   * A `Rect` that specifies the bounds of this shape.
   */
  bounds: Rectangle

  /**
   * Contains the bounding box of the shape, that is, the smallest
   * rectangle that includes all pixels of the shape.
   */
  boundingBox: Rectangle | null

  /**
   * Specify the points of this shape.
   */
  points: Point[]

  /**
   * The outermost DOM node that represents this shape.
   */
  elem: HTMLElement | SVGElement | null

  /**
   * Specifies if the shape should be drawn as an outline. This disables
   * all fill colors and can be used to disable other drawing states that
   * should not be painted for outlines.
   */
  outline: boolean = false

  /**
   * Specifies if pointer events should be handled.
   */
  pointerEvents: boolean = true

  /**
   * Specifies if pointer events outside of shape should be handled.
   */
  shapePointerEvents: boolean = false

  /**
   * Specifies if pointer events outside of stencils should be handled.
   */
  stencilPointerEvents: boolean = false

  /**
   * Allows to use the SVG bounding box in SVG. Default is false
   * for performance reasons.
   */
  useSvgBoundingBox: boolean = false

  /**
   * Minimum stroke width for SVG output.
   */
  minSvgStrokeWidth: number = 1

  /**
   * Event-tolerance for SVG strokes (in px).
   */
  svgStrokeTolerance: number = 8

  svgPointerEvents: string = 'all'

  oldGradients: SvgCanvas2D.Gradients | null

  //
  image: string | null
  indicatorShape: Shape.ShapeClass | null
  indicatorImage: string | null
  indicatorColor: string | null
  indicatorStrokeColor: string | null
  indicatorGradientColor: string | null
  indicatorDirection: Direction | null

  // style
  cursor?: string
  opacity: number
  rotation: number
  fill: string | null
  fillOpacity: number
  stroke: string | null
  strokeWidth: number | string
  strokeOpacity: number
  flipH: boolean
  flipV: boolean
  gradientColor: string | null
  gradientDirection?: Direction
  startArrow?: string
  endArrow?: string
  startSize?: number
  endSize?: number
  direction?: Direction | null
  spacing: number = 0

  glass: boolean = false
  dashed: boolean = false
  shadow: boolean = false
  rounded: boolean = false

  constructor(stencil?: Stencil) {
    this.stencil = stencil != null ? stencil : null
    this.style = {}
    this.initStyle()
  }

  protected initStyle() {
    this.rotation = 0
    this.opacity = 100
    this.fillOpacity = 100
    this.strokeWidth = 1
    this.strokeOpacity = 100
    this.flipH = false
    this.flipV = false
  }

  resetStyle() {
    this.initStyle()

    this.spacing = 0

    delete this.fill
    delete this.gradientColor
    delete this.gradientDirection
    delete this.stroke
    delete this.startSize
    delete this.endSize
    delete this.startArrow
    delete this.endArrow
    delete this.direction

    this.glass = false
    this.shadow = false
    this.dashed = false
    this.rounded = false
  }

  /**
   * Creaing the DOM node and adding it into the given container.
   */
  init(container: HTMLElement | SVGElement | null) {
    if (container) {
      if (this.elem == null) {
        this.elem = this.create(container)
        if (container != null) {
          container.appendChild(this.elem)
        }
      }
    }
  }

  protected create(container: HTMLElement | SVGElement) {
    return Private.isSvgElem(container)
      ? this.createSvg()  // g
      : this.createHtml() // div
  }

  protected createSvg(): SVGGElement {
    return Private.createSvgElement('g') as SVGGElement
  }

  protected createHtml(): HTMLDivElement {
    const elem = document.createElement('div') as HTMLDivElement
    elem.style.position = 'absolute'
    return elem
  }

  protected getSvgScreenOffset(): number {
    let sw = (this.stencil && this.stencil.strokeWidth !== 'inherit')
      ? Number(this.stencil.strokeWidth)
      : this.strokeWidth as number
    sw = Math.max(1, Math.round(sw * this.scale))
    return (util.mod(sw, 2) === 1) ? 0.5 : 0
  }

  redraw() {
    if (this.elem) {
      const elem = this.elem

      this.updateClassName()
      this.updateBoundsFromPoints()

      if (this.visible && this.isValidBounds()) {
        elem.style.visibility = 'visible'
        this.empty()

        if (Private.isSvgElem(elem)) {
          this.redrawSvgShape()
        } else {
          this.redrawHtmlShape()
        }

        this.updateBoundingBox()
      } else {
        elem.style.visibility = 'hidden'
        this.boundingBox = null
      }
    }
  }

  protected updateClassName() {
    if (this.className != null && this.elem != null) {
      if (!this.hasClass(this.className)) {
        this.addClass(this.className)
      }
    }
  }

  protected empty() {
    if (this.elem != null) {
      if (Private.isSvgElem(this.elem)) {
        util.emptyElement(this.elem)
      } else {
        const cursorStyle = (this.cursor != null)
          ? ` cursor: ${this.cursor};`
          : ''
        this.elem.style.cssText = `position: absolute;${cursorStyle}`
        this.elem.innerHTML = ''
      }
    }
  }

  protected updateBoundsFromPoints() {
    const points = this.points
    if (points != null && points.length > 0 && points[0] != null) {
      this.bounds = new Rectangle(points[0].x, points[0].y, 1, 1)
      for (let i = 1, ii = points.length; i < ii; i += 1) {
        if (points[i] != null) {
          this.bounds.add(new Rectangle(points[i].x, points[i].y, 1, 1))
        }
      }
    }
  }

  protected isValidBounds() {
    return (
      !isNaN(this.scale) &&
      isFinite(this.scale) &&
      this.scale > 0 &&
      this.bounds != null &&
      !isNaN(this.bounds.x) &&
      !isNaN(this.bounds.y) &&
      !isNaN(this.bounds.width) &&
      !isNaN(this.bounds.height) &&
      this.bounds.width > 0 &&
      this.bounds.height > 0
    )
  }

  protected redrawSvgShape() {
    const canvas = this.createCanvas()
    if (canvas != null) {
      this.paint(canvas)
      if (this.elem !== canvas.root) {
        this.elem!.insertAdjacentHTML('beforeend', canvas.root.outerHTML)
      }
      this.destroyCanvas(canvas)
    }
  }

  protected createCanvas() {
    let canvas: SvgCanvas2D | null = null

    if (Private.isSvgElem(this.elem)) {
      canvas = this.createSvgCanvas()
    }

    // draw outline
    if (canvas != null && this.outline) {
      canvas.setStrokeWidth(+this.strokeWidth)
      canvas.setStrokeColor(this.stroke)
      if (this.dashed != null) {
        canvas.setDashed(this.dashed)
      }

      canvas.setStrokeWidth = () => { }
      canvas.setStrokeColor = () => { }
      canvas.setDashed = () => { }

      canvas.setFillColor = () => { }
      canvas.setGradient = () => { }
      canvas.text = () => { }
    }

    return canvas
  }

  protected createSvgCanvas() {
    const canvas = new SvgCanvas2D(this.elem as SVGElement, false)
    canvas.minStrokeWidth = this.minSvgStrokeWidth
    canvas.strokeTolerance = this.pointerEvents ? this.svgStrokeTolerance : 0
    canvas.pointerEvents = this.pointerEvents
    canvas.pointerEventsValue = this.svgPointerEvents
    canvas.blockImagePointerEvents = detector.IS_FIREFOX

    const offset = this.getSvgScreenOffset()
    if (offset !== 0) {
      this.elem!.setAttribute('transform', `translate(${offset},${offset})`)
    } else {
      this.elem!.removeAttribute('transform')
    }

    if (!this.antiAlias) {
      canvas.format = (val: any) => Math.round(parseFloat(val))
    }

    return canvas
  }

  protected destroyCanvas(canvas: SvgCanvas2D) {
    if (canvas instanceof SvgCanvas2D) {
      for (const key in canvas.gradients) {
        const gradient = canvas.gradients[key]
        if (gradient != null) {
          (gradient as any).refCount = ((gradient as any).refCount || 0) + 1
        }
      }

      this.releaseSvgGradients(this.oldGradients)
      this.oldGradients = canvas.gradients
    }
  }

  protected releaseSvgGradients(gradients: SvgCanvas2D.Gradients | null) {
    if (gradients != null) {
      Object.keys(gradients).forEach((key) => {
        const gradient = gradients[key]
        if (gradient != null) {
          let refCount = (gradient as any).refCount || 0
          refCount = refCount > 0 ? refCount - 1 : 0;
          (gradient as any).refCount = refCount

          if (refCount === 0 && gradient.parentNode != null) {
            gradient.parentNode.removeChild(gradient)
          }
        }
      })
    }
  }

  // #region html

  isHtmlAllowed() {
    return false
  }

  protected redrawHtmlShape() {
    const elem = this.elem as HTMLElement
    this.updateHtmlBounds(elem)
    this.updateHtmlFilters(elem)
    this.updateHtmlColors(elem)
  }

  protected updateHtmlBounds(elem: HTMLElement) {
    let sw = util.getDocumentMode() >= 9
      ? 0
      : Math.ceil(Number(this.strokeWidth) * this.scale)

    elem.style.overflow = 'hidden'
    elem.style.borderWidth = `${Math.max(1, sw)}px`
    elem.style.left = `${Math.round(this.bounds.x - sw / 2)}px`
    elem.style.top = `${Math.round(this.bounds.y - sw / 2)}px`

    if (document.compatMode === 'CSS1Compat') {
      sw = -sw
    }

    elem.style.width = `${Math.round(Math.max(0, this.bounds.width + sw))}px`
    elem.style.height = `${Math.round(Math.max(0, this.bounds.height + sw))}px`
  }

  protected updateHtmlFilters(node: HTMLElement) {
    let f = ''

    if (this.opacity < 100) {
      f += `alpha(opacity=${this.opacity})`
    }

    if (this.shadow) {
      f += (
        'progid:DXImageTransform.Microsoft.dropShadow (' +
        `OffX='${Math.round(constants.SHADOW_OFFSET_X * this.scale)}',` +
        `OffY='${Math.round(constants.SHADOW_OFFSET_Y * this.scale)}',` +
        `Color='${constants.SHADOWCOLOR}')`
      )
    }

    if (
      this.fill != null &&
      this.fill !== constants.NONE &&
      this.gradientColor &&
      this.gradientColor !== constants.NONE
    ) {
      let start = this.fill
      let end = this.gradientColor
      let type = '0'

      const lookup = { east: 0, south: 1, west: 2, north: 3 }
      let dir = (this.direction != null) ? lookup[this.direction] : 0
      if (this.gradientDirection != null) {
        dir = util.mod(dir + lookup[this.gradientDirection] - 1, 4)
      }

      if (dir === 1) {
        type = '1'
        const tmp = start
        start = end
        end = tmp
      } else if (dir === 2) {
        const tmp = start
        start = end
        end = tmp
      } else if (dir === 3) {
        type = '1'
      }

      f += (
        'progid:DXImageTransform.Microsoft.gradient(' +
        `startColorStr='${start}', ` +
        `endColorStr='${end}', ` +
        `gradientType='${type}')`
      )
    }

    node.style.filter = f
  }

  protected updateHtmlColors(node: HTMLElement) {
    let color = this.stroke

    if (color != null && color !== constants.NONE) {
      node.style.borderColor = color

      if (this.dashed) {
        node.style.borderStyle = 'dashed'
      } else if (this.strokeWidth > 0) {
        node.style.borderStyle = 'solid'
      }

      const borderWidth = Math.max(
        1,
        Math.ceil(Number(this.strokeWidth) * this.scale),
      )
      node.style.borderWidth = `${borderWidth}px`
    } else {
      node.style.borderWidth = '0px'
    }

    color = this.outline ? null : this.fill

    if (color != null && color !== constants.NONE) {
      node.style.backgroundColor = color
      node.style.backgroundImage = 'none'
    } else if (this.pointerEvents) {
      node.style.backgroundColor = 'transparent'
    } else {
      this.setTransparentBackgroundImage(node)
    }
  }

  /**
   * Sets a transparent background CSS style to catch all events.
   */
  protected setTransparentBackgroundImage(elem: HTMLElement) {
    elem.style.backgroundImage = `url('${images.transparent.src}')`
  }

  // #endregion

  // #region svg

  paint(c: SvgCanvas2D, update?: boolean) {
    let strokeDrawn = false

    // draw outline
    if (c != null && this.outline) {
      const stroke = c.stroke
      const fillAndStroke = c.fillAndStroke

      c.stroke = (...args) => {
        strokeDrawn = true
        stroke.apply(c, args)
      }

      c.fillAndStroke = (...args) => {
        strokeDrawn = true
        fillAndStroke.apply(c, args)
      }
    }

    // Scale is passed-through to canvas
    const s = this.scale
    let x = this.bounds.x / s
    let y = this.bounds.y / s
    let w = this.bounds.width / s
    let h = this.bounds.height / s

    if (this.isPaintBoundsInverted()) {
      const tmp1 = (w - h) / 2
      x += tmp1
      y -= tmp1

      const tmp2 = w
      w = h
      h = tmp2
    }

    this.updateTransform(c, x, y, w, h)
    this.configureCanvas(c, x, y, w, h)

    // Adds background rectangle to capture events
    let bg = null
    if (
      (this.stencil == null && this.points == null && this.shapePointerEvents) ||
      (this.stencil != null && this.stencilPointerEvents)
    ) {
      if (this.dialect === 'svg') {
        const bbox = this.createBoundingBox()
        bg = this.createTransparentSvgRectangle(
          bbox.x, bbox.y, bbox.width, bbox.height,
        )
        this.elem!.appendChild(bg)
      }
    }

    if (this.stencil != null) {
      this.stencil.drawShape(c, this, x, y, w, h)
    } else {

      // Stencils have separate strokewidth
      c.setStrokeWidth(this.strokeWidth as number)

      if (this.points != null) {
        const pts: Point[] = []
        this.points.forEach((p) => {
          if (p != null) {
            pts.push(new Point(p.x / s, p.y / s))
          }
        })
        this.paintEdgeShape(c, pts)
      } else {
        this.paintNodeShape(c, x, y, w, h)
      }
    }

    if (bg != null && c.state != null && c.state.transform != null) {
      bg.setAttribute('transform', c.state.transform)
    }

    // Draws highlight rectangle if no stroke was used
    if (c != null && this.outline && !strokeDrawn) {
      c.rect(x, y, w, h)
      c.stroke()
    }
  }

  protected updateTransform(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    // TODO: Currently, scale is implemented in state and canvas. This will
    // move to canvas in a later version, so that the states are unscaled
    // and untranslated and do not need an update after zooming or panning.
    c.scale(this.scale)
    c.rotate(
      this.getShapeRotation(),
      this.flipH,
      this.flipV,
      x + w / 2,
      y + h / 2,
    )
  }

  protected configureCanvas(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {

    c.setAlpha(this.opacity / 100)
    c.setFillAlpha(this.fillOpacity / 100)
    c.setStrokeAlpha(this.strokeOpacity / 100)

    if (this.shadow != null) {
      c.setShadow(this.shadow)
    }

    // Dash
    if (this.dashed != null) {
      c.setDashed(
        this.dashed,
        this.style.fixDash ? true : false,
      )
    }

    const dash = this.style && this.style.dashPattern
    if (dash != null) {
      c.setDashPattern(dash)
    }

    if (
      this.fill != null &&
      this.fill !== constants.NONE &&
      this.gradientColor &&
      this.gradientColor !== constants.NONE
    ) {
      const b = this.getGradientBounds(c, x, y, w, h)
      c.setGradient(
        this.fill,
        this.gradientColor,
        b.x,
        b.y,
        b.width,
        b.height,
        this.gradientDirection!,
      )
    } else {
      c.setFillColor(this.fill)
    }

    c.setStrokeColor(this.stroke)
  }

  protected getGradientBounds(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    return new Rectangle(x, y, w, h)
  }

  /**
   * Create a transparent rectangle that catches all events.
   */
  protected createTransparentSvgRectangle(
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    const rect = Private.createSvgElement('rect') as SVGElement
    util.setAttributes(rect, {
      x, y, w, h,
      fill: 'none',
      stroke: 'none',
      'pointer-events': 'all',
    })
    return rect
  }

  protected paintEdgeShape(c: SvgCanvas2D, points: Point[]) { }

  protected paintNodeShape(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    this.paintBackground(c, x, y, w, h)

    if (
      !this.outline ||
      this.style == null ||
      !this.style.backgroundOutline
    ) {
      c.setShadow(false)
      this.paintForeground(c, x, y, w, h)
    }
  }

  paintBackground(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) { }

  paintForeground(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) { }

  protected getArcSize(w: number, h: number, f?: number) {
    let r = 0

    const absoluteArcSize = this.style.absoluteArcSize
    if (absoluteArcSize) {
      r = Math.min(
        w / 2,
        Math.min(
          h / 2,
          (this.style.arcSize || constants.LINE_ARCSIZE) / 2,
        ),
      )
    } else {
      const f = (
        this.style.arcSize || constants.RECTANGLE_ROUNDING_FACTOR * 100
      ) / 100
      r = Math.min(w * f, h * f)
    }

    return r
  }

  protected paintGlassEffect(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
    arc: number,
  ) {
    const sw = Math.ceil((this.strokeWidth as number) / 2)
    const size = 0.4

    c.setGradient(
      '#ffffff',
      '#ffffff',
      x, y, w, h * 0.6,
      'south',
      0.9,
      0.1,
    )

    c.begin()
    arc += 2 * sw // tslint:disable-line

    if (this.rounded) {
      c.moveTo(x - sw + arc, y - sw)
      c.quadTo(x - sw, y - sw, x - sw, y - sw + arc)
      c.lineTo(x - sw, y + h * size)
      c.quadTo(x + w * 0.5, y + h * 0.7, x + w + sw, y + h * size)
      c.lineTo(x + w + sw, y - sw + arc)
      c.quadTo(x + w + sw, y - sw, x + w + sw - arc, y - sw)
    } else {
      c.moveTo(x - sw, y - sw)
      c.lineTo(x - sw, y + h * size)
      c.quadTo(x + w * 0.5, y + h * 0.7, x + w + sw, y + h * size)
      c.lineTo(x + w + sw, y - sw)
    }

    c.close()
    c.fill()
  }

  /**
   * Paints the given points with rounded corners.
   */
  paintPoints(
    c: SvgCanvas2D,
    points: Point[],
    rounded: boolean,
    arcSize: number,
    close: boolean,
    exclude?: number[],
    initialMove: boolean = true,
  ) {
    if (points != null && points.length > 0) {
      const pe = points[points.length - 1]

      // Adds virtual waypoint in the center between start and end point
      if (close && rounded) {
        points = points.slice() // tslint:disable-line
        const p0 = points[0]
        const wp = new Point(pe.x + (p0.x - pe.x) / 2, pe.y + (p0.y - pe.y) / 2)
        points.splice(0, 0, wp)
      }

      let pt = points[0]
      let i = 1

      // Draws the line segments
      if (initialMove) {
        c.moveTo(pt.x, pt.y)
      } else {
        c.lineTo(pt.x, pt.y)
      }

      while (i < ((close) ? points.length : points.length - 1)) {
        let tmp = points[util.mod(i, points.length)]
        let dx = pt.x - tmp.x
        let dy = pt.y - tmp.y

        if (
          rounded &&
          (dx !== 0 || dy !== 0) &&
          (exclude == null || util.indexOf(exclude, i - 1) < 0)
        ) {
          // Draws a line from the last point to the current
          // point with a spacing of size off the current point
          // into direction of the last point
          let dist = Math.sqrt(dx * dx + dy * dy)
          const nx1 = dx * Math.min(arcSize, dist / 2) / dist
          const ny1 = dy * Math.min(arcSize, dist / 2) / dist

          const x1 = tmp.x + nx1
          const y1 = tmp.y + ny1
          c.lineTo(x1, y1)

          // Draws a curve from the last point to the current
          // point with a spacing of size off the current point
          // into direction of the next point
          let next = points[util.mod(i + 1, points.length)]

          // Uses next non-overlapping point
          while (
            i < points.length - 2 &&
            Math.round(next.x - tmp.x) === 0 &&
            Math.round(next.y - tmp.y) === 0
          ) {
            next = points[util.mod(i + 2, points.length)]
            i += 1
          }

          dx = next.x - tmp.x
          dy = next.y - tmp.y

          dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))
          const nx2 = dx * Math.min(arcSize, dist / 2) / dist
          const ny2 = dy * Math.min(arcSize, dist / 2) / dist

          const x2 = tmp.x + nx2
          const y2 = tmp.y + ny2

          c.quadTo(tmp.x, tmp.y, x2, y2)
          tmp = new Point(x2, y2)
        } else {
          c.lineTo(tmp.x, tmp.y)
        }

        pt = tmp
        i += 1
      }

      if (close) {
        c.close()
      } else {
        c.lineTo(pe.x, pe.y)
      }
    }
  }

  // #endregion

  getLabelBounds(rect: Rectangle) {
    const direction = (this.style.direction || 'east') as Direction

    let bounds = rect

    if (
      direction !== 'south' &&
      direction !== 'north' &&
      this.state != null &&
      this.state.text != null &&
      this.state.text.isPaintBoundsInverted()
    ) {
      bounds = bounds.clone()
      const tmp = bounds.width
      bounds.width = bounds.height
      bounds.height = tmp
    }

    // Normalizes argument for getLabelMargins hook
    const margin = this.getLabelMargins(bounds)
    if (margin != null) {
      let flipH = !!this.style.flipH
      let flipV = !!this.style.flipV

      // Handles special case for vertical labels
      if (
        this.state != null &&
        this.state.text != null &&
        this.state.text.isPaintBoundsInverted()
      ) {
        const tmp1 = margin.x
        margin.x = margin.height
        margin.height = margin.width
        margin.width = margin.y
        margin.y = tmp1

        const tmp2 = flipH
        flipH = flipV
        flipV = tmp2
      }

      return util.getDirectedBounds(rect, margin, this.style, flipH, flipV)
    }

    return rect
  }

  /**
   * Returns the scaled top, left, bottom and right margin to be used for
   * computing the label bounds as an `Rectangle`, where the bottom and right
   * margin are defined in the width and height of the rectangle, respectively.
   */
  getLabelMargins(rect: Rectangle): Rectangle | null {
    return null
  }

  /**
   * Applies the style of the given `CellState` to the shape.
   */
  apply(state: State) {
    this.state = state
    this.style = state.style // keeps a reference to style

    this.fill = this.style.fill || this.fill
    this.gradientColor = this.style.gradientColor || this.gradientColor
    this.gradientDirection = this.style.gradientDirection || this.gradientDirection
    this.opacity = this.style.opacity || this.opacity
    this.fillOpacity = this.style.fillOpacity || this.fillOpacity
    this.strokeOpacity = this.style.strokeOpacity || this.strokeOpacity
    this.stroke = this.style.stroke || this.stroke
    this.strokeWidth = this.style.strokeWidth || this.strokeWidth
    this.spacing = this.style.spacing || this.spacing
    this.startSize = this.style.startSize || this.startSize
    this.endSize = this.style.endSize || this.endSize
    this.startArrow = this.style.startArrow || this.startArrow
    this.endArrow = this.style.endArrow || this.endArrow
    this.rotation = this.style.rotation || this.rotation
    this.direction = this.style.direction || this.direction
    this.flipH = this.style.flipH || this.flipH
    this.flipV = this.style.flipV || this.flipV

    if (
      this.direction === 'north' ||
      this.direction === 'south'
    ) {
      const tmp = this.flipH
      this.flipH = this.flipV
      this.flipV = tmp
    }

    this.glass = this.style.glass || this.glass
    this.shadow = this.style.shadow || this.shadow
    this.dashed = this.style.dashed || this.dashed
    this.rounded = this.style.rounded || this.rounded

    if (this.fill === constants.NONE) {
      this.fill = null
    }

    if (this.gradientColor === constants.NONE) {
      this.gradientColor = null
    }

    if (this.stroke === constants.NONE) {
      this.stroke = null
    }
  }

  getCursor() {
    return this.cursor
  }

  setCursor(cursor?: string) {
    this.cursor = cursor != null ? cursor : ''
    if (this.elem != null) {
      this.elem.style.cursor = this.cursor
    }
  }

  hasClass(selector: string | null) {
    return util.hasClass(this.elem, selector)
  }

  addClass(selector: string | null) {
    return util.addClass(this.elem, selector)
  }

  removeClass(selector: string | null) {
    return util.removeClass(this.elem, selector)
  }

  toggleClass(selector: string | null) {
    return util.toggleClass(this.elem, selector)
  }

  protected isRoundable() {
    return false
  }

  // #region boundingBox

  updateBoundingBox() {
    if (this.useSvgBoundingBox && Private.isSvgElem(this.elem)) {
      try {
        const b = (this.elem as SVGGraphicsElement).getBBox()
        if (b.width > 0 && b.height > 0) {
          this.boundingBox = new Rectangle(b.x, b.y, b.width, b.height)
          this.boundingBox.grow(+this.strokeWidth * this.scale / 2)
          return
        }
      } catch (e) { }
    }

    if (this.bounds != null) {
      let bbox = this.createBoundingBox()
      if (bbox != null) {
        this.augmentBoundingBox(bbox)
        const rot = this.getShapeRotation()

        if (rot !== 0) {
          bbox = util.getBoundingBox(bbox, rot)
        }
      }

      this.boundingBox = bbox
    }
  }

  /**
   * Returns a new rectangle that represents the bounding box
   * of the bare shape with no shadows or strokewidths.
   */
  protected createBoundingBox() {
    const bbox = this.bounds.clone()

    if ((
      this.stencil != null && (
        this.direction === 'north' ||
        this.direction === 'south'
      )
    ) ||
      this.isPaintBoundsInverted()
    ) {
      bbox.rotate90()
    }

    return bbox
  }

  /**
   * Augments the bounding box with the strokewidth and shadow offsets.
   */
  protected augmentBoundingBox(bbox: Rectangle) {
    if (this.shadow) {
      bbox.width += Math.ceil(constants.SHADOW_OFFSET_X * this.scale)
      bbox.height += Math.ceil(constants.SHADOW_OFFSET_Y * this.scale)
    }

    bbox.grow(+this.strokeWidth * this.scale / 2)
  }

  /**
   * Returns true if the bounds should be inverted.
   */
  isPaintBoundsInverted() {
    return (
      this.stencil == null && (
        this.direction === 'north' ||
        this.direction === 'south'
      )
    )
  }

  // #endregion

  getRotation() {
    return (this.rotation != null) ? this.rotation : 0
  }

  getTextRotation() {
    let rot = this.getRotation()
    if (this.style.horizontal === false) {
      rot += -90
    }

    return rot
  }

  getShapeRotation() {
    const direction = this.direction
    let rotation = this.getRotation()

    // clockwise
    if (direction != null) {
      if (direction === 'north') {
        rotation += 270
      } else if (direction === 'west') {
        rotation += 180
      } else if (direction === 'south') {
        rotation += 90
      }
    }

    return rotation
  }

  private destoryed = false

  get disposed() {
    return this.destoryed
  }

  dispose() {
    if (this.destoryed) {
      return
    }

    if (this.elem != null) {
      DomEvent.release(this.elem as HTMLElement)
      if (this.elem.parentNode != null) {
        this.elem.parentNode.removeChild(this.elem)
      }

      this.elem = null
    }

    // Decrements refCount and removes unused
    this.releaseSvgGradients(this.oldGradients)
    this.oldGradients = null

    this.destoryed = true
  }
}

namespace Private {
  export function createSvgElement(tagName: string = 'g') {
    return document.createElementNS(constants.NS_SVG, tagName)
  }

  export function isSvgElem(elem: any) {
    return (
      elem != null &&
      (elem as SVGElement).ownerSVGElement != null
    )
  }
}

export namespace Shape {
  export type ShapeClass = new (...args: any[]) => Shape

  const shapes: { [name: string]: ShapeClass } = {}

  export function registerShape(name: string, ctor: ShapeClass) {
    if (shapes[name] != null) {
      throw new Error(`Shape with name '${name}' already registered.`)
    }

    shapes[name] = ctor
  }

  export function getShape(name?: string | null) {
    return name != null && shapes[name] || null
  }
}
