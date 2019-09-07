import * as util from '../util'
import { Graph, Model, Cell, State, Geometry } from '../core'
import { View } from '../core/view'
import { Rectangle, Point, Image, Constraint } from '../struct'
import { constants, DomEvent, CustomMouseEvent } from '../common'
import { Shape, ImageShape, Polyline } from '../shape'
import { CellMarker } from './cell-marker'
import { CellStyle } from '../types'
import { ConstraintHandler } from './constraint-handler'
import { MouseHandler } from './handler-mouse'

export class ConnectionHandler extends MouseHandler {
  /**
   * Function that is used for creating new edges.
   */
  factoryMethod?: (source: Cell, target: Cell, style: CellStyle) => Cell

  /**
   * Specifies if icons should be displayed inside the graph container instead
   * of the overlay pane. This is used for HTML labels on nodes which hide
   * the connect icon.
   *
   * Default is `false`.
   */
  moveIconFront: boolean = false

  /**
   * Specifies if icons should be moved to the back of the overlay pane.
   * This can be set to `true` if the icons of the connection handler
   * conflict with other handles, such as the node label move handle.
   *
   * Default is `false`.
   */
  moveIconBack: boolean = false

  connectImage: Image | null = null

  /**
   * Specifies if the connect icon should be centered on the target state
   * while connections are being previewed.
   *
   * Default is `false`.
   */
  targetConnectImage: boolean = false

  /**
   * Specifies if new edges should be selected.
   *
   * Default is `true`.
   */
  select: boolean = true

  /**
   * Specifies if `createTargetNode` should be called if no target was under
   * the mouse for the new connection. Setting this to `true` means the
   * connection will be drawn as valid if no target is under the mouse, and
   * `createTargetNode` will be called before the connection is created between
   * the source cell and the newly created node, which can be overridden to
   * create a new target.
   *
   * Default is `false`.
   */
  createTarget: boolean = false

  /**
   * Holds the `CellMarker` used for finding source and target cells.
   */
  marker: CellMarker

  /**
   * Holds the `ConstraintHandler` used for drawing and highlighting
   * constraints.
   */
  constraintHandler: ConstraintHandler

  /**
   * Holds the current validation error while connections are being created.
   */
  error: string | null = null

  /**
   * Specifies if single clicks should add waypoints on the new edge.
   *
   * Default is `false`.
   */
  waypointsEnabled: boolean = false

  /**
   * Specifies if the connection handler should ignore the state of the mouse
   * button when highlighting the source. Default is `false`, that is, the
   * handler only highlights the source if no button is being pressed.
   */
  ignoreMouseDown: boolean = false

  /**
   * Holds the offset for connect icons during connection preview.
   *
   * Note that placing the icon under the mouse pointer with an
   * offset of (0,0) will affect hit detection.
   */
  connectIconOffset: Point = new Point(0, constants.TOOLTIP_VERTICAL_OFFSET)

  /**
   * Optional `CellState` that represents the preview edge while the
   * handler is active.
   */
  edgeState: State | null = null

  /**
   * Counts the number of mouseDown events since the start. The initial mouse
   * down event counts as 1.
   */
  mouseDownCounter: number = 0

  /**
   * Switch to enable moving the preview away from the mousepointer. This is required in browsers
   * where the preview cannot be made transparent to events and if the built-in hit detection on
   * the HTML elements in the page should be used. Default is the value of <mxClient.IS_VML>.
   */
  movePreviewAway = false // mxClient.IS_VML

  /**
   * Specifies if connections to the outline of a highlighted target should be
   * enabled. This will allow to place the connection point along the outline of
   * the highlighted target.
   *
   * Default is `false`.
   */
  outlineConnect: boolean = false

  /**
   * Specifies if the actual shape of the edge state should be used for
   * the preview.
   *
   * Default is `false`.
   */
  livePreview: boolean = false

  /**
   * Specifies the cursor to be used while the handler is active.
   *
   * Default is `null`.
   */
  cursor: string | null = null

  /**
   * Specifies if new edges should be inserted before the source node in the
   * cell hierarchy.
   *
   * Default is `false`.
   */
  insertBeforeSource: boolean = false

  private escapeHandler: (() => void) | null
  private changeHandler: (() => void) | null
  private drillHandler: (() => void) | null
  private previous: State | null
  private first: Point | null
  private currentPoint: Point | null
  private originalPoint: Point | null
  private currentState: State | null
  private shape: Shape | null
  private icon: ImageShape | null
  private icons: ImageShape[] | null
  private selectedIcon: ImageShape | null
  private iconState: State | null
  private sourceConstraint: Constraint | null
  private waypoints: Point[] | null

  constructor(
    graph: Graph,
    factoryMethod?: (source: Cell, target: Cell, style: CellStyle) => Cell,
  ) {
    super(graph)
    this.factoryMethod = factoryMethod
    this.graph.addMouseListener(this)
    this.init()
    this.escapeHandler = () => this.reset()
    this.graph.on(DomEvent.ESCAPE, this.escapeHandler)
  }

  init() {
    this.marker = this.createMarker()
    this.constraintHandler = new ConstraintHandler(this.graph)

    // Redraws the icons if the graph changes
    this.changeHandler = () => {
      if (this.iconState != null) {
        this.iconState = this.graph.view.getState(this.iconState.cell)
      }

      if (this.iconState != null) {
        this.redrawIcons(this.icons, this.iconState)
        this.constraintHandler.reset()
      } else if (
        this.previous != null &&
        this.graph.view.getState(this.previous.cell) == null
      ) {
        this.reset()
      }
    }

    this.graph.model.on(Model.events.change, this.changeHandler)
    this.graph.view.on(View.events.scale, this.changeHandler)
    this.graph.view.on(View.events.translate, this.changeHandler)
    this.graph.view.on(View.events.scaleAndTranslate, this.changeHandler)

    // Removes the icon if we step into/up or start editing
    this.drillHandler = () => this.reset()
    this.graph.on(DomEvent.START_EDITING, this.drillHandler)
    this.graph.view.on(View.events.down, this.drillHandler)
    this.graph.view.on(View.events.up, this.drillHandler)
  }

