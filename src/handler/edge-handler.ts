import * as routers from '../router'
import * as util from '../util'
import { Cell, State, Graph } from '../core'
import { Rectangle, Point, Image, Constraint } from '../struct'
import { constants, DomEvent, MouseEventEx, detector } from '../common'
import { Shape, RectangleShape, ImageShape, EllipseShape } from '../shape'
import { MouseHandler } from './handler-mouse'
import { CellMarker } from './cell-marker'
import { ConstraintHandler } from './constraint-handler'

export class EdgeHandler extends MouseHandler {
  state: State
  bends: (ImageShape | null)[] | (EllipseShape | null)[] | null = null
  virtualBends: ImageShape[] | EllipseShape[] | null = null

  /**
   * The `CellMarker` which is used for highlighting terminals.
   */
  marker: CellMarker

  /**
   * The `ConstraintHandler` used for drawing and highlighting constraints.
   */
  constraintHandler: ConstraintHandler

  /**
   * Holds the `Shape` that represents the preview edge.
   */
  previewShape: Shape | null

  /**
   * Specifies if cloning by control-drag is enabled.
   *
   * Default is `true`.
   */
  cloneable: boolean = true

  /**
   * Specifies if adding bends by shift-click is enabled.
   *
   * Default is `false`.
   */
  addable: boolean = false

  /**
   * Specifies if removing bends by shift-click is enabled.
   *
   * Default is `false`.
   */
  removable: boolean = false

  /**
   * Specifies if removing bends by double click is enabled.
   *
   * Default is `false`.
   */
  dblClickRemoveEnabled: boolean = false

  /**
   * Specifies if removing bends by dropping them on other bends is enabled.
   *
   * Default is `false`.
   */
  mergeRemoveEnabled: boolean = false

  /**
   * Specifies if removing bends by creating straight segments is enabled.
   *
   * If enabled, this can be overridden by holding down the alt key while
   * moving.
   *
   * Default is `false`.
   */
  straightRemoveEnabled: boolean = false

  /**
   * Specifies if virtual bends should be added in the center of each
   * segments. These bends can then be used to add new waypoints.
   *
   * Default is `false`.
   */
  virtualBendsEnabled: boolean = false

  /**
   * Opacity to be used for virtual bends.
   *
   * Default is `20`.
   */
  virtualBendOpacity: number = 20

  /**
   * Specifies if the parent should be highlighted if a child cell is selected.
   *
   * Default is `false`.
   */
  parentHighlightEnabled: boolean = false

  parentHighlight: RectangleShape | null

  preferHtml: boolean = false

  /**
   * Specifies if waypoints should snap to the routing centers of terminals.
   *
   * Default is `false`.
   */
  snapToTerminals: boolean = false

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
  tolerance = 0

  /**
   * Specifies if the bounds of handles should be used for hit-detection in IE.
   *
   * Default is `true`.
   */
  checkHandleBounds: boolean = true

  /**
   * Specifies if connections to the outline of a highlighted target should be
   * enabled. This will allow to place the connection point along the outline
   * of the highlighted target.
   *
   * Default is `false`.
   */
  outlineConnect: boolean = false

  /**
   * Holds the current validation error while a connection is being changed.
   */
  error: string | null = null

  /**
   * Specifies if the label handle should be moved if it intersects with
   * another handle.
   *
   * Default is `false`.
   */
  manageLabelHandle: boolean = false

  labelHandleImage: Image
  labelShape: ImageShape | RectangleShape | EllipseShape | null
  labelPos: Point | null

  protected escapeHandler: (() => void) | null
  protected customHandles: any[] | null
  protected points: Point[] | null
  protected absolutePoints: Point[]
  protected snapPoint: Point | null
  protected startX: number
  protected startY: number
  protected index: number | null
  protected active: boolean

  isSource: boolean
  isTarget: boolean
  isLabel: boolean
  currentPoint: Point

  constructor(graph: Graph, state: State) {
    super(graph)
    this.state = state
    this.init()

    this.escapeHandler = () => {
      const dirty = this.index != null
      this.reset()
      if (dirty) {
        this.graph.renderer.redraw(this.state, false, state.view.isRendering())
      }
    }

    this.state.view.graph.on(Graph.events.escape, this.escapeHandler)
  }

  init() {
    this.marker = new EdgeHandler.EdgeHandlerMarker(this.graph, this)
    this.constraintHandler = new ConstraintHandler(this.graph)

    // Clones the original points from the cell
    // and makes sure at least one point exists
    this.points = []

    // Uses the absolute points of the state
    // for the initial configuration and preview
    this.absolutePoints = this.getSelectionPoints(this.state)
    this.previewShape = this.createSelectionShape(this.absolutePoints)
    this.previewShape.dialect = 'svg'
    this.previewShape.pointerEvents = false
    this.previewShape.init(this.graph.view.getOverlayPane())
    this.previewShape.setCursor(constants.CURSOR_MOVABLE_EDGE)

    MouseEventEx.redirectMouseEvents(
      this.previewShape.elem!, this.graph, this.state,
    )

    // Updates preferHtml
    this.preferHtml = this.isPreferHtml()

    // Adds highlight for parent group
    if (this.parentHighlightEnabled) {
      const parent = this.graph.model.getParent(this.state.cell)
      if (this.graph.model.isNode(parent)) {
        const pstate = this.graph.view.getState(parent)
        if (pstate != null) {
          this.parentHighlight = this.createParentHighlightShape(pstate.bounds)
          this.parentHighlight.pointerEvents = false
          this.parentHighlight.rotation = util.getRotation(pstate)
          this.parentHighlight.init(this.graph.view.getOverlayPane())
        }
      }
    }

    // Creates bends for the non-routed absolute points
    // or bends that don't correspond to points
    const maxCellCount = this.graph.graphHandler.maxCellCount
    if (maxCellCount <= 0 || this.graph.getSelecedCellCount() < maxCellCount) {
      this.bends = this.createBends()
      if (this.isVirtualBendsEnabled()) {
        this.virtualBends = this.createVirtualBends()
      }
    }

    // Adds a rectangular handle for the label position
    this.labelPos = this.state.absoluteOffset.clone()
    this.labelShape = this.createLabelHandleShape()
    this.initHandle(this.labelShape)
    this.labelShape.setCursor(constants.CURSOR_LABEL_HANDLE)

    this.customHandles = this.createCustomHandles()

    this.redraw()
  }

  /**
   * Returns the list of points that defines the selection stroke.
   */
  protected getSelectionPoints(state: State) {
    return state.absolutePoints
  }

  protected createParentHighlightShape(bounds: Rectangle) {
    const shape = new RectangleShape(bounds, null, this.getSelectionColor())
    shape.strokeWidth = this.getSelectionStrokeWidth()
    shape.dashed = this.isSelectionDashed()
    return shape
  }

  protected createSelectionShape(points: Point[]) {
    const ctor = this.state.shape!.constructor
    const shape = new (ctor as any)() as Shape

    shape.outline = true
    shape.apply(this.state)

    shape.stroke = this.getSelectionColor()
    shape.dashed = this.isSelectionDashed()
    shape.shadow = false

    return shape
  }

