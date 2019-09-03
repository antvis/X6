import * as util from '../util'
import { Cell, CellState, Graph } from '../core'
import { Rectangle, Point, Image, ConnectionConstraint } from '../struct'
import { constants, DomEvent, CustomMouseEvent, detector } from '../common'
import { Shape, RectangleShape, ImageShape } from '../shape'
import { GraphHandler } from './graph-handler'
import { MouseHandler } from './handler-mouse'
import { CellMarker } from './cell-marker'
import { ConstraintHandler } from './constraint-handler'
import { EdgeStyle } from '../stylesheet'

export class EdgeHandler extends MouseHandler {

  state: CellState
  bends: (ImageShape | null)[] | (RectangleShape | null)[] | null = null
  virtualBends: ImageShape[] | RectangleShape[] | null = null

  /**
   * Holds the <mxTerminalMarker> which is used for highlighting terminals.
   */
  marker: CellMarker

  /**
   * Holds the <mxConstraintHandler> used for drawing and highlighting
   * constraints.
   */
  constraintHandler: ConstraintHandler

  /**
   * Holds the `Shape` that represents the preview edge.
   */
  preview: Shape | null

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
   * Default is false.
   */
  mergeRemoveEnabled: boolean = false

  /**
   * Specifies if removing bends by creating straight segments should be enabled.
   * If enabled, this can be overridden by holding down the alt key while moving.
   * Default is false.
   */
  straightRemoveEnabled: boolean = false

  /**
   * Specifies if virtual bends should be added in the center of each
   * segments. These bends can then be used to add new waypoints.
   * Default is false.
   */
  virtualBendsEnabled: boolean = false

  /**
   * Variable: virtualBendOpacity
   *
   * Opacity to be used for virtual bends (see <virtualBendsEnabled>).
   * Default is 20.
   */
  virtualBendOpacity: number = 20

  /**
   * Specifies if the parent should be highlighted if a child cell is selected.
   *
   * Default is `false`.
   */
  parentHighlightEnabled: boolean = false
  protected parentHighlight: RectangleShape | null

  preferHtml: boolean = false

  /**
   * Variable: snapToTerminals
   *
   * Specifies if waypoints should snap to the routing centers of terminals.
   * Default is false.
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
   * Specifies if the bounds of handles should be used for hit-detection in IE
   * Default is `true`.
   */
  allowHandleBoundsCheck: boolean = true

  /**
   * Specifies if connections to the outline of a highlighted target should be
   * enabled. This will allow to place the connection point along the outline of
   * the highlighted target. Default is false.
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
  labelShape: ImageShape | RectangleShape | null
  labelPos: Point | null

  protected escapeHandler: (() => void) | null
  protected customHandles: any[] | null
  protected points: Point[] | null
  protected abspoints: Point[]
  protected snapPoint: Point | null
  protected startX: number
  protected startY: number
  protected isSource: boolean
  protected isTarget: boolean
  protected isLabel: boolean
  protected index: number | null
  protected currentPoint: Point
  protected active: boolean

  constructor(graph: Graph, state: CellState) {
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
    this.marker = this.createMarker()
    this.constraintHandler = new ConstraintHandler(this.graph)

    // Clones the original points from the cell
    // and makes sure at least one point exists
    this.points = []

    // Uses the absolute points of the state
    // for the initial configuration and preview
    this.abspoints = this.getSelectionPoints(this.state)
    this.preview = this.createSelectionShape(this.abspoints)
    this.preview.dialect = (this.graph.dialect !== 'svg')
      ? 'html'
      : 'svg'
    this.preview.pointerEvents = false
    this.preview.init(this.graph.view.getOverlayPane())
    this.preview.setCursor(constants.CURSOR_MOVABLE_EDGE)

    CustomMouseEvent.redirectMouseEvents(
      this.preview.elem!, this.graph, this.state,
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
          this.parentHighlight.dialect = 'svg'
          this.parentHighlight.pointerEvents = false
          this.parentHighlight.rotation = util.getRotation(pstate)
          this.parentHighlight.init(this.graph.view.getOverlayPane())
        }
      }
    }

    // Creates bends for the non-routed absolute points
    // or bends that don't correspond to points
    if (
      this.graph.getSelecedCellCount() < GraphHandler.prototype.maxCellCount ||
      GraphHandler.prototype.maxCellCount <= 0
    ) {
      this.bends = this.createBends()
      if (this.isVirtualBendsEnabled()) {
        this.virtualBends = this.createVirtualBends()
      }
    }

    // Adds a rectangular handle for the label position
    this.labelPos = new Point(this.state.absoluteOffset.x, this.state.absoluteOffset.y)
    this.labelShape = this.createLabelHandleShape()
    this.initBend(this.labelShape)
    this.labelShape.setCursor(constants.CURSOR_LABEL_HANDLE)

    this.customHandles = this.createCustomHandles()

    this.redraw()
  }

  /**
   * Returns the list of points that defines the selection stroke.
   */
  protected getSelectionPoints(state: CellState) {
    return state.absolutePoints
  }