  isInsertBefore(
    edge: Cell,
    source: Cell,
    target: Cell,
    evt: MouseEvent,
    dropTarget: Cell | null,
  ) {
    return this.insertBeforeSource && source !== target
  }

  isCreateTarget(e: MouseEvent) {
    return this.createTarget
  }

  /**
   * Creates the preview shape for new connections.
   */
  createShape() {
    // Creates the edge preview
    const shape = (this.livePreview && this.edgeState)
      ? this.graph.renderer.createShape(this.edgeState)!
      : new Polyline([], constants.INVALID_COLOR)

    shape.dialect = 'svg'
    shape.scale = this.graph.view.scale
    shape.pointerEvents = false
    shape.dashed = true
    shape.init(this.graph.getView().getOverlayPane())

    CustomMouseEvent.redirectMouseEvents(shape.elem!, this.graph, null)

    return shape
  }

  isConnectableCell(cell: Cell) {
    return true
  }

  createMarker() {
    const marker = new CellMarker(this.graph)
    marker.hotspotable = true

    // Overrides to return cell at location only if valid (so that
    // there is no highlight for invalid cells)
    marker.getCell = (e: CustomMouseEvent) => {
      let cell = CellMarker.prototype.getCell.call(marker, e)
      this.error = null

      // Checks for cell at preview point (with grid)
      if (cell == null && this.currentPoint != null) {
        cell = this.graph.getCellAt(this.currentPoint.x, this.currentPoint.y)
      }

      // Uses connectable parent vertex if one exists
      if (cell != null && !this.graph.isCellConnectable(cell)) {
        const parent = this.graph.getModel().getParent(cell)

        if (
          this.graph.model.isNode(parent) &&
          this.graph.isCellConnectable(parent)
        ) {
          cell = parent
        }
      }

      if ((
        this.graph.isSwimlane(cell) &&
        this.currentPoint != null &&
        this.graph.cellManager.hitsSwimlaneContent(cell, this.currentPoint.x, this.currentPoint.y)
      ) || !this.isConnectableCell(cell)
      ) {
        cell = null
      }

      if (cell != null) {
        if (this.isConnecting()) {
          if (this.previous != null) {
            this.error = this.validateConnection(this.previous.cell, cell)

            if (this.error != null && this.error.length === 0) {
              cell = null

              // Enables create target inside groups
              if (this.isCreateTarget(e.getEvent())) {
                this.error = null
              }
            }
          }
        } else if (!this.isValidSource(cell, e)) {
          cell = null
        }
      } else if (
        this.isConnecting() &&
        !this.isCreateTarget(e.getEvent()) &&
        !this.graph.allowDanglingEdges
      ) {
        this.error = ''
      }

      return cell
    }

    // Sets the highlight color according to validateConnection
    marker.isValidState = (state: State) => {
      if (this.isConnecting()) {
        return this.error == null
      }

      return CellMarker.prototype.isValidState.call(marker, state)
    }

    marker.getMarkerColor = (evt, state, isValid) => {
      return (this.connectImage == null || this.isConnecting())
        ? CellMarker.prototype.getMarkerColor.call(marker, evt, state, isValid)
        : null
    }

    // Overrides to use hotspot only for source selection otherwise
    // intersects always returns true when over a cell
    marker.intersects = (state, evt) => {
      if (this.connectImage != null || this.isConnecting()) {
        return true
      }

      return CellMarker.prototype.intersects.call(marker, state, evt)
    }

    return marker
  }

  /**
   * Starts a new connection for the given state and coordinates.
   */
  start(state: State, x: number, y: number, edgeState: State) {
    this.previous = state
    this.first = new Point(x, y)
    this.edgeState = (edgeState != null) ? edgeState : this.createEdgeState(null)

    if (this.marker) {
      this.marker.currentColor = this.marker.validColor
      this.marker.markedState = state
      this.marker.mark()
    }

    this.trigger(ConnectionHandler.events.start, { state })
  }

  /**
   * Returns true if the source terminal has been clicked and a new
   * connection is currently being previewed.
   */
  isConnecting() {
    return this.first != null && this.shape != null
  }

  isValidSource(cell: Cell, e: CustomMouseEvent) {
    return this.graph.isValidSource(cell)
  }

  isValidTarget(cell: Cell) {
    return true
  }

  /**
   * Returns the error message or an empty string if the connection for the
   * given source target pair is not valid. Otherwise it returns null. This
   * implementation uses <mxGraph.getEdgeValidationError>.
   */
  validateConnection(source: Cell, target: Cell) {
    if (!this.isValidTarget(target)) {
      return ''
    }

    return this.graph.validator.getEdgeValidationError(
      null, source, target,
    )
  }

  /**
   * Hook to return the <mxImage> used for the connection icon of the given
   * <mxCellState>. This implementation returns <connectImage>.
   */
  getConnectImage(state: State) {
    return this.connectImage
  }

  /**
   * Returns true if the state has a HTML label in the graph's container, otherwise
   * it returns <moveIconFront>.
   *
   * Parameters:
   *
   * state - <mxCellState> whose connect icons should be returned.
   */
  isMoveIconToFrontForState(state: State) {
    if (state.text && state.text.elem!.parentNode === this.graph.container) {
      return true
    }

    return this.moveIconFront
  }

  /**
   * Creates the array <mxImageShapes> that represent the connect icons for
   * the given <mxCellState>.
   *
   * Parameters:
   *
   * state - <mxCellState> whose connect icons should be returned.
   */
  createIcons(state: State) {
    const image = this.getConnectImage(state)

    if (image != null && state != null) {
      this.iconState = state
      const icons = []

      // Cannot use HTML for the connect icons because the icon receives all
      // mouse move events in IE, must use VML and SVG instead even if the
      // connect-icon appears behind the selection border and the selection
      // border consumes the events before the icon gets a chance
      const bounds = new Rectangle(0, 0, image.width, image.height)
      const icon = new ImageShape(bounds, image.src, null, null, 0)
      icon.preserveImageAspect = false

      if (this.isMoveIconToFrontForState(state)) {
        icon.dialect = 'html'
        icon.init(this.graph.container)
      } else {
        icon.dialect = 'svg'
        icon.init(this.graph.getView().getOverlayPane())

        // Move the icon back in the overlay pane
        if (this.moveIconBack && icon.elem && icon.elem.previousSibling) {
          icon.elem.parentNode!.insertBefore(
            icon.elem,
            icon.elem.parentNode!.firstChild,
          )
        }
      }

      icon.elem!.style.cursor = constants.CURSOR_CONNECT

      const getState = () => this.currentState || state
      const mouseDown = (evt: MouseEvent) => {
        // Updates the local icon before firing the mouse down event.
        if (!DomEvent.isConsumed(evt)) {
          this.icon = icon
          this.graph.fireMouseEvent(
            DomEvent.MOUSE_DOWN, new CustomMouseEvent(evt, getState()),
          )
        }
      }

      CustomMouseEvent.redirectMouseEvents(
        icon.elem!, this.graph, getState, mouseDown,
      )

      icons.push(icon)
      this.redrawIcons(icons, this.iconState)

      return icons
    }

    return null
  }