  protected getSelectionColor() {
    return constants.EDGE_SELECTION_COLOR
  }

  protected getSelectionStrokeWidth() {
    return constants.EDGE_SELECTION_STROKEWIDTH
  }

  protected isSelectionDashed() {
    return constants.EDGE_SELECTION_DASHED
  }

  protected isPreferHtml() {
    const check = (state: State | null) => (
      state != null &&
      state.text != null &&
      state.text.elem != null &&
      state.text.elem.parentNode === this.graph.container
    )

    let preferHtml = check(this.state)
    if (!preferHtml) {
      // Checks source terminal
      preferHtml = check(this.state.getVisibleTerminalState(true))
    }

    if (!preferHtml) {
      // Checks target terminal
      preferHtml = check(this.state.getVisibleTerminalState(false))
    }

    return preferHtml
  }

  /**
   * Returns true if the given cell is connectable. This is a hook to
   * disable floating connections.
   */
  isConnectableCell(cell: Cell | null) {
    return true
  }

  validateConnection(source: Cell | null, target: Cell | null) {
    return this.graph.validator.getEdgeValidationError(
      this.state.cell, source, target,
    )
  }

  protected getCellAt(x: number, y: number) {
    return (!this.outlineConnect) ? this.graph.getCellAt(x, y) : null
  }

  /**
   * Creates and returns the bends used for modifying the edge.
   */
  protected createBends() {
    const bends = []
    const cell = this.state.cell
    const len = this.absolutePoints.length
    const bendable = this.graph.isCellBendable(cell)

    for (let i = 0; i < len; i += 1) {
      if (this.isHandleVisible(i)) {
        const isSource = i === 0
        const isTarget = i === len - 1
        const isTerminal = isSource || isTarget

        if (isTerminal || bendable) {
          const bend = this.createHandleShape(i)
          const dblClick = (index => () => {
            if (this.dblClickRemoveEnabled) {
              this.removePoint(this.state, index)
            }
          })(i)

          this.initHandle(bend, dblClick)

          if (this.isHandleEnabled(i)) {
            bend.setCursor((isTerminal)
              ? constants.CURSOR_TERMINAL_HANDLE
              : constants.CURSOR_BEND_HANDLE)
          }

          bends.push(bend)

          if (!isTerminal) {
            this.points!.push(new Point(0, 0))
            bend.elem!.style.visibility = 'hidden'
          }
        }
      }
    }

    return bends
  }

  protected isVirtualBendsEnabled() {
    return this.virtualBendsEnabled && (
      this.state.style.edge == null ||
      this.state.style.edge === constants.NONE ||
      this.state.style.noEdgeStyle === true
    ) &&
      this.state.style.shape !== 'arrow'
  }

  protected createVirtualBends() {
    const cell = this.state.cell
    const bends = []

    if (this.graph.isCellBendable(cell)) {
      for (let i = 1, ii = this.absolutePoints.length; i < ii; i += 1) {
        const bend = this.createHandleShape(i)
        this.initHandle(bend)
        bend.setCursor(constants.CURSOR_VIRTUAL_BEND_HANDLE)
        bends.push(bend)
      }
    }

    return bends
  }

  protected isHandleVisible(index: number) {
    if (index === 0 || index === this.absolutePoints.length - 1) {
      return true
    }

    const geo = this.graph.getCellGeometry(this.state.cell)
    const sourceState = this.state.getVisibleTerminalState(true)
    const targetState = this.state.getVisibleTerminalState(false)
    const edgeFn = (geo != null) ? this.graph.view.getEdgeFunction(
      this.state, geo.points, sourceState, targetState,
    ) : null

    return edgeFn !== routers.entityRelation
  }

  protected isHandleEnabled(index: number) {
    return true
  }

  /**
   * Creates the shape used to display the given bend.
   *
   * Note that the index may be `null` for special cases, such as when
   * called from `createVirtualBend`. Only images and rectangles should be
   * returned if support for HTML labels with not foreign objects is required.
   */
  protected createHandleShape(
    index?: number | null,
  ): ImageShape | EllipseShape {
    if (this.handleImage != null) {
      const shape = new ImageShape(
        new Rectangle(
          0, 0,
          this.handleImage.width,
          this.handleImage.height,
        ),
        this.handleImage.src,
      )

      shape.preserveImageAspect = false

      return shape
    }

    let s = constants.HANDLE_SIZE
    if (this.preferHtml) {
      s -= 1
    }

    return new EllipseShape(
      new Rectangle(0, 0, s, s),
      constants.HANDLE_FILLCOLOR,
      constants.HANDLE_STROKECOLOR,
    )
  }

  /**
   * Creates the shape used to display the the label handle.
   */
  protected createLabelHandleShape() {
    if (this.labelHandleImage) {
      const shape = new ImageShape(
        new Rectangle(
          0, 0,
          this.labelHandleImage.width,
          this.labelHandleImage.height,
        ),
        this.labelHandleImage.src,
      )

      // Allows HTML rendering of the images
      shape.preserveImageAspect = false

      return shape
    }

    const s = constants.LABEL_HANDLE_SIZE
    return new EllipseShape(
      new Rectangle(0, 0, s, s),
      constants.LABEL_HANDLE_FILLCOLOR,
      constants.HANDLE_STROKECOLOR,
    )
  }

  protected initHandle(
    handle: EllipseShape | ImageShape | RectangleShape,
    dblClick?: (evt: MouseEvent) => void,
  ) {
    if (this.preferHtml) {
      handle.dialect = 'html'
      handle.init(this.graph.container)
    } else {
      handle.dialect = 'svg'
      handle.init(this.graph.view.getOverlayPane())
    }

    MouseEventEx.redirectMouseEvents(
      handle.elem!, this.graph, this.state,
      null, null, null, dblClick,
    )

    if (detector.SUPPORT_TOUCH) {
      handle.elem!.setAttribute('pointer-events', 'none')
    }
  }

  protected createCustomHandles() {
    return null
  }

  /**
   * Returns true if the given event is a trigger to add a new point.
   * This implementation returns `true` if shift is pressed.
   */
  protected isAddPointEvent(evt: MouseEvent) {
    return DomEvent.isShiftDown(evt)
  }

  /**
   * Returns true if the given event is a trigger to remove a point.
   * This implementation returns `true` if shift is pressed.
   */
  protected isRemovePointEvent(evt: MouseEvent) {
    return DomEvent.isShiftDown(evt)
  }

  /**
   * Returns true if the given event allows virtual bends to be added.
   */
  protected isAddVirtualBendEvent(e: MouseEventEx) {
    return true
  }

  /**
   * Returns true if the given event allows custom handles to be changed.
   */
  protected isCustomHandleEvent(e: MouseEventEx) {
    return true
  }

  protected isSnapToTerminalsEvent(e: MouseEventEx) {
    return this.snapToTerminals && !DomEvent.isAltDown(e.getEvent())
  }

