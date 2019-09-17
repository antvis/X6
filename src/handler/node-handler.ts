import * as util from '../util'
import { Cell, State, Graph } from '../core'
import { Rectangle, Point } from '../struct'
import { constants, DomEvent, MouseEventEx, detector } from '../common'
import { Shape, RectangleShape } from '../shape'
import { Handle } from './handle'
import { EdgeHandler } from './edge-handler'
import { MouseHandler } from './handler-mouse'
import {
  applySelectionPreviewStyle,
  createResizeHandle,
  createRotationHandle,
  createLabelHandle,
  getLabelHandleCursor,
  getLabelHandleOffset,
  applyResizePreviewStyle,
  applyRotatePreviewStyle,
  ResizeOption,
  ResizeHandleOptions,
  RotateOptions,
  getRotationHandleOffset,
  getRotationHandleCursor,
} from '../option'

export class NodeHandler extends MouseHandler {
  graph: Graph
  state: State
  startX: number
  startY: number

  /**
   * The index of the current handle.
   */
  index: number | null = null

  /**
   * Specifies if only one sizer handle at the bottom, right corner should be
   * used.
   *
   * Default is `false`.
   */
  singleResizeHandle: boolean = false

  /**
   * Specifies if the bounds of handles should be used for hit-detection
   * in IE or if `tolerance > 0`.
   *
   * Default is `true`.
   */
  checkHandleBounds: boolean = true

  /**
   * Specifies if sizers should be hidden and spaced if the node is small.
   *
   * Default is `false`.
   */
  manageHandles: boolean = false

  /**
   * Optional tolerance for hit-detection.
   *
   * Default is `0`.
   */
  tolerance: number = 0

  /**
   * Specifies if rotation steps should be "rasterized" depening on the
   * distance to the handle.
   *
   * Default is `true`.
   */
  rotationRaster: boolean = true

  /**
   * Specifies if the parent should be highlighted if a child cell is selected.
   *
   * Default is `false`.
   */
  parentHighlightable: boolean = false

  /**
   * Specifies if the size of groups should be constrained by the children.
   *
   * Default is `false`.
   */
  constrainGroupByChildren: boolean = false

  resizeLivePreview: boolean = false
  rotateLivePreview: boolean = false

  private escapeHandler: (() => void) | null
  protected horizontalOffset: number = 0
  protected verticalOffset: number = 0
  protected x0: number
  protected y0: number

  protected bounds: Rectangle
  protected selectionBounds: Rectangle
  protected minBounds: Rectangle | null
  protected unscaledBounds: Rectangle | null

  protected selectionShape: RectangleShape | null
  protected previewShape: RectangleShape | null
  protected parentHighlight: RectangleShape | null
  protected handles: (Shape)[] | null
  protected labelShape: Shape | null
  protected rotationShape: Shape
  protected customHandles: Handle[] | null
  protected edgeHandlers: EdgeHandler[] | null

  protected inTolerance: boolean
  protected childOffsetX: number
  protected childOffsetY: number
  protected parentState: State | null
  protected currentAlpha: number | null

  constructor(graph: Graph, state: State) {
    super(graph)
    this.state = state
    this.config()
    this.init()
    this.escapeHandler = () => {
      if (
        (this.rotateLivePreview || this.resizeLivePreview) &&
        this.index != null
      ) {
        this.redrawLivePreview()
      }

      this.reset()
    }

    this.state.view.graph.on(Graph.events.escape, this.escapeHandler)
  }

  protected config() {
    const options = this.graph.options

    const resize = options.resize as ResizeOption
    this.manageHandles = resize.manageHandles
    this.resizeLivePreview = resize.livePreview

    const resizeHandle = options.resizeHandle as ResizeHandleOptions
    this.singleResizeHandle = resizeHandle.single

    const rotate = options.rotate as RotateOptions
    this.rotateLivePreview = rotate.livePreview
    this.rotationRaster = rotate.rasterized
  }

  protected init() {
    this.initSelectionShape()
    this.initHandles()
    this.redraw()

    if (this.constrainGroupByChildren) {
      this.updateMinBounds()
    }
  }

  protected initSelectionShape() {
    this.selectionBounds = this.getSelectionBounds(this.state)
    this.bounds = this.selectionBounds.clone()
    this.selectionShape = this.createSelectionShape(this.bounds)

    this.selectionShape.dialect = 'svg'
    this.selectionShape.pointerEvents = false
    this.selectionShape.rotation = util.getRotation(this.state)
    this.selectionShape.init(this.graph.view.getOverlayPane())

    MouseEventEx.redirectMouseEvents(
      this.selectionShape.elem!,
      this.graph,
      this.state,
    )

    if (this.graph.isCellMovable(this.state.cell)) {
      this.selectionShape.setCursor(constants.CURSOR_MOVABLE_NODE)
    }
  }