  redrawIcons(icons: ImageShape[] | null, state: State) {
    if (icons != null && icons[0] != null && state != null) {
      const pos = this.getIconPosition(icons[0], state)
      icons[0].bounds.x = pos.x
      icons[0].bounds.y = pos.y
      icons[0].redraw()
    }
  }

  getIconPosition(icon: ImageShape, state: State) {
    const scale = this.graph.view.scale
    let cx = state.bounds.getCenterX()
    let cy = state.bounds.getCenterY()

    if (this.graph.isSwimlane(state.cell)) {
      const size = this.graph.getStartSize(state.cell)

      cx = (size.width !== 0) ? state.bounds.x + size.width * scale / 2 : cx
      cy = (size.height !== 0) ? state.bounds.y + size.height * scale / 2 : cy

      const alpha = util.toRad(util.getRotation(state))
      if (alpha !== 0) {
        const cos = Math.cos(alpha)
        const sin = Math.sin(alpha)
        const ct = state.bounds.getCenter()
        const pt = util.rotatePoint(new Point(cx, cy), cos, sin, ct)
        cx = pt.x
        cy = pt.y
      }
    }

    return new Point(
      cx - icon.bounds.width / 2,
      cy - icon.bounds.height / 2,
    )
  }

  /**
   * Destroys the connect icons and resets the respective state.
   */
  destroyIcons() {
    if (this.icons != null) {
      this.icons.forEach(i => i.dispose())
      this.icons = null
      this.icon = null
      this.selectedIcon = null
      this.iconState = null
    }
  }

  /**
   * Returns true if the given mouse down event should start this handler. The
   * This implementation returns true if the event does not force marquee
   * selection, and the currentConstraint and currentFocus of the
   * <constraintHandler> are not null, or <previous> and <error> are not null and
   * <icons> is null or <icons> and <icon> are not null.
   */
  isStartEvent(e: CustomMouseEvent) {
    return (
      (
        this.constraintHandler.currentFocus != null &&
        this.constraintHandler.currentConstraint != null
      ) ||
      (
        this.previous != null &&
        this.error == null &&
        (
          this.icons == null || (this.icons != null && this.icon != null)
        )
      )
    )
  }

  /**
   * Handles the event by initiating a new connection.
   */
  mouseDown(e: CustomMouseEvent) {
    this.mouseDownCounter += 1

    if (
      this.isEnabled() &&
      this.graph.isEnabled() &&
      !e.isConsumed() &&
      !this.isConnecting() &&
      this.isStartEvent(e)
    ) {
      if (this.constraintHandler.currentConstraint != null &&
        this.constraintHandler.currentFocus != null &&
        this.constraintHandler.currentPoint != null
      ) {
        this.sourceConstraint = this.constraintHandler.currentConstraint
        this.previous = this.constraintHandler.currentFocus
        this.first = this.constraintHandler.currentPoint.clone()
      } else {
        // Stores the location of the initial mousedown
        this.first = new Point(e.getGraphX(), e.getGraphY())
      }

      this.edgeState = this.createEdgeState(e)
      this.mouseDownCounter = 1

      if (this.waypointsEnabled && this.shape == null) {
        this.waypoints = null
        this.shape = this.createShape()

        if (this.edgeState != null) {
          this.shape.apply(this.edgeState)
        }
      }

      // Stores the starting point in the geometry of the preview
      if (this.previous == null && this.edgeState != null) {
        const pt = this.graph.getPointForEvent(e.getEvent())
        this.edgeState.cell.geometry!.setTerminalPoint(pt, true)
      }

      this.trigger(ConnectionHandler.events.start, { state: this.previous })
      e.consume()
    }

    this.selectedIcon = this.icon
    this.icon = null
  }

  /**
   * Returns true if a tap on the given source state should immediately start
   * connecting. This implementation returns true if the state is not movable
   * in the graph.
   */
  isImmediateConnectSource(state: State) {
    return !this.graph.isCellMovable(state.cell)
  }

  /**
   * Hook to return an <mxCellState> which may be used during the preview.
   */
  createEdgeState(e: CustomMouseEvent | null): State | null {
    return null
  }

  /**
   * Returns true if <outlineConnect> is true and the source of the event is the outline shape
   * or shift is pressed.
   */
  isOutlineConnectEvent(e: CustomMouseEvent) {
    const offset = util.getOffset(this.graph.container)
    const evt = e.getEvent()

    const clientX = DomEvent.getClientX(evt)
    const clientY = DomEvent.getClientY(evt)

    const doc = document.documentElement
    const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

    const gridX = this.currentPoint!.x - this.graph.container.scrollLeft + offset.x - left
    const gridY = this.currentPoint!.y - this.graph.container.scrollTop + offset.y - top

    return (
      this.outlineConnect &&
      !DomEvent.isShiftDown(e.getEvent()) &&
      (
        e.isSource(this.marker.highlight.shape)
        ||
        (
          DomEvent.isAltDown(e.getEvent()) &&
          e.getState() != null
        )
        ||
        this.marker.highlight.isHighlightAt(clientX, clientY)
        ||
        (
          (gridX !== clientX || gridY !== clientY) &&
          e.getState() == null &&
          this.marker.highlight.isHighlightAt(gridX, gridY)
        )
      )
    )
  }

