import * as util from '../util'
import { Graph, State } from '../core'
import { MouseEventEx } from '../common'
import { COLOR_PRIMARY } from '../option/preset'
import { Shape, ImageShape, EllipseShape } from '../shape'
import { Rectangle, Point, Image, ShapeNames } from '../struct'

export class Handle {
  graph: Graph
  state: State
  shape: Shape
  active: boolean

  ignoreGrid: boolean
  image: Image | null
  shapeName: string
  size: number
  stroke: string
  strokeWidth: number
  dashed: boolean
  fill: string
  opacity: number
  cursor: string | null

  constructor(state: State, options: Handle.Options) {
    this.graph = state.view.graph
    this.state = state

    this.ignoreGrid = options.ignoreGrid === true || false
    this.image = options.image || null
    this.shapeName = options.shape || ShapeNames.ellipse
    this.size = options.size || 8
    this.stroke = options.stroke || COLOR_PRIMARY
    this.strokeWidth = options.strokeWidth != null ? options.strokeWidth : 1
    this.dashed = options.dashed === true || false
    this.fill = options.fill || COLOR_PRIMARY
    this.opacity = options.opacity != null ? options.opacity : 1
    this.cursor = options.cursor || null

    this.init()
  }

  init() {
    const isHtml = this.isHtmlRequired()
    if (this.image != null) {
      const shape = new ImageShape(
        new Rectangle(0, 0, this.image.width, this.image.height),
        this.image.src,
      )
      shape.preserveImageAspect = false
      this.shape = shape
    } else {
      this.shape = this.createShape(isHtml)
    }

    this.initShape(isHtml)
  }

  createShape(isHtml?: boolean) {
    const name = this.shapeName
    const ctor = name && Shape.getShape(name) || EllipseShape
    const shape = new ctor() as Shape
    shape.bounds = new Rectangle(0, 0, this.size, this.size)
    return shape
  }

  initShape(isHtml?: boolean) {
    if (isHtml && this.shape.isHtmlAllowed()) {
      this.shape.dialect = 'html'
      this.shape.init(this.graph.container)
    } else {
      this.shape.dialect = 'svg'
      this.shape.init(this.graph.view.getOverlayPane())
    }

    MouseEventEx.redirectMouseEvents(
      this.shape.elem!,
      this.graph,
      this.state,
    )

    this.shape.elem!.style.cursor = this.cursor || ''
  }

  getPosition(bounds: Rectangle): Point {
    throw new Error('Method not implemented.')
  }

  setPosition(bounds: Rectangle, p: Point, e: MouseEventEx) {
    throw new Error('Method not implemented.')
  }

  execute() {
    throw new Error('Method not implemented.')
  }

  copyStyle(key: string) {
    this.graph.updateCellsStyle(
      key,
      (this.state.style as any)[key],
      [this.state.cell],
    )
  }

  processEvent(e: MouseEventEx) {
    const s = this.graph.view.scale
    const t = this.graph.view.translate
    let p = new Point(
      e.getGraphX() / s - t.x,
      e.getGraphY() / s - t.y,
    )

    // Center shape on mouse cursor
    if (this.shape != null && this.shape.bounds != null) {
      p.x -= this.shape.bounds.width / s / 4
      p.y -= this.shape.bounds.height / s / 4
    }

    // Snaps to grid for the rotated position then applies the
    // rotation for the direction after that
    const alpha1 = -util.toRad(this.getRotation())
    const alpha2 = -util.toRad(this.getTotalRotation()) - alpha1
    p = this.flipPoint(
      this.rotatePoint(
        this.snapPoint(
          this.rotatePoint(p, alpha1),
          this.ignoreGrid || !this.graph.isGridEnabledForEvent(e.getEvent()),
        ),
        alpha2,
      ),
    )

    this.setPosition(this.state.getPaintBounds(), p, e)
    this.positionChanged()
    this.redraw()
  }

  positionChanged() {
    if (this.state.text != null) {
      this.state.text.apply(this.state)
    }

    if (this.state.shape != null) {
      this.state.shape.apply(this.state)
    }

    this.graph.renderer.redraw(this.state, true)
  }

  /**
   * Returns the rotation defined in the style of the cell.
   */
  getRotation() {
    if (this.state.shape != null) {
      return this.state.shape.getRotation()
    }

    return 0
  }

  /**
   * Returns the rotation from the style and the rotation from
   * the direction of the cell.
   */
  getTotalRotation() {
    if (this.state.shape != null) {
      return this.state.shape.getShapeRotation()
    }

    return 0
  }

  /**
   * Renders the shape for this handle.
   */
  redraw() {
    if (this.shape != null && this.state.shape != null) {
      let p = this.getPosition(this.state.getPaintBounds())
      if (p != null) {
        const alpha = util.toRad(this.getTotalRotation())
        p = this.rotatePoint(this.flipPoint(p), alpha)

        const s = this.graph.view.scale
        const t = this.graph.view.translate
        const x = Math.floor((p.x + t.x) * s - this.shape.bounds.width / 2)
        const y = Math.floor((p.y + t.y) * s - this.shape.bounds.height / 2)
        this.shape.bounds.x = x
        this.shape.bounds.y = y
        this.shape.redraw()
      }
    }
  }

  /**
   * Returns true if this handle should be rendered in HTML. This returns
   * true if the text node is in the graph container.
   */
  protected isHtmlRequired() {
    return util.hasHtmlLabel(this.state)
  }

  /**
   * Rotates the point by the given angle.
   */
  protected rotatePoint(pt: Point, deg: number) {
    const bounds = this.state.getCellBounds()
    const cx = bounds.getCenter()
    return util.rotatePoint(pt, deg, cx)
  }

  /**
   * Flips the given point vertically and/or horizontally.
   */
  protected flipPoint(p: Point) {
    if (this.state.shape != null) {
      const bounds = this.state.getCellBounds()

      if (this.state.shape.flipH) {
        p.x = 2 * bounds.x + bounds.width - p.x
      }

      if (this.state.shape.flipV) {
        p.y = 2 * bounds.y + bounds.height - p.y
      }
    }

    return p
  }

  protected snapPoint(p: Point, ignore?: boolean) {
    if (!ignore) {
      p.x = this.graph.snap(p.x)
      p.y = this.graph.snap(p.y)
    }

    return p
  }

  setVisible(visible: boolean) {
    if (this.shape != null && this.shape.elem != null) {
      this.shape.elem.style.display = visible ? '' : 'none'
    }
  }

  reset() {
    this.setVisible(true)
    this.state.style = this.graph.getCellStyle(this.state.cell)
    this.positionChanged()
  }

  dispose() {
    if (this.shape != null) {
      this.shape.dispose()
      delete this.shape
    }
  }
}

export namespace Handle {
  export interface Options {
    ignoreGrid?: boolean
    image?: Image
    shape?: string
    size?: number
    stroke?: string
    strokeWidth?: number
    dashed?: boolean
    fill?: string
    opacity?: number
    cursor?: string
  }
}
