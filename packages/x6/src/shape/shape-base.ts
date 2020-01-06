import { NumberExt, Color } from '../util'
import { DomUtil, DomEvent } from '../dom'
import { Point, Rectangle } from '../geometry'
import { Disposable } from '../entity'
import * as images from '../assets/images'
import { globals } from '../option'
import { State } from '../core/state'
import { Stencil } from './stencil'
import { SvgCanvas2D } from '../canvas'
import { Style, Direction, Dialect, Margin } from '../types'
import { registerEntity } from '../registry/util'

export class Shape extends Disposable {
  state: State

  /**
   * Specifies if the shape is visible.
   */
  visible: boolean = true

  /**
   * Rendering hint for configuring the canvas.
   */
  antialiased: boolean = true

  /**
   * The dialect in which the shape is to be painted.
   */
  dialect: Dialect = 'svg'

  /**
   * The `Stencil` instance that defines the shape.
   */
  stencil: Stencil | null

  /**
   * Optional reference to the style of the corresponding `State`.
   */
  style: Style

  className?: string | null

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
   * Render facede for minimap
   */
  facade: boolean = false

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

  svgPointerEvents: string = 'all'

  /**
   * Allows to use the SVG bounding box in SVG.
   *
   * Default is `false` for performance reasons.
   */
  useSvgBoundingBox: boolean = false

  /**
   * Minimum stroke width.
   */
  minSvgStrokeWidth: number = 1

  /**
   * Event-tolerance for SVG strokes (in px).
   */
  svgStrokeTolerance: number = 8

  oldGradients: SvgCanvas2D.Gradients | null

  image: string | null

  indicatorShape: Shape.ShapeConstructor | null
  indicatorImage: string | null
  indicatorColor: string | null
  indicatorStrokeColor: string | null
  indicatorGradientColor: string | null
  indicatorDirection: Direction | null

  // style
  cursor?: string
  opacity: number
  rotation: number
  fillColor: string | null
  fillOpacity: number
  strokeColor: string | null
  strokeWidth: number
  strokeOpacity: number
  gradientColor: string | null
  gradientDirection?: Direction

  startArrow?: string
  endArrow?: string
  startSize?: number
  endSize?: number
  direction?: Direction | null

  spacing: number = 0

  flipH: boolean = false
  flipV: boolean = false
  glass: boolean = false
  dashed: boolean = false
  rounded: boolean = false

  shadow: boolean = false
  shadowColor: string = globals.defaultShadowColor
  shadowOpacity: number = globals.defaultShadowOpacity
  shadowOffsetX: number = globals.defaultShadowOffsetX
  shadowOffsetY: number = globals.defaultShadowOffsetY

  constructor(stencil?: Stencil) {
    super()
    this.stencil = stencil != null ? stencil : null
    this.style = {}
    this.initStyle()
  }

  initStyle() {
    this.rotation = 0
    this.opacity = 1
    this.fillOpacity = 1
    this.strokeWidth = 1
    this.strokeOpacity = 1
    this.flipH = false
    this.flipV = false
  }

  resetStyle() {
    this.initStyle()

    delete this.fillColor
    delete this.gradientColor
    delete this.gradientDirection
    delete this.strokeColor
    delete this.startSize
    delete this.endSize
    delete this.startArrow
    delete this.endArrow
    delete this.direction

    this.spacing = 0

    this.glass = false
    this.shadow = false
    this.dashed = false
    this.rounded = false
  }

  /**
   * Creaing the DOM node and adding it into the given container.
   */
  init(container: HTMLElement | SVGElement | null) {
    if (container != null) {
      if (this.elem == null) {
        this.elem = this.create(container)
      }
      container.appendChild(this.elem)
    }
  }

  redraw() {
    const elem = this.elem
    if (elem != null) {
      this.updateBoundsFromPoints()
      this.updateClassName()

      if (this.visible && this.isValidBounds()) {
        elem.style.visibility = ''
        this.clean()
        if (DomUtil.isSvgElement(elem)) {
          this.redrawSvgShape()
        } else {
          this.redrawHtmlShape()
        }
        this.updateBoundingBox()
      } else {
        elem.style.visibility = 'hidden'
        this.boundingBox = null
      }

      if (this.cursor) {
        this.setCursor(this.cursor)
      }
    }
  }