  /**
   * Updates the current state for a given mouse move event by using
   * the <marker>.
   */
  updateCurrentState(e: CustomMouseEvent, point: Point) {
    this.constraintHandler.update(
      e,
      this.first == null,
      false,
      (this.first == null || e.isSource(this.marker.highlight.shape))
        ? null
        : point,
    )

    if (
      this.constraintHandler!.currentFocus != null &&
      this.constraintHandler!.currentConstraint != null
    ) {
      // Handles special case where grid is large and connection point is at actual point in which
      // case the outline is not followed as long as we're < gridSize / 2 away from that point
      if (
        this.marker &&
        this.marker.highlight != null &&
        this.marker.highlight.state != null &&
        this.marker.highlight.state.cell === this.constraintHandler!.currentFocus.cell
      ) {
        // Direct repaint needed if cell already highlighted
        if (this.marker.highlight.shape!.stroke !== 'transparent') {
          this.marker.highlight.shape!.stroke = 'transparent'
          this.marker.highlight.repaint()
        }
      } else {
        this.marker.markCell(this.constraintHandler.currentFocus.cell, 'transparent')
      }

      // Updates validation state
      if (this.previous != null) {
        this.error = this.validateConnection(
          this.previous.cell, this.constraintHandler.currentFocus.cell,
        )

        if (this.error == null) {
          this.currentState = this.constraintHandler.currentFocus
        } else {
          this.constraintHandler.reset()
        }
      }
    } else {
      if (this.graph.isIgnoreTerminalEvent(e.getEvent())) {
        this.marker.reset()
        this.currentState = null
      } else {
        this.marker.process(e)
        this.currentState = this.marker.getValidState()

        if (this.currentState != null && !this.isCellEnabled(this.currentState.cell)) {
          this.currentState = null
        }
      }

      const outline = this.isOutlineConnectEvent(e)

      if (this.currentState != null && outline) {
        // Handles special case where mouse is on outline away from actual end point
        // in which case the grid is ignored and mouse point is used instead
        if (e.isSource(this.marker.highlight.shape)) {
          point = new Point(e.getGraphX(), e.getGraphY()) // tslint:disable-line
        }

        const constraint = this.graph.cellManager.getOutlineConstraint(
          point, this.currentState, e,
        )
        this.constraintHandler.setFocus(e, this.currentState, false)
        this.constraintHandler.currentConstraint = constraint
        this.constraintHandler.currentPoint = point
      }

      if (this.outlineConnect) {
        if (this.marker.highlight != null && this.marker.highlight.shape != null) {
          const s = this.graph.view.scale

          if (
            this.constraintHandler.currentConstraint != null &&
            this.constraintHandler.currentFocus != null
          ) {

            this.marker.highlight.shape.stroke = constants.OUTLINE_HIGHLIGHT_COLOR
            this.marker.highlight.shape.strokeWidth =
              constants.OUTLINE_HIGHLIGHT_STROKEWIDTH / s / s
            this.marker.highlight.repaint()

          } else if (this.marker.hasValidState()) {
            // Handles special case where actual end point of edge and current mouse point
            // are not equal (due to grid snapping) and there is no hit on shape or highlight
            if (this.marker.getValidState() !== e.getState()) {
              this.marker.highlight.shape.stroke = 'transparent'
              this.currentState = null
            } else {
              this.marker.highlight.shape.stroke = constants.DEFAULT_VALID_COLOR
            }

            this.marker.highlight.shape.strokeWidth = constants.HIGHLIGHT_STROKEWIDTH / s / s
            this.marker.highlight.repaint()
          }
        }
      }
    }
  }

  /**
   * Returns true if the given cell does not allow new connections to be created.
   */
  isCellEnabled(cell: Cell) {
    return true
  }

  /**
   * Converts the given point from screen coordinates to model coordinates.
   */
  convertWaypoint(point: Point) {
    const scale = this.graph.getView().getScale()
    const tr = this.graph.getView().getTranslate()

    point.x = point.x / scale - tr.x
    point.y = point.y / scale - tr.y
  }

  /**
   * Called to snap the given point to the current preview. This snaps to the
   * first point of the preview if alt is not pressed.
   */
  snapToPreview(e: CustomMouseEvent, point: Point) {
    if (!DomEvent.isAltDown(e.getEvent()) && this.previous != null) {
      const tol = this.graph.gridSize * this.graph.view.scale / 2
      const tmp = this.sourceConstraint
        ? this.first!
        : this.previous.bounds.getCenter()

      if (Math.abs(tmp.x - e.getGraphX()) < tol) {
        point.x = tmp.x
      }

      if (Math.abs(tmp.y - e.getGraphY()) < tol) {
        point.y = tmp.y
      }
    }
  }