  protected initHandles() {
    this.handles = []

    // Adds the sizer handles
    const maxCells = this.graph.graphHandler.maxCellCount || 0
    if (maxCells <= 0 || this.graph.getSelecedCellCount() < maxCells) {
      const resizable = this.graph.isCellResizable(this.state.cell)
      const labelMovable = this.graph.isLabelMovable(this.state.cell)

      if (resizable || (
        labelMovable &&
        this.state.bounds.width >= 2 &&
        this.state.bounds.height >= 2
      )) {
        let i = 0

        if (resizable) {
          if (!this.singleResizeHandle) {
            this.handles.push(this.createHandle(i, 'nw-resize'))
            i += 1
            this.handles.push(this.createHandle(i, 'n-resize'))
            i += 1
            this.handles.push(this.createHandle(i, 'ne-resize'))
            i += 1
            this.handles.push(this.createHandle(i, 'w-resize'))
            i += 1
            this.handles.push(this.createHandle(i, 'e-resize'))
            i += 1
            this.handles.push(this.createHandle(i, 'sw-resize'))
            i += 1
            this.handles.push(this.createHandle(i, 's-resize'))
            i += 1
          }

          this.handles.push(this.createHandle(i, 'se-resize'))
        }

        const geo = this.state.cell.getGeometry()

        if (
          geo != null &&
          !geo.relative &&
          !this.graph.isSwimlane(this.state.cell) &&
          labelMovable
        ) {
          this.labelShape = this.createHandle(DomEvent.getLabelHandle())
          this.handles.push(this.labelShape)
        }
      } else if (
        !resizable &&
        this.graph.isCellMovable(this.state.cell) &&
        this.state.bounds.width < 2 &&
        this.state.bounds.height < 2
      ) {
        this.labelShape = this.createHandle(DomEvent.getLabelHandle())
        this.handles.push(this.labelShape)
      }
    }

    // Adds the rotation handler
    if (this.isRotationHandleVisible()) {
      this.rotationShape = this.createHandle(DomEvent.getRotationHandle())
      this.handles.push(this.rotationShape)
    }

    this.customHandles = this.createCustomHandles()
  }

  protected isRotationHandleVisible() {
    return (
      this.graph.isEnabled() &&
      this.graph.isCellRotatable(this.state.cell) &&
      (
        this.graph.graphHandler.maxCellCount <= 0 ||
        this.graph.getSelecedCellCount() < this.graph.graphHandler.maxCellCount
      ) &&
      this.state.bounds.width >= 2 &&
      this.state.bounds.height >= 2
    )
  }

  protected createCustomHandles() {
    return null
  }

  /**
   * Returns true if the aspect ratio of the cell should be maintained.
   */
  protected isConstrained(e: MouseEventEx) {
    return (
      DomEvent.isShiftDown(e.getEvent()) ||
      this.state.style.aspect === true
    )
  }

  /**
   * Returns true if the center of the node should be maintained
   * during the resize.
   */
  protected isCentered(cell: Cell, e: MouseEventEx) {
    const options = this.graph.options.resize as ResizeOption
    if (typeof options.centered === 'function') {
      return options.centered.call(this.graph, cell, e)
    }
    return options.centered
  }

  protected isSizerVisible(index: number) {
    return true
  }

  protected updateMinBounds() {
    const children = this.graph.getChildCells(this.state.cell)
    if (children.length > 0) {
      this.minBounds = this.graph.view.getBounds(children)
      if (this.minBounds != null) {
        const s = this.state.view.scale
        const t = this.state.view.translate

        this.minBounds.x -= this.state.bounds.x
        this.minBounds.y -= this.state.bounds.y
        this.minBounds.x /= s
        this.minBounds.y /= s
        this.minBounds.width /= s
        this.minBounds.height /= s

        this.x0 = this.state.bounds.x / s - t.x
        this.y0 = this.state.bounds.y / s - t.y
      }
    }
  }

  protected getSelectionBounds(state: State) {
    return state.bounds.round()
  }

  protected createSelectionShape(bounds: Rectangle) {
    return applySelectionPreviewStyle({
      graph: this.graph,
      cell: this.state.cell,
      shape: new RectangleShape(bounds),
    }) as RectangleShape
  }

  protected createResizePreviewShape(bounds: Rectangle) {
    return applyResizePreviewStyle({
      graph: this.graph,
      cell: this.state.cell,
      shape: new RectangleShape(bounds),
    }) as RectangleShape
  }

  protected createRotatePreviewShape(bounds: Rectangle) {
    return applyRotatePreviewStyle({
      graph: this.graph,
      cell: this.state.cell,
      shape: new RectangleShape(bounds),
    }) as RectangleShape
  }

  protected createParentHighlightShape(bounds: Rectangle) {
    return this.createSelectionShape(bounds)
  }

  protected createHandle(index: number, cursor?: string) {
    let handle
    const args = {
      graph: this.graph,
      cell: this.state.cell,
    }

    if (DomEvent.isLabelHandle(index)) {
      handle = createLabelHandle(args)
      // tslint:disable-next-line
      cursor = getLabelHandleCursor({ ...args, shape: handle })
    } else if (DomEvent.isRotationHandle(index)) {
      handle = createRotationHandle(args)
      // tslint:disable-next-line
      cursor = getRotationHandleCursor({ ...args, shape: handle })
    } else {
      handle = createResizeHandle({ ...args, index, cursor: cursor! })
    }

    if (
      handle.isHtmlAllowed() &&
      this.state.text &&
      this.state.text.elem &&
      this.state.text.elem.parentNode === this.graph.container
    ) {
      handle.bounds.width -= 1
      handle.bounds.height -= 1
      handle.dialect = 'html'
      handle.init(this.graph.container)
    } else {
      handle.dialect = 'svg'
      handle.init(this.graph.view.getOverlayPane())
    }

    MouseEventEx.redirectMouseEvents(handle.elem!, this.graph, this.state)

    if (this.graph.isEnabled()) {
      handle.setCursor(cursor)
    }

    if (!this.isSizerVisible(index)) {
      handle.visible = false
    }

    return handle
  }

  protected moveHandleTo(shape: Shape, x: number, y: number) {
    if (shape != null) {
      shape.bounds.x = Math.floor(x - shape.bounds.width / 2)
      shape.bounds.y = Math.floor(y - shape.bounds.height / 2)
      if (util.isVisible(shape.elem)) {
        shape.redraw()
      }
    }
  }

