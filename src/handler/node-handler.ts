import * as util from '../util'
import { Cell, CellState, Graph } from '../core'
import { Rectangle, Point, Image } from '../struct'
import { constants, DomEvent, CustomMouseEvent, detector } from '../common'
import { Shape, RectangleShape, EllipseShape, ImageShape } from '../shape'
import { GraphHandler } from './graph-handler'
import { MouseHandler, IMouseHandler } from './handler-mouse'

export class NodeHandler extends MouseHandler {
  private escapeHandler: (() => void) | null

  private x0: number
  private y0: number

  private bounds: Rectangle
  private selectionBounds: Rectangle
  private minBounds: Rectangle | null
  private unscaledBounds: Rectangle | null

  private selectionShape: RectangleShape | null
  private preview: RectangleShape | null
  private sizers: (RectangleShape | EllipseShape | ImageShape)[] | null
  private edgeHandlers: IMouseHandler[] | null
  private labelShape: RectangleShape | null
  private rotationShape: EllipseShape
  private customHandles: Shape[] | null
  private parentHighlight: RectangleShape | null

  startX: number
  startY: number
  private inTolerance: boolean
  private childOffsetX: number
  private childOffsetY: number
  private parentState: CellState | null
  private currentAlpha: number | null

  graph: Graph
  state: CellState

  /**
   * Specifies if only one sizer handle at the bottom, right corner should be
   * used.
   *
   * Default is `false`.
   */
  singleSizer: boolean = false

  /**
   * The index of the current handle.
   */
  index: number | null = null

  /**
   * Specifies if the bounds of handles should be used for hit-detection
   * in IE or if `tolerance > 0`.
   *
   * Default is `true`.
   */
  allowHandleBoundsCheck: boolean = true

  /**
   * Optional `Image` to be used as handles.
   *
   * Default is `null`.
   */
  handleImage: Image | null = null

  /**
   * Optional tolerance for hit-detection.
   *
   * Default is `0`.
   */
  tolerance: number = 0

  /**
   * Specifies if a rotation handle should be visible.
   *
   * Default is `false`.
   */
  rotationEnabled: boolean = false

  /**
   * Specifies if the parent should be highlighted if a child cell is selected.
   *
   * Default is `false`.
   */
  parentHighlightEnabled = false

  /**
   * Specifies if rotation steps should be "rasterized" depening on the
   * distance to the handle.
   *
   * Default is `true`.
   */
  rotationRaster = true

  /**
   * Specifies the cursor for the rotation handle.
   *
   * Default is `'crosshair'`.
   */
  rotationCursor: string = 'crosshair'

  /**
   * Specifies if resize should change the cell in-place.
   *
   * Default is `false`.
   */
  livePreview: boolean = false

  /**
   * Specifies if sizers should be hidden and spaced if the node is small.
   *
   * Default is `false`.
   */
  manageSizers = false

  /**
   * Specifies if the size of groups should be constrained by the children.
   *
   * Default is `false`.
   */
  constrainGroupByChildren = false

  /**
   * Vertical spacing for rotation icon.
   *
   * Default is `-16`.
   */
  rotationHandleVSpacing = -16

  /**
   * The horizontal offset for the handles. This is updated in `redrawHandles`
   * if `manageSizers` is `true` and the sizers are offset horizontally.
   */
  horizontalOffset: number = 0

  /**
   * The horizontal offset for the handles. This is updated in `redrawHandles`
   * if `manageSizers` is `true` and the sizers are offset vertically.
   */
  verticalOffset: number = 0

  constructor(graph: Graph, state: CellState) {
    super(graph)
    this.state = state
    this.init()
    this.escapeHandler = () => {
      if (this.livePreview && this.index != null) {
        // Redraws the live preview
        this.state.view.graph.renderer.redraw(this.state, true)

        // Redraws connected edges
        this.state.view.invalidate(this.state.cell)
        this.state.invalid = false
        this.state.view.validate()
      }

      this.reset()
    }

    this.state.view.graph.on(DomEvent.ESCAPE, this.escapeHandler)
  }

  private init() {
    this.selectionBounds = this.getSelectionBounds(this.state)
    this.bounds = this.selectionBounds.clone()
    this.selectionShape = this.createSelectionShape(this.bounds)

    this.selectionShape.dialect = constants.DIALECT_SVG
    this.selectionShape.pointerEvents = false
    this.selectionShape.rotation = util.getRotation(this.state)
    this.selectionShape.init(this.graph.view.getOverlayPane())

    CustomMouseEvent.redirectMouseEvents(
      this.selectionShape.elem!,
      this.graph,
      this.state,
    )

    if (this.graph.isCellMovable(this.state.cell)) {
      this.selectionShape.setCursor(constants.CURSOR_MOVABLE_NODE)
    }

    this.sizers = []

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
          if (!this.singleSizer) {
            this.sizers.push(this.createSizer('nw-resize', i))
            i += 1
            this.sizers.push(this.createSizer('n-resize', i))
            i += 1
            this.sizers.push(this.createSizer('ne-resize', i))
            i += 1
            this.sizers.push(this.createSizer('w-resize', i))
            i += 1
            this.sizers.push(this.createSizer('e-resize', i))
            i += 1
            this.sizers.push(this.createSizer('sw-resize', i))
            i += 1
            this.sizers.push(this.createSizer('s-resize', i))
            i += 1
          }

          this.sizers.push(this.createSizer('se-resize', i))
        }