  /**
   * Handles the event by updating the preview edge or by highlighting
   * a possible source or target terminal.
   */
  mouseMove(e: CustomMouseEvent) {
    if (
      !e.isConsumed() &&
      (this.ignoreMouseDown || this.first != null || !this.graph.eventloop.isMouseDown)
    ) {
      // Handles special case when handler is disabled during highlight
      if (!this.isEnabled() && this.currentState != null) {
        this.destroyIcons()
        this.currentState = null
      }

      const view = this.graph.getView()
      const scale = view.scale
      const tr = view.translate
      let point = new Point(e.getGraphX(), e.getGraphY())
      this.error = null

      if (this.graph.isGridEnabledForEvent(e.getEvent())) {
        point = new Point(
          (this.graph.snap(point.x / scale - tr.x) + tr.x) * scale,
          (this.graph.snap(point.y / scale - tr.y) + tr.y) * scale,
        )
      }

      this.snapToPreview(e, point)
      this.currentPoint = point

      if (
        (
          this.first != null ||
          (this.isEnabled() && this.graph.isEnabled())
        )
        &&
        (
          this.shape != null || this.first == null ||
          Math.abs(e.getGraphX() - this.first.x) > this.graph.tolerance ||
          Math.abs(e.getGraphY() - this.first.y) > this.graph.tolerance
        )
      ) {
        this.updateCurrentState(e, point)
      }

      if (this.first != null) {
        let constraint = null
        let current = point

        // Uses the current point from the constraint handler if available
        if (this.constraintHandler.currentConstraint != null &&
          this.constraintHandler.currentFocus != null &&
          this.constraintHandler.currentPoint != null) {
          constraint = this.constraintHandler.currentConstraint
          current = this.constraintHandler.currentPoint.clone()
        } else if (
          this.previous != null &&
          !this.graph.isIgnoreTerminalEvent(e.getEvent()) &&
          DomEvent.isShiftDown(e.getEvent())
        ) {
          if (
            Math.abs(this.previous.bounds.getCenterX() - point.x) <
            Math.abs(this.previous.bounds.getCenterY() - point.y)
          ) {
            point.x = this.previous.bounds.getCenterX()
          } else {
            point.y = this.previous.bounds.getCenterY()
          }
        }

        let pt2 = this.first

        // Moves the connect icon with the mouse
        if (this.selectedIcon != null) {
          const w = this.selectedIcon.bounds.width
          const h = this.selectedIcon.bounds.height

          if (this.currentState != null && this.targetConnectImage) {
            const pos = this.getIconPosition(this.selectedIcon, this.currentState)
            this.selectedIcon.bounds.x = pos.x
            this.selectedIcon.bounds.y = pos.y
          } else {
            const bounds = new Rectangle(
              e.getGraphX() + this.connectIconOffset.x,
              e.getGraphY() + this.connectIconOffset.y,
              w, h,
            )
            this.selectedIcon.bounds = bounds
          }

          this.selectedIcon.redraw()
        }

        // Uses edge state to compute the terminal points
        if (this.edgeState != null) {
          this.updateEdgeState(current, constraint)
          current = this.edgeState.absolutePoints[this.edgeState.absolutePoints.length - 1]
          pt2 = this.edgeState.absolutePoints[0]
        } else {
          if (this.currentState != null) {
            if (this.constraintHandler.currentConstraint == null) {
              const tmp = this.getTargetPerimeterPoint(this.currentState, e)

              if (tmp != null) {
                current = tmp
              }
            }
          }

          // Computes the source perimeter point
          if (this.sourceConstraint == null && this.previous != null) {
            const next = (this.waypoints != null && this.waypoints.length > 0) ?
              this.waypoints[0] : current
            const tmp = this.getSourcePerimeterPoint(this.previous, next, e)

            if (tmp != null) {
              pt2 = tmp
            }
          }
        }

        // Makes sure the cell under the mousepointer can be detected
        // by moving the preview shape away from the mouse. This
        // makes sure the preview shape does not prevent the detection
        // of the cell under the mousepointer even for slow gestures.
        if (this.currentState == null && this.movePreviewAway) {
          let tmp = pt2

          if (this.edgeState != null && this.edgeState.absolutePoints.length >= 2) {
            const tmp2 = this.edgeState.absolutePoints[this.edgeState.absolutePoints.length - 2]

            if (tmp2 != null) {
              tmp = tmp2
            }
          }

          const dx = current.x - tmp.x
          const dy = current.y - tmp.y

          const len = Math.sqrt(dx * dx + dy * dy)

          if (len === 0) {
            return
          }

          // Stores old point to reuse when creating edge
          this.originalPoint = current.clone()
          current.x -= dx * 4 / len
          current.y -= dy * 4 / len
        } else {
          this.originalPoint = null
        }

        // Creates the preview shape (lazy)
        if (this.shape == null) {
          const dx = Math.abs(e.getGraphX() - this.first.x)
          const dy = Math.abs(e.getGraphY() - this.first.y)

          if (dx > this.graph.tolerance || dy > this.graph.tolerance) {
            this.shape = this.createShape()

            if (this.edgeState != null) {
              this.shape.apply(this.edgeState)
            }

            // Revalidates current connection
            this.updateCurrentState(e, point)
          }
        }

        // Updates the points in the preview edge
        if (this.shape != null) {
          if (this.edgeState != null) {
            this.shape.points = this.edgeState.absolutePoints
          } else {
            let pts = [pt2]

            if (this.waypoints != null) {
              pts = pts.concat(this.waypoints)
            }

            pts.push(current)
            this.shape.points = pts
          }

          this.drawPreview()
        }

        // Makes sure endpoint of edge is visible during connect
        if (this.cursor != null) {
          this.graph.container.style.cursor = this.cursor
        }

        DomEvent.consume(e.getEvent())
        e.consume()
      } else if (!this.isEnabled() || !this.graph.isEnabled()) {
        this.constraintHandler.reset()
      } else if (this.previous !== this.currentState && this.edgeState == null) {
        this.destroyIcons()

        // Sets the cursor on the current shape
        if (
          this.currentState != null &&
          this.error == null &&
          this.constraintHandler.currentConstraint == null
        ) {
          this.icons = this.createIcons(this.currentState)

          if (this.icons == null) {
            this.currentState.setCursor(constants.CURSOR_CONNECT)
            e.consume()
          }
        }

        this.previous = this.currentState

      } else if (
        this.previous === this.currentState &&
        this.currentState != null &&
        this.icons == null &&
        !this.graph.eventloop.isMouseDown
      ) {
        // Makes sure that no cursors are changed
        e.consume()
      }

      if (
        !this.graph.eventloop.isMouseDown &&
        this.currentState != null &&
        this.icons != null
      ) {
        let hitsIcon = false
        const target = e.getSource()

        for (let i = 0; i < this.icons.length && !hitsIcon; i += 1) {
          hitsIcon =
            target === this.icons[i].elem ||
            target.parentNode === this.icons[i].elem
        }

        if (!hitsIcon) {
          this.updateIcons(this.currentState, this.icons, e)
        }
      }
    } else {
      this.constraintHandler.reset()
    }
  }