  /**
   * Creates the shape used to draw the selection border.
   */
  protected createParentHighlightShape(bounds: Rectangle) {
    const shape = new RectangleShape(bounds, null, this.getSelectionColor())
    shape.strokeWidth = this.getSelectionStrokeWidth()
    shape.dashed = this.isSelectionDashed()
    return shape
  }

  /**
   * Creates the shape used to draw the selection border.
   */
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
    const check = (state: CellState | null) => (
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
   * disable floating connections. This implementation returns true.
   */
  isConnectableCell(cell: Cell) {
    return true
  }

  /**
   * Creates and returns the <mxCellMarker> used in <marker>.
   */
  getCellAt(x: number, y: number) {
    return (!this.outlineConnect) ? this.graph.getCellAt(x, y) : null
  }

  protected createMarker() {
    const marker = new CellMarker(this.graph)

    // Only returns edges if they are connectable and never returns
    // the edge that is currently being modified
    marker.getCell = (e: CustomMouseEvent) => {
      let cell = CellMarker.prototype.getCell.call(this, e)

      // Checks for cell at preview point (with grid)
      if (
        (cell === this.state.cell || cell == null) &&
        this.currentPoint != null
      ) {
        cell = this.graph.getCellAt(this.currentPoint.x, this.currentPoint.y)
      }

      // Uses connectable parent vertex if one exists
      if (cell != null && !this.graph.isCellConnectable(cell)) {
        const parent = this.graph.getModel().getParent(cell)

        if (
          this.graph.getModel().isNode(parent) &&
          this.graph.isCellConnectable(parent)
        ) {
          cell = parent
        }
      }

      const model = this.graph.getModel()

      if ((this.graph.isSwimlane(cell) && this.currentPoint != null &&
        this.graph.hitsSwimlaneContent(cell, this.currentPoint.x, this.currentPoint.y)) ||
        (!this.isConnectableCell(cell)) || (cell === this.state.cell ||
          (cell != null && !this.graph.connectableEdges && model.isEdge(cell))) ||
        model.isAncestor(this.state.cell, cell)) {
        cell = null
      }

      if (!this.graph.isCellConnectable(cell)) {
        cell = null
      }

      return cell
    }

    // Sets the highlight color according to validateConnection
    marker.isValidState = (state) => {
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
      this.error = this.validateConnection(source, target)

      return this.error == null
    }

    return marker
  }

  /**
   * Returns the error message or an empty string if the connection for the
   * given source, target pair is not valid. Otherwise it returns null.
   */
  protected validateConnection(source: Cell | null, target: Cell | null) {
    return this.graph.validator.getEdgeValidationError(
      this.state.cell, source, target,
    )
  }

  /**
   * Creates and returns the bends used for modifying the edge.
   */
  protected createBends() {
    const bends = []
    const cell = this.state.cell

    for (let i = 0; i < this.abspoints.length; i += 1) {
      if (this.isHandleVisible(i)) {
        const isSource = i === 0
        const isTarget = i === this.abspoints.length - 1
        const isTerminal = isSource || isTarget

        if (isTerminal || this.graph.isCellBendable(cell)) {
          const bend = this.createHandleShape(i)
          const dblClick = (index => () => {
            if (this.dblClickRemoveEnabled) {
              this.removePoint(this.state, index)
            }
          })(i)

          this.initBend(bend, dblClick)

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

  /**
   * Returns true if virtual bends should be added.
   */
  protected isVirtualBendsEnabled() {
    return this.virtualBendsEnabled && (
      this.state.style.edge == null ||
      this.state.style.edge === constants.NONE ||
      this.state.style.noEdgeStyle === true
    ) &&
      this.state.style.shape !== 'arrow'
  }

  /**
   * Creates and returns the bends used for modifying the edge.
   */
  protected createVirtualBends() {
    const cell = this.state.cell
    const bends = []

    if (this.graph.isCellBendable(cell)) {
      for (let i = 1; i < this.abspoints.length; i += 1) {
        const bend = this.createHandleShape(i)
        this.initBend(bend)
        bend.setCursor(constants.CURSOR_VIRTUAL_BEND_HANDLE)
        bends.push(bend)
      }
    }

    return bends
  }

  /**
   * Returns true if the handle at the given index is visible.
   */
  protected isHandleVisible(index: number) {
    if (index === 0 || index === this.abspoints.length - 1) {
      return true
    }

    const geo = this.graph.getCellGeometry(this.state.cell)
    const sourceState = this.state.getVisibleTerminalState(true)
    const targetState = this.state.getVisibleTerminalState(false)
    const edgeFn = (geo != null) ? this.graph.view.getEdgeFunction(
      this.state, geo.points, sourceState, targetState,
    ) : null

    return edgeFn !== EdgeStyle.entityRelation
  }

  /**
   * Creates the shape used to display the given bend.
   */
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
  protected createHandleShape(index?: number | null): ImageShape | RectangleShape {
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
    return new RectangleShape(
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
    return new RectangleShape(
      new Rectangle(0, 0, s, s),
      constants.LABEL_HANDLE_FILLCOLOR,
      constants.HANDLE_STROKECOLOR)
  }

  protected initBend(
    bend: RectangleShape,
    dblClick?: (evt: MouseEvent) => void,
  ) {
    if (this.preferHtml) {
      bend.dialect = 'html'
      bend.init(this.graph.container)
    } else {
      bend.dialect = (this.graph.dialect !== 'svg')
        ? 'html'
        : 'svg'
      bend.init(this.graph.view.getOverlayPane())
    }

    CustomMouseEvent.redirectMouseEvents(
      bend.elem!, this.graph, this.state,
      null, null, null, dblClick,
    )

    if (detector.SUPPORT_TOUCH) {
      bend.elem!.setAttribute('pointer-events', 'none')
    }
  }

  /**
   * Returns an array of custom handles.
   */
  createCustomHandles() {
    return null
  }

  /**
   * Returns true if the given event is a trigger to add a new point.
   * This implementation returns `true` if shift is pressed.
   */
  isAddPointEvent(evt: MouseEvent) {
    return DomEvent.isShiftDown(evt)
  }

  /**
   * Returns true if the given event is a trigger to remove a point.
   * This implementation returns `true` if shift is pressed.
   */
  isRemovePointEvent(evt: MouseEvent) {
    return DomEvent.isShiftDown(evt)
  }

  /**
   * Returns true if the given event allows virtual bends to be added.
   */
  isAddVirtualBendEvent(e: CustomMouseEvent) {
    return true
  }

  /**
   * Returns true if the given event allows custom handles to be changed.
   */
  isCustomHandleEvent(e: CustomMouseEvent) {
    return true
  }

  /**
   * Returns the index of the handle for the given event.
   */
  getHandleForEvent(e: CustomMouseEvent) {
    // Connection highlight may consume events before they reach sizer handle
    const tol = !DomEvent.isMouseEvent(e.getEvent()) ? this.tolerance : 1
    const hit = (this.allowHandleBoundsCheck && (detector.IS_IE || tol > 0)) ?
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
        shape &&
        shape.elem &&
        shape.elem.style.display !== 'none' &&
        shape.elem.style.visibility !== 'hidden' &&
        (
          e.isSource(shape) ||
          (hit && util.intersects(shape.bounds, hit))
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
  mouseDown(e: CustomMouseEvent) {
    const handle = this.getHandleForEvent(e)!
    if (this.bends != null && this.bends[handle] != null) {
      this.snapPoint = this.bends[handle]!.bounds.getCenter()
    }

    if (this.addable && handle == null && this.isAddPointEvent(e.getEvent())) {
      this.addPoint(this.state, e.getEvent())
      e.consume()
    } else if (handle != null && !e.isConsumed() && this.graph.isEnabled()) {
      if (this.removable && this.isRemovePointEvent(e.getEvent())) {
        this.removePoint(this.state, handle)
      } else if (
        handle !== DomEvent.LABEL_HANDLE ||
        this.graph.isLabelMovable(e.getCell()!)
      ) {
        if (handle <= DomEvent.VIRTUAL_HANDLE && this.virtualBends) {
          const bend = this.virtualBends[DomEvent.VIRTUAL_HANDLE - handle]
          bend.elem!.style.opacity = '100'
        }

        this.start(e.getClientX(), e.getClientY(), handle)
      }

      e.consume()
    }
  }

  /**
   * Adds a control point for the given state and event.
   */
  addPoint(state: CellState, evt: MouseEvent) {
    const pt = util.clientToGraph(
      this.graph.container,
      DomEvent.getClientX(evt),
      DomEvent.getClientY(evt),
    )
    const gridEnabled = this.graph.isGridEnabledEvent(evt)
    this.convertPoint(pt, gridEnabled)
    this.addPointAt(state, pt.x, pt.y)
    DomEvent.consume(evt)
  }

  /**
   * Adds a control point at the given point.
   */
  addPointAt(state: CellState, x: number, y: number) {
    let geo = this.graph.getCellGeometry(state.cell)
    if (geo != null) {
      geo = geo.clone()
      const t = this.graph.view.translate
      const s = this.graph.view.scale
      const pt = new Point(x, y)
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
        pt.x * s + offset.x,
        pt.y * s + offset.y,
      )

      if (geo.points == null) {
        geo.points = [pt]
      } else {
        geo.points.splice(index, 0, pt)
      }

      this.graph.getModel().setGeometry(state.cell, geo)
      this.refresh()
      this.redraw()
    }
  }

  /**
   * Removes the control point at the given index from the given state.
   */
  removePoint(state: CellState, index: number) {
    if (index > 0 && index < this.abspoints.length - 1) {
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

  start(x: number, y: number, index: number) {
    this.startX = x
    this.startY = y

    this.isSource = (this.bends == null) ? false : index === 0
    this.isTarget = (this.bends == null) ? false : index === this.bends.length - 1
    this.isLabel = index === DomEvent.LABEL_HANDLE

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
    if (
      this.index! <= DomEvent.CUSTOM_HANDLE &&
      this.index! > DomEvent.VIRTUAL_HANDLE
    ) {
      if (this.customHandles != null) {
        for (let i = 0, ii = this.customHandles.length; i < ii; i += 1) {
          if (i !== DomEvent.CUSTOM_HANDLE - this.index!) {
            this.customHandles[i].setVisible(false)
          }
        }
      }
    }
  }

  clonePreviewState(point: Point, terminal: Cell | null) {
    return this.state.clone()
  }

  /**
   * Returns the tolerance for the guides. Default value is
   * gridSize * scale / 2.
   */
  getSnapToTerminalTolerance() {
    return this.graph.gridSize * this.graph.view.scale / 2
  }

  /**
   * Hook for subclassers do show details while the handler is active.
   */
  updateHint(e: CustomMouseEvent, point: Point) { }

  /**
   * Function: removeHint
   *
   * Hooks for subclassers to hide details when the handler gets inactive.
   */
  removeHint() { }

  /**
   * Hook for rounding the unscaled width or height. This uses Math.round.
   */
  roundLength(length: number) {
    return Math.round(length)
  }

  /**
   * Returns true if <snapToTerminals> is true and if alt is not pressed.
   */
  isSnapToTerminalsEvent(e: CustomMouseEvent) {
    return this.snapToTerminals && !DomEvent.isAltDown(e.getEvent())
  }

  /**
   * Returns the point for the given event.
   */
  getPointForEvent(e: CustomMouseEvent) {
    const view = this.graph.view
    const scale = view.scale
    const point = new Point(
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

          if (Math.abs(point.x - x) < tt) {
            point.x = x
            overrideX = true
          }

          const y = pt.y

          if (Math.abs(point.y - y) < tt) {
            point.y = y
            overrideY = true
          }
        }
      }

      // Temporary function
      const snapToTerminal = (terminal: CellState) => {
        if (terminal != null) {
          snapToPoint(
            new Point(
              view.getRoutingCenterX(terminal),
              view.getRoutingCenterY(terminal),
            ))
        }
      }

      snapToTerminal(this.state.getVisibleTerminalState(true)!)
      snapToTerminal(this.state.getVisibleTerminalState(false)!)

      if (this.state.absolutePoints != null) {
        for (let i = 0; i < this.state.absolutePoints.length; i += 1) {
          snapToPoint(this.state.absolutePoints[i])
        }
      }
    }

    if (this.graph.isGridEnabledEvent(e.getEvent())) {
      const tr = view.translate

      if (!overrideX) {
        point.x = (this.graph.snap(point.x / scale - tr.x) + tr.x) * scale
      }

      if (!overrideY) {
        point.y = (this.graph.snap(point.y / scale - tr.y) + tr.y) * scale
      }
    }

    return point
  }

  /**
   * Updates the given preview state taking into account
   * the state of the constraint handler.
   */
  getPreviewTerminalState(e: CustomMouseEvent) {
    this.constraintHandler.update(
      e, this.isSource, true,
      e.isSource(this.marker.highlight.shape) ? null : this.currentPoint,
    )

    if (this.constraintHandler.currentFocus != null &&
      this.constraintHandler.currentConstraint != null
    ) {
      // Handles special case where grid is large and connection point is at actual point in which
      // case the outline is not followed as long as we're < gridSize / 2 away from that point
      if (
        this.marker.highlight != null &&
        this.marker.highlight.state != null &&
        this.marker.highlight.state.cell === this.constraintHandler.currentFocus.cell
      ) {
        // Direct repaint needed if cell already highlighted
        if (this.marker.highlight.shape!.stroke !== 'transparent') {
          this.marker.highlight.shape!.stroke = 'transparent'
          this.marker.highlight.repaint()
        }
      } else {
        this.marker.markCell(this.constraintHandler.currentFocus.cell, 'transparent')
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
      const source = (this.isSource) ? this.constraintHandler.currentFocus.cell : otherCell
      const target = (this.isSource) ? otherCell : this.constraintHandler.currentFocus.cell

      // Updates the error message of the handler
      this.error = this.validateConnection(source, target)
      let result = null

      if (this.error == null) {
        result = this.constraintHandler.currentFocus
      } else {
        this.constraintHandler.reset()
      }

      return result
    }
    if (!this.graph.isIgnoreTerminalEvent(e.getEvent())) {
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
   * Updates the given preview state taking into account
   * the state of the constraint handler.
   */
  getPreviewPoints(pt: Point, e: CustomMouseEvent) {
    const geometry = this.graph.getCellGeometry(this.state.cell)!
    let points = (geometry.points != null) ? geometry.points.slice() : null
    const point = new Point(pt.x, pt.y)
    let result = null

    if (!this.isSource && !this.isTarget) {
      this.convertPoint(point, false)

      if (points == null) {
        points = [point]
      } else {
        // Adds point from virtual bend
        if (this.index! <= DomEvent.VIRTUAL_HANDLE) {
          points.splice(DomEvent.VIRTUAL_HANDLE - this.index!, 0, point)
        }

        // Removes point if dragged on terminal point
        if (!this.isSource && !this.isTarget) {
          for (let i = 0; i < this.bends!.length; i += 1) {
            if (i !== this.index) {
              const bend = this.bends![i]

              if (bend != null && util.contains(bend.bounds, pt.x, pt.y)) {
                if (this.index! <= DomEvent.VIRTUAL_HANDLE) {
                  points.splice(DomEvent.VIRTUAL_HANDLE - this.index!, 1)
                } else {
                  points.splice(this.index! - 1, 1)
                }

                result = points
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
            abs[this.index!] = pt

            // Handes special case where removing waypoint affects tolerance (flickering)
            const src = this.state.getVisibleTerminalState(true)

            if (src != null) {
              const c = this.graph.getConnectionConstraint(this.state, src, true)

              // Checks if point is not fixed
              if (c == null || this.graph.getConnectionPoint(src, c) == null) {
                abs[0] = new Point(src.view.getRoutingCenterX(src), src.view.getRoutingCenterY(src))
              }
            }

            const trg = this.state.getVisibleTerminalState(false)

            if (trg != null) {
              const c = this.graph.getConnectionConstraint(this.state, trg, false)

              // Checks if point is not fixed
              if (c == null || this.graph.getConnectionPoint(trg, c) == null) {
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
            checkRemove(this.index!, pt)
          }
        }

        // Updates existing point
        if (result == null && this.index! > DomEvent.VIRTUAL_HANDLE) {
          points[this.index! - 1] = point
        }
      }
    } else if (this.graph.resetEdgesOnConnect) {
      points = null
    }

    return (result != null) ? result : points
  }

  /**
   * Function: isOutlineConnectEvent
   *
   * Returns true if <outlineConnect> is true and the source of the event is the outline shape
   * or shift is pressed.
   */
  isOutlineConnectEvent(me: CustomMouseEvent) {
    const offset = util.getOffset(this.graph.container)
    const evt = me.getEvent()

    const clientX = DomEvent.getClientX(evt)
    const clientY = DomEvent.getClientY(evt)

    const doc = document.documentElement
    const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

    const gridX = this.currentPoint.x - this.graph.container.scrollLeft + offset.x - left
    const gridY = this.currentPoint.y - this.graph.container.scrollTop + offset.y - top

    return this.outlineConnect && !DomEvent.isShiftDown(me.getEvent()) &&
      (me.isSource(this.marker.highlight.shape) ||
        (DomEvent.isAltDown(me.getEvent()) && me.getState() != null) ||
        this.marker.highlight.isHighlightAt(clientX, clientY) ||
        ((gridX !== clientX || gridY !== clientY) && me.getState() == null &&
          this.marker.highlight.isHighlightAt(gridX, gridY)))
  }

  /**
   * Updates the given preview state taking into account
   * the state of the constraint handler.
   */
  updatePreviewState(
    edge: CellState,
    point: Point,
    terminalState: CellState | null,
    e: CustomMouseEvent,
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

        constraint = this.graph.getOutlineConstraint(point, terminalState, e)
        this.constraintHandler.setFocus(e, terminalState, this.isSource)
        this.constraintHandler.currentConstraint = constraint
        this.constraintHandler.currentPoint = point
      } else {
        constraint = new ConnectionConstraint()
      }
    }

    if (this.outlineConnect &&
      this.marker.highlight != null &&
      this.marker.highlight.shape != null) {
      const s = this.graph.view.scale

      if (
        this.constraintHandler.currentConstraint != null &&
        this.constraintHandler.currentFocus != null
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

    edge.view.updatePoints(edge, this.points || [], sourceState!, targetState!)
    edge.view.updateFloatingTerminalPoints(edge, sourceState!, targetState!)
  }

  /**
   * Handles the event by updating the preview.
   */
  mouseMove(e: CustomMouseEvent) {
    if (this.index != null && this.marker != null) {
      this.currentPoint = this.getPointForEvent(e)
      this.error = null

      const evt = e.getEvent()

      // Uses the current point from the constraint handler if available
      if (
        !this.graph.isIgnoreTerminalEvent(evt) &&
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

      if (
        this.index <= DomEvent.CUSTOM_HANDLE &&
        this.index > DomEvent.VIRTUAL_HANDLE
      ) {
        if (this.customHandles != null) {
          this.customHandles[DomEvent.CUSTOM_HANDLE - this.index].processEvent(e)
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

        if (this.constraintHandler.currentConstraint != null &&
          this.constraintHandler.currentFocus != null &&
          this.constraintHandler.currentPoint != null) {
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

        if (terminalState != null && this.graph.isCellLocked(terminalState.cell)) {
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
        this.abspoints = clone.absolutePoints
        this.active = true
      }

      // This should go before calling isOutlineConnectEvent above. As a workaround
      // we add an offset of gridSize to the hint to avoid problem with hit detection
      // in highlight.isHighlightAt (which uses comonentFromPoint)
      this.updateHint(e, this.currentPoint)
      this.drawPreview()
      DomEvent.consume(e.getEvent())
      e.consume()
    } else if (detector.IS_IE && this.getHandleForEvent(e) != null) {
      // Workaround for disabling the connect highlight when over handle
      e.consume(false)
    }
  }

  mouseUp(e: CustomMouseEvent) {
    if (this.index != null && this.marker != null) {
      const index = this.index
      let edge = this.state.cell

      this.index = null

      // Ignores event if mouse has not been moved
      if (e.getClientX() !== this.startX || e.getClientY() !== this.startY) {
        const clone = (
          !this.graph.isIgnoreTerminalEvent(e.getEvent()) &&
          this.graph.isCloneEvent(e.getEvent()) &&
          this.cloneable && this.graph.isCellsCloneable()
        )

        // Displays the reason for not carriying out the change
        // if there is an error message with non-zero length
        if (this.error != null) {
          if (this.error.length > 0) {
            this.graph.validationAlert(this.error)
          }
        } else if (
          index <= DomEvent.CUSTOM_HANDLE &&
          index > DomEvent.VIRTUAL_HANDLE
        ) {
          if (this.customHandles != null) {
            this.graph.batchUpdate(() => {
              this.customHandles![DomEvent.CUSTOM_HANDLE - index].execute()
            })

          }
        } else if (this.isLabel) {
          this.moveLabel(this.state, this.labelPos!.x, this.labelPos!.y)
        } else if (this.isSource || this.isTarget) {
          let terminal: Cell | null = null

          if (
            this.constraintHandler.currentConstraint != null &&
            this.constraintHandler.currentFocus != null
          ) {
            terminal = this.constraintHandler.currentFocus.cell
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
          } else if (this.graph.isAllowDanglingEdges()) {
            const pt = this.abspoints[(this.isSource) ? 0 : this.abspoints.length - 1]
            pt.x = this.roundLength(pt.x / this.graph.view.scale - this.graph.view.translate.x)
            pt.y = this.roundLength(pt.y / this.graph.view.scale - this.graph.view.translate.y)

            const pstate = this.graph.view.getState(
              this.graph.getModel().getParent(edge))

            if (pstate != null) {
              pt.x -= pstate.origin.x
              pt.y -= pstate.origin.y
            }

            pt.x -= this.graph.panDx / this.graph.view.scale
            pt.y -= this.graph.panDy / this.graph.view.scale

            // Destroys and recreates this handler
            edge = this.changeTerminalPoint(edge, pt, this.isSource, clone)
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
  reset() {
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
  setPreviewColor(color: string | null) {
    if (this.preview != null) {
      this.preview.stroke = color
    }
  }

  /**
   * Converts the given point in-place from screen to unscaled, untranslated
   * graph coordinates and applies the grid. Returns the given, modified
   * point instance.
   */
  convertPoint(point: Point, gridEnabled: boolean) {
    const scale = this.graph.view.getScale()
    const trans = this.graph.view.getTranslate()

    if (gridEnabled) {
      point.x = this.graph.snap(point.x)
      point.y = this.graph.snap(point.y)
    }

    point.x = Math.round(point.x / scale - trans.x)
    point.y = Math.round(point.y / scale - trans.y)

    const pstate = this.graph.view.getState(
      this.graph.getModel().getParent(this.state.cell))

    if (pstate != null) {
      point.x -= pstate.origin.x
      point.y -= pstate.origin.y
    }

    return point
  }

  /**
   * Changes the coordinates for the label of the given edge.
   */
  moveLabel(edgeState: CellState, x: number, y: number) {
    const model = this.graph.getModel()
    let geometry = model.getGeometry(edgeState.cell)

    if (geometry != null) {
      const scale = this.graph.view.scale
      geometry = geometry.clone()

      if (geometry.relative) {
        // Resets the relative location stored inside the geometry
        let pt = this.graph.view.getRelativePoint(edgeState, x, y)
        geometry.bounds.x = Math.round(pt.x * 10000) / 10000
        geometry.bounds.y = Math.round(pt.y)

        // Resets the offset inside the geometry to find the offset
        // from the resulting point
        geometry.offset = new Point(0, 0)
        pt = this.graph.view.getPoint(edgeState, geometry)
        geometry.offset = new Point(
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

          geometry.offset = new Point(
            Math.round((x - cx) / scale),
            Math.round((y - cy) / scale),
          )
          geometry.bounds.x = 0
          geometry.bounds.y = 0
        }
      }

      model.setGeometry(edgeState.cell, geometry)
    }
  }

  connect(
    edge: Cell,
    terminal: Cell,
    isSource: boolean,
    clone: boolean,
    e: CustomMouseEvent,
  ) {
    this.graph.batchUpdate(() => {
      let constraint = this.constraintHandler.currentConstraint
      if (constraint == null) {
        constraint = new ConnectionConstraint()
      }

      this.graph.connectCell(edge, terminal, isSource, constraint)
    })

    return edge
  }

  /**
   * Changes the terminal point of the given edge.
   */
  changeTerminalPoint(
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
        this.graph.connectCell(edge, null, isSource, new ConnectionConstraint())
      }
    })

    return edge
  }

  /**
   * Changes the control points of the given edge in the graph model.
   */
  changePoints(edge: Cell, points: Point[], clone: boolean) {
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
  getHandleFillColor(index: number) {
    const isSource = index === 0
    const cell = this.state.cell
    const terminal = this.graph.getModel().getTerminal(cell, isSource)
    let color = constants.HANDLE_FILLCOLOR

    if ((terminal != null && !this.graph.isCellDisconnectable(cell, terminal, isSource)) ||
      (terminal == null && !this.graph.isTerminalPointMovable(cell, isSource))) {
      color = constants.LOCKED_HANDLE_FILLCOLOR
    } else if (terminal != null && this.graph.isCellDisconnectable(cell, terminal, isSource)) {
      color = constants.CONNECT_HANDLE_FILLCOLOR
    }

    return color
  }

  redraw() {
    this.abspoints = this.state.absolutePoints.slice()
    this.redrawHandles()

    const g = this.graph.model.getGeometry(this.state.cell)!
    const pts = g.points

    if (pts != null && this.bends != null && this.bends.length > 0) {
      if (this.points == null) {
        this.points = []
      }

      for (let i = 1; i < this.bends.length - 1; i += 1) {
        if (this.bends[i] != null && this.abspoints[i] != null) {
          this.points[i - 1] = pts[i - 1]
        }
      }
    }

    this.drawPreview()
  }

  /**
   * Redraws the handles.
   */
  redrawHandles() {
    const cell = this.state.cell

    // Updates the handle for the label position
    let b = this.labelShape!.bounds
    this.labelPos = new Point(
      this.state.absoluteOffset.x,
      this.state.absoluteOffset.y,
    )

    this.labelShape!.bounds = new Rectangle(
      Math.round(this.labelPos.x - b.width / 2),
      Math.round(this.labelPos.y - b.height / 2),
      b.width,
      b.height,
    )

    // Shows or hides the label handle depending on the label
    const txt = this.graph.getLabel(cell)
    this.labelShape!.visible = (
      txt != null &&
      txt.length > 0 &&
      this.graph.isLabelMovable(cell)
    )

    if (this.bends != null && this.bends.length > 0) {
      const p0 = this.abspoints[0]
      const pe = this.abspoints[this.abspoints.length - 1]

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

        const lastBendIndex = this.bends.length - 1
        b = bende.bounds
        bende.bounds = new Rectangle(
          Math.floor(xn - b.width / 2),
          Math.floor(yn - b.height / 2),
          b.width,
          b.height,
        )
        bende.fill = this.getHandleFillColor(lastBendIndex)
        bende.redraw()

        if (this.manageLabelHandle) {
          this.checkLabelHandle(bende.bounds)
        }
      }

      this.redrawInnerBends(p0, pe)
    }

    if (
      this.abspoints != null &&
      this.virtualBends != null &&
      this.virtualBends.length > 0
    ) {
      let last = this.abspoints[0]
      for (let i = 0, ii = this.virtualBends.length; i < ii; i += 1) {
        if (this.virtualBends[i] != null && this.abspoints[i + 1] != null) {
          const pt = this.abspoints[i + 1]
          const x = last.x + (pt.x - last.x) / 2
          const y = last.y + (pt.y - last.y) / 2
          const b = this.virtualBends[i]

          b.bounds = new Rectangle(
            Math.floor(x - b.bounds.width / 2),
            Math.floor(y - b.bounds.height / 2),
            b.bounds.width,
            b.bounds.height,
          )
          b.redraw()
          b.elem!.style.opacity = `${this.virtualBendOpacity}`
          last = pt

          if (this.manageLabelHandle) {
            this.checkLabelHandle(b.bounds)
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

  drawPreview() {
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
    } else if (this.preview != null) {
      this.preview.apply(this.state)
      this.preview.points = this.abspoints
      this.preview.scale = this.state.view.scale
      this.preview.dashed = this.isSelectionDashed()
      this.preview.stroke = this.getSelectionColor()
      this.preview.strokeWidth =
        `${this.getSelectionStrokeWidth() / this.preview.scale / this.preview.scale}`
      this.preview.shadow = false
      this.preview.redraw()
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
      if (util.intersects(b, b2)) {
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
          if (this.abspoints[i] != null) {
            const x = this.abspoints[i].x
            const y = this.abspoints[i].y
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
              util.intersects(bend.bounds, this.labelShape.bounds)
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

  setHandlesVisible(visible: boolean) {
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

  refresh() {
    this.abspoints = this.getSelectionPoints(this.state)
    this.points = []

    if (this.preview != null) {
      this.preview.points = this.abspoints
    }

    if (this.bends != null) {
      this.destroyBends(this.bends)
      this.bends = this.createBends()
    }

    if (this.virtualBends != null) {
      this.destroyBends(this.virtualBends)
      this.virtualBends = this.createVirtualBends()
    }

    if (this.customHandles != null) {
      this.destroyBends(this.customHandles)
      this.customHandles = this.createCustomHandles()
    }

    // Puts label node on top of bends
    if (
      this.labelShape &&
      this.labelShape.elem &&
      this.labelShape.elem.parentNode
    ) {
      this.labelShape.elem.parentNode.appendChild(this.labelShape.elem)
    }
  }

  destroyBends(bends: (ImageShape | null)[] | (RectangleShape | null)[] | null = null) {
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

    if (this.preview != null) {
      this.preview.dispose()
      this.preview = null
    }

    if (this.parentHighlight != null) {
      this.parentHighlight.dispose()
      this.parentHighlight = null
    }

    if (this.labelShape != null) {
      this.labelShape.dispose()
      this.labelShape = null
    }

    this.destroyBends(this.virtualBends)
    this.virtualBends = null

    this.destroyBends(this.customHandles)
    this.customHandles = null

    this.destroyBends(this.bends)
    this.bends = null

    this.removeHint()

    super.dispose()
  }
}

export namespace EdgeHandler { }