  /**
   * Returns the index of the handle for the given event.
   */
  protected getHandleForEvent(e: MouseEventEx) {
    // Connection highlight may consume events before they reach sizer handle
    const tol = !DomEvent.isMouseEvent(e.getEvent()) ? this.tolerance : 1
    const hit = (this.checkHandleBounds && (detector.IS_IE || tol > 0)) ?
      new Rectangle(
        e.getGraphX() - tol,
        e.getGraphY() - tol,
        2 * tol,
        2 * tol,
      ) : null

    let minDist: number | null = null
    let result = null

    function checkShape(shape: Shape | null) {
      if (
        shape && util.isVisible(shape.elem) &&
        (
          e.isSource(shape) ||
          (hit && shape.bounds.isIntersectWith(hit))
        )
      ) {
        const dx = e.getGraphX() - shape.bounds.getCenterX()
        const dy = e.getGraphY() - shape.bounds.getCenterY()
        const tmp = dx * dx + dy * dy

        if (minDist == null || tmp <= minDist) {
          minDist = tmp
          return true
        }
      }

      return false
    }

    if (this.customHandles && this.isCustomHandleEvent(e)) {
      // Inverse loop order to match display order
      for (let i = this.customHandles.length - 1; i >= 0; i -= 1) {
        if (checkShape(this.customHandles[i].shape)) {
          return DomEvent.CUSTOM_HANDLE - i
        }
      }
    }

    if (e.isSource(this.state.text) || checkShape(this.labelShape)) {
      result = DomEvent.LABEL_HANDLE
    }

    if (this.bends != null) {
      for (let i = 0, ii = this.bends.length; i < ii; i += 1) {
        if (checkShape(this.bends[i])) {
          result = i
        }
      }
    }

    if (this.virtualBends != null && this.isAddVirtualBendEvent(e)) {
      for (let i = 0, ii = this.virtualBends.length; i < ii; i += 1) {
        if (checkShape(this.virtualBends[i])) {
          result = DomEvent.VIRTUAL_HANDLE - i
        }
      }
    }

    return result
  }

  /**
   * Handles the event by checking if a special element of the handler
   * was clicked, in which case the index parameter is non-null. The
   * indices may be one of <LABEL_HANDLE> or the number of the respective
   * control point. The source and target points are used for reconnecting
   * the edge.
   */
  mouseDown(e: MouseEventEx) {
    const index = this.getHandleForEvent(e)!
    if (this.bends != null && index != null && this.bends[index] != null) {
      this.snapPoint = this.bends[index]!.bounds.getCenter()
    }

    if (this.addable && index == null && this.isAddPointEvent(e.getEvent())) {

      this.addPoint(this.state, e.getEvent())
      e.consume()

    } else if (index != null && !e.isConsumed() && this.graph.isEnabled()) {

      if (this.removable && this.isRemovePointEvent(e.getEvent())) {
        this.removePoint(this.state, index)
      } else if (
        !DomEvent.isLabelHandle(index) ||
        this.graph.isLabelMovable(e.getCell())
      ) {
        if (DomEvent.isVisualHandle(index) && this.virtualBends) {
          const bend = this.virtualBends[DomEvent.getVisualHandle(index)]
          bend.elem!.style.opacity = '100'
        }

        this.start(e.getClientX(), e.getClientY(), index)
      }

      e.consume()
    }
  }

  /**
   * Adds a control point for the given state and event.
   */
  protected addPoint(state: State, evt: MouseEvent) {
    const pt = util.clientToGraph(
      this.graph.container,
      DomEvent.getClientX(evt),
      DomEvent.getClientY(evt),
    )
    const gridEnabled = this.graph.isGridEnabledForEvent(evt)
    this.convertPoint(pt, gridEnabled)
    this.addPointAt(state, pt.x, pt.y)
    DomEvent.consume(evt)
  }

  /**
   * Adds a control point at the given point.
   */
  protected addPointAt(state: State, x: number, y: number) {
    let geo = this.graph.getCellGeometry(state.cell)
    if (geo != null) {
      geo = geo.clone()
      const t = this.graph.view.translate
      const s = this.graph.view.scale
      const p = new Point(x, y)
      let offset = new Point(t.x * s, t.y * s)

      const parent = this.graph.model.getParent(this.state.cell)
      if (this.graph.model.isNode(parent)) {
        const pState = this.graph.view.getState(parent)
        if (pState) {
          offset = new Point(pState.bounds.x, pState.bounds.y)
        }
      }

      const index = util.findNearestSegment(
        state,
        p.x * s + offset.x,
        p.y * s + offset.y,
      )

      if (geo.points == null) {
        geo.points = [p]
      } else {
        geo.points.splice(index, 0, p)
      }

      this.graph.model.setGeometry(state.cell, geo)
      this.refresh()
      this.redraw()
    }
  }

  /**
   * Removes the control point at the given index from the given state.
   */
  protected removePoint(state: State, index: number) {
    if (index > 0 && index < this.absolutePoints.length - 1) {
      let geo = this.graph.getCellGeometry(this.state.cell)
      if (geo != null && geo.points != null) {
        geo = geo.clone()
        geo.points.splice(index - 1, 1)
        this.graph.model.setGeometry(state.cell, geo)
        this.refresh()
        this.redraw()
      }
    }
  }

  protected start(x: number, y: number, index: number) {
    this.startX = x
    this.startY = y

    this.isSource = this.bends ? index === 0 : false
    this.isTarget = this.bends ? index === this.bends.length - 1 : false
    this.isLabel = DomEvent.isLabelHandle(index)

    if (this.isSource || this.isTarget) {
      const cell = this.state.cell
      const terminal = this.graph.model.getTerminal(cell, this.isSource)

      if (
        (terminal == null && this.graph.isTerminalPointMovable(cell, this.isSource)) ||
        (terminal != null && this.graph.isCellDisconnectable(cell, terminal, this.isSource))
      ) {
        this.index = index
      }
    } else {
      this.index = index
    }

    // Hides other custom handles
    if (this.index != null) {
      if (DomEvent.isCustomHandle(this.index)) {
        if (this.customHandles != null) {
          const idx = DomEvent.getCustomHandle(this.index)
          for (let i = 0, ii = this.customHandles.length; i < ii; i += 1) {
            if (i !== idx) {
              this.customHandles[i].setVisible(false)
            }
          }
        }
      }
    }
  }