  updateEdgeState(current: Point, constraint: Constraint | null) {
    // TODO: Use generic method for writing constraint to style
    if (this.sourceConstraint != null && this.sourceConstraint.point != null) {
      this.edgeState!.style.exitX = this.sourceConstraint.point.x
      this.edgeState!.style.exitY = this.sourceConstraint.point.y
    }

    if (constraint != null && constraint.point != null) {
      this.edgeState!.style.entryX = constraint.point.x
      this.edgeState!.style.entryY = constraint.point.y
    } else {
      delete this.edgeState!.style.entryX
      delete this.edgeState!.style.entryY
    }

    this.edgeState!.absolutePoints = [null, (this.currentState != null) ? null : current] as any
    this.graph.view.updateFixedTerminalPoint(
      this.edgeState!, this.previous!, true, this.sourceConstraint!,
    )

    if (this.currentState != null) {
      if (constraint == null) {
        // tslint:disable-next-line
        constraint = this.graph.getConnectionConstraint(
          this.edgeState!, this.previous, false,
        )
      }

      this.edgeState!.setAbsoluteTerminalPoint(null as any, false)
      this.graph.view.updateFixedTerminalPoint(
        this.edgeState!, this.currentState, false, constraint,
      )
    }

    // Scales and translates the waypoints to the model
    let realPoints = null

    if (this.waypoints != null) {
      realPoints = []

      for (let i = 0; i < this.waypoints.length; i += 1) {
        const pt = this.waypoints[i].clone()
        this.convertWaypoint(pt)
        realPoints[i] = pt
      }
    }

    this.graph.view.updatePoints(this.edgeState!, realPoints!, this.previous!, this.currentState!)
    this.graph.view.updateFloatingTerminalPoints(
      this.edgeState!, this.previous!, this.currentState!,
    )
  }

  /**
   * Returns the perimeter point for the given target state.
   * Parameters:
   *
   * state - <mxCellState> that represents the target cell state.
   * me - <mxMouseEvent> that represents the mouse move.
   */
  getTargetPerimeterPoint(state: State, e: CustomMouseEvent) {
    let result = null
    const view = state.view
    const targetPerimeter = view.getPerimeterFunction(state)

    if (targetPerimeter != null) {
      const next = (this.waypoints != null && this.waypoints.length > 0)
        ? this.waypoints[this.waypoints.length - 1]
        : this.previous!.bounds.getCenter()

      const tmp = targetPerimeter(
        view.getPerimeterBounds(state), this.edgeState, next, false,
      )

      if (tmp != null) {
        result = tmp
      }
    } else {
      result = state.bounds.getCenter()
    }

    return result
  }

  /**
   * Hook to update the icon position(s) based on a mouseOver event. This is
   * an empty implementation.
   *
   * Parameters:
   *
   * state - <mxCellState> that represents the target cell state.
   * next - <Point> that represents the next point along the previewed edge.
   * me - <mxMouseEvent> that represents the mouse move.
   */
  getSourcePerimeterPoint(state: State, next: Point, me: CustomMouseEvent) {
    let result = null
    const view = state.view
    const sourcePerimeter = view.getPerimeterFunction(state)
    const c = state.bounds.getCenter()

    if (sourcePerimeter != null) {
      const theta = util.getRotation(state)
      const rad = -theta * (Math.PI / 180)

      if (theta !== 0) {
        // tslint:disable-next-line
        next = util.rotatePoint(new Point(next.x, next.y), Math.cos(rad), Math.sin(rad), c)
      }

      let tmp = sourcePerimeter(view.getPerimeterBounds(state), state, next, false)

      if (tmp != null) {
        if (theta !== 0) {
          tmp = util.rotatePoint(new Point(tmp.x, tmp.y), Math.cos(-rad), Math.sin(-rad), c)
        }

        result = tmp
      }
    } else {
      result = c
    }

    return result
  }

  /**
   * Hook to update the icon position(s) based on a mouseOver event. This is
   * an empty implementation.
   *
   * Parameters:
   *
   * state - <mxCellState> under the mouse.
   * icons - Array of currently displayed icons.
   * me - <mxMouseEvent> that contains the mouse event.
   */
  updateIcons(state: State, icons: ImageShape[], e: CustomMouseEvent) {
    // empty
  }

  /**
   * Returns true if the given mouse up event should stop this handler. The
   * connection will be created if <error> is null. Note that this is only
   * called if <waypointsEnabled> is true. This implemtation returns true
   * if there is a cell state in the given event.
   */
  isStopEvent(e: CustomMouseEvent) {
    return e.getState() != null
  }

  /**
   * Adds the waypoint for the given event to <waypoints>.
   */
  addWaypointForEvent(e: CustomMouseEvent) {
    const point = util.clientToGraph(this.graph.container, e.getClientX(), e.getClientY())
    const dx = Math.abs(point.x - this.first!.x)
    const dy = Math.abs(point.y - this.first!.y)
    const addPoint = this.waypoints != null || (this.mouseDownCounter > 1 &&
      (dx > this.graph.tolerance || dy > this.graph.tolerance))

    if (addPoint) {
      if (this.waypoints == null) {
        this.waypoints = []
      }

      const scale = this.graph.view.scale
      const point = new Point(
        this.graph.snap(e.getGraphX() / scale) * scale,
        this.graph.snap(e.getGraphY() / scale) * scale,
      )
      this.waypoints.push(point)
    }
  }

  /**
   * Returns true if the connection for the given constraints is valid. This
   * implementation returns true if the constraints are not pointing to the
   * same fixed connection point.
   */
  checkConstraints(c1: Constraint | null, c2: Constraint | null) {
    return (
      c1 == null || c2 == null || c1.point == null || c2.point == null ||
      !c1.point.equals(c2.point) || c1.dx !== c2.dx || c1.dy !== c2.dy ||
      c1.perimeter !== c2.perimeter
    )
  }

  /**
   * Handles the event by inserting the new connection.
   */
  mouseUp(e: CustomMouseEvent) {
    if (!e.isConsumed() && this.isConnecting()) {
      if (this.waypointsEnabled && !this.isStopEvent(e)) {
        this.addWaypointForEvent(e)
        e.consume()

        return
      }

      const c1 = this.sourceConstraint
      const c2 = this.constraintHandler!.currentConstraint

      const source = (this.previous != null) ? this.previous.cell : null
      let target = null

      if (this.constraintHandler!.currentConstraint != null &&
        this.constraintHandler!.currentFocus != null) {
        target = this.constraintHandler!.currentFocus.cell
      }

      if (target == null && this.currentState != null) {
        target = this.currentState.cell
      }

      // Inserts the edge if no validation error exists and if constraints differ
      if (
        this.error == null && (source == null || target == null ||
          source !== target || this.checkConstraints(c1, c2))
      ) {
        this.connect(source!, target!, e.getEvent(), e.getCell()!)
      } else {
        // Selects the source terminal for self-references
        if (this.previous != null && this.marker!.validState != null &&
          this.previous.cell === this.marker!.validState.cell) {
          // TODO:
          // this.graph.selectCellForEvent(this.marker!.source, e.getEvent())
        }

        // Displays the error message if it is not an empty string,
        // for empty error messages, the event is silently dropped
        if (this.error != null && this.error.length > 0) {
          this.graph.validationWarn(this.error)
        }
      }

      // Redraws the connect icons and resets the handler state
      this.destroyIcons()
      e.consume()
    }

    if (this.first != null) {
      this.reset()
    }
  }