  protected getHandleForEvent(e: MouseEventEx) {
    // Connection highlight may consume events before they reach sizer handle
    const tol = DomEvent.isMouseEvent(e.getEvent()) ? 1 : this.tolerance
    const hit = (this.checkHandleBounds && (detector.IS_IE || tol > 0))
      ? new Rectangle(
        e.getGraphX() - tol,
        e.getGraphY() - tol,
        2 * tol,
        2 * tol,
      )
      : null

    const checkShape = (shape: Shape | null) => {
      return (
        shape != null &&
        (
          e.isSource(shape) ||
          (
            hit != null &&
            shape.bounds.isIntersectWith(hit) &&
            util.isVisible(shape.elem)
          )
        )
      )
    }

    if (this.customHandles != null && this.isCustomHandleEvent(e)) {
      // Inverse loop order to match display order
      for (let i = this.customHandles.length - 1; i >= 0; i -= 1) {
        if (checkShape(this.customHandles[i].shape)) {
          return DomEvent.getCustomHandle(i)
        }
      }
    }

    if (checkShape(this.rotationShape)) {
      return DomEvent.getRotationHandle()
    }

    if (checkShape(this.labelShape)) {
      return DomEvent.getLabelHandle()
    }

    if (this.handles != null) {
      for (let i = 0, ii = this.handles.length; i < ii; i += 1) {
        if (checkShape(this.handles[i])) {
          return i
        }
      }
    }

    return null
  }

  protected isCustomHandleEvent(e: MouseEventEx) {
    return true
  }

  mouseDown(e: MouseEventEx, sender: any) {
    const tol = DomEvent.isMouseEvent(e.getEvent()) ? 1 : this.tolerance
    if (
      !e.isConsumed() &&
      this.graph.isEnabled() &&
      (tol > 0 || e.getState() === this.state)
    ) {
      const handle = this.getHandleForEvent(e)
      if (handle != null) {
        this.start(e.getGraphX(), e.getGraphY(), handle)
        e.consume()
      }
    }
  }

  start(graphX: number, graphY: number, index: number) {
    if (this.selectionShape != null) {
      this.index = index
      this.startX = graphX
      this.startY = graphY
      this.inTolerance = true
      this.childOffsetX = 0
      this.childOffsetY = 0

      // Saves reference to parent state
      const model = this.state.view.graph.model
      const parent = model.getParent(this.state.cell)

      if (
        this.state.view.currentRoot !== parent &&
        (model.isNode(parent) || model.isEdge(parent))
      ) {
        this.parentState = this.graph.view.getState(parent)
      }
    }
  }

  protected isUnapparent() {
    return (
      // returns true if the shape is transparent.
      this.state.shape != null &&
      util.isNoneColor(this.state.shape.fill) &&
      util.isNoneColor(this.state.shape.stroke)
    )
  }

  protected setHandlesVisible(visible: boolean) {
    this.handles && this.handles.forEach(
      handle => (handle.elem!.style.display = visible ? '' : 'none'),
    )

    this.customHandles && this.customHandles.forEach(
      handle => handle.setVisible(visible),
    )
  }

  protected hideSizers() {
    this.setHandlesVisible(false)
  }

  /**
   * Hook for subclassers do show details while the handler is active.
   */
  protected updateHint(e: MouseEventEx) { }

  /**
   * Hooks for subclassers to hide details when the handler gets inactive.
   */
  protected removeHint() { }

  /**
   * Hook for rounding the angle.
   */
  protected roundAngle(angle: number) {
    return Math.round(angle * 10) / 10
  }

  /**
   * Hook for rounding the unscaled width or height.
   */
  protected roundLength(length: number) {
    return Math.round(length)
  }

  protected checkTolerance(e: MouseEventEx) {
    if (this.inTolerance && this.startX != null && this.startY != null) {
      if (
        DomEvent.isMouseEvent(e.getEvent()) ||
        Math.abs(e.getGraphX() - this.startX) > this.graph.tolerance ||
        Math.abs(e.getGraphY() - this.startY) > this.graph.tolerance
      ) {
        this.inTolerance = false
      }
    }
  }

  mouseMove(e: MouseEventEx, sender: any) {
    if (!e.isConsumed() && this.index != null) {
      this.checkTolerance(e)

      // Checks tolerance for ignoring single clicks
      if (!this.inTolerance) {

        if (this.previewShape == null) {
          this.preparePreview()
        }

        if (DomEvent.isCustomHandle(this.index)) {
          if (this.customHandles != null) {
            const idx = DomEvent.getCustomHandle(this.index)
            this.customHandles[idx].processEvent(e)
            this.customHandles[idx].active = true
          }
        } else if (DomEvent.isLabelHandle(this.index)) {
          this.moveLabel(e)
        } else if (DomEvent.isRotationHandle(this.index)) {
          this.rotateNode(e)
        } else {
          this.resizeNode(e)
        }

        this.updateHint(e)
      }

      e.consume()

    } else if (
      !this.graph.eventloop.isMouseDown &&
      this.getHandleForEvent(e) != null
    ) {
      // Workaround for disabling the connect highlight when over handle
      e.consume(false)
    }
  }