  protected create(container: HTMLElement | SVGElement) {
    return DomUtil.isSvgElement(container)
      ? this.createSvgGroup() // g
      : this.createHtmlDiv() // div
  }

  protected createSvgGroup(): SVGGElement {
    return DomUtil.createSvgElement('g') as SVGGElement
  }

  protected createHtmlDiv(): HTMLDivElement {
    const elem = DomUtil.createElement('div') as HTMLDivElement
    elem.style.position = 'absolute'
    return elem
  }

  protected clean() {
    if (this.elem != null) {
      if (DomUtil.isSvgElement(this.elem)) {
        DomUtil.empty(this.elem)
      } else {
        this.elem.style.cssText = 'position: absolute;'
        this.elem.innerHTML = ''
      }
    }
  }

  // #region draw html

  protected redrawHtmlShape() {
    const elem = this.elem as HTMLElement
    this.updateHtmlBounds(elem)
    this.updateHtmlFilters(elem)
    this.updateHtmlColors(elem)
  }

  protected updateHtmlBounds(elem: HTMLElement) {
    let sw = 0
    if (Color.isValid(this.strokeColor) && this.strokeWidth > 0) {
      sw = Math.ceil(this.strokeWidth * this.scale)
    }

    elem.style.overflow = 'hidden'
    elem.style.boxSizing = 'content-box'
    elem.style.borderWidth = `${sw}px`
    elem.style.left = `${Math.round(this.bounds.x - sw)}px`
    elem.style.top = `${Math.round(this.bounds.y - sw)}px`

    if (document.compatMode === 'CSS1Compat') {
      sw = -sw
    }

    const width = Math.round(Math.max(0, this.bounds.width + 2 * sw))
    const height = Math.round(Math.max(0, this.bounds.height + 2 * sw))

    elem.style.width = `${width}px`
    elem.style.height = `${height}px`
  }