  mouseMove(e: MouseEventEx) {
    if (this.index != null && this.marker != null) {
      this.currentPoint = this.getPointForEvent(e)
      this.error = null

      const evt = e.getEvent()

      // Uses the current point from the constraint handler if available
      if (
        !this.graph.isConnectionIgnored(evt) &&
        DomEvent.isShiftDown(evt) &&
        this.snapPoint != null
      ) {
        if (
          Math.abs(this.snapPoint.x - this.currentPoint.x) <
          Math.abs(this.snapPoint.y - this.currentPoint.y)
        ) {
          this.currentPoint.x = this.snapPoint.x
        } else {
          this.currentPoint.y = this.snapPoint.y
        }
      }

      if (DomEvent.isCustomHandle(this.index)) {
        if (this.customHandles != null) {
          const idx = DomEvent.getCustomHandle(this.index)
          this.customHandles[idx].processEvent(e)
        }
      } else if (this.isLabel) {

        this.labelPos!.x = this.currentPoint.x
        this.labelPos!.y = this.currentPoint.y

      } else {

        let outline = false
        this.points = this.getPreviewPoints(this.currentPoint, e)!
        let terminalState = (this.isSource || this.isTarget)
          ? this.getPreviewTerminalState(e)
          : null

        if (
          this.constraintHandler.currentConstraint != null &&
          this.constraintHandler.currentState != null &&
          this.constraintHandler.currentPoint != null
        ) {

          this.currentPoint = this.constraintHandler.currentPoint.clone()

        } else if (this.outlineConnect) {

          // Need to check outline before cloning terminal state
          outline = (this.isSource || this.isTarget)
            ? this.isOutlineConnectEvent(e)
            : false

          if (outline) {
            terminalState = this.marker.highlight.state
          } else if (
            terminalState != null &&
            terminalState !== e.getState() &&
            this.marker.highlight.shape != null
          ) {
            this.marker.highlight.shape.stroke = 'transparent'
            this.marker.highlight.repaint()
            terminalState = null
          }
        }

        if (
          terminalState != null &&
          this.graph.isCellLocked(terminalState.cell)
        ) {
          terminalState = null
          this.marker.reset()
        }

        const clone = this.clonePreviewState(
          this.currentPoint,
          (terminalState != null) ? terminalState.cell : null,
        )

        this.updatePreviewState(
          clone, this.currentPoint, terminalState, e, outline,
        )

        // Sets the color of the preview to valid or invalid, updates the
        // points of the preview and redraws
        const color = (this.error == null)
          ? this.marker.validColor
          : this.marker.invalidColor

        this.setPreviewColor(color)
        this.absolutePoints = clone.absolutePoints
        this.active = true
      }

      // This should go before calling isOutlineConnectEvent above.
      // As a workaround we add an offset of gridSize to the hint
      // to avoid problem with hit detection in highlight.isHighlightAt
      // (which uses comonentFromPoint)
      this.updateHint(e, this.currentPoint)
      this.drawPreview()
      DomEvent.consume(e.getEvent())
      e.consume()

    } else if (detector.IS_IE && this.getHandleForEvent(e) != null) {
      // Workaround for disabling the connect highlight when over handle
      e.consume(false)
    }
  }

  protected getSnapToTerminalTolerance() {
    return this.graph.gridSize * this.graph.view.scale / 2
  }

  /**
   * Hook for subclassers do show details while the handler is active.
   */
  protected updateHint(e: MouseEventEx, point: Point) { }

  /**
   * Hooks for subclassers to hide details when the handler gets inactive.
   */
  protected removeHint() { }

  protected roundLength(length: number) {
    return Math.round(length)
  }

  /**
   * Returns the point for the given event.
   */
  protected getPointForEvent(e: MouseEventEx) {
    const view = this.graph.view
    const scale = view.scale
    const result = new Point(
      this.roundLength(e.getGraphX() / scale) * scale,
      this.roundLength(e.getGraphY() / scale) * scale,
    )

    const tt = this.getSnapToTerminalTolerance()
    let overrideX = false
    let overrideY = false

    if (tt > 0 && this.isSnapToTerminalsEvent(e)) {
      const snapToPoint = (pt: Point) => {
        if (pt != null) {
          const x = pt.x

          if (Math.abs(result.x - x) < tt) {
            result.x = x
            overrideX = true
          }

          const y = pt.y

          if (Math.abs(result.y - y) < tt) {
            result.y = y
            overrideY = true
          }
        }
      }

      // Temporary function
      const snapToTerminal = (terminal: State | null) => {
        if (terminal != null) {
          snapToPoint(
            new Point(
              view.getRoutingCenterX(terminal),
              view.getRoutingCenterY(terminal),
            ))
        }
      }

      snapToTerminal(this.state.getVisibleTerminalState(true))
      snapToTerminal(this.state.getVisibleTerminalState(false))

      if (this.state.absolutePoints != null) {
        this.state.absolutePoints.forEach(p => snapToPoint(p))
      }
    }

    if (this.graph.isGridEnabledForEvent(e.getEvent())) {
      const t = view.translate
      if (!overrideX) {
        result.x = (this.graph.snap(result.x / scale - t.x) + t.x) * scale
      }
      if (!overrideY) {
        result.y = (this.graph.snap(result.y / scale - t.y) + t.y) * scale
      }
    }

    return result
  }

  /**
   * Updates the given preview state taking into account
   * the state of the constraint handler.
   */
  protected getPreviewPoints(pt: Point, e: MouseEventEx) {
    const point = new Point(pt.x, pt.y)
    const index = this.index!
    const geo = this.graph.getCellGeometry(this.state.cell)!
    let points = (geo.points != null) ? geo.points.slice() : null
    let result = null

    if (!this.isSource && !this.isTarget) {
      this.convertPoint(point, false)

      if (points == null) {
        points = [point]
      } else {
        // Adds point from virtual bend
        if (DomEvent.isVisualHandle(index)) {
          points.splice(DomEvent.getVisualHandle(index), 0, point)
        }

        // Removes point if dragged on terminal point
        if (!this.isSource && !this.isTarget) {
          if (this.bends != null) {
            for (let i = 0, ii = this.bends.length; i < ii; i += 1) {
              if (i !== index) {
                const bend = this.bends[i]
                if (bend != null && bend.bounds.containsPoint(pt)) {

                  if (DomEvent.isVisualHandle(index)) {
                    points.splice(DomEvent.getVisualHandle(index), 1)
                  } else {
                    points.splice(index - 1, 1)
                  }

                  result = points
                }
              }
            }
          }

          // Removes point if user tries to straighten a segment
          if (
            result == null &&
            this.straightRemoveEnabled &&
            (e == null || !DomEvent.isAltDown(e.getEvent()))
          ) {
            const tol = this.graph.tolerance * this.graph.tolerance
            const abs = this.state.absolutePoints.slice()
            abs[index] = pt

            // Handes special case where removing waypoint affects tolerance (flickering)
            const src = this.state.getVisibleTerminalState(true)

            if (src != null) {
              const c = this.graph.getConnectionConstraint(this.state, src, true)

              // Checks if point is not fixed
              if (c == null || this.graph.view.getConnectionPoint(src, c) == null) {
                abs[0] = new Point(src.view.getRoutingCenterX(src), src.view.getRoutingCenterY(src))
              }
            }

            const trg = this.state.getVisibleTerminalState(false)

            if (trg != null) {
              const c = this.graph.getConnectionConstraint(this.state, trg, false)

              // Checks if point is not fixed
              if (c == null || this.graph.view.getConnectionPoint(trg, c) == null) {
                abs[abs.length - 1] = new Point(
                  trg.view.getRoutingCenterX(trg),
                  trg.view.getRoutingCenterY(trg),
                )
              }
            }

            const checkRemove = (idx: number, tmp: Point) => {
              if (idx > 0 && idx < abs.length - 1 &&
                util.ptSegmentDist(
                  abs[idx - 1].x, abs[idx - 1].y,
                  abs[idx + 1].x, abs[idx + 1].y,
                  tmp.x, tmp.y,
                ) < tol
              ) {
                points!.splice(idx - 1, 1)
                result = points
              }
            }

            // LATER: Check if other points can be removed if a segment is made straight
            checkRemove(index, pt)
          }
        }

        // Updates existing point
        if (result == null && !DomEvent.isVisualHandle(index)) {
          points[index - 1] = point
        }
      }
    } else if (this.graph.resetEdgesOnConnect) {
      points = null
    }

    return (result != null) ? result : points
  }