  /**
   * Resets the state of this handler.
   */
  reset() {
    if (this.shape != null) {
      this.shape.dispose()
      this.shape = null
    }

    // Resets the cursor on the container
    if (this.cursor != null && this.graph.container != null) {
      this.graph.container.style.cursor = ''
    }

    this.destroyIcons()
    this.marker!.reset()
    this.constraintHandler!.reset()
    this.originalPoint = null
    this.currentPoint = null
    this.edgeState = null
    this.previous = null
    this.error = null
    this.sourceConstraint = null
    this.mouseDownCounter = 0
    this.first = null

    this.trigger(ConnectionHandler.events.reset)
  }

  /**
   * Redraws the preview edge using the color and width returned by
   * <getEdgeColor> and <getEdgeWidth>.
   */
  drawPreview() {
    this.updatePreview(this.error == null)
    this.shape!.redraw()
  }

  /**
   * Returns the color used to draw the preview edge. This returns green if
   * there is no edge validation error and red otherwise.
   *
   * Parameters:
   *
   * valid - Boolean indicating if the color for a valid edge should be
   * returned.
   */
  updatePreview(valid: boolean) {
    this.shape!.strokeWidth = this.getEdgeWidth(valid)
    this.shape!.stroke = this.getEdgeColor(valid)
  }

  /**
   * Returns the color used to draw the preview edge. This returns green if
   * there is no edge validation error and red otherwise.
   *
   * Parameters:
   *
   * valid - Boolean indicating if the color for a valid edge should be
   * returned.
   */
  getEdgeColor(valid: boolean) {
    return (valid) ? constants.VALID_COLOR : constants.INVALID_COLOR
  }

  /**
   * Returns the width used to draw the preview edge. This returns 3 if
   * there is no edge validation error and 1 otherwise.
   *
   * Parameters:
   *
   * valid - Boolean indicating if the width for a valid edge should be
   * returned.
   */
  getEdgeWidth(valid: boolean) {
    return (valid) ? 3 : 1
  }

  /**
   * Function: connect
   *
   * Connects the given source and target using a new edge. This
   * implementation uses <createEdge> to create the edge.
   *
   * Parameters:
   *
   * source - <mxCell> that represents the source terminal.
   * target - <mxCell> that represents the target terminal.
   * evt - Mousedown event of the connect gesture.
   * dropTarget - <mxCell> that represents the cell under the mouse when it was
   * released.
   */
  connect(source: Cell, target: Cell, evt: MouseEvent, dropTarget: Cell | null) {
    if (target != null || this.isCreateTarget(evt) || this.graph.allowDanglingEdges) {
      // Uses the common parent of source and target or
      // the default parent to insert the edge
      const model = this.graph.getModel()
      let terminalInserted = false
      let edge = null

      model.beginUpdate()
      try {
        if (
          source != null &&
          target == null &&
          !this.graph.isIgnoreTerminalEvent(evt) &&
          this.isCreateTarget(evt)
        ) {
          target = this.createTargetVertex(evt, source) // tslint:disable-line

          if (target != null) {
            dropTarget = this.graph.getDropTarget([target], evt, dropTarget)! // tslint:disable-line
            terminalInserted = true

            // Disables edges as drop targets if the target cell was created
            // FIXME: Should not shift if vertex was aligned (same in Java)
            if (dropTarget == null || !this.graph.getModel().isEdge(dropTarget)) {
              const pstate = this.graph.getView().getState(dropTarget)

              if (pstate != null) {
                const tmp = model.getGeometry(target)!
                tmp.bounds.x -= pstate.origin.x
                tmp.bounds.y -= pstate.origin.y
              }
            } else {
              dropTarget = this.graph.getDefaultParent() // tslint:disable-line
            }

            this.graph.addCell(target, dropTarget)
          }
        }

        let parent = this.graph.getDefaultParent()

        if (
          source != null && target != null &&
          model.getParent(source) === model.getParent(target) &&
          model.getParent(model.getParent(source)) !== model.getRoot()
        ) {
          parent = model.getParent(source)!

          if ((source.geometry != null && source.geometry.relative) &&
            (target.geometry != null && target.geometry.relative)) {
            parent = model.getParent(parent)!
          }
        }

        // Uses the value of the preview edge state for inserting
        // the new edge into the graph
        let value = null
        let style = null

        if (this.edgeState != null) {
          value = this.edgeState.cell.data
          style = this.edgeState.cell.style
        }

        edge = this.insertEdge(parent, null, value, source, target, style!)

        if (edge != null) {
          // Updates the connection constraints
          this.graph.setConnectionConstraint(
            edge, source, true, this.sourceConstraint,
          )

          this.graph.setConnectionConstraint(
            edge, target, false, this.constraintHandler!.currentConstraint,
          )

          // Uses geometry of the preview edge state
          if (this.edgeState != null) {
            model.setGeometry(edge, this.edgeState.cell.geometry!)
          }

          const parent = model.getParent(source)

          // Inserts edge before source
          if (this.isInsertBefore(edge, source, target, evt, dropTarget)) {
            let tmp = source

            while (tmp.parent != null && tmp.geometry != null &&
              tmp.geometry.relative && tmp.parent !== edge.parent) {
              tmp = this.graph.model.getParent(tmp)!
            }

            if (tmp != null && tmp.parent != null && tmp.parent === edge.parent) {
              model.add(parent, edge, tmp.parent.getChildIndex(tmp))
            }
          }

          // Makes sure the edge has a non-null, relative geometry
          let geo = model.getGeometry(edge)

          if (geo == null) {
            geo = new Geometry()
            geo.relative = true

            model.setGeometry(edge, geo)
          }

          // Uses scaled waypoints in geometry
          if (this.waypoints != null && this.waypoints.length > 0) {
            const s = this.graph.view.scale
            const tr = this.graph.view.translate
            geo.points = []

            for (let i = 0; i < this.waypoints.length; i += 1) {
              const pt = this.waypoints[i]
              geo.points.push(new Point(pt.x / s - tr.x, pt.y / s - tr.y))
            }
          }

          if (target == null) {
            const t = this.graph.view.translate
            const s = this.graph.view.scale
            const pt = (this.originalPoint != null) ?
              new Point(this.originalPoint.x / s - t.x, this.originalPoint.y / s - t.y) :
              new Point(this.currentPoint!.x / s - t.x, this.currentPoint!.y / s - t.y)
            pt.x -= this.graph.panDx / this.graph.view.scale
            pt.y -= this.graph.panDy / this.graph.view.scale
            geo.setTerminalPoint(pt, false)
          }

          this.trigger(ConnectionHandler.events.connect, {
            terminalInserted,
            cell: edge,
            terminal: target,
            target: dropTarget,
            event: evt,
          })
        }
      } finally {
        model.endUpdate()
      }

      if (this.select) {
        this.selectCells(edge, (terminalInserted) ? target : null)
      }
    }
  }