  protected updateHtmlFilters(node: HTMLElement) {
    let filter = ''

    if (this.opacity < 1) {
      filter += `alpha(opacity=${this.opacity * 100})`
    }

    if (this.shadow) {
      filter +=
        'progid:DXImageTransform.Microsoft.dropShadow (' +
        `OffX='${Math.round(this.shadowOffsetX * this.scale)}',` +
        `OffY='${Math.round(this.shadowOffsetY * this.scale)}',` +
        `Color='${this.shadowColor}')`
    }

    if (Color.isValid(this.fillColor) && Color.isValid(this.gradientColor)) {
      let start = this.fillColor
      let end = this.gradientColor
      let type = '0'

      const lookup = { east: 0, south: 1, west: 2, north: 3 }
      let dir = this.direction != null ? lookup[this.direction] : 0
      if (this.gradientDirection != null) {
        dir = NumberExt.mod(dir + lookup[this.gradientDirection] - 1, 4)
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

      filter +=
        'progid:DXImageTransform.Microsoft.gradient(' +
        `startColorStr='${start}', ` +
        `endColorStr='${end}', ` +
        `gradientType='${type}')`
    }

    node.style.filter = filter
  }

  protected updateHtmlColors(node: HTMLElement) {
    let color = this.strokeColor

    if (Color.isValid(color)) {
      node.style.borderColor = color!

      if (this.dashed) {
        node.style.borderStyle = 'dashed'
      } else if (this.strokeWidth > 0) {
        node.style.borderStyle = 'solid'
      }

      const borderWidth = Math.max(1, Math.ceil(this.strokeWidth * this.scale))
      node.style.borderWidth = `${borderWidth}px`
    } else {
      node.style.borderWidth = '0px'
    }

    color = this.outline ? null : this.fillColor
    if (Color.isValid(color)) {
      node.style.backgroundColor = color!
      node.style.backgroundImage = 'none'
    } else if (this.pointerEvents) {
      node.style.backgroundColor = 'transparent'
    } else {
      this.setTransparentBackgroundImage(node)
    }
  }

  // #endregion

  // #region draw svg

  protected redrawSvgShape() {
    const canvas = this.createCanvas()
    if (canvas != null) {
      this.draw(canvas)
      if (this.elem != null && this.elem !== canvas.root) {
        this.elem.insertAdjacentHTML('beforeend', canvas.root.outerHTML)
      }
      this.destroyCanvas(canvas)
    }
  }

  protected createCanvas() {
    let canvas: SvgCanvas2D | null = null

    if (DomUtil.isSvgElement(this.elem)) {
      canvas = this.createSvgCanvas()
    }

    // draw outline
    if (canvas != null && this.outline) {
      canvas.setStrokeWidth(this.strokeWidth)
      canvas.setStrokeColor(this.strokeColor)
      if (this.dashed != null) {
        canvas.setDashed(this.dashed)
      }

      canvas.setStrokeWidth = () => {}
      canvas.setStrokeColor = () => {}
      canvas.setDashed = () => {}

      canvas.setFillColor = () => {}
      canvas.setGradient = () => {}
      canvas.drawText = () => {}
    }

    return canvas
  }

  // protected getSvgScreenOffset(): number {
  //   let sw =
  //     this.stencil && this.stencil.strokeWidth !== -1
  //       ? this.stencil.strokeWidth
  //       : this.strokeWidth
  //   sw = Math.max(1, Math.round(sw * this.scale))
  //   return util.mod(sw, 2) === 1 ? 0.5 : 0
  // }

  protected createSvgCanvas() {
    const elem = this.elem as SVGElement
    const canvas = new SvgCanvas2D(elem, false)
    canvas.minStrokeWidth = this.minSvgStrokeWidth
    canvas.strokeTolerance = this.pointerEvents ? this.svgStrokeTolerance : 0
    canvas.pointerEvents = this.pointerEvents
    canvas.pointerEventsValue = this.svgPointerEvents

    // const offset = this.getSvgScreenOffset()
    // if (offset !== 0) {
    //   elem.setAttribute('transform', `translate(${offset},${offset})`)
    // } else {
    //   elem.removeAttribute('transform')
    // }

    if (!this.antialiased) {
      canvas.format = (val: any) => Math.round(parseFloat(val))
    }

    return canvas
  }

  protected destroyCanvas(canvas: SvgCanvas2D) {
    if (canvas instanceof SvgCanvas2D) {
      for (const key in canvas.gradients) {
        const gradient = canvas.gradients[key]
        if (gradient != null) {
          const refCount = this.getGradientRefConut(gradient) + 1
          this.setGradientRefConut(gradient, refCount)
        }
      }

      this.destroySvgGradients(this.oldGradients)
      this.oldGradients = canvas.gradients
    }
  }

  protected destroySvgGradients(gradients: SvgCanvas2D.Gradients | null) {
    if (gradients != null) {
      Object.keys(gradients).forEach(key => {
        const gradient = gradients[key]
        if (gradient != null) {
          let refCount = this.getGradientRefConut(gradient)
          refCount = refCount > 0 ? refCount - 1 : 0
          this.setGradientRefConut(gradient, refCount)
          if (refCount === 0) {
            DomUtil.remove(gradient)
          }
        }
      })
    }
  }

  protected getGradientRefConut(gradient: SVGGradientElement) {
    return ((gradient as any).refCount || 0) as number
  }

  protected setGradientRefConut(gradient: SVGGradientElement, count: number) {
    const elem = gradient as any
    elem.refCount = count
  }

  draw(c: SvgCanvas2D, update?: boolean) {
    let outlineDrawn = false

    // draw outline
    if (c != null && this.outline) {
      const stroke = c.stroke
      const fillAndStroke = c.fillAndStroke

      c.stroke = (...args) => {
        outlineDrawn = true
        stroke.apply(c, args)
      }

      c.fillAndStroke = (...args) => {
        outlineDrawn = true
        fillAndStroke.apply(c, args)
      }
    }

    // Scale is passed-through to canvas
    const s = this.scale
    let x = this.bounds.x / s
    let y = this.bounds.y / s
    let w = this.bounds.width / s
    let h = this.bounds.height / s

    if (this.drawBoundsInverted()) {
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
    const bg = this.drawGhostBackground()

    if (this.stencil != null) {
      this.stencil.drawShape(c, this, x, y, w, h)
    } else {
      // Stencils have separate strokewidth
      c.setStrokeWidth(this.strokeWidth)

      if (this.points != null) {
        const pts: Point[] = []
        this.points.forEach(p => {
          if (p != null) {
            pts.push(new Point(p.x / s, p.y / s))
          }
        })
        this.drawEdgeShape(c, pts)
      } else {
        this.drawNodeShape(c, x, y, w, h)
      }
    }

    if (bg != null && c.state != null && c.state.transform != null) {
      bg.setAttribute('transform', c.state.transform)
    }

    // Draw a highlight rectangle if no stroke was used
    if (this.outline && !outlineDrawn) {
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
    c.setOpacity(this.opacity)
    c.setFillOpacity(this.fillOpacity)
    c.setStrokeOpacity(this.strokeOpacity)

    if (this.shadow != null) {
      c.setShadow(this.shadow)
      c.setShadowColor(this.shadowColor)
      c.setShadowOpacity(this.shadowOpacity)
      c.setShadowOffset(this.shadowOffsetX, this.shadowOffsetY)
    }

    // Dash
    if (this.dashed != null) {
      c.setDashed(this.dashed, this.style.fixDash ? true : false)
    }

    const dash = this.style.dashPattern
    if (dash != null) {
      c.setDashPattern(dash)
    }

    if (Color.isValid(this.fillColor) && Color.isValid(this.gradientColor)) {
      const b = this.getGradientBounds(c, x, y, w, h)
      c.setGradient(
        this.fillColor!,
        this.gradientColor!,
        b.x,
        b.y,
        b.width,
        b.height,
        this.gradientDirection!,
      )
    } else {
      c.setFillColor(this.fillColor)
    }

    c.setStrokeColor(this.strokeColor)
  }

  /**
   * Create a transparent rectangle that catches all events.
   */
  protected drawGhostBackground() {
    let rect = null

    if (
      (this.stencil == null &&
        this.points == null &&
        this.shapePointerEvents) ||
      (this.stencil != null && this.stencilPointerEvents)
    ) {
      if (this.dialect === 'svg') {
        const bbox = this.createBoundingBox()
        rect = DomUtil.createSvgElement('rect')
        DomUtil.setAttributes(rect, {
          x: bbox.x,
          y: bbox.y,
          width: bbox.width,
          height: bbox.height,
          fill: 'none',
          stroke: 'none',
          'pointer-events': 'all',
        })

        this.elem!.appendChild(rect)
      }
    }

    return rect
  }

  protected drawEdgeShape(c: SvgCanvas2D, points: Point[]) {}

  protected drawNodeShape(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    this.drawBackground(c, x, y, w, h)
    if (!this.outline || this.style == null || !this.style.backgroundOutline) {
      c.setShadow(false)
      this.drawForeground(c, x, y, w, h)
    }
  }

  drawBackground(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {}

  drawForeground(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {}

  drawGlassEffect(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
    arc: number,
  ) {
    const sw = Math.ceil(this.strokeWidth / 2)
    const size = 0.4

    c.setGradient('#ffffff', '#ffffff', x, y, w, h * 0.6, 'south', 0.9, 0.1)

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

  drawPoints(
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

      while (i < (close ? points.length : points.length - 1)) {
        let tmp = points[NumberExt.mod(i, points.length)]
        let dx = pt.x - tmp.x
        let dy = pt.y - tmp.y

        if (
          rounded &&
          (dx !== 0 || dy !== 0) &&
          (exclude == null || exclude.indexOf(i - 1) < 0)
        ) {
          // Draws a line from the last point to the current
          // point with a spacing of size off the current point
          // into direction of the last point
          let dist = Math.sqrt(dx * dx + dy * dy)
          const nx1 = (dx * Math.min(arcSize, dist / 2)) / dist
          const ny1 = (dy * Math.min(arcSize, dist / 2)) / dist

          const x1 = tmp.x + nx1
          const y1 = tmp.y + ny1
          c.lineTo(x1, y1)

          // Draws a curve from the last point to the current
          // point with a spacing of size off the current point
          // into direction of the next point
          let next = points[NumberExt.mod(i + 1, points.length)]

          // Uses next non-overlapping point
          while (
            i < points.length - 2 &&
            Math.round(next.x - tmp.x) === 0 &&
            Math.round(next.y - tmp.y) === 0
          ) {
            next = points[NumberExt.mod(i + 2, points.length)]
            i += 1
          }

          dx = next.x - tmp.x
          dy = next.y - tmp.y

          dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))
          const nx2 = (dx * Math.min(arcSize, dist / 2)) / dist
          const ny2 = (dy * Math.min(arcSize, dist / 2)) / dist

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

  // #region label

  getLabelBounds(rect: Rectangle) {
    const direction = (this.style.direction || 'east') as Direction

    let bounds = rect

    if (
      direction !== 'south' &&
      direction !== 'north' &&
      this.state != null &&
      this.state.text != null &&
      this.state.text.drawBoundsInverted()
    ) {
      bounds = bounds.clone()
      const tmp = bounds.width
      bounds.width = bounds.height
      bounds.height = tmp
    }

    // Normalizes argument for getLabelMargins hook
    const margin = this.getLabelMargins(bounds)
    if (margin != null) {
      let flipH = State.isFlipH(this.style)
      let flipV = State.isFlipV(this.style)

      // Handles special case for vertical labels
      if (
        this.state != null &&
        this.state.text != null &&
        this.state.text.drawBoundsInverted()
      ) {
        const m = margin.left
        margin.left = margin.bottom
        margin.bottom = margin.right
        margin.right = margin.top
        margin.top = m

        const f = flipH
        flipH = flipV
        flipV = f
      }

      return State.getDirectedBounds(this.state, rect, margin, flipH, flipV)
    }

    return rect
  }

  /**
   * Returns the scaled top, left, bottom and right margin
   * to be used for computing the label bounds.
   */
  getLabelMargins(rect: Rectangle): Margin | null {
    return null
  }

  // #endregion

  // #region boundingBox

  updateBoundingBox() {
    if (this.useSvgBoundingBox && DomUtil.isSvgElement(this.elem)) {
      try {
        const b = (this.elem as SVGGraphicsElement).getBBox()
        if (b.width > 0 && b.height > 0) {
          this.boundingBox = new Rectangle(b.x, b.y, b.width, b.height)
          this.boundingBox.inflate((this.strokeWidth * this.scale) / 2)
          return
        }
      } catch (e) {}
    }

    if (this.bounds != null) {
      let bbox = this.createBoundingBox()
      if (bbox != null) {
        this.augmentBoundingBox(bbox)
        const rot = this.getShapeRotation()
        if (rot !== 0) {
          bbox = bbox.rotate(rot)
        }
      }

      this.boundingBox = bbox
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

  /**
   * Returns a new rectangle that represents the bounding box
   * of the bare shape with no shadows or strokeWidth.
   */
  protected createBoundingBox() {
    const bbox = this.bounds.clone()
    if (
      (this.stencil != null &&
        (this.direction === 'north' || this.direction === 'south')) ||
      this.drawBoundsInverted()
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
      bbox.width += Math.ceil(this.shadowOffsetX * this.scale)
      bbox.height += Math.ceil(this.shadowOffsetY * this.scale)
    }

    bbox.inflate((this.strokeWidth * this.scale) / 2)
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
   * Returns true if the bounds should be inverted.
   */
  drawBoundsInverted() {
    return (
      this.stencil == null &&
      (this.direction === 'north' || this.direction === 'south')
    )
  }

  // #endregion

  apply(state: State) {
    this.state = state
    this.style = state.style // keeps a reference to style

    this.opacity = this.style.opacity || this.opacity
    this.spacing = this.style.spacing || this.spacing
    this.rotation = this.style.rotation || this.rotation
    this.direction = this.style.direction || this.direction

    this.fillColor = this.style.fill || this.fillColor
    this.fillOpacity = this.style.fillOpacity || this.fillOpacity
    this.gradientColor = this.style.gradientColor || this.gradientColor
    this.gradientDirection =
      this.style.gradientDirection || this.gradientDirection

    this.strokeColor = this.style.stroke || this.strokeColor
    this.strokeWidth = this.style.strokeWidth || this.strokeWidth
    this.strokeOpacity = this.style.strokeOpacity || this.strokeOpacity

    this.startArrow = this.style.startArrow || this.startArrow
    this.startSize = this.style.startSize || this.startSize
    this.endArrow = this.style.endArrow || this.endArrow
    this.endSize = this.style.endSize || this.endSize

    this.flipH = this.style.flipH || this.flipH
    this.flipV = this.style.flipV || this.flipV

    if (this.direction === 'north' || this.direction === 'south') {
      const tmp = this.flipH
      this.flipH = this.flipV
      this.flipV = tmp
    }

    this.glass = this.style.glass || this.glass
    this.shadow = this.style.shadow || this.shadow
    this.dashed = this.style.dashed || this.dashed
    this.rounded = this.style.rounded || this.rounded

    if (this.fillColor === 'none') {
      this.fillColor = null
    }

    if (this.gradientColor === 'none') {
      this.gradientColor = null
    }

    if (this.strokeColor === 'none') {
      this.strokeColor = null
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
    return DomUtil.hasClass(this.elem, selector)
  }

  addClass(selector: string | null) {
    return DomUtil.addClass(this.elem, selector)
  }

  removeClass(selector: string | null) {
    return DomUtil.removeClass(this.elem, selector)
  }

  toggleClass(selector: string | null) {
    return DomUtil.toggleClass(this.elem, selector)
  }

  updateClassName() {
    if (this.elem != null) {
      this.elem.setAttribute('class', this.className || '')
    }
  }

  isHtmlAllowed() {
    return false
  }

  isRoundable() {
    return false
  }

  /**
   * Sets a transparent background CSS style to catch all events.
   */
  setTransparentBackgroundImage(elem: HTMLElement | SVGElement) {
    elem.style.backgroundImage = `url('${images.transparent.src}')`
  }

  getRotation() {
    return this.rotation != null ? this.rotation : 0
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

  getArcSize(w: number, h: number, f?: number) {
    let size = 0

    const absoluteArcSize = this.style.absoluteArcSize
    if (absoluteArcSize) {
      size = Math.min(w / 2, Math.min(h / 2, this.getLineArcSize()))
    } else {
      const f = (this.style.arcSize || globals.rectangleRoundFactor * 100) / 100
      size = Math.min(w * f, h * f)
    }

    return size
  }

  getLineArcSize() {
    return (this.style.arcSize || globals.defaultLineArcSize) / 2
  }

  @Disposable.dispose()
  dispose() {
    if (this.elem != null) {
      DomEvent.release(this.elem as HTMLElement)
      DomUtil.remove(this.elem)
      this.elem = null
    }

    // Decrements refCount and removes unused
    this.destroySvgGradients(this.oldGradients)
    this.oldGradients = null
  }
}

export namespace Shape {
  export type ShapeConstructor = new (...args: any[]) => Shape

  const shapes: { [name: string]: ShapeConstructor } = {}

  export function register(
    name: string,
    ctor: ShapeConstructor,
    force: boolean = false,
  ) {
    registerEntity(shapes, name, ctor, force, () => {
      throw new Error(`Shape with name '${name}' already registered.`)
    })
  }

  export function getShape(name?: string | null) {
    return (name != null && shapes[name]) || null
  }

  export function getShapeNames() {
    return Object.keys(shapes)
  }
}

export namespace Shape {
  export function applyClassName(
    shape: Shape | HTMLElement,
    prefix: string,
    native?: string,
    manual?: string,
  ) {
    let className = ''
    if (native) {
      className += `${prefix}-${native}`
    }
    if (manual) {
      className += ` ${manual}`
    }

    if (className.length > 0) {
      shape.className = className
      if (shape instanceof Shape && shape.elem) {
        shape.elem.setAttribute('class', className)
      }
    }
  }
}