  /**
   * Updates the given preview state taking into account
   * the state of the constraint handler.
   */
  protected getPreviewTerminalState(e: MouseEventEx) {
    this.constraintHandler.update(
      e,
      this.isSource,
      true,
      e.isSource(this.marker.highlight.shape)
        ? null
        : this.currentPoint,
    )

    if (
      this.constraintHandler.currentState != null &&
      this.constraintHandler.currentConstraint != null
    ) {
      // Handles special case where grid is large and connection point is at actual point in which
      // case the outline is not followed as long as we're < gridSize / 2 away from that point
      if (
        this.marker.highlight != null &&
        this.marker.highlight.state != null &&
        this.marker.highlight.state.cell === this.constraintHandler.currentState.cell
      ) {
        // Direct repaint needed if cell already highlighted
        if (this.marker.highlight.shape!.stroke !== 'transparent') {
          this.marker.highlight.shape!.stroke = 'transparent'
          this.marker.highlight.repaint()
        }
      } else {
        this.marker.markCell(this.constraintHandler.currentState.cell, 'transparent')
      }

      const model = this.graph.getModel()
      const other = this.graph.view.getTerminalPortState(
        this.state,
        this.graph.view.getState(
          model.getTerminal(this.state.cell, !this.isSource),
        )!,
        !this.isSource,
      )
      const otherCell = (other != null) ? other.cell : null
      const source = (this.isSource) ? this.constraintHandler.currentState.cell : otherCell
      const target = (this.isSource) ? otherCell : this.constraintHandler.currentState.cell

      // Updates the error message of the handler
      this.error = this.validateConnection(source, target)
      let result = null

      if (this.error == null) {
        result = this.constraintHandler.currentState
      } else {
        this.constraintHandler.reset()
      }

      return result
    }

    if (!this.graph.isConnectionIgnored(e.getEvent())) {
      this.marker.process(e)
      const state = this.marker.getValidState()

      if (state != null && this.graph.isCellLocked(state.cell)) {
        this.marker.reset()
      }

      return this.marker.getValidState()
    }

    this.marker.reset()

    return null
  }

  /**
   * Returns true if <outlineConnect> is true and the source of the event is the outline shape
   * or shift is pressed.
   */
  protected isOutlineConnectEvent(me: MouseEventEx) {
    const offset = util.getOffset(this.graph.container)
    const evt = me.getEvent()

    const clientX = DomEvent.getClientX(evt)
    const clientY = DomEvent.getClientY(evt)

    const doc = document.documentElement
    const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

    const gridX = this.currentPoint.x - this.graph.container.scrollLeft + offset.x - left
    const gridY = this.currentPoint.y - this.graph.container.scrollTop + offset.y - top

    return (
      this.outlineConnect &&
      !DomEvent.isShiftDown(me.getEvent()) &&
      (
        me.isSource(this.marker.highlight.shape) ||
        (DomEvent.isAltDown(me.getEvent()) && me.getState() != null) ||
        this.marker.highlight.isHighlightAt(clientX, clientY) ||
        (
          (gridX !== clientX || gridY !== clientY) &&
          me.getState() == null &&
          this.marker.highlight.isHighlightAt(gridX, gridY)
        )
      )
    )
  }

  protected clonePreviewState(point: Point, terminal: Cell | null) {
    return this.state.clone()
  }

  /**
   * Updates the given preview state taking into account
   * the state of the constraint handler.
   */
  protected updatePreviewState(
    edge: State,
    point: Point,
    terminalState: State | null,
    e: MouseEventEx,
    outline: boolean,
  ) {
    // Computes the points for the edge style and terminals
    const sourceState = (this.isSource) ? terminalState : this.state.getVisibleTerminalState(true)
    const targetState = (this.isTarget) ? terminalState : this.state.getVisibleTerminalState(false)

    let sourceConstraint = this.graph.getConnectionConstraint(edge, sourceState, true)
    let targetConstraint = this.graph.getConnectionConstraint(edge, targetState, false)

    let constraint = this.constraintHandler.currentConstraint

    if (constraint == null && outline) {
      if (terminalState != null) {
        // Handles special case where mouse is on outline away from actual end point
        // in which case the grid is ignored and mouse point is used instead
        if (e.isSource(this.marker.highlight.shape)) {
          // tslint:disable-next-line
          point = new Point(e.getGraphX(), e.getGraphY())
        }

        constraint = this.graph.cellManager.getOutlineConstraint(
          point, terminalState, e,
        )
        this.constraintHandler.focus(e, terminalState, this.isSource)
        this.constraintHandler.currentConstraint = constraint
        this.constraintHandler.currentPoint = point
      } else {
        constraint = new Constraint()
      }
    }

    if (this.outlineConnect &&
      this.marker.highlight != null &&
      this.marker.highlight.shape != null) {
      const s = this.graph.view.scale

      if (
        this.constraintHandler.currentConstraint != null &&
        this.constraintHandler.currentState != null
      ) {
        this.marker.highlight.shape.stroke = (outline)
          ? constants.OUTLINE_HIGHLIGHT_COLOR : 'transparent'
        this.marker.highlight.shape.strokeWidth = constants.OUTLINE_HIGHLIGHT_STROKEWIDTH / s / s
        this.marker.highlight.repaint()
      } else if (this.marker.hasValidState()) {
        this.marker.highlight.shape.stroke = (this.marker.getValidState() === e.getState()) ?
          constants.DEFAULT_VALID_COLOR : 'transparent'
        this.marker.highlight.shape.strokeWidth = constants.HIGHLIGHT_STROKEWIDTH / s / s
        this.marker.highlight.repaint()
      }
    }

    if (this.isSource) {
      sourceConstraint = constraint!
    } else if (this.isTarget) {
      targetConstraint = constraint!
    }

    if (this.isSource || this.isTarget) {
      if (constraint != null && constraint.point != null) {
        if (this.isSource) {
          edge.style.exitX = constraint.point.x
          edge.style.exitY = constraint.point.y
        } else {
          edge.style.entryX = constraint.point.x
          edge.style.entryY = constraint.point.y
        }
      } else {
        if (this.isSource) {
          delete edge.style.exitX
          delete edge.style.exitY
        } else {
          delete edge.style.entryX
          delete edge.style.entryY
        }
      }
    }

    edge.setVisibleTerminalState(sourceState, true)
    edge.setVisibleTerminalState(targetState, false)

    if (!this.isSource || sourceState != null) {
      edge.view.updateFixedTerminalPoint(edge, sourceState!, true, sourceConstraint)
    }

    if (!this.isTarget || targetState != null) {
      edge.view.updateFixedTerminalPoint(edge, targetState!, false, targetConstraint)
    }

    if ((this.isSource || this.isTarget) && terminalState == null) {
      edge.setAbsoluteTerminalPoint(point, this.isSource)

      if (this.marker.getMarkedState() == null) {
        this.error = (this.graph.allowDanglingEdges) ? null : ''
      }
    }

    edge.view.updateRouterPoints(edge, this.points || [], sourceState!, targetState!)
    edge.view.updateFloatingTerminalPoints(edge, sourceState!, targetState!)
  }