  protected preparePreview() {
    const livePreview = this.resizeLivePreview || this.rotateLivePreview
    const index = this.index!
    const isRotate = DomEvent.isRotationHandle(index)
    const isResize = !isRotate
      && !DomEvent.isCustomHandle(index)
      && !DomEvent.isLabelHandle(index)

    this.selectionShape!.elem!.style.display = 'none'

    if (isResize || isRotate) {
      if (!livePreview || this.isUnapparent()) {
        this.previewShape = isResize
          ? this.createResizePreviewShape(this.bounds)
          : this.createRotatePreviewShape(this.bounds)

        if (
          this.state.text != null &&
          this.state.text.elem!.parentNode === this.graph.container
        ) {
          this.previewShape.dialect = 'html'
          this.previewShape.init(this.graph.container)
        } else {
          this.previewShape.dialect = 'svg'
          this.previewShape.init(this.graph.view.getOverlayPane())
        }
      }
    }

    // Prepares the handles for live preview
    if (livePreview) {
      this.hideSizers()

      if (DomEvent.isRotationHandle(index)) {
        this.rotationShape.elem!.style.display = ''
      } else if (DomEvent.isLabelHandle(index)) {
        this.labelShape!.elem!.style.display = ''
      } else if (this.handles != null && this.handles[index] != null) {
        this.handles[index].elem!.style.display = ''
      } else if (
        DomEvent.isCustomHandle(index) &&
        this.customHandles != null
      ) {
        this.customHandles[DomEvent.getCustomHandle(index)].setVisible(true)
      }

      // Gets the array of connected edge handlers for redrawing
      this.edgeHandlers = []
      const edges = this.graph.getEdges(this.state.cell)
      for (let i = 0, ii = edges.length; i < ii; i += 1) {
        const handler = this.graph.selectionHandler.getHandler(
          edges[i],
        ) as any as EdgeHandler
        if (handler != null) {
          this.edgeHandlers.push(handler)
        }
      }
    }
  }

  protected moveLabel(e: MouseEventEx) {
    const p = new Point(e.getGraphX(), e.getGraphY())
    const t = this.graph.view.translate
    const s = this.graph.view.scale

    if (this.graph.isGridEnabledForEvent(e.getEvent())) {
      p.x = (this.graph.snap(p.x / s - t.x) + t.x) * s
      p.y = (this.graph.snap(p.y / s - t.y) + t.y) * s
    }

    if (this.handles) {
      const index = (this.rotationShape != null)
        ? this.handles.length - 2
        : this.handles.length - 1

      this.moveHandleTo(this.handles[index], p.x, p.y)
    }
  }

  protected rotateNode(e: MouseEventEx) {
    const p = new Point(e.getGraphX(), e.getGraphY())
    const dx = this.state.bounds.getCenterX() - p.x
    const dy = this.state.bounds.getCenterY() - p.y

    this.currentAlpha = (dx !== 0)
      ? Math.atan(dy / dx) * 180 / Math.PI + 90
      : (dy < 0 ? 180 : 0)

    if (dx > 0) {
      this.currentAlpha -= 180
    }

    // Rotation raster
    if (this.rotationRaster && this.graph.isGridEnabledForEvent(e.getEvent())) {
      const dx = p.x - this.state.bounds.getCenterX()
      const dy = p.y - this.state.bounds.getCenterY()
      const dist = Math.abs(Math.sqrt(dx * dx + dy * dy) - 20) * 3
      const raster = Math.max(
        1,
        5 * Math.min(3, Math.max(0, Math.round(80 / Math.abs(dist)))),
      )

      this.currentAlpha = Math.round(this.currentAlpha / raster) * raster
    } else {
      this.currentAlpha = this.roundAngle(this.currentAlpha)
    }

    if (this.previewShape) {
      this.drawPreview()
    }

    if ((this.rotateLivePreview || this.resizeLivePreview)) {
      this.drawHandles()
    }
  }

