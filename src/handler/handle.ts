import * as util from '../util'
import { Graph, State } from '../core'
import { Shape, ImageShape, RectangleShape } from '../shape'
import { Rectangle, Point, Image } from '../struct'
import { MouseEventEx, constants } from '../common'

export class Handle {
  graph: Graph
  state: State
  cursor: string = 'default'
  image: Image | null
  shape: Shape
  ignoreGrid = false

  constructor(state: State, cursor?: string, image?: Image) {
    this.graph = state.view.graph
    this.state = state
    if (cursor != null) {
      this.cursor = cursor
    }

    if (image) {
      this.image = image
    }

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
    return new RectangleShape(
      new Rectangle(
        0,
        0,
        constants.HANDLE_SIZE,
        constants.HANDLE_SIZE,
      ),
      constants.HANDLE_FILLCOLOR,
      constants.HANDLE_STROKECOLOR,
    )
  }

  initShape(isHtml?: boolean) {
    if (isHtml && this.shape.isHtmlAllowed()) {
      this.shape.dialect = 'html'
      this.shape.init(this.graph.container)
    } else {
      this.shape.dialect = 'svg'

      if (this.cursor != null) {
        this.shape.init(this.graph.view.getOverlayPane()!)
      }
    }

    MouseEventEx.redirectMouseEvents(
      this.shape.elem!,
      this.graph,
      this.state,
    )

    this.shape.elem!.style.cursor = this.cursor
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
    const scale = this.graph.view.scale
    const tr = this.graph.view.translate
    let pt = new Point(
      e.getGraphX() / scale - tr.x,
      e.getGraphY() / scale - tr.y,
    )

    // Center shape on mouse cursor
    if (this.shape != null && this.shape.bounds != null) {
      pt.x -= this.shape.bounds.width / scale / 4
      pt.y -= this.shape.bounds.height / scale / 4
    }

    // Snaps to grid for the rotated position then applies the
    // rotation for the direction after that
    const alpha1 = -util.toRad(this.getRotation())
    const alpha2 = -util.toRad(this.getTotalRotation()) - alpha1
    pt = this.flipPoint(
      this.rotatePoint(
        this.snapPoint(
          this.rotatePoint(pt, alpha1),
          this.ignoreGrid || !this.graph.isGridEnabledForEvent(e.getEvent()),
        ),
        alpha2,
      ),
    )

    this.setPosition(this.state.getPaintBounds(), pt, e)
    this.positionChanged()
    this.redraw()
  }

  /**
   * Called after <setPosition> has been called in <processEvent>. This repaints
   * the state using <mxCellRenderer>.
   */
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
      let pt = this.getPosition(this.state.getPaintBounds())
      if (pt != null) {
        const alpha = util.toRad(this.getTotalRotation())
        pt = this.rotatePoint(this.flipPoint(pt), alpha)

        const scale = this.graph.view.scale
        const tr = this.graph.view.translate
        this.shape.bounds.x = Math.floor((pt.x + tr.x) * scale - this.shape.bounds.width / 2)
        this.shape.bounds.y = Math.floor((pt.y + tr.y) * scale - this.shape.bounds.height / 2)

        // Needed to force update of text bounds
        this.shape.redraw()
      }
    }
  }

  /**
   * Returns true if this handle should be rendered in HTML. This returns
   * true if the text node is in the graph container.
   */
  protected isHtmlRequired() {
    if (this.state.text != null) {
      return this.state.text.elem!.parentNode === this.graph.container
    }
    return false
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
  protected flipPoint(pt: Point) {
    if (this.state.shape != null) {
      const bounds = this.state.getCellBounds()

      if (this.state.shape.flipH) {
        pt.x = 2 * bounds.x + bounds.width - pt.x
      }

      if (this.state.shape.flipV) {
        pt.y = 2 * bounds.y + bounds.height - pt.y
      }
    }

    return pt
  }

  protected snapPoint(pt: Point, ignore?: boolean) {
    if (!ignore) {
      pt.x = this.graph.snap(pt.x)
      pt.y = this.graph.snap(pt.y)
    }

    return pt
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

  destroy() {
    if (this.shape != null) {
      this.shape.dispose()
      delete this.shape
    }
  }
}