  mouseUp(e: MouseEventEx) {
    if (this.index != null && this.marker != null) {
      const index = this.index!
      let edge = this.state.cell

      this.index = null

      // Ignores event if mouse has not been moved
      if (e.getClientX() !== this.startX || e.getClientY() !== this.startY) {
        const clone = (
          !this.graph.isConnectionIgnored(e.getEvent()) &&
          this.graph.isCloneEvent(e.getEvent()) &&
          this.cloneable &&
          this.graph.isCellsCloneable()
        )

        // Displays the reason for not carriying out the change
        // if there is an error message with non-zero length
        if (this.error != null) {

          if (this.error.length > 0) {
            this.graph.validationWarn(this.error)
          }

        } else if (DomEvent.isCustomHandle(index)) {

          if (this.customHandles != null) {
            this.graph.batchUpdate(() => {
              this.customHandles![DomEvent.getCustomHandle(index)].execute()
            })
          }

        } else if (this.isLabel) {

          this.moveLabel(this.state, this.labelPos!.x, this.labelPos!.y)

        } else if (this.isSource || this.isTarget) {

          let terminal: Cell | null = null

          if (
            this.constraintHandler.currentConstraint != null &&
            this.constraintHandler.currentState != null
          ) {
            terminal = this.constraintHandler.currentState.cell
          }

          if (
            terminal == null &&
            this.marker.hasValidState() &&
            this.marker.highlight != null &&
            this.marker.highlight.shape != null &&
            this.marker.highlight.shape.stroke !== 'transparent' &&
            this.marker.highlight.shape.stroke !== 'white'
          ) {
            terminal = this.marker.validState!.cell
          }

          if (terminal != null) {
            const model = this.graph.getModel()
            const parent = model.getParent(edge)

            this.graph.batchUpdate(() => {
              // Clones and adds the cell
              if (clone) {
                let geo = model.getGeometry(edge)
                const clone = this.graph.cloneCell(edge)
                model.add(parent, clone, model.getChildCount(parent))

                if (geo != null) {
                  geo = geo.clone()
                  model.setGeometry(clone, geo)
                }

                const other = model.getTerminal(edge, !this.isSource)!
                this.graph.connectCell(clone, other, !this.isSource)

                edge = clone
              }

              edge = this.connect(edge, terminal!, this.isSource, clone, e)
            })
          } else if (this.graph.isDanglingEdgesEnabled()) {
            const s = this.graph.view.scale
            const t = this.graph.view.translate
            const i = this.isSource ? 0 : this.absolutePoints.length - 1
            const p = this.absolutePoints[i]

            p.x = this.roundLength(p.x / s - t.x)
            p.y = this.roundLength(p.y / s - t.y)

            const pstate = this.graph.view.getState(
              this.graph.getModel().getParent(edge))

            if (pstate != null) {
              p.x -= pstate.origin.x
              p.y -= pstate.origin.y
            }

            p.x -= this.graph.tx / s
            p.y -= this.graph.ty / s

            // Destroys and recreates this handler
            edge = this.changeTerminalPoint(edge, p, this.isSource, clone)
          }
        } else if (this.active) {
          edge = this.changePoints(edge, this.points || [], clone)
        } else {
          this.graph.view.invalidate(this.state.cell)
          this.graph.view.validate(this.state.cell)
        }
      }

      // Resets the preview color the state of the handler if this
      // handler has not been recreated
      if (this.marker != null) {
        this.reset()

        // Updates the selection if the edge has been cloned
        if (edge !== this.state.cell) {
          this.graph.setSelectedCell(edge)
        }
      }

      e.consume()
    }
  }

  /**
   * Resets the state of this handler.
   */
  protected reset() {
    if (this.active) {
      this.refresh()
    }

    this.error = null
    this.index = null
    this.labelPos = null
    this.points = null
    this.snapPoint = null
    this.isLabel = false
    this.isSource = false
    this.isTarget = false
    this.active = false

    if (this.marker != null) {
      this.marker.reset()
    }

    if (this.constraintHandler != null) {
      this.constraintHandler.reset()
    }

    if (this.customHandles != null) {
      for (let i = 0, ii = this.customHandles.length; i < ii; i += 1) {
        this.customHandles[i].reset()
      }
    }

    this.setPreviewColor(constants.EDGE_SELECTION_COLOR)
    this.removeHint()
    this.redraw()
  }

  /**
   * Sets the color of the preview to the given value.
   */
  protected setPreviewColor(color: string | null) {
    if (this.previewShape != null) {
      this.previewShape.stroke = color
    }
  }

  /**
   * Converts the given point in-place from screen to unscaled, untranslated
   * graph coordinates and applies the grid. Returns the given, modified
   * point instance.
   */
  protected convertPoint(point: Point, gridEnabled: boolean) {
    const scale = this.graph.view.getScale()
    const trans = this.graph.view.getTranslate()

    if (gridEnabled) {
      point.x = this.graph.snap(point.x)
      point.y = this.graph.snap(point.y)
    }

    point.x = Math.round(point.x / scale - trans.x)
    point.y = Math.round(point.y / scale - trans.y)

    const pstate = this.graph.view.getState(
      this.graph.getModel().getParent(this.state.cell),
    )

    if (pstate != null) {
      point.x -= pstate.origin.x
      point.y -= pstate.origin.y
    }

    return point
  }

  /**
   * Changes the coordinates for the label of the given edge.
   */
  protected moveLabel(edgeState: State, x: number, y: number) {
    const model = this.graph.getModel()
    const scale = this.graph.view.scale
    let geo = model.getGeometry(edgeState.cell)

    if (geo != null) {
      geo = geo.clone()

      if (geo.relative) {
        // Resets the relative location stored inside the geometry
        let pt = this.graph.view.getRelativePoint(edgeState, x, y)
        geo.bounds.x = Math.round(pt.x * 10000) / 10000
        geo.bounds.y = Math.round(pt.y)

        // Resets the offset inside the geometry to find the offset
        // from the resulting point
        geo.offset = new Point(0, 0)
        pt = this.graph.view.getPointOnEdge(edgeState, geo)
        geo.offset = new Point(
          Math.round((x - pt.x) / scale),
          Math.round((y - pt.y) / scale),
        )

      } else {

        const points = edgeState.absolutePoints
        const p0 = points[0]
        const pe = points[points.length - 1]

        if (p0 != null && pe != null) {
          const cx = p0.x + (pe.x - p0.x) / 2
          const cy = p0.y + (pe.y - p0.y) / 2

          geo.offset = new Point(
            Math.round((x - cx) / scale),
            Math.round((y - cy) / scale),
          )
          geo.bounds.x = 0
          geo.bounds.y = 0
        }
      }
      model.setGeometry(edgeState.cell, geo)
    }
  }