  protected resizeNode(e: MouseEventEx) {
    const p = new Point(e.getGraphX(), e.getGraphY())
    const t = this.graph.view.translate
    const s = this.graph.view.scale
    const geo = this.graph.getCellGeometry(this.state.cell)!
    const ct = this.state.bounds.getCenter()
    const rot = util.toRad(util.getRotation(this.state))

    let cos = Math.cos(-rot)
    let sin = Math.sin(-rot)

    let dx = p.x - this.startX
    let dy = p.y - this.startY

    // Rotates vector for mouse gesture
    dx = cos * dx - sin * dy
    dy = sin * dx + cos * dy

    this.unscaledBounds = this.union(
      geo.bounds,
      dx / s,
      dy / s,
      this.index!,
      this.graph.isGridEnabledForEvent(e.getEvent()),
      1,
      new Point(0, 0),
      this.isConstrained(e),
      this.isCentered(this.state.cell, e),
    )

    // Keeps node within maximum graph or parent bounds
    if (!geo.relative) {
      let max = this.graph.getMaximumGraphBounds()

      // Handles child cells
      if (max != null && this.parentState != null) {
        max = max.clone()
        max.x -= this.parentState.bounds.x / s - t.x
        max.y -= this.parentState.bounds.y / s - t.y
      }

      if (this.graph.isConstrainChild(this.state.cell)) {
        let tmp = this.graph.cellManager.getCellContainmentArea(this.state.cell)

        if (tmp != null) {
          const overlap = this.graph.getOverlap(this.state.cell)

          if (overlap > 0) {
            tmp = tmp.clone()

            tmp.x -= tmp.width * overlap
            tmp.y -= tmp.height * overlap
            tmp.width += 2 * tmp.width * overlap
            tmp.height += 2 * tmp.height * overlap
          }

          if (max == null) {
            max = tmp
          } else {
            max = max.clone()
            max.intersect(tmp)
          }
        }
      }

      if (max != null) {
        if (this.unscaledBounds.x < max.x) {
          this.unscaledBounds.width -= max.x - this.unscaledBounds.x
          this.unscaledBounds.x = max.x
        }

        if (this.unscaledBounds.y < max.y) {
          this.unscaledBounds.height -= max.y - this.unscaledBounds.y
          this.unscaledBounds.y = max.y
        }

        if (
          this.unscaledBounds.x + this.unscaledBounds.width >
          max.x + max.width
        ) {
          this.unscaledBounds.width -= this.unscaledBounds.x +
            this.unscaledBounds.width - max.x - max.width
        }

        if (
          this.unscaledBounds.y + this.unscaledBounds.height >
          max.y + max.height
        ) {
          this.unscaledBounds.height -= this.unscaledBounds.y +
            this.unscaledBounds.height - max.y - max.height
        }
      }
    }

    this.bounds = new Rectangle(
      (this.parentState != null ? this.parentState.bounds.x : t.x * s)
      + (this.unscaledBounds.x) * s,
      (this.parentState != null ? this.parentState.bounds.y : t.y * s)
      + (this.unscaledBounds.y) * s,
      this.unscaledBounds.width * s,
      this.unscaledBounds.height * s,
    )

    if (geo.relative && this.parentState != null) {
      this.bounds.x += this.state.bounds.x - this.parentState.bounds.x
      this.bounds.y += this.state.bounds.y - this.parentState.bounds.y
    }

    cos = Math.cos(rot)
    sin = Math.sin(rot)

    const c2 = this.bounds.getCenter()

    dx = c2.x - ct.x
    dy = c2.y - ct.y

    const dx2 = cos * dx - sin * dy
    const dy2 = sin * dx + cos * dy

    const dx3 = dx2 - dx
    const dy3 = dy2 - dy

    const dx4 = this.bounds.x - this.state.bounds.x
    const dy4 = this.bounds.y - this.state.bounds.y

    const dx5 = cos * dx4 - sin * dy4
    const dy5 = sin * dx4 + cos * dy4

    this.bounds.x += dx3
    this.bounds.y += dy3

    // Rounds unscaled bounds to int
    this.unscaledBounds.x = this.roundLength(this.unscaledBounds.x + dx3 / s)
    this.unscaledBounds.y = this.roundLength(this.unscaledBounds.y + dy3 / s)
    this.unscaledBounds.width = this.roundLength(this.unscaledBounds.width)
    this.unscaledBounds.height = this.roundLength(this.unscaledBounds.height)

    // Shifts the children according to parent offset
    if (
      !this.graph.isCellCollapsed(this.state.cell) &&
      (dx3 !== 0 || dy3 !== 0)
    ) {
      this.childOffsetX = this.state.bounds.x - this.bounds.x + dx5
      this.childOffsetY = this.state.bounds.y - this.bounds.y + dy5
    } else {
      this.childOffsetX = 0
      this.childOffsetY = 0
    }

    if ((this.rotateLivePreview || this.resizeLivePreview)) {
      this.updateLivePreview(e)
    }

    if (this.previewShape) {
      this.drawPreview()
    }
  }

  protected updateLivePreview(e: MouseEventEx) {
    const s = this.graph.view.scale
    const t = this.graph.view.translate

    // Saves current state
    const tempState = this.state.clone()

    // Temporarily changes size and origin
    this.state.bounds.update(this.bounds)
    this.state.origin = new Point(
      this.state.bounds.x / s - t.x,
      this.state.bounds.y / s - t.y,
    )

    // Needed to force update of text bounds
    this.state.unscaledWidth = null

    // Redraws cell and handles
    // const off = this.state.absoluteOffset.clone()

    // Required to store and reset absolute offset for updating label position
    this.state.absoluteOffset.x = 0
    this.state.absoluteOffset.y = 0
    const geo = this.graph.getCellGeometry(this.state.cell)

    if (geo != null) {
      const offset = geo.offset
      if (offset != null && !geo.relative) {
        this.state.absoluteOffset.x = s * offset.x
        this.state.absoluteOffset.y = s * offset.y
      }

      this.state.view.updateNodeLabelOffset(this.state)
    }

    this.redrawLivePreview()
    this.drawHandles()

    // Restores current state
    this.state.setState(tempState)
  }

  protected redrawLivePreview() {
    // Redraws the live preview
    this.state.view.graph.renderer.redraw(this.state, true)

    // Redraws connected edges
    this.state.view.invalidate(this.state.cell)
    this.state.invalid = false
    this.state.view.validate()
  }

  mouseUp(e: MouseEventEx, sender: any) {
    if (this.index != null && this.state != null) {
      const point = new Point(e.getGraphX(), e.getGraphY())
      const index = this.index

      this.index = null

      this.graph.batchUpdate(() => {

        if (DomEvent.isCustomHandle(index)) {
          if (this.customHandles != null) {
            const idx = DomEvent.getCustomHandle(index)
            this.customHandles[idx].active = false
            this.customHandles[idx].execute()
          }
        } else if (DomEvent.isRotationHandle(index)) {

          if (this.currentAlpha != null) {
            const delta = this.currentAlpha - util.getRotation(this.state)
            if (delta !== 0) {
              this.rotateCell(this.state.cell, delta)
            }
          } else {
            this.rotateClick()
          }

        } else {

          const gridEnabled = this.graph.isGridEnabledForEvent(e.getEvent())
          const alpha = util.toRad(util.getRotation(this.state))
          const cos = Math.cos(-alpha)
          const sin = Math.sin(-alpha)

          let dx = point.x - this.startX
          let dy = point.y - this.startY

          dx = cos * dx - sin * dy
          dy = sin * dx + cos * dy

          const scale = this.graph.view.scale
          const recurse = this.isRecursiveResize(this.state, e)
          this.resizeCell(
            this.state.cell,
            this.roundLength(dx / scale),
            this.roundLength(dy / scale),
            index,
            gridEnabled,
            this.isConstrained(e),
            recurse,
          )
        }
      })

      e.consume()
      this.reset()
    }
  }