        const geo = this.state.cell.getGeometry()

        if (
          geo != null &&
          !geo.relative &&
          !this.graph.isSwimlane(this.state.cell) &&
          labelMovable
        ) {
          this.labelShape = this.createSizer(
            constants.CURSOR_LABEL_HANDLE,
            DomEvent.LABEL_HANDLE,
            constants.LABEL_HANDLE_SIZE,
            constants.LABEL_HANDLE_FILLCOLOR,
          ) as RectangleShape
          this.sizers.push(this.labelShape)
        }

      } else if (
        !resizable &&
        this.graph.isCellMovable(this.state.cell) &&
        this.state.bounds.width < 2 &&
        this.state.bounds.height < 2
      ) {
        this.labelShape = this.createSizer(
          constants.CURSOR_MOVABLE_NODE,
          DomEvent.LABEL_HANDLE,
          null,
          constants.LABEL_HANDLE_FILLCOLOR,
        ) as RectangleShape
        this.sizers.push(this.labelShape)
      }
    }

    // Adds the rotation handler
    if (this.isRotationHandleVisible()) {
      this.rotationShape = this.createSizer(
        this.rotationCursor,
        DomEvent.ROTATION_HANDLE,
        constants.HANDLE_SIZE + 3,
        constants.HANDLE_FILLCOLOR,
      ) as EllipseShape

      this.sizers.push(this.rotationShape)
    }

    this.customHandles = this.createCustomHandles()
    this.redraw()

    if (this.constrainGroupByChildren) {
      this.updateMinBounds()
    }
  }

  private isRotationHandleVisible() {
    return (
      this.graph.isEnabled() &&
      this.rotationEnabled &&
      this.graph.isCellRotatable(this.state.cell) &&
      (
        GraphHandler.prototype.maxCellCount <= 0 ||
        this.graph.getSelecedCellCount() < GraphHandler.prototype.maxCellCount
      ) &&
      this.state.bounds.width >= 2 &&
      this.state.bounds.height >= 2
    )
  }

  createCustomHandles() {
    return null
  }

  /**
   * Returns true if the aspect ratio of the cell should be maintained.
   */
  private isConstrainedEvent(e: CustomMouseEvent) {
    return (
      DomEvent.isShiftDown(e.getEvent()) ||
      this.state.style.aspect === true
    )
  }

  /**
   * Returns true if the center of the node should be maintained
   * during the resize.
   */
  private isCenteredEvent(state: CellState, e: CustomMouseEvent) {
    return false
  }

  private updateMinBounds() {
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

  private getSelectionBounds(state: CellState) {
    return new Rectangle(
      Math.round(state.bounds.x),
      Math.round(state.bounds.y),
      Math.round(state.bounds.width),
      Math.round(state.bounds.height),
    )
  }

  private getSelectionColor() {
    return constants.VERTEX_SELECTION_COLOR
  }

  private getSelectionStrokeWidth() {
    return constants.VERTEX_SELECTION_STROKEWIDTH
  }

  private isSelectionDashed() {
    return constants.VERTEX_SELECTION_DASHED
  }

  private createSelectionShape(bounds: Rectangle) {
    const shape = new RectangleShape(bounds, null, this.getSelectionColor())
    shape.strokeWidth = this.getSelectionStrokeWidth()
    shape.dashed = this.isSelectionDashed()
    return shape
  }

  private createParentHighlightShape(bounds: Rectangle) {
    return this.createSelectionShape(bounds)
  }

  private createSizer(
    cursor: string,
    index: number,
    size?: number | null,
    fillColor?: string,
  ) {

    const wh = size || constants.HANDLE_SIZE
    const bounds = new Rectangle(0, 0, wh, wh)
    const sizer = this.createSizerShape(bounds, index, fillColor)

    if (
      sizer.isHtmlAllowed() &&
      this.state.text &&
      this.state.text.elem &&
      this.state.text.elem.parentNode === this.graph.container
    ) {
      sizer.bounds.width -= 1
      sizer.bounds.height -= 1
      sizer.dialect = constants.DIALECT_STRICTHTML
      sizer.init(this.graph.container)
    } else {
      sizer.dialect = constants.DIALECT_SVG
      sizer.init(this.graph.view.getOverlayPane()!)
    }

    CustomMouseEvent.redirectMouseEvents(sizer.elem!, this.graph, this.state)

    if (this.graph.isEnabled()) {
      sizer.setCursor(cursor)
    }

    if (!this.isSizerVisible(index)) {
      sizer.visible = false
    }

    return sizer
  }

  private createSizerShape(
    bounds: Rectangle,
    index: number,
    fillColor?: string,
  ) {
    if (this.handleImage != null) {
      bounds = new Rectangle( // tslint:disable-line
        bounds.x,
        bounds.y,
        this.handleImage.width,
        this.handleImage.height,
      )
      const shape = new ImageShape(bounds, this.handleImage.src)
      shape.preserveImageAspect = false
      return shape
    }

    const fill = fillColor || constants.HANDLE_FILLCOLOR
    const stroke = constants.HANDLE_STROKECOLOR

    if (index === DomEvent.ROTATION_HANDLE) {
      return new EllipseShape(bounds, fill, stroke)
    }

    return new RectangleShape(bounds, fill, stroke)
  }

  private isSizerVisible(index: number) {
    return true
  }

  private moveSizerTo(
    shape: RectangleShape | EllipseShape | ImageShape,
    x: number,
    y: number,
  ) {
    if (shape != null) {
      shape.bounds.x = Math.floor(x - shape.bounds.width / 2)
      shape.bounds.y = Math.floor(y - shape.bounds.height / 2)

      if (shape.elem && shape.elem.style.display !== 'none') {
        shape.redraw()
      }
    }
  }

  /**
   * Returns the index of the handle for the given event.
   */
  getHandleForEvent(e: CustomMouseEvent) {
    // Connection highlight may consume events before they reach sizer handle
    const tol = (!DomEvent.isMouseEvent(e.getEvent())) ? this.tolerance : 1
    const hit = (this.allowHandleBoundsCheck && (detector.IS_IE || tol > 0))
      ? new Rectangle(
        e.getGraphX() - tol,
        e.getGraphY() - tol,
        2 * tol,
        2 * tol,
      )
      : null

    const checkShape = (shape: Shape | null) => {
      return (
        shape &&
        (
          e.isSource(shape) ||
          (
            hit != null &&
            util.intersects(shape.bounds, hit) &&
            shape.elem!.style.display !== 'none' &&
            shape.elem!.style.visibility !== 'hidden'
          )
        )
      )
    }

    if (this.customHandles != null && this.isCustomHandleEvent(e)) {
      // Inverse loop order to match display order
      // for (let i = this.customHandles.length - 1; i >= 0; i -= 1) {
      //   if (checkShape(this.customHandles[i].shape)) {
      //     return DomEvent.CUSTOM_HANDLE - i
      //   }
      // }
    }

    if (checkShape(this.rotationShape)) {
      return DomEvent.ROTATION_HANDLE
    }
    if (checkShape(this.labelShape)) {
      return DomEvent.LABEL_HANDLE
    }

    if (this.sizers != null) {
      for (let i = 0; i < this.sizers.length; i += 1) {
        if (checkShape(this.sizers[i])) {
          return i
        }
      }
    }

    return null
  }

  private isCustomHandleEvent(e: CustomMouseEvent) {
    return true
  }

  mouseDown(e: CustomMouseEvent, sender: any) {
    const tol = !DomEvent.isMouseEvent(e.getEvent()) ? this.tolerance : 0
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

  private isLivePreviewBorder() {
    return (
      // returns true if the shape is transparent.
      this.state.shape != null &&
      this.state.shape.fill == null &&
      this.state.shape.stroke == null
    )
  }

  start(x: number, y: number, index: number) {
    if (this.selectionShape != null) {

      this.inTolerance = true
      this.childOffsetX = 0
      this.childOffsetY = 0
      this.index = index
      this.startX = x
      this.startY = y

      // Saves reference to parent state
      const model = this.state.view.graph.model
      const parent = model.getParent(this.state.cell)

      if (
        this.state.view.currentRoot !== parent &&
        (model.isNode(parent) || model.isEdge(parent))
      ) {
        this.parentState = this.state.view.graph.view.getState(parent)
      }

      // Creates a preview that can be on top of any HTML label
      this.selectionShape.elem!.style.display =
        (index === DomEvent.ROTATION_HANDLE) ? 'inline' : 'none'

      // Creates the border that represents the new bounds
      if (!this.livePreview || this.isLivePreviewBorder()) {
        this.preview = this.createSelectionShape(this.bounds)

        if (!((this.state.style.rotation || 0) !== 0) &&
          this.state.text != null && this.state.text.elem!.parentNode === this.graph.container
        ) {
          this.preview.dialect = constants.DIALECT_STRICTHTML
          this.preview.init(this.graph.container)
        } else {
          this.preview.dialect = constants.DIALECT_SVG
          this.preview.init(this.graph.view.getOverlayPane()!)
        }
      }

      // Prepares the handles for live preview
      if (this.livePreview) {
        this.hideSizers()

        if (index === DomEvent.ROTATION_HANDLE) {
          this.rotationShape.elem!.style.display = ''
        } else if (index === DomEvent.LABEL_HANDLE) {
          this.labelShape!.elem!.style.display = ''
        } else if (this.sizers != null && this.sizers[index] != null) {
          this.sizers[index].elem!.style.display = ''
        } else if (index <= DomEvent.CUSTOM_HANDLE && this.customHandles != null) {
          // this.customHandles[DomEvent.CUSTOM_HANDLE - index].setVisible(true)
        }

        // Gets the array of connected edge handlers for redrawing
        const edges = this.graph.getEdges(this.state.cell)
        this.edgeHandlers = []

        for (let i = 0; i < edges.length; i += 1) {
          const handler = this.graph.selectionHandler.getHandler(edges[i])

          if (handler != null) {
            this.edgeHandlers.push(handler)
          }
        }
      }
    }
  }

  private setHandlesVisible(visible: boolean) {
    if (this.sizers != null) {
      for (let i = 0; i < this.sizers.length; i += 1) {
        this.sizers[i].elem!.style.display = (visible) ? '' : 'none'
      }
    }

    // if (this.customHandles != null) {
    //   for (let i = 0; i < this.customHandles.length; i += 1) {
    //     this.customHandles[i].setVisible(visible)
    //   }
    // }
  }

  private hideSizers() {
    this.setHandlesVisible(false)
  }

  private checkTolerance(e: CustomMouseEvent) {
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

  /**
   * Hook for subclassers do show details while the handler is active.
   */
  updateHint(e: CustomMouseEvent) { }

  /**
   * Hooks for subclassers to hide details when the handler gets inactive.
   */
  removeHint() { }

  /**
   * Hook for rounding the angle. This uses Math.round.
   */
  roundAngle(angle: number) {
    return Math.round(angle * 10) / 10
  }

  /**
   * Hook for rounding the unscaled width or height. This uses Math.round.
   */
  roundLength(length: number) {
    return Math.round(length)
  }

  mouseMove(e: CustomMouseEvent, sender: any) {
    if (!e.isConsumed() && this.index != null) {
      // Checks tolerance for ignoring single clicks
      this.checkTolerance(e)

      if (!this.inTolerance) {

        if (this.index <= DomEvent.CUSTOM_HANDLE) {
          // if (this.customHandles != null) {
          //   this.customHandles[DomEvent.CUSTOM_HANDLE - this.index].processEvent(e)
          //   this.customHandles[DomEvent.CUSTOM_HANDLE - this.index].active = true
          // }
        } else if (this.index === DomEvent.LABEL_HANDLE) {
          this.moveLabel(e)
        } else if (this.index === DomEvent.ROTATION_HANDLE) {
          this.rotateNode(e)
        } else {
          this.resizeNode(e)
        }

        this.updateHint(e)
      }

      e.consume()

    } else if (
      !this.graph.isMouseDown &&
      this.getHandleForEvent(e) != null
    ) {
      // Workaround for disabling the connect highlight when over handle
      e.consume(false)
    }
  }

  moveLabel(e: CustomMouseEvent) {
    const point = new Point(e.getGraphX(), e.getGraphY())
    const trans = this.graph.view.translate
    const scale = this.graph.view.scale

    if (this.graph.isGridEnabledEvent(e.getEvent())) {
      point.x = (this.graph.snap(point.x / scale - trans.x) + trans.x) * scale
      point.y = (this.graph.snap(point.y / scale - trans.y) + trans.y) * scale
    }

    if (this.sizers) {

      const index = (this.rotationShape != null)
        ? this.sizers.length - 2
        : this.sizers.length - 1

      this.moveSizerTo(this.sizers[index], point.x, point.y)
    }
  }

  rotateNode(e: CustomMouseEvent) {
    const point = new Point(e.getGraphX(), e.getGraphY())
    const dx = this.state.bounds.x + this.state.bounds.width / 2 - point.x
    const dy = this.state.bounds.y + this.state.bounds.height / 2 - point.y

    this.currentAlpha = (dx !== 0)
      ? Math.atan(dy / dx) * 180 / Math.PI + 90
      : ((dy < 0) ? 180 : 0)

    if (dx > 0) {
      this.currentAlpha -= 180
    }

    // Rotation raster
    if (this.rotationRaster && this.graph.isGridEnabledEvent(e.getEvent())) {
      const dx = point.x - this.state.bounds.getCenterX()
      const dy = point.y - this.state.bounds.getCenterY()
      const dist = Math.abs(Math.sqrt(dx * dx + dy * dy) - 20) * 3
      const raster = Math.max(1, 5 * Math.min(3, Math.max(0, Math.round(80 / Math.abs(dist)))))

      this.currentAlpha = Math.round(this.currentAlpha / raster) * raster
    } else {
      this.currentAlpha = this.roundAngle(this.currentAlpha)
    }

    if (this.selectionShape) {
      this.selectionShape.rotation = this.currentAlpha
      this.selectionShape.redraw()
    }

    if (this.livePreview) {
      this.redrawHandles()
    }
  }

  resizeNode(e: CustomMouseEvent) {
    const geo = this.graph.getCellGeometry(this.state.cell)!
    const ct = this.state.bounds.getCenter()
    const alpha = util.toRad(this.state.style.rotation || 0)
    const point = new Point(e.getGraphX(), e.getGraphY())
    const trans = this.graph.view.translate
    const scale = this.graph.view.scale

    let cos = Math.cos(-alpha)
    let sin = Math.sin(-alpha)

    let dx = point.x - this.startX
    let dy = point.y - this.startY

    // Rotates vector for mouse gesture
    const tx = cos * dx - sin * dy
    const ty = sin * dx + cos * dy

    dx = tx
    dy = ty

    this.unscaledBounds = this.union(
      geo.bounds,
      dx / scale,
      dy / scale,
      this.index!,
      this.graph.isGridEnabledEvent(e.getEvent()),
      1,
      new Point(0, 0),
      this.isConstrainedEvent(e),
      this.isCenteredEvent(this.state, e),
    )

    // Keeps vertex within maximum graph or parent bounds
    if (!geo.relative) {
      let max = this.graph.getMaximumGraphBounds()

      // Handles child cells
      if (max != null && this.parentState != null) {
        max = max.clone()
        max.x -= (this.parentState.bounds.x - trans.x * scale) / scale
        max.y -= (this.parentState.bounds.y - trans.y * scale) / scale
      }

      if (this.graph.isConstrainChild(this.state.cell)) {
        let tmp = this.graph.getCellContainmentArea(this.state.cell)

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

        if (this.unscaledBounds.x + this.unscaledBounds.width > max.x + max.width) {
          this.unscaledBounds.width -= this.unscaledBounds.x +
            this.unscaledBounds.width - max.x - max.width
        }

        if (this.unscaledBounds.y + this.unscaledBounds.height > max.y + max.height) {
          this.unscaledBounds.height -= this.unscaledBounds.y +
            this.unscaledBounds.height - max.y - max.height
        }
      }
    }

    this.bounds = new Rectangle(
      (this.parentState != null ? this.parentState.bounds.x : trans.x * scale)
      + (this.unscaledBounds.x) * scale,
      (this.parentState != null ? this.parentState.bounds.y : trans.y * scale)
      + (this.unscaledBounds.y) * scale,
      this.unscaledBounds.width * scale,
      this.unscaledBounds.height * scale,
    )

    if (geo.relative && this.parentState != null) {
      this.bounds.x += this.state.bounds.x - this.parentState.bounds.x
      this.bounds.y += this.state.bounds.y - this.parentState.bounds.y
    }

    cos = Math.cos(alpha)
    sin = Math.sin(alpha)

    const c2 = new Point(this.bounds.getCenterX(), this.bounds.getCenterY())

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
    this.unscaledBounds.x = this.roundLength(this.unscaledBounds.x + dx3 / scale)
    this.unscaledBounds.y = this.roundLength(this.unscaledBounds.y + dy3 / scale)
    this.unscaledBounds.width = this.roundLength(this.unscaledBounds.width)
    this.unscaledBounds.height = this.roundLength(this.unscaledBounds.height)

    // Shifts the children according to parent offset
    if (!this.graph.isCellCollapsed(this.state.cell) && (dx3 !== 0 || dy3 !== 0)) {
      this.childOffsetX = this.state.bounds.x - this.bounds.x + dx5
      this.childOffsetY = this.state.bounds.y - this.bounds.y + dy5
    } else {
      this.childOffsetX = 0
      this.childOffsetY = 0
    }

    if (this.livePreview) {
      this.updateLivePreview(e)
    }

    if (this.preview != null) {
      this.drawPreview()
    }
  }

  updateLivePreview(e: CustomMouseEvent) {
    // TODO: Apply child offset to children in live preview
    const scale = this.graph.view.scale
    const tr = this.graph.view.translate

    // Saves current state
    const tempState = this.state.clone()

    // Temporarily changes size and origin
    this.state.bounds.x = this.bounds.x
    this.state.bounds.y = this.bounds.y
    this.state.origin = new Point(
      this.state.bounds.x / scale - tr.x,
      this.state.bounds.y / scale - tr.y,
    )
    this.state.bounds.width = this.bounds.width
    this.state.bounds.height = this.bounds.height

    // Needed to force update of text bounds
    this.state.unscaledWidth = null

    // Redraws cell and handles
    let off = this.state.absoluteOffset
    off = new Point(off.x, off.y)

    // Required to store and reset absolute offset for updating label position
    this.state.absoluteOffset.x = 0
    this.state.absoluteOffset.y = 0
    const geo = this.graph.getCellGeometry(this.state.cell)

    if (geo != null) {
      const offset = geo.offset
      if (offset != null && !geo.relative) {
        this.state.absoluteOffset.x = this.state.view.scale * offset.x
        this.state.absoluteOffset.y = this.state.view.scale * offset.y
      }

      this.state.view.updateNodeLabelOffset(this.state)
    }

    // Draws the live preview
    this.state.view.graph.renderer.redraw(this.state, true)

    // Redraws connected edges TODO: Include child edges
    this.state.view.invalidate(this.state.cell)
    this.state.invalid = false
    this.state.view.validate()
    this.redrawHandles()

    // Restores current state
    this.state.setState(tempState)
  }

  mouseUp(e: CustomMouseEvent, sender: any) {
    if (this.index != null && this.state != null) {

      const point = new Point(e.getGraphX(), e.getGraphY())
      const index = this.index

      this.index = null

      this.graph.batchUpdate(() => {

        if (index <= DomEvent.CUSTOM_HANDLE) {
          // if (this.customHandles != null) {
          //   this.customHandles[DomEvent.CUSTOM_HANDLE - index].active = false
          //   this.customHandles[DomEvent.CUSTOM_HANDLE - index].execute()
          // }
        } else if (index === DomEvent.ROTATION_HANDLE) {

          if (this.currentAlpha != null) {
            const delta = this.currentAlpha - (this.state.style.rotation || 0)
            if (delta !== 0) {
              this.rotateCell(this.state.cell, delta)
            }
          } else {
            this.rotateClick()
          }
        } else {
          const gridEnabled = this.graph.isGridEnabledEvent(e.getEvent())
          const alpha = util.toRad(this.state.style.rotation || 0)
          const cos = Math.cos(-alpha)
          const sin = Math.sin(-alpha)

          let dx = point.x - this.startX
          let dy = point.y - this.startY

          // Rotates vector for mouse gesture
          const tx = cos * dx - sin * dy
          const ty = sin * dx + cos * dy

          dx = tx
          dy = ty

          const s = this.graph.view.scale
          const recurse = this.isRecursiveResize(this.state, e)
          this.resizeCell(
            this.state.cell,
            this.roundLength(dx / s),
            this.roundLength(dy / s),
            index,
            gridEnabled,
            this.isConstrainedEvent(e),
            recurse,
          )
        }
      })

      e.consume()
      this.reset()
    }
  }

  isRecursiveResize(state: CellState, e: CustomMouseEvent) {
    return this.graph.isRecursiveResize()
  }

  /**
   * Hook for subclassers to implement a single click on the rotation handle.
   * This code is executed as part of the model transaction. This implementation
   * is empty.
   */
  rotateClick() { }

  rotateCell(cell: Cell, angle: number, parent?: Cell) {
    if (angle !== 0) {
      const model = this.graph.getModel()

      if (model.isNode(cell) || model.isEdge(cell)) {
        if (!model.isEdge(cell)) {
          const state = this.graph.view.getState(cell)
          const style = (state != null) ? state.style : this.graph.getCellStyle(cell)

          if (style != null) {
            const total = (style.rotation || 0) + angle
            this.graph.setCellStyles('rotation', total, [cell])
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

  reset() {
    if (
      this.sizers && this.index != null && this.sizers[this.index] &&
      this.sizers[this.index].elem!.style.display === 'none'
    ) {
      this.sizers[this.index].elem!.style.display = ''
    }

    this.currentAlpha = null
    this.inTolerance = false
    this.index = null

    if (this.preview != null) {
      this.preview.dispose()
      this.preview = null
    }

    if (this.livePreview && this.sizers != null) {
      for (let i = 0; i < this.sizers.length; i += 1) {
        if (this.sizers[i] != null) {
          this.sizers[i].elem!.style.display = ''
        }
      }
    }

    // if (this.customHandles != null) {
    //   for (let i = 0; i < this.customHandles.length; i += 1) {
    //     if (this.customHandles[i].active) {
    //       this.customHandles[i].active = false
    //       this.customHandles[i].reset()
    //     } else {
    //       this.customHandles[i].setVisible(true)
    //     }
    //   }
    // }

    // Checks if handler has been destroyed
    if (this.selectionShape != null) {
      this.selectionShape.elem!.style.display = 'inline'
      this.selectionBounds = this.getSelectionBounds(this.state)
      this.bounds = this.selectionBounds.clone()
      this.drawPreview()
    }

    this.removeHint()
    this.redrawHandles()
    this.edgeHandlers = null
    this.unscaledBounds = null
  }

  /**
   * Uses the given vector to change the bounds of the given cell
   * in the graph using <mxGraph.resizeCell>.
   */
  resizeCell(
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

  moveChildren(cell: Cell, dx: number, dy: number) {
    cell.eachChild((child) => {
      let geo = this.graph.getCellGeometry(child)
      if (geo != null) {
        geo = geo.clone()
        geo.translate(dx, dy)
        this.graph.model.setGeometry(child, geo)
      }
    })
  }

  union(
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
    if (this.singleSizer) {
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

    {
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

      const result = new Rectangle(left + tr.x * scale, top + tr.y * scale, width, height)

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
  }

  redraw() {
    this.selectionBounds = this.getSelectionBounds(this.state)
    this.bounds = this.selectionBounds.clone()

    this.redrawHandles()
    this.drawPreview()
  }

  redrawHandles() {

    this.verticalOffset = 0
    this.horizontalOffset = 0

    const tol = this.tolerance
    let box = this.bounds

    if (this.sizers && this.sizers.length > 0 && this.sizers[0]) {

      if (this.index == null && this.manageSizers && this.sizers.length >= 8) {

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

        if (this.sizers.length >= 8) {
          if (
            (box.width < 2 * this.sizers[0].bounds.width + 2 * tol) ||
            (box.height < 2 * this.sizers[0].bounds.height + 2 * tol)
          ) {
            this.sizers[0].elem!.style.display = 'none'
            this.sizers[2].elem!.style.display = 'none'
            this.sizers[5].elem!.style.display = 'none'
            this.sizers[7].elem!.style.display = 'none'
          } else {
            this.sizers[0].elem!.style.display = ''
            this.sizers[2].elem!.style.display = ''
            this.sizers[5].elem!.style.display = ''
            this.sizers[7].elem!.style.display = ''
          }
        }
      }

      const right = box.x + box.width
      const bottom = box.y + box.height

      if (this.singleSizer) {
        this.moveSizerTo(this.sizers[0], right, bottom)
      } else {
        const cx = box.x + box.width / 2
        const cy = box.y + box.height / 2

        if (this.sizers.length >= 8) {
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

          const alpha = util.toRad(this.state.style.rotation || 0)
          const cos = Math.cos(alpha)
          const sin = Math.sin(alpha)

          const da = Math.round(alpha * 4 / Math.PI)

          const ct = box.getCenter()
          let pt = util.rotatePoint(new Point(box.x, box.y), cos, sin, ct)

          this.moveSizerTo(this.sizers[0], pt.x, pt.y)
          this.sizers[0].setCursor(cursors[util.mod(0 + da, cursors.length)])

          pt.x = cx
          pt.y = box.y
          pt = util.rotatePoint(pt, cos, sin, ct)

          this.moveSizerTo(this.sizers[1], pt.x, pt.y)
          this.sizers[1].setCursor(cursors[util.mod(1 + da, cursors.length)])

          pt.x = right
          pt.y = box.y
          pt = util.rotatePoint(pt, cos, sin, ct)

          this.moveSizerTo(this.sizers[2], pt.x, pt.y)
          this.sizers[2].setCursor(cursors[util.mod(2 + da, cursors.length)])

          pt.x = box.x
          pt.y = cy
          pt = util.rotatePoint(pt, cos, sin, ct)

          this.moveSizerTo(this.sizers[3], pt.x, pt.y)
          this.sizers[3].setCursor(cursors[util.mod(7 + da, cursors.length)])

          pt.x = right
          pt.y = cy
          pt = util.rotatePoint(pt, cos, sin, ct)

          this.moveSizerTo(this.sizers[4], pt.x, pt.y)
          this.sizers[4].setCursor(cursors[util.mod(3 + da, cursors.length)])

          pt.x = box.x
          pt.y = bottom
          pt = util.rotatePoint(pt, cos, sin, ct)

          this.moveSizerTo(this.sizers[5], pt.x, pt.y)
          this.sizers[5].setCursor(cursors[util.mod(6 + da, cursors.length)])

          pt.x = cx
          pt.y = bottom
          pt = util.rotatePoint(pt, cos, sin, ct)

          this.moveSizerTo(this.sizers[6], pt.x, pt.y)
          this.sizers[6].setCursor(cursors[util.mod(5 + da, cursors.length)])

          pt.x = right
          pt.y = bottom
          pt = util.rotatePoint(pt, cos, sin, ct)

          this.moveSizerTo(this.sizers[7], pt.x, pt.y)
          this.sizers[7].setCursor(cursors[util.mod(4 + da, cursors.length)])

          this.moveSizerTo(
            this.sizers[8],
            cx + this.state.absoluteOffset.x,
            cy + this.state.absoluteOffset.y,
          )
        } else if (
          this.state.bounds.width >= 2 &&
          this.state.bounds.height >= 2
        ) {

          this.moveSizerTo(
            this.sizers[0],
            cx + this.state.absoluteOffset.x,
            cy + this.state.absoluteOffset.y,
          )

        } else {
          this.moveSizerTo(
            this.sizers[0],
            this.state.bounds.x,
            this.state.bounds.y,
          )
        }
      }
    }

    if (this.rotationShape != null) {
      const alpha = util.toRad(this.currentAlpha
        ? this.currentAlpha
        : this.state.style.rotation || 0,
      )
      const cos = Math.cos(alpha)
      const sin = Math.sin(alpha)

      const ct = this.state.bounds.getCenter()
      const pt = util.rotatePoint(this.getRotationHandlePosition(), cos, sin, ct)

      if (this.rotationShape.elem != null) {
        this.moveSizerTo(this.rotationShape, pt.x, pt.y)

        // Hides rotation handle during text editing
        this.rotationShape.elem.style.visibility =
          this.state.view.graph.isEditing() ? 'hidden' : ''
      }
    }

    if (this.selectionShape != null) {
      this.selectionShape.rotation = this.state.style.rotation || 0
    }

    // if (this.edgeHandlers != null) {
    //   for (let i = 0; i < this.edgeHandlers.length; i += 1) {
    //     this.edgeHandlers[i].redraw()
    //   }
    // }

    // if (this.customHandles != null) {
    //   for (let i = 0; i < this.customHandles.length; i += 1) {
    //     const temp = this.customHandles[i].shape.node.style.display
    //     this.customHandles[i].redraw()
    //     this.customHandles[i].shape.node.style.display = temp

    //     // Hides custom handles during text editing
    //     this.customHandles[i].shape.node.style.visibility =
    //       this.graph.isEditing() ? 'hidden' : ''
    //   }
    // }

    this.updateParentHighlight()
  }

  private getHandlePadding() {
    const result = new Point(0, 0)
    let tol = this.tolerance

    if (
      this.sizers && this.sizers.length > 0 && this.sizers[0] &&
      (
        this.bounds.width < 2 * this.sizers[0].bounds.width + 2 * tol ||
        this.bounds.height < 2 * this.sizers[0].bounds.height + 2 * tol
      )
    ) {
      tol /= 2

      result.x = this.sizers[0].bounds.width + tol
      result.y = this.sizers[0].bounds.height + tol
    }

    return result
  }

  private getRotationHandlePosition() {
    return new Point(
      this.bounds.x + this.bounds.width / 2,
      this.bounds.y + this.rotationHandleVSpacing,
    )
  }

  private updateParentHighlight() {
    // If not destroyed
    if (this.selectionShape != null) {
      if (this.parentHighlight != null) {
        const parent = this.graph.model.getParent(this.state.cell)

        if (this.graph.model.isNode(parent)) {
          const pstate = this.graph.view.getState(parent)
          const b = this.parentHighlight.bounds

          if (
            pstate != null &&
            (
              b.x !== pstate.bounds.x ||
              b.y !== pstate.bounds.y ||
              b.width !== pstate.bounds.width ||
              b.height !== pstate.bounds.height
            )
          ) {
            this.parentHighlight.bounds = pstate.bounds
            this.parentHighlight.redraw()
          }
        } else {
          this.parentHighlight.dispose()
          this.parentHighlight = null
        }
      } else if (this.parentHighlightEnabled) {
        const parent = this.graph.model.getParent(this.state.cell)

        if (this.graph.model.isNode(parent)) {
          const pstate = this.graph.view.getState(parent)

          if (pstate != null) {
            this.parentHighlight = this.createParentHighlightShape(pstate.bounds)
            this.parentHighlight.dialect = constants.DIALECT_SVG
            this.parentHighlight.pointerEvents = false
            this.parentHighlight.rotation = util.getRotation(pstate)
            this.parentHighlight.init(this.graph.getView().getOverlayPane())
          }
        }
      }
    }
  }

  drawPreview() {
    if (this.preview != null) {
      this.preview.bounds = this.bounds

      if (this.preview.elem!.parentNode === this.graph.container) {
        this.preview.bounds.width = Math.max(0, this.preview.bounds.width - 1)
        this.preview.bounds.height = Math.max(0, this.preview.bounds.height - 1)
      }

      this.preview.rotation = (this.state.style.rotation || 0)
      this.preview.redraw()
    }

    if (this.selectionShape) {
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

    if (this.preview != null) {
      this.preview.dispose()
      this.preview = null
    }

    if (this.parentHighlight != null) {
      this.parentHighlight.dispose()
      this.parentHighlight = null
    }

    if (this.selectionShape != null) {
      this.selectionShape.dispose()
      this.selectionShape = null
    }

    this.labelShape = null
    this.removeHint()

    if (this.sizers != null) {
      for (let i = 0; i < this.sizers.length; i += 1) {
        this.sizers[i].dispose()
      }

      this.sizers = null
    }

    if (this.customHandles != null) {
      for (let i = 0; i < this.customHandles.length; i += 1) {
        this.customHandles[i].dispose()
      }

      this.customHandles = null
    }

    super.dispose()
  }
}