  protected connect(
    edge: Cell,
    terminal: Cell,
    isSource: boolean,
    clone: boolean,
    e: MouseEventEx,
  ) {
    this.graph.batchUpdate(() => {
      let constraint = this.constraintHandler.currentConstraint
      if (constraint == null) {
        constraint = new Constraint()
      }

      this.graph.connectCell(edge, terminal, isSource, constraint)
    })

    return edge
  }

  /**
   * Changes the terminal point of the given edge.
   */
  protected changeTerminalPoint(
    edge: Cell,
    point: Point,
    isSource: boolean,
    clone: boolean,
  ) {

    const model = this.graph.getModel()
    this.graph.batchUpdate(() => {
      if (clone) {
        const parent = model.getParent(edge)
        const terminal = model.getTerminal(edge, !isSource)
        edge = this.graph.cloneCell(edge) // tslint:disable-line
        model.add(parent, edge, model.getChildCount(parent))
        model.setTerminal(edge, terminal, !isSource)
      }

      let geo = model.getGeometry(edge)

      if (geo != null) {
        geo = geo.clone()
        geo.setTerminalPoint(point, isSource)
        model.setGeometry(edge, geo)
        this.graph.connectCell(edge, null, isSource, new Constraint())
      }
    })

    return edge
  }

  /**
   * Changes the control points of the given edge in the graph model.
   */
  protected changePoints(edge: Cell, points: Point[], clone: boolean) {
    const model = this.graph.getModel()
    this.graph.batchUpdate(() => {
      if (clone) {
        const parent = model.getParent(edge)
        const source = model.getTerminal(edge, true)
        const target = model.getTerminal(edge, false)
        edge = this.graph.cloneCell(edge) // tslint:disable-line
        model.add(parent, edge, model.getChildCount(parent))
        model.setTerminal(edge, source, true)
        model.setTerminal(edge, target, false)
      }

      let geo = model.getGeometry(edge)

      if (geo != null) {
        geo = geo.clone()
        geo.points = points

        model.setGeometry(edge, geo)
      }
    })

    return edge
  }

  /**
   * Returns the fillcolor for the handle at the given index.
   */
  protected getHandleFillColor(index: number) {
    const isSource = index === 0
    const cell = this.state.cell
    const terminal = this.graph.getModel().getTerminal(cell, isSource)
    let color = constants.HANDLE_FILLCOLOR

    if (
      (terminal != null && !this.graph.isCellDisconnectable(cell, terminal, isSource)) ||
      (terminal == null && !this.graph.isTerminalPointMovable(cell, isSource))
    ) {
      color = constants.LOCKED_HANDLE_FILLCOLOR
    } else if (
      terminal != null &&
      this.graph.isCellDisconnectable(cell, terminal, isSource)
    ) {
      color = constants.CONNECT_HANDLE_FILLCOLOR
    }

    return color
  }

  protected refresh() {
    this.absolutePoints = this.getSelectionPoints(this.state)
    this.points = []

    if (this.previewShape != null) {
      this.previewShape.points = this.absolutePoints
    }

    if (this.bends != null) {
      this.disposeHandles(this.bends)
      this.bends = this.createBends()
    }

    if (this.virtualBends != null) {
      this.disposeHandles(this.virtualBends)
      this.virtualBends = this.createVirtualBends()
    }

    if (this.customHandles != null) {
      this.disposeHandles(this.customHandles)
      this.customHandles = this.createCustomHandles()
    }

    // Puts label node on top of bends
    if (this.labelShape) {
      util.toFront(this.labelShape.elem)
    }
  }

  redraw() {
    this.absolutePoints = this.state.absolutePoints.slice()
    this.redrawHandles()

    const geo = this.graph.model.getGeometry(this.state.cell)!
    const pts = geo.points

    if (pts != null && this.bends != null && this.bends.length > 0) {
      if (this.points == null) {
        this.points = []
      }

      for (let i = 1, ii = this.bends.length - 1; i < ii; i += 1) {
        if (this.bends[i] != null && this.absolutePoints[i] != null) {
          this.points[i - 1] = pts[i - 1]
        }
      }
    }

    this.drawPreview()
  }

  protected redrawHandles() {
    const cell = this.state.cell

    if (this.labelShape != null) {
      // Updates the handle for the label position
      const bounds = this.labelShape.bounds
      this.labelPos = this.state.absoluteOffset.clone()
      this.labelShape.bounds = new Rectangle(
        Math.round(this.labelPos.x - bounds.width / 2),
        Math.round(this.labelPos.y - bounds.height / 2),
        bounds.width,
        bounds.height,
      )

      // Shows or hides the label handle depending on the label
      const txt = this.graph.getLabel(cell)
      this.labelShape.visible = (
        txt != null &&
        (txt as string).length > 0 &&
        this.graph.isLabelMovable(cell)
      )
    }

    if (this.bends != null && this.bends.length > 0) {
      const p0 = this.absolutePoints[0]
      const pe = this.absolutePoints[this.absolutePoints.length - 1]

      // first bend
      const bend0 = this.bends[0]
      if (bend0 != null) {
        const x0 = p0.x
        const y0 = p0.y
        const b = bend0.bounds
        bend0.bounds = new Rectangle(
          Math.floor(x0 - b.width / 2),
          Math.floor(y0 - b.height / 2),
          b.width,
          b.height,
        )
        bend0.fill = this.getHandleFillColor(0)
        bend0.redraw()

        if (this.manageLabelHandle) {
          this.checkLabelHandle(bend0.bounds)
        }
      }

      // last bend
      const bende = this.bends[this.bends.length - 1]
      if (bende != null) {
        const xn = pe.x
        const yn = pe.y

        const index = this.bends.length - 1
        const b = bende.bounds
        bende.bounds = new Rectangle(
          Math.floor(xn - b.width / 2),
          Math.floor(yn - b.height / 2),
          b.width,
          b.height,
        )
        bende.fill = this.getHandleFillColor(index)
        bende.redraw()

        if (this.manageLabelHandle) {
          this.checkLabelHandle(bende.bounds)
        }
      }

      this.redrawInnerBends(p0, pe)
    }

    if (
      this.absolutePoints != null &&
      this.virtualBends != null &&
      this.virtualBends.length > 0
    ) {
      let pl = this.absolutePoints[0]
      for (let i = 0, ii = this.virtualBends.length; i < ii; i += 1) {
        const pt = this.absolutePoints[i + 1]
        const bend = this.virtualBends[i]
        if (bend != null && pt != null) {
          const x = pl.x + (pt.x - pl.x) / 2
          const y = pl.y + (pt.y - pl.y) / 2

          bend.bounds = new Rectangle(
            Math.floor(x - bend.bounds.width / 2),
            Math.floor(y - bend.bounds.height / 2),
            bend.bounds.width,
            bend.bounds.height,
          )
          bend.redraw()
          bend.elem!.style.opacity = `${this.virtualBendOpacity}`
          pl = pt

          if (this.manageLabelHandle) {
            this.checkLabelHandle(bend.bounds)
          }
        }
      }
    }

    if (this.labelShape != null) {
      this.labelShape.redraw()
    }

    if (this.customHandles != null) {
      this.customHandles.forEach(c => c.redraw())
    }
  }