  protected isRecursiveResize(state: State, e: MouseEventEx) {
    return this.graph.isRecursiveResize()
  }

  protected rotateClick() { }

  protected rotateCell(cell: Cell, angle: number, parent?: Cell) {
    if (angle !== 0) {
      const model = this.graph.getModel()

      if (model.isNode(cell) || model.isEdge(cell)) {
        if (!model.isEdge(cell)) {
          const style = this.graph.getStyle(cell)
          if (style != null) {
            const total = (style.rotation || 0) + angle
            this.graph.updateCellsStyle('rotation', total, [cell])
          }
        }

        let geo = this.graph.getCellGeometry(cell)
        if (geo != null && parent != null) {
          const pgeo = this.graph.getCellGeometry(parent)
          if (pgeo != null && !model.isEdge(parent)) {
            geo = geo.clone()
            geo.rotate(angle, new Point(pgeo.bounds.width / 2, pgeo.bounds.height / 2))
            model.setGeometry(cell, geo)
          }

          if ((model.isNode(cell) && !geo.relative) || model.isEdge(cell)) {
            cell.eachChild(child => this.rotateCell(child, angle, cell))
          }
        }
      }
    }
  }

  protected resizeCell(
    cell: Cell,
    dx: number,
    dy: number,
    index: number,
    gridEnabled: boolean,
    constrained: boolean,
    recurse: boolean,
  ) {
    let geo = this.graph.model.getGeometry(cell)
    if (geo != null) {
      if (index === DomEvent.LABEL_HANDLE) {
        const scale = this.graph.view.scale
        dx = Math.round((this.labelShape!.bounds.getCenterX() - this.startX) / scale) // tslint:disable-line
        dy = Math.round((this.labelShape!.bounds.getCenterY() - this.startY) / scale) // tslint:disable-line

        geo = geo.clone()

        if (geo.offset == null) {
          geo.offset = new Point(dx, dy)
        } else {
          geo.offset.x += dx
          geo.offset.y += dy
        }

        this.graph.model.setGeometry(cell, geo)
      } else if (this.unscaledBounds != null) {
        const scale = this.graph.view.scale

        if (this.childOffsetX !== 0 || this.childOffsetY !== 0) {
          this.moveChildren(
            cell,
            Math.round(this.childOffsetX / scale),
            Math.round(this.childOffsetY / scale),
          )
        }

        this.graph.resizeCell(cell, this.unscaledBounds, recurse)
      }
    }
  }

  protected moveChildren(cell: Cell, dx: number, dy: number) {
    cell.eachChild((child) => {
      let geo = this.graph.getCellGeometry(child)
      if (geo != null) {
        geo = geo.clone()
        geo.translate(dx, dy)
        this.graph.model.setGeometry(child, geo)
      }
    })
  }

  protected union(
    bounds: Rectangle,
    dx: number,
    dy: number,
    index: number,
    gridEnabled: boolean,
    scale: number,
    tr: Point,
    constrained: boolean,
    centered: boolean,
  ) {
    if (this.singleResizeHandle) {
      let x = bounds.x + bounds.width + dx
      let y = bounds.y + bounds.height + dy

      if (gridEnabled) {
        x = this.graph.snap(x / scale) * scale
        y = this.graph.snap(y / scale) * scale
      }

      const rect = new Rectangle(bounds.x, bounds.y, 0, 0)
      rect.add(new Rectangle(x, y, 0, 0))

      return rect
    }

    const w0 = bounds.width
    const h0 = bounds.height
    let left = bounds.x - tr.x * scale
    let right = left + w0
    let top = bounds.y - tr.y * scale
    let bottom = top + h0

    const cx = left + w0 / 2
    const cy = top + h0 / 2

    if (index > 4) {
      bottom = bottom + dy

      if (gridEnabled) {
        bottom = this.graph.snap(bottom / scale) * scale
      }
    } else if (index < 3) {
      top = top + dy

      if (gridEnabled) {
        top = this.graph.snap(top / scale) * scale
      }
    }

    if (index === 0 || index === 3 || index === 5) {
      left += dx

      if (gridEnabled) {
        left = this.graph.snap(left / scale) * scale
      }
    } else if (index === 2 || index === 4 || index === 7) {
      right += dx

      if (gridEnabled) {
        right = this.graph.snap(right / scale) * scale
      }
    }

    let width = right - left
    let height = bottom - top

    if (constrained) {
      const geo = this.graph.getCellGeometry(this.state.cell)

      if (geo != null) {
        const aspect = geo.bounds.width / geo.bounds.height

        if (index === 1 || index === 2 || index === 7 || index === 6) {
          width = height * aspect
        } else {
          height = width / aspect
        }

        if (index === 0) {
          left = right - width
          top = bottom - height
        }
      }
    }

    if (centered) {
      width += (width - w0)
      height += (height - h0)

      const cdx = cx - (left + width / 2)
      const cdy = cy - (top + height / 2)

      left += cdx
      top += cdy
      right += cdx
      bottom += cdy
    }

    // Flips over left side
    if (width < 0) {
      left += width
      width = Math.abs(width)
    }

    // Flips over top side
    if (height < 0) {
      top += height
      height = Math.abs(height)
    }

    const result = new Rectangle(
      left + tr.x * scale,
      top + tr.y * scale,
      width,
      height,
    )

    if (this.minBounds != null) {
      result.width = Math.max(
        result.width,
        this.minBounds.x * scale +
        this.minBounds.width * scale +
        Math.max(0, this.x0 * scale - result.x),
      )

      result.height = Math.max(
        result.height,
        this.minBounds.y * scale +
        this.minBounds.height * scale +
        Math.max(0, this.y0 * scale - result.y),
      )
    }

    return result
  }