  /**
   * Function: selectCells
   *
   * Selects the given edge after adding a new connection. The target argument
   * contains the target vertex if one has been inserted.
   */
  selectCells(edge: Cell, target: Cell | null) {
    this.graph.setSelectedCell(edge)
  }

  /**
   * Creates, inserts and returns the new edge for the given parameters. This
   * implementation does only use <createEdge> if <factoryMethod> is defined,
   * otherwise <mxGraph.insertEdge> will be used.
   */
  insertEdge(
    parent: Cell,
    id: string | null,
    data: any,
    sourceNode: Cell,
    targetNode: Cell,
    style: CellStyle,
  ) {
    if (this.factoryMethod == null) {
      return this.graph.addEdge({ parent, id, data, sourceNode, targetNode, style })
    }

    let edge = this.createEdge(data, sourceNode, targetNode, style)
    edge = this.graph.addEdge(edge, parent, sourceNode, targetNode)

    return edge
  }

  /**
   * Hook method for creating new vertices on the fly if no target was
   * under the mouse. This is only called if <createTarget> is true and
   * returns null.
   *
   * Parameters:
   *
   * evt - Mousedown event of the connect gesture.
   * source - <mxCell> that represents the source terminal.
   */
  createTargetVertex(evt: MouseEvent, source: Cell) {
    let geo = this.graph.getCellGeometry(source)!
    while (geo != null && geo.relative) {
      source = this.graph.model.getParent(source)! // tslint:disable-line
      geo = this.graph.getCellGeometry(source)!
    }

    const clone = this.graph.cloneCell(source)
    geo = this.graph.model.getGeometry(clone)!

    if (geo != null) {
      const t = this.graph.view.translate
      const s = this.graph.view.scale
      const point = new Point(this.currentPoint!.x / s - t.x, this.currentPoint!.y / s - t.y)
      geo.bounds.x = Math.round(point.x - geo.bounds.width / 2 - this.graph.panDx / s)
      geo.bounds.y = Math.round(point.y - geo.bounds.height / 2 - this.graph.panDy / s)

      // Aligns with source if within certain tolerance
      const tol = this.getAlignmentTolerance(evt)
      if (tol > 0) {
        const sourceState = this.graph.view.getState(source)

        if (sourceState != null) {
          const x = sourceState.bounds.x / s - t.x
          const y = sourceState.bounds.y / s - t.y

          if (Math.abs(x - geo.bounds.x) <= tol) {
            geo.bounds.x = Math.round(x)
          }

          if (Math.abs(y - geo.bounds.y) <= tol) {
            geo.bounds.y = Math.round(y)
          }
        }
      }
    }

    return clone
  }

  /**
   * Returns the tolerance for aligning new targets to sources. This returns the grid size / 2.
   */
  getAlignmentTolerance(evt: MouseEvent) {
    return (this.graph.isGridEnabled()) ? this.graph.gridSize / 2 : this.graph.tolerance
  }

  /**
   * Creates and returns a new edge using <factoryMethod> if one exists. If
   * no factory method is defined, then a new default edge is returned. The
   * source and target arguments are informal, the actual connection is
   * setup later by the caller of this function.
   *
   * Parameters:
   *
   * value - Value to be used for creating the edge.
   * source - <mxCell> that represents the source terminal.
   * target - <mxCell> that represents the target terminal.
   * style - Optional style from the preview edge.
   */
  createEdge(data: any, source: Cell, target: Cell, style: CellStyle) {
    let edge = null

    // Creates a new edge using the factoryMethod
    if (this.factoryMethod != null) {
      edge = this.factoryMethod(source, target, style)
    }

    if (edge == null) {
      edge = new Cell(data || '')
      edge.asEdge(true)
      edge.setStyle(style)

      const geo = new Geometry()
      geo.relative = true
      edge.setGeometry(geo)
    }

    return edge
  }

  dispose() {
    if (this.disposed) {
      return
    }

    this.graph.removeMouseListener(this)

    if (this.shape != null) {
      this.shape.dispose()
      this.shape = null
    }

    if (this.marker != null) {
      this.marker.dispose()
      delete this.marker
    }

    if (this.constraintHandler != null) {
      this.constraintHandler.dispose()
      delete this.constraintHandler
    }

    if (this.changeHandler != null) {
      this.graph.model.off(null, this.changeHandler)
      this.graph.view.off(null, this.changeHandler)
      this.changeHandler = null
    }

    if (this.drillHandler != null) {
      this.graph.off(null, this.drillHandler)
      this.graph.view.off(null, this.drillHandler)
      this.drillHandler = null
    }

    if (this.escapeHandler != null) {
      this.graph.off(null, this.escapeHandler)
      this.escapeHandler = null
    }

    super.dispose()
  }
}

export namespace ConnectionHandler {
  export const events = {
    start: 'start',
    reset: 'reset',
    connect: 'connect',
  }
}