  protected drawPreview() {
    if (this.isLabel) {
      if (this.labelShape != null) {
        const b = this.labelShape.bounds
        const bounds = new Rectangle(
          Math.round(this.labelPos!.x - b.width / 2),
          Math.round(this.labelPos!.y - b.height / 2),
          b.width,
          b.height,
        )
        this.labelShape.bounds = bounds
        this.labelShape.redraw()
      }
    } else if (this.previewShape != null) {
      this.previewShape.apply(this.state)
      this.previewShape.points = this.absolutePoints
      this.previewShape.scale = this.state.view.scale
      this.previewShape.dashed = this.isSelectionDashed()
      this.previewShape.stroke = this.getSelectionColor()
      this.previewShape.strokeWidth = this.getSelectionStrokeWidth() / this.previewShape.scale
      this.previewShape.shadow = false
      this.previewShape.redraw()
    }

    if (this.parentHighlight != null) {
      this.parentHighlight.redraw()
    }
  }

  /**
   * Checks if the label handle intersects the given bounds and moves
   * it if it intersects.
   */
  protected checkLabelHandle(b: Rectangle) {
    if (this.labelShape != null) {
      const b2 = this.labelShape.bounds
      if (b.isIntersectWith(b2)) {
        if (b.getCenterY() < b2.getCenterY()) {
          b2.y = b.y + b.height
        } else {
          b2.y = b.y - b2.height
        }
      }
    }
  }

  protected redrawInnerBends(p0: Point, pe: Point) {
    if (this.bends) {
      for (let i = 1, ii = this.bends.length - 1; i < ii; i += 1) {
        const bend = this.bends[i]
        if (bend != null) {
          if (this.absolutePoints[i] != null) {
            const x = this.absolutePoints[i].x
            const y = this.absolutePoints[i].y
            const b = bend.bounds

            bend.elem!.style.visibility = 'visible'
            bend.bounds = new Rectangle(
              Math.round(x - b.width / 2),
              Math.round(y - b.height / 2),
              b.width,
              b.height,
            )

            if (this.manageLabelHandle) {
              this.checkLabelHandle(bend.bounds)
            } else if (
              this.handleImage == null &&
              this.labelShape != null &&
              this.labelShape.visible &&
              bend.bounds.isIntersectWith(this.labelShape.bounds)
            ) {
              const w = constants.HANDLE_SIZE + 3
              const h = constants.HANDLE_SIZE + 3
              bend.bounds = new Rectangle(
                Math.round(x - w / 2),
                Math.round(y - h / 2),
                w,
                h,
              )
            }

            bend.redraw()
          } else {
            bend.dispose()
            this.bends[i] = null
          }
        }
      }
    }
  }

  protected setHandlesVisible(visible: boolean) {
    this.bends && this.bends.forEach((bend) => {
      if (bend && bend.elem) {
        bend.elem!.style.display = visible ? '' : 'none'
      }
    })

    this.virtualBends && this.virtualBends.forEach((bend) => {
      if (bend && bend.elem) {
        bend.elem!.style.display = visible ? '' : 'none'
      }
    })

    if (this.labelShape != null) {
      this.labelShape.elem!.style.display = visible ? '' : 'none'
    }

    if (this.customHandles != null) {
      this.customHandles.forEach(c => c.setVisible(visible))
    }
  }

  protected disposeHandles(
    bends: (ImageShape | null)[] | (EllipseShape | null)[] | null,
  ) {
    bends && bends.forEach(b => (b && b.dispose()))
  }

  dispose() {
    if (this.disposed) {
      return
    }

    this.state.view.graph.off(Graph.events.escape, this.escapeHandler)
    this.escapeHandler = null

    this.marker.dispose()
    this.constraintHandler.dispose()

    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
    }

    if (this.parentHighlight != null) {
      this.parentHighlight.dispose()
      this.parentHighlight = null
    }

    if (this.labelShape != null) {
      this.labelShape.dispose()
      this.labelShape = null
    }

    this.disposeHandles(this.virtualBends)
    this.virtualBends = null

    this.disposeHandles(this.customHandles)
    this.customHandles = null

    this.disposeHandles(this.bends)
    this.bends = null

    this.removeHint()

    super.dispose()
  }
}

export namespace EdgeHandler {
  export class EdgeHandlerMarker extends CellMarker {
    edgeHandler: EdgeHandler

    constructor(graph: Graph, edgeHandler: EdgeHandler) {
      super(graph)
      this.edgeHandler = edgeHandler
    }

    get state() {
      return this.edgeHandler.state
    }

    get currentPoint() {
      return this.edgeHandler.currentPoint
    }

    get isSource() {
      return this.edgeHandler.isSource
    }

    // Only returns edges if they are connectable and never returns
    // the edge that is currently being modified
    getCell(e: MouseEventEx) {
      const model = this.graph.getModel()
      let cell = super.getCell(e)

      // Checks for cell at preview point (with grid)
      if (
        (cell === this.state.cell || cell == null) &&
        this.currentPoint != null
      ) {
        cell = this.graph.getCellAt(this.currentPoint.x, this.currentPoint.y)
      }

      // Uses connectable parent node if one exists
      if (cell != null && !this.graph.isCellConnectable(cell)) {
        const parent = model.getParent(cell)

        if (model.isNode(parent) && this.graph.isCellConnectable(parent)) {
          cell = parent
        }
      }

      if (
        (
          this.graph.isSwimlane(cell) && this.currentPoint != null &&
          this.graph.cellManager.hitsSwimlaneContent(cell, this.currentPoint.x, this.currentPoint.y)
        )
        ||
        !this.edgeHandler.isConnectableCell(cell)
        ||
        (
          cell === this.state.cell ||
          (cell != null && !this.graph.edgesConnectable && model.isEdge(cell))
        )
        ||
        model.isAncestor(this.state.cell, cell)
      ) {
        cell = null
      }

      if (!this.graph.isCellConnectable(cell)) {
        cell = null
      }

      return cell
    }

    // Sets the highlight color according to validateConnection
    isValidState(state: State) {
      const model = this.graph.getModel()
      const other = this.graph.view.getTerminalPortState(
        state, this.graph.view.getState(
          model.getTerminal(this.state.cell, !this.isSource),
        )!,
        !this.isSource,
      )
      const otherCell = (other != null) ? other.cell : null
      const source = (this.isSource) ? state.cell : otherCell
      const target = (this.isSource) ? otherCell : state.cell

      // Updates the error message of the handler
      this.edgeHandler.error =
        this.edgeHandler.validateConnection(source, target)

      return this.edgeHandler.error == null
    }
  }
}