  reset() {
    if (
      this.handles && this.index != null && this.handles[this.index] &&
      this.handles[this.index].elem!.style.display === 'none'
    ) {
      this.handles[this.index].elem!.style.display = ''
    }

    this.index = null
    this.currentAlpha = null
    this.inTolerance = false

    // Checks if handler has been destroyed
    if (this.selectionShape != null) {
      this.selectionShape.elem!.style.display = ''
      this.selectionBounds = this.getSelectionBounds(this.state)
      this.bounds = this.selectionBounds.clone()
      this.drawPreview()
    }

    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
    }

    if (
      (this.rotateLivePreview || this.resizeLivePreview) &&
      this.handles != null
    ) {
      for (let i = 0; i < this.handles.length; i += 1) {
        if (this.handles[i] != null) {
          this.handles[i].elem!.style.display = ''
        }
      }
    }

    if (this.customHandles != null) {
      for (let i = 0; i < this.customHandles.length; i += 1) {
        if (this.customHandles[i].active) {
          this.customHandles[i].active = false
          this.customHandles[i].reset()
        } else {
          this.customHandles[i].setVisible(true)
        }
      }
    }

    this.removeHint()
    this.drawHandles()
    this.edgeHandlers = null
    this.unscaledBounds = null
  }

  redraw() {
    this.selectionBounds = this.getSelectionBounds(this.state)
    this.bounds = this.selectionBounds.clone()

    this.drawHandles()
    this.drawPreview()
  }

  protected drawHandles() {

    this.verticalOffset = 0
    this.horizontalOffset = 0

    const tol = this.tolerance
    let box = this.bounds

    if (this.handles && this.handles.length > 0 && this.handles[0]) {

      if (this.index == null && this.manageHandles && this.handles.length >= 8) {
        const padding = this.getHandlePadding()
        this.horizontalOffset = padding.x
        this.verticalOffset = padding.y

        if (this.horizontalOffset !== 0 || this.verticalOffset !== 0) {
          box = box.clone()
          box.x -= this.horizontalOffset / 2
          box.width += this.horizontalOffset
          box.y -= this.verticalOffset / 2
          box.height += this.verticalOffset
        }

        if (this.handles.length >= 8) {
          if (
            (box.width < 2 * this.handles[0].bounds.width + 2 * tol) ||
            (box.height < 2 * this.handles[0].bounds.height + 2 * tol)
          ) {
            this.handles[0].elem!.style.display = 'none'
            this.handles[2].elem!.style.display = 'none'
            this.handles[5].elem!.style.display = 'none'
            this.handles[7].elem!.style.display = 'none'
          } else {
            this.handles[0].elem!.style.display = ''
            this.handles[2].elem!.style.display = ''
            this.handles[5].elem!.style.display = ''
            this.handles[7].elem!.style.display = ''
          }
        }
      }

      const right = box.x + box.width
      const bottom = box.y + box.height

      if (this.singleResizeHandle) {
        this.moveHandleTo(this.handles[0], right, bottom)
      } else {
        const cx = box.x + box.width / 2
        const cy = box.y + box.height / 2

        // resizable
        if (this.handles.length >= 8) {
          const cursors = [
            'nw-resize',
            'n-resize',
            'ne-resize',
            'e-resize',
            'se-resize',
            's-resize',
            'sw-resize',
            'w-resize',
          ]

          const alpha = util.toRad(util.getRotation(this.state))
          const cos = Math.cos(alpha)
          const sin = Math.sin(alpha)
          const da = Math.round(alpha * 4 / Math.PI)

          const ct = box.getCenter()
          let pt = util.rotatePointEx(new Point(box.x, box.y), cos, sin, ct)
          this.moveHandleTo(this.handles[0], pt.x, pt.y)
          this.handles[0].setCursor(cursors[util.mod(0 + da, cursors.length)])

          pt.x = cx
          pt.y = box.y
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[1], pt.x, pt.y)
          this.handles[1].setCursor(cursors[util.mod(1 + da, cursors.length)])

          pt.x = right
          pt.y = box.y
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[2], pt.x, pt.y)
          this.handles[2].setCursor(cursors[util.mod(2 + da, cursors.length)])

          pt.x = box.x
          pt.y = cy
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[3], pt.x, pt.y)
          this.handles[3].setCursor(cursors[util.mod(7 + da, cursors.length)])

          pt.x = right
          pt.y = cy
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[4], pt.x, pt.y)
          this.handles[4].setCursor(cursors[util.mod(3 + da, cursors.length)])

          pt.x = box.x
          pt.y = bottom
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[5], pt.x, pt.y)
          this.handles[5].setCursor(cursors[util.mod(6 + da, cursors.length)])

          pt.x = cx
          pt.y = bottom
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[6], pt.x, pt.y)
          this.handles[6].setCursor(cursors[util.mod(5 + da, cursors.length)])

          pt.x = right
          pt.y = bottom
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[7], pt.x, pt.y)
          this.handles[7].setCursor(cursors[util.mod(4 + da, cursors.length)])

          const offset = getLabelHandleOffset({
            graph: this.graph,
            cell: this.state.cell,
            shape: this.labelShape!,
          })
          this.moveHandleTo(
            this.handles[8], // labelShape
            cx + this.state.absoluteOffset.x + offset.x,
            cy + this.state.absoluteOffset.y + offset.y,
          )
        } else if (
          this.state.bounds.width >= 2 &&
          this.state.bounds.height >= 2
        ) {
          const offset = getLabelHandleOffset({
            graph: this.graph,
            cell: this.state.cell,
            shape: this.labelShape!,
          })
          this.moveHandleTo(
            this.handles[0], // labelShape
            cx + this.state.absoluteOffset.x + offset.x,
            cy + this.state.absoluteOffset.y + offset.y,
          )
        } else {
          this.moveHandleTo(
            this.handles[0],
            this.state.bounds.x,
            this.state.bounds.y,
          )
        }
      }
    }

    if (this.rotationShape != null) {
      const rot = this.currentAlpha != null
        ? this.currentAlpha
        : util.getRotation(this.state)
      const ct = this.state.bounds.getCenter()
      const pt = util.rotatePoint(this.getRotationHandlePosition(), rot, ct)
      if (this.rotationShape.elem != null) {
        this.moveHandleTo(this.rotationShape, pt.x, pt.y)

        // Hides rotation handle during text editing
        this.rotationShape.elem.style.visibility =
          this.graph.isEditing() ? 'hidden' : ''
      }
    }

    if (this.selectionShape != null) {
      this.selectionShape.rotation = util.getRotation(this.state)
    }

    if (this.edgeHandlers != null) {
      this.edgeHandlers.forEach(h => h.redraw())
    }

    if (this.customHandles != null) {
      for (let i = 0; i < this.customHandles.length; i += 1) {
        const temp = this.customHandles[i].shape.elem!.style.display
        this.customHandles[i].redraw()
        this.customHandles[i].shape.elem!.style.display = temp

        // Hides custom handles during text editing
        this.customHandles[i].shape.elem!.style.visibility =
          this.graph.isEditing() ? 'hidden' : ''
      }
    }

    this.updateParentHighlight()
  }

  protected getHandlePadding() {
    const result = new Point(0, 0)
    let tol = this.tolerance

    if (
      this.handles && this.handles.length > 0 && this.handles[0] &&
      (
        this.bounds.width < 2 * this.handles[0].bounds.width + 2 * tol ||
        this.bounds.height < 2 * this.handles[0].bounds.height + 2 * tol
      )
    ) {
      tol /= 2

      result.x = this.handles[0].bounds.width + tol
      result.y = this.handles[0].bounds.height + tol
    }

    return result
  }

  protected getRotationHandlePosition() {
    const offset = getRotationHandleOffset({
      graph: this.graph,
      cell: this.state.cell,
      shape: this.rotationShape,
    })

    return new Point(
      this.bounds.x + this.bounds.width / 2 + offset.x,
      this.bounds.y + offset.y,
    )
  }

  protected updateParentHighlight() {
    if (this.selectionShape != null) {
      if (this.parentHighlight != null) {
        const parent = this.graph.model.getParent(this.state.cell)
        if (this.graph.model.isNode(parent)) {
          const pstate = this.graph.view.getState(parent)
          const bounds = this.parentHighlight.bounds
          if (pstate != null && !bounds.equals(pstate.bounds)) {
            this.parentHighlight.bounds = pstate.bounds.clone()
            this.parentHighlight.redraw()
          }
        } else {
          this.parentHighlight.dispose()
          this.parentHighlight = null
        }
      } else if (this.parentHighlightable) {
        const parent = this.graph.model.getParent(this.state.cell)
        if (this.graph.model.isNode(parent)) {
          const pstate = this.graph.view.getState(parent)
          if (pstate != null) {
            this.parentHighlight = this.createParentHighlightShape(pstate.bounds)
            this.parentHighlight.dialect = 'svg'
            this.parentHighlight.pointerEvents = false
            this.parentHighlight.rotation = util.getRotation(pstate)
            this.parentHighlight.init(this.graph.view.getOverlayPane())
          }
        }
      }
    }
  }

  protected drawPreview() {
    const rotation = this.currentAlpha == null
      ? util.getRotation(this.state)
      : this.currentAlpha

    if (this.previewShape != null) {
      this.previewShape.bounds = this.bounds
      // html
      if (this.previewShape.elem!.parentNode === this.graph.container) {
        this.previewShape.bounds.width =
          Math.max(0, this.previewShape.bounds.width - 1)
        this.previewShape.bounds.height =
          Math.max(0, this.previewShape.bounds.height - 1)
      }

      this.previewShape.rotation = rotation
      this.previewShape.redraw()
    }

    if (this.selectionShape) {
      this.selectionShape.rotation = rotation
      this.selectionShape.bounds = this.bounds
      this.selectionShape.redraw()
    }

    if (this.parentHighlight != null) {
      this.parentHighlight.redraw()
    }
  }

  dispose() {
    if (this.disposed) {
      return
    }

    if (this.escapeHandler != null) {
      this.state.view.graph.off(DomEvent.ESCAPE, this.escapeHandler)
      this.escapeHandler = null
    }

    if (this.selectionShape != null) {
      this.selectionShape.dispose()
      this.selectionShape = null
    }

    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
    }

    if (this.parentHighlight != null) {
      this.parentHighlight.dispose()
      this.parentHighlight = null
    }

    this.labelShape = null
    this.removeHint()

    this.handles && this.handles.forEach(h => h.dispose())
    this.handles = null

    this.customHandles && this.customHandles.forEach(h => h.dispose())
    this.customHandles = null

    super.dispose()
  }
}
