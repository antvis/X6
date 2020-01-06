import { Angle, Point, Rectangle } from '../geometry'
import { State } from '../core/state'
import { Graph } from '../graph'
import { MouseEventEx } from './mouse-event'
import { globals } from '../option/global'
import { Image } from '../struct'
import { Shape, ImageShape, EllipseShape } from '../shape'

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
    this.shapeName = options.shape || 'ellipse'
    this.size = options.size || 8
    this.stroke = options.stroke || globals.defaultPrimaryColor
    this.strokeWidth = options.strokeWidth != null ? options.strokeWidth : 1
    this.dashed = options.dashed === true || false
    this.fill = options.fill || globals.defaultPrimaryColor
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
    const ctor = (name && Shape.getShape(name)) || EllipseShape
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

    MouseEventEx.redirectMouseEvents(this.shape.elem!, this.graph, this.state)

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
    this.graph.updateCellsStyle(key, (this.state.style as any)[key], [
      this.state.cell,
    ])
  }

  processEvent(e: MouseEventEx) {
    const s = this.graph.view.scale
    const t = this.graph.view.translate
    let p = new Point(e.getGraphX() / s - t.x, e.getGraphY() / s - t.y)

    // Center shape on mouse cursor
    if (this.shape != null && this.shape.bounds != null) {
      p.x -= this.shape.bounds.width / s / 4
      p.y -= this.shape.bounds.height / s / 4
    }

    // Snaps to grid for the rotated position then applies the
    // rotation for the direction after that
    const rad1 = -Angle.toRad(this.getRotation())
    const rad2 = -Angle.toRad(this.getTotalRotation()) - rad1
    p = this.flipPoint(
      this.rotatePoint(
        this.snapPoint(
          this.rotatePoint(p, rad1),
          this.ignoreGrid || !this.graph.isGridEnabledForEvent(e.getEvent()),
        ),
        rad2,
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
        const rad = Angle.toRad(this.getTotalRotation())
        p = this.rotatePoint(this.flipPoint(p), rad)

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
    return State.hasHtmlLabel(this.state)
  }

  /**
   * Rotates the point by the given angle.
   */
  protected rotatePoint(pt: Point, deg: number) {
    const bounds = this.state.getCellBounds()
    const cx = bounds.getCenter()
    return Point.rotate(pt, deg, cx)
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
    image?: Image
    shape?: string
    size?: number
    stroke?: string
    strokeWidth?: number
    dashed?: boolean
    fill?: string
    opacity?: number
    cursor?: string
    ignoreGrid?: boolean
  }

  /**
   * Index for the label handle in an MouseEvent. This should be a negative
   * value that does not interfere with any possible handle indices.
   *
   * Default is -1.
   */
  export const LABEL_HANDLE = -1

  export function getLabelHandle() {
    return LABEL_HANDLE
  }

  export function isLabelHandle(index: number) {
    return LABEL_HANDLE === index
  }

  /**
   * Index for the rotation handle in an MouseEvent. This should be a
   * negative value that does not interfere with any possible handle indices.
   *
   * Default is -2.
   */
  export const ROTATION_HANDLE = -2

  export function getRotationHandle() {
    return ROTATION_HANDLE
  }

  export function isRotationHandle(index: number) {
    return ROTATION_HANDLE === index
  }

  /**
   * Start index for the custom handles in an MouseEvent. This should be a
   * negative value and is the start index which is decremented for each
   * custom handle.
   *
   * Default is -100.
   */
  export const CUSTOM_HANDLE = -100

  export function isCustomHandle(index: number | null) {
    return index != null && index <= CUSTOM_HANDLE && index > VIRTUAL_HANDLE
  }

  export function getCustomHandle(index: number) {
    return CUSTOM_HANDLE - index
  }

  /**
   * Start index for the virtual handles in an MouseEvent. This should be a
   * negative value and is the start index which is decremented for each
   * virtual handle.
   *
   * Default is -100000. This assumes that there are no more
   * than VIRTUAL_HANDLE - CUSTOM_HANDLE custom handles.
   */
  export const VIRTUAL_HANDLE = -100000

  export function isVisualHandle(index: number | null) {
    return index != null && index <= VIRTUAL_HANDLE
  }

  export function getVisualHandle(index: number) {
    return VIRTUAL_HANDLE - index
  }
}
