import { Platform } from '../../util'
import { Point, Rectangle, Line } from '../../geometry'
import { DomEvent, DomUtil } from '../../dom'
import { IDisposable } from '../../entity'
import { Route } from '../../route'
import { Graph } from '../../graph'
import { Cell } from '../../core/cell'
import { State } from '../../core/state'
import { Anchor } from '../../struct'
import { Shape, RectangleShape } from '../../shape'
import { MouseHandler } from '../mouse-handler'
import { CellMarker } from '../cell-marker'
import { AnchorHandler } from '../anchor/handler'
import { Handle } from '../handle'
import { EdgeMarker } from './marker'
import { transparentMarker } from '../connection/util'
import { MouseEventEx } from '../mouse-event'
import {
  createEdgeHandle,
  getEdgeHandleCursor,
  getEdgeHandleOptions,
} from './option'
import {
  createLabelHandle,
  getLabelHandleCursor,
  getLabelHandleOffset,
} from '../node/option-label'
import {
  applySelectionPreviewStyle,
  getSelectionPreviewCursor,
} from '../node/option-selection'

export class EdgeHandler extends MouseHandler {
  state: State
  handles: Shape[] | null = null
  virtualHandles: Shape[] | null = null
  preferHtml: boolean = false

  marker: CellMarker
  anchorHandler: AnchorHandler
  previewShape: Shape | null
  parentHighlight: RectangleShape | null
  labelPos: Point | null
  labelHandleShape: Shape | null
  error: string | null = null

  /**
   * Specifies if cloning by control-drag is enabled.
   *
   * Default is `false`.
   */
  cloneable: boolean = false

  /**
   * Specifies if adding handles by shift-click is enabled.
   *
   * Default is `false`.
   */
  addable: boolean = false

  /**
   * Specifies if removing handles by shift-click is enabled.
   *
   * Default is `false`.
   */
  removable: boolean = false

  /**
   * Specifies if removing handles by double click is enabled.
   *
   * Default is `false`.
   */
  dblClickRemoveEnabled: boolean = false

  /**
   * Specifies if removing handles by dropping them on other handles is enabled.
   *
   * Default is `false`.
   */
  mergeRemoveEnabled: boolean = false

  /**
   * Specifies if removing handles by creating straight segments is enabled.
   *
   * If enabled, this can be overridden by holding down the alt key while
   * moving.
   *
   * Default is `false`.
   */
  straightRemoveEnabled: boolean = false

  /**
   * Specifies if virtual handles should be added in the center of each
   * segments. These handles can then be used to add new waypoints.
   *
   * Default is `false`.
   */
  virtualHandlesEnabled: boolean = false

  /**
   * Specifies if the label handle should be moved if it intersects with
   * another handle.
   *
   * Default is `false`.
   */
  manageLabelHandle: boolean = false

  /**
   * Specifies if the parent should be highlighted if a child cell is selected.
   *
   * Default is `false`.
   */
  parentHighlightEnabled: boolean = false

  /**
   * Specifies if waypoints should snap to the routing centers of terminals.
   *
   * Default is `false`.
   */
  snapToTerminals: boolean = false

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

  protected escapeHandler: (() => void) | null
  protected customHandles: Handle[] | null
  protected points: Point[] | null
  protected absolutePoints: Point[]
  protected snapPoint: Point | null

  startX: number
  startY: number
  active: boolean
  index: number | null
  isSourceHandle: boolean
  isTargetHandle: boolean
  isLabelHandle: boolean
  currentPoint: Point

  constructor(graph: Graph, state: State) {
    super(graph)
    this.state = state
    this.config()
    this.init()

    this.escapeHandler = () => {
      const dirty = this.index != null
      this.reset()
      if (dirty) {
        this.graph.renderer.redraw(this.state, false, state.view.isRendering())
      }
    }

    this.state.view.graph.on('escape', this.escapeHandler)
  }

  config() {
    const options = getEdgeHandleOptions({
      graph: this.graph,
      cell: this.state.cell,
    })
    this.cloneable = options.cloneable
    this.addable = options.addable
    this.removable = options.removable
    this.dblClickRemoveEnabled = options.dblClickRemoveEnabled
    this.mergeRemoveEnabled = options.mergeRemoveEnabled
    this.straightRemoveEnabled = options.straightRemoveEnabled
    this.virtualHandlesEnabled = options.virtualHandlesEnabled
    this.manageLabelHandle = options.manageLabelHandle
  }

  init() {
    this.marker = new EdgeMarker(this.graph, this)
    this.anchorHandler = new AnchorHandler(this.graph)

    // Clones the original points from the cell
    // and makes sure at least one point exists
    this.points = []

    // Uses the absolute points of the state
    // for the initial configuration and preview
    this.absolutePoints = this.getSelectionPoints(this.state)
    this.initPreviewShape()

    // Updates preferHtml
    this.preferHtml = this.isPreferHtml()

    // Adds highlight for parent group
    this.initParentHighlight()

    // Creates bends for the non-routed absolute points
    // or bends that don't correspond to points
    const max = this.graph.options.maxCellCountForHandle || 0
    if (max <= 0 || this.graph.getSelecedCellCount() < max) {
      this.handles = this.createHandles()
      if (this.isVirtualHandlesEnabled()) {
        this.virtualHandles = this.createVirtualHandles()
      }
    }

    // Adds a rectangular handle for the label position
    this.labelPos = this.state.absoluteOffset.clone()
    this.labelHandleShape = this.createLabelHandleShape()
    this.initHandle(this.labelHandleShape)

    this.customHandles = this.createCustomHandles()

    this.redraw()
  }

  protected getSelectionPoints(state: State) {
    return state.absolutePoints
  }

  protected createParentHighlightShape(bounds: Rectangle) {
    const shape = new RectangleShape(bounds)
    applySelectionPreviewStyle({
      shape,
      graph: this.graph,
      cell: this.state.cell,
    })
    return shape
  }

  protected initPreviewShape() {
    this.previewShape = this.createPreviewShape(this.absolutePoints)
    this.previewShape.pointerEvents = false
    this.previewShape.init(this.graph.view.getOverlayPane())

    MouseEventEx.redirectMouseEvents(
      this.previewShape.elem,
      this.graph,
      this.state,
    )
  }

  protected createPreviewShape(points: Point[]) {
    const ctor = this.state.shape!.constructor
    return new (ctor as any)() as Shape
  }

  protected isPreferHtml() {
    let preferHtml = State.hasHtmlLabel(this.state)
    if (!preferHtml) {
      preferHtml = State.hasHtmlLabel(this.state.getVisibleTerminalState(true))
    }

    if (!preferHtml) {
      preferHtml = State.hasHtmlLabel(this.state.getVisibleTerminalState(false))
    }

    return preferHtml
  }

  protected initParentHighlight() {
    if (this.parentHighlightEnabled) {
      const parent = this.graph.model.getParent(this.state.cell)
      if (this.graph.model.isNode(parent)) {
        const pstate = this.graph.view.getState(parent)
        if (pstate != null) {
          this.parentHighlight = this.createParentHighlightShape(pstate.bounds)
          this.parentHighlight.pointerEvents = false
          this.parentHighlight.rotation = State.getRotation(pstate)
          this.parentHighlight.init(this.graph.view.getOverlayPane())
        }
      }
    }
  }

  isConnectableCell(cell: Cell | null) {
    return true
  }

  validateConnection(source: Cell | null, target: Cell | null) {
    return this.graph.validationManager.getEdgeValidationError(
      this.state.cell,
      source,
      target,
    )
  }

  protected createHandles() {
    const handles = []
    const cell = this.state.cell
    const len = this.absolutePoints.length
    const bendable = this.graph.isCellBendable(cell)

    for (let i = 0; i < len; i += 1) {
      if (this.isHandleVisible(i)) {
        const isSource = i === 0
        const isTarget = i === len - 1
        const isTerminal = isSource || isTarget

        if (isTerminal || bendable) {
          const handle = this.createHandleShape(i)
          const dblClick = (index => () => {
            if (this.dblClickRemoveEnabled) {
              this.removePoint(this.state, index)
            }
          })(i)

          this.initHandle(handle, dblClick)

          if (this.isHandleEnabled(i)) {
            const cursor = getEdgeHandleCursor({
              isSource,
              isTarget,
              index: i,
              graph: this.graph,
              cell: this.state.cell,
              shape: handle,
            })

            if (cursor != null) {
              handle.setCursor(cursor)
            }
          }

          handles.push(handle)

          if (!isTerminal) {
            this.points!.push(new Point(0, 0))
            handle.elem!.style.display = 'none'
          }
        }
      }
    }

    return handles
  }

  protected isVirtualHandlesEnabled() {
    return (
      this.virtualHandlesEnabled &&
      this.state.style.shape !== 'arrow' &&
      (this.state.style.edge == null || this.state.style.edge === 'none')
    )
  }

  protected createVirtualHandles() {
    const cell = this.state.cell
    const handles = []

    if (this.graph.isCellBendable(cell)) {
      for (let i = 1, ii = this.absolutePoints.length; i < ii; i += 1) {
        const handle = this.createHandleShape(i, true)
        this.initHandle(handle)
        const cursor = getEdgeHandleCursor({
          graph: this.graph,
          cell: this.state.cell,
          index: i,
          shape: handle,
          visual: true,
        })
        if (cursor != null) {
          handle.setCursor(cursor)
        }
        handles.push(handle)
      }
    }

    return handles
  }

  protected isHandleVisible(index: number) {
    if (index === 0 || index === this.absolutePoints.length - 1) {
      return true
    }

    const geo = this.graph.getCellGeometry(this.state.cell)
    const sourceState = this.state.getVisibleTerminalState(true)
    const targetState = this.state.getVisibleTerminalState(false)
    const edgeFn =
      geo != null
        ? this.graph.view.getRoute(
            this.state,
            geo.points,
            sourceState,
            targetState,
          )
        : null

    return edgeFn !== Route.er
  }

  protected isHandleEnabled(index: number) {
    return true
  }

  protected createHandleShape(index?: number | null, visual = false): Shape {
    return createEdgeHandle({
      visual,
      graph: this.graph,
      cell: this.state.cell,
      index: index != null ? index : null,
    })
  }

  protected createLabelHandleShape() {
    const args = {
      graph: this.graph,
      cell: this.state.cell,
    }
    const handle = createLabelHandle(args)
    const cursor = getLabelHandleCursor({ ...args, shape: handle })
    handle.setCursor(cursor)
    return handle
  }

  protected initHandle(handle: Shape, dblClick?: (evt: MouseEvent) => void) {
    if (this.preferHtml) {
      handle.dialect = 'html'
      handle.init(this.graph.container)
    } else {
      handle.dialect = 'svg'
      handle.init(this.graph.view.getOverlayPane())
    }

    MouseEventEx.redirectMouseEvents(
      handle.elem,
      this.graph,
      this.state,
      null,
      null,
      null,
      dblClick,
    )
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

  protected getHandleForEvent(e: MouseEventEx) {
    const tol = DomEvent.isMouseEvent(e.getEvent()) ? 1 : this.tolerance
    const hit =
      this.checkHandleBounds && (Platform.IS_IE || tol > 0)
        ? new Rectangle(
            e.getGraphX() - tol,
            e.getGraphY() - tol,
            2 * tol,
            2 * tol,
          )
        : null

    let minDist: number | null = null
    let result = null

    function checkShape(shape: Shape | null) {
      if (
        shape &&
        DomUtil.isVisible(shape.elem) &&
        (e.isSource(shape) || (hit && shape.bounds.isIntersectWith(hit)))
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
          return Handle.getCustomHandle(i)
        }
      }
    }

    if (e.isSource(this.state.text) || checkShape(this.labelHandleShape)) {
      result = Handle.getLabelHandle()
    }

    if (this.handles != null) {
      for (let i = 0, ii = this.handles.length; i < ii; i += 1) {
        if (checkShape(this.handles[i])) {
          result = i
        }
      }
    }

    if (this.virtualHandles != null && this.isAddVirtualBendEvent(e)) {
      for (let i = 0, ii = this.virtualHandles.length; i < ii; i += 1) {
        if (checkShape(this.virtualHandles[i])) {
          result = Handle.getVisualHandle(i)
        }
      }
    }

    return result
  }

  /**
   * Handles the event by checking if a special element of the handler
   * was clicked, in which case the index parameter is non-null.
   */
  mouseDown(e: MouseEventEx) {
    const index = this.getHandleForEvent(e)
    if (this.handles != null && index != null && this.handles[index] != null) {
      this.snapPoint = this.handles[index].bounds.getCenter()
    }

    if (this.addable && index == null && this.isAddPointEvent(e.getEvent())) {
      this.addPoint(this.state, e.getEvent())
      e.consume()
    } else if (index != null && !e.isConsumed() && this.graph.isEnabled()) {
      if (this.removable && this.isRemovePointEvent(e.getEvent())) {
        this.removePoint(this.state, index)
      } else if (
        !Handle.isLabelHandle(index) ||
        this.graph.isLabelMovable(e.getCell())
      ) {
        if (Handle.isVisualHandle(index) && this.virtualHandles) {
          const handle = this.virtualHandles[Handle.getVisualHandle(index)]
          handle.elem!.style.opacity = '100'
        }

        this.start(e.getClientX(), e.getClientY(), index)
      }

      e.consume()
    }
  }

  /**
   * Adds a control point for the given state and event.
   */
  protected addPoint(state: State, e: MouseEvent) {
    const p = this.graph.clientToGraph(e)
    const gridEnabled = this.graph.isGridEnabledForEvent(e)
    this.normalizePoint(p, gridEnabled)
    this.addPointAt(state, p.x, p.y)
    DomEvent.consume(e)
  }

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

      if (geo.points == null) {
        geo.points = [p]
      } else {
        const index = State.getNearestSegment(
          state,
          p.x * s + offset.x,
          p.y * s + offset.y,
        )
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

  start(x: number, y: number, index: number) {
    this.startX = x
    this.startY = y
    this.isLabelHandle = Handle.isLabelHandle(index)
    this.isSourceHandle = this.handles ? index === 0 : false
    this.isTargetHandle = this.handles
      ? index === this.handles.length - 1
      : false

    if (this.isSourceHandle || this.isTargetHandle) {
      const cell = this.state.cell
      const terminal = this.graph.model.getTerminal(cell, this.isSourceHandle)

      if (
        (terminal == null &&
          this.graph.isTerminalPointMovable(cell, this.isSourceHandle)) ||
        (terminal != null &&
          this.graph.isCellDisconnectable(cell, terminal, this.isSourceHandle))
      ) {
        this.index = index
      }
    } else {
      this.index = index
    }

    // Hides other custom handles
    if (this.index != null) {
      if (Handle.isCustomHandle(this.index)) {
        if (this.customHandles != null) {
          const idx = Handle.getCustomHandle(this.index)
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
    if (this.index != null) {
      this.error = null
      this.currentPoint = this.getCurrentPoint(e)

      if (Handle.isCustomHandle(this.index)) {
        if (this.customHandles != null) {
          const idx = Handle.getCustomHandle(this.index)
          this.customHandles[idx].processEvent(e)
        }
      } else if (this.isLabelHandle) {
        this.labelPos!.x = this.currentPoint.x
        this.labelPos!.y = this.currentPoint.y
      } else {
        this.points = this.getPreviewPoints(this.currentPoint, e)!
        let terminalState =
          this.isSourceHandle || this.isTargetHandle
            ? this.getPreviewTerminalState(e)
            : null

        if (
          this.anchorHandler.currentAnchor != null &&
          this.anchorHandler.currentState != null &&
          this.anchorHandler.currentPoint != null
        ) {
          this.currentPoint = this.anchorHandler.currentPoint.clone()
        }

        if (
          terminalState != null &&
          this.graph.isCellLocked(terminalState.cell)
        ) {
          terminalState = null
          this.marker.reset()
        }

        const state = this.clonePreviewState(
          this.currentPoint,
          (terminalState && terminalState.cell) || null,
        )

        this.updatePreviewState(state, this.currentPoint, terminalState, e)

        // Sets the color of the preview to valid or invalid, updates the
        // points of the preview and redraws
        const color =
          this.error == null ? this.marker.validColor : this.marker.invalidColor

        this.setPreviewColor(color)
        this.absolutePoints = state.absolutePoints
        this.active = true
      }

      this.updateHint(e, this.currentPoint)
      this.drawPreview()

      DomEvent.consume(e.getEvent())
      e.consume()
    }
  }

  /**
   * Hook for subclassers do show details while the handler is active.
   */
  protected updateHint(e: MouseEventEx, point: Point) {}

  /**
   * Hooks for subclassers to hide details when the handler gets inactive.
   */
  protected removeHint() {}

  protected roundLength(length: number) {
    return Math.round(length)
  }

  protected getSnapToTerminalTolerance() {
    return (this.graph.getGridSize() * this.graph.view.scale) / 2
  }

  protected getCurrentPoint(e: MouseEventEx) {
    const view = this.graph.view
    const s = view.scale
    const t = view.translate

    const result = new Point(
      this.roundLength(e.getGraphX() / s) * s,
      this.roundLength(e.getGraphY() / s) * s,
    )

    let overrideX = false
    let overrideY = false
    const tt = this.getSnapToTerminalTolerance()
    if (tt > 0 && this.isSnapToTerminalsEvent(e)) {
      const snapToPoint = (p: Point) => {
        if (p != null) {
          if (Math.abs(result.x - p.x) < tt) {
            result.x = p.x
            overrideX = true
          }

          if (Math.abs(result.y - p.y) < tt) {
            result.y = p.y
            overrideY = true
          }
        }
      }

      const snapToTerminal = (terminal: State | null) => {
        if (terminal != null) {
          snapToPoint(
            new Point(
              view.getRoutingCenterX(terminal),
              view.getRoutingCenterY(terminal),
            ),
          )
        }
      }

      snapToTerminal(this.state.getVisibleTerminalState(true))
      snapToTerminal(this.state.getVisibleTerminalState(false))

      if (this.state.absolutePoints != null) {
        this.state.absolutePoints.forEach(p => snapToPoint(p))
      }
    }

    if (this.graph.isGridEnabledForEvent(e.getEvent())) {
      if (!overrideX) {
        result.x = (this.graph.snap(result.x / s - t.x) + t.x) * s
      }
      if (!overrideY) {
        result.y = (this.graph.snap(result.y / s - t.y) + t.y) * s
      }
    }

    // Uses the current point from the anchor handler if available
    const evt = e.getEvent()
    const snapPoint = this.snapPoint
    if (
      !this.graph.isConnectionIgnored(evt) &&
      DomEvent.isShiftDown(evt) &&
      snapPoint != null
    ) {
      if (Math.abs(snapPoint.x - result.x) < Math.abs(snapPoint.y - result.y)) {
        result.x = snapPoint.x
      } else {
        result.y = snapPoint.y
      }
    }

    return result
  }

  protected getPreviewPoints(p: Point, e: MouseEventEx) {
    const point = p.clone()
    const index = this.index!
    const geo = this.graph.getCellGeometry(this.state.cell)!
    let points = geo.points != null ? geo.points.slice() : null
    let result = null

    if (!this.isSourceHandle && !this.isTargetHandle) {
      this.normalizePoint(point, false)

      if (points == null) {
        points = [point]
      } else {
        // Adds point from virtual handle
        if (Handle.isVisualHandle(index)) {
          points.splice(Handle.getVisualHandle(index), 0, point)
        }

        // Removes point if dragged on terminal point
        if (this.handles != null) {
          for (let i = 0, ii = this.handles.length; i < ii; i += 1) {
            if (i !== index) {
              const handle = this.handles[i]
              if (handle != null && handle.bounds.containsPoint(p)) {
                if (Handle.isVisualHandle(index)) {
                  points.splice(Handle.getVisualHandle(index), 1)
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
          abs[index] = p

          // Handes special case where removing waypoint affects tolerance (flickering)
          const src = this.state.getVisibleTerminalState(true)
          if (src != null) {
            const c = this.graph.getConnectionAnchor(this.state, src, true)
            // Checks if point is not fixed
            if (
              c == null ||
              this.graph.view.getConnectionPoint(src, c) == null
            ) {
              abs[0] = new Point(
                src.view.getRoutingCenterX(src),
                src.view.getRoutingCenterY(src),
              )
            }
          }

          const trg = this.state.getVisibleTerminalState(false)
          if (trg != null) {
            const c = this.graph.getConnectionAnchor(this.state, trg, false)
            // Checks if point is not fixed
            if (
              c == null ||
              this.graph.view.getConnectionPoint(trg, c) == null
            ) {
              abs[abs.length - 1] = new Point(
                trg.view.getRoutingCenterX(trg),
                trg.view.getRoutingCenterY(trg),
              )
            }
          }

          const checkRemove = (idx: number, p: Point) => {
            if (idx > 0 && idx < abs.length - 1) {
              const line = new Line(abs[idx - 1], abs[idx + 1])
              if (line.pointSquaredDistance(p) < tol) {
                points!.splice(idx - 1, 1)
                result = points
              }
            }
          }

          checkRemove(index, p)
        }

        // Updates existing point
        if (result == null && !Handle.isVisualHandle(index)) {
          points[index - 1] = point
        }
      }
    } else if (this.graph.resetEdgesOnConnect) {
      points = null
    }

    return result != null ? result : points
  }

  protected getPreviewTerminalState(e: MouseEventEx) {
    this.anchorHandler.update(
      e,
      this.isSourceHandle,
      true,
      e.isSource(this.marker.highlight.shape) ? null : this.currentPoint,
    )

    if (
      this.anchorHandler.currentState != null &&
      this.anchorHandler.currentAnchor != null
    ) {
      transparentMarker(this.anchorHandler, this.marker)

      const model = this.graph.getModel()
      const other = this.graph.view.getTerminalPortState(
        this.state,
        this.graph.view.getState(
          model.getTerminal(this.state.cell, !this.isSourceHandle),
        )!,
        !this.isSourceHandle,
      )
      const otherCell = other != null ? other.cell : null

      const source = this.isSourceHandle
        ? this.anchorHandler.currentState.cell
        : otherCell

      const target = this.isSourceHandle
        ? otherCell
        : this.anchorHandler.currentState.cell

      // Updates the error message of the handler
      this.error = this.validateConnection(source, target)
      let result = null

      if (this.error == null) {
        result = this.anchorHandler.currentState
      } else {
        this.anchorHandler.reset()
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

  protected clonePreviewState(point: Point, terminal: Cell | null) {
    return this.state.clone()
  }

  protected updatePreviewState(
    edgeState: State,
    point: Point,
    terminalState: State | null,
    e: MouseEventEx,
  ) {
    // Computes the points for the edge style and terminals
    const sourceState = this.isSourceHandle
      ? terminalState
      : this.state.getVisibleTerminalState(true)

    const targetState = this.isTargetHandle
      ? terminalState
      : this.state.getVisibleTerminalState(false)

    let sourceC = this.graph.getConnectionAnchor(edgeState, sourceState, true)
    let targetC = this.graph.getConnectionAnchor(edgeState, targetState, false)
    const anchor = this.anchorHandler.currentAnchor

    if (this.isSourceHandle) {
      sourceC = anchor!
    } else if (this.isTargetHandle) {
      targetC = anchor!
    }

    if (this.isSourceHandle || this.isTargetHandle) {
      if (anchor != null && anchor.position != null) {
        if (this.isSourceHandle) {
          edgeState.style.sourceAnchorX = anchor.position.x
          edgeState.style.sourceAnchorY = anchor.position.y
        } else {
          edgeState.style.targetAnchorX = anchor.position.x
          edgeState.style.targetAnchorY = anchor.position.y
        }
      } else {
        if (this.isSourceHandle) {
          delete edgeState.style.sourceAnchorX
          delete edgeState.style.sourceAnchorY
        } else {
          delete edgeState.style.targetAnchorX
          delete edgeState.style.targetAnchorY
        }
      }
    }

    edgeState.setVisibleTerminalState(sourceState, true)
    edgeState.setVisibleTerminalState(targetState, false)

    if (!this.isSourceHandle || sourceState != null) {
      edgeState.view.updateFixedTerminalPoint(
        edgeState,
        sourceState!,
        true,
        sourceC,
      )
    }

    if (!this.isTargetHandle || targetState != null) {
      edgeState.view.updateFixedTerminalPoint(
        edgeState,
        targetState!,
        false,
        targetC,
      )
    }

    if ((this.isSourceHandle || this.isTargetHandle) && terminalState == null) {
      edgeState.setAbsoluteTerminalPoint(point, this.isSourceHandle)
      if (this.marker.getMarkedState() == null) {
        this.error = this.graph.allowDanglingEdges ? null : ''
      }
    }

    edgeState.view.updateRouterPoints(
      edgeState,
      this.points || [],
      sourceState!,
      targetState!,
    )
    edgeState.view.updateFloatingTerminalPoints(
      edgeState,
      sourceState!,
      targetState!,
    )
  }

  mouseUp(e: MouseEventEx) {
    if (this.index != null) {
      const index = this.index
      let edge = this.state.cell

      this.index = null

      // Ignores event if mouse has not been moved
      if (e.getClientX() !== this.startX || e.getClientY() !== this.startY) {
        const clone =
          !this.graph.isConnectionIgnored(e.getEvent()) &&
          this.graph.isCloneEvent(e.getEvent()) &&
          this.cloneable &&
          this.graph.isCellsCloneable()

        // Displays the reason for not carriying out the change
        // if there is an error message with non-zero length
        if (this.error != null) {
          if (this.error.length > 0) {
            this.graph.validationManager.warning(this.error)
          }
        } else if (Handle.isCustomHandle(index)) {
          if (this.customHandles != null) {
            this.graph.batchUpdate(() => {
              this.customHandles![Handle.getCustomHandle(index)].execute()
            })
          }
        } else if (this.isLabelHandle) {
          this.moveLabel(this.state, this.labelPos!.x, this.labelPos!.y)
        } else if (this.isSourceHandle || this.isTargetHandle) {
          let terminal: Cell | null = null

          if (
            this.anchorHandler.currentAnchor != null &&
            this.anchorHandler.currentState != null
          ) {
            terminal = this.anchorHandler.currentState.cell
          }

          if (
            terminal == null &&
            this.marker.hasValidState() &&
            this.marker.highlight != null &&
            this.marker.highlight.shape != null &&
            this.marker.highlight.shape.strokeColor !== 'transparent' &&
            this.marker.highlight.shape.strokeColor !== 'white'
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

                const other = model.getTerminal(edge, !this.isSourceHandle)!
                this.graph.connectCell(clone, other, !this.isSourceHandle)

                edge = clone
              }

              edge = this.connect(
                edge,
                terminal!,
                this.isSourceHandle,
                clone,
                e,
              )
            })
          } else if (this.graph.isDanglingEdgesEnabled()) {
            const s = this.graph.view.scale
            const t = this.graph.view.translate
            const i = this.isSourceHandle ? 0 : this.absolutePoints.length - 1
            const p = this.absolutePoints[i]

            p.x = this.roundLength(p.x / s - t.x)
            p.y = this.roundLength(p.y / s - t.y)

            const pstate = this.graph.view.getState(
              this.graph.getModel().getParent(edge),
            )

            if (pstate != null) {
              p.x -= pstate.origin.x
              p.y -= pstate.origin.y
            }

            p.x -= this.graph.panX / s
            p.y -= this.graph.panY / s

            // Destroys and recreates this handler
            edge = this.changeTerminalPoint(edge, p, this.isSourceHandle, clone)
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
          this.graph.setCellSelected(edge)
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
    this.isLabelHandle = false
    this.isSourceHandle = false
    this.isTargetHandle = false
    this.active = false

    if (this.marker != null) {
      this.marker.reset()
    }

    if (this.anchorHandler != null) {
      this.anchorHandler.reset()
    }

    if (this.customHandles != null) {
      for (let i = 0, ii = this.customHandles.length; i < ii; i += 1) {
        this.customHandles[i].reset()
      }
    }

    this.removeHint()
    this.redraw()
  }

  /**
   * Sets the color of the preview to the given value.
   */
  protected setPreviewColor(color: string | null) {
    if (this.previewShape != null) {
      this.previewShape.strokeColor = color
    }
  }

  /**
   * Converts the given point in-place from screen to unscaled,
   * untranslated graph coordinates and applies the grid.
   */
  protected normalizePoint(point: Point, gridEnabled: boolean) {
    const s = this.graph.view.getScale()
    const t = this.graph.view.getTranslate()

    if (gridEnabled) {
      point.x = this.graph.snap(point.x)
      point.y = this.graph.snap(point.y)
    }

    point.x = Math.round(point.x / s - t.x)
    point.y = Math.round(point.y / s - t.y)

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
      let anchor = this.anchorHandler.currentAnchor
      if (anchor == null) {
        anchor = new Anchor()
      }

      this.graph.connectCell(edge, terminal, isSource, anchor)
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
        this.graph.connectCell(edge, null, isSource, new Anchor())
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

  protected refresh() {
    this.absolutePoints = this.getSelectionPoints(this.state)
    this.points = []

    if (this.previewShape != null) {
      this.previewShape.points = this.absolutePoints
    }

    if (this.handles != null) {
      this.destroyHandles(this.handles)
      this.handles = this.createHandles()
    }

    if (this.virtualHandles != null) {
      this.destroyHandles(this.virtualHandles)
      this.virtualHandles = this.createVirtualHandles()
    }

    if (this.customHandles != null) {
      this.destroyHandles(this.customHandles)
      this.customHandles = this.createCustomHandles()
    }

    if (this.labelHandleShape) {
      DomUtil.toFront(this.labelHandleShape.elem)
    }
  }

  redraw() {
    this.absolutePoints = this.state.absolutePoints.slice()
    this.redrawHandles()

    const geo = this.graph.model.getGeometry(this.state.cell)!
    const pts = geo.points

    if (pts != null && this.handles != null && this.handles.length > 0) {
      if (this.points == null) {
        this.points = []
      }

      for (let i = 1, ii = this.handles.length - 1; i < ii; i += 1) {
        if (this.handles[i] != null && this.absolutePoints[i] != null) {
          this.points[i - 1] = pts[i - 1]
        }
      }
    }

    this.drawPreview()
  }

  protected redrawHandles() {
    const cell = this.state.cell

    if (this.labelHandleShape != null) {
      // Updates the handle for the label position
      const bounds = this.labelHandleShape.bounds
      const offset = getLabelHandleOffset({
        graph: this.graph,
        cell: this.state.cell,
        shape: this.labelHandleShape,
      })

      this.labelPos = this.state.absoluteOffset.clone()
      this.labelHandleShape.bounds = new Rectangle(
        Math.round(this.labelPos.x - bounds.width / 2 + offset.x),
        Math.round(this.labelPos.y - bounds.height / 2 + offset.y),
        bounds.width,
        bounds.height,
      )

      // Shows or hides the label handle depending on the label
      this.labelHandleShape.visible =
        this.isValidLabel(this.graph.getLabel(cell)) &&
        this.graph.isLabelMovable(cell)
    }

    if (this.handles != null && this.handles.length > 0) {
      const p0 = this.absolutePoints[0]
      const pe = this.absolutePoints[this.absolutePoints.length - 1]
      this.redrawTerminalHandle(this.handles[0], p0)
      this.redrawTerminalHandle(this.handles[this.handles.length - 1], pe)
      this.redrawInnerHandles(p0, pe)
    }

    if (
      this.absolutePoints != null &&
      this.virtualHandles != null &&
      this.virtualHandles.length > 0
    ) {
      let pl = this.absolutePoints[0]
      for (let i = 0, ii = this.virtualHandles.length; i < ii; i += 1) {
        const point = this.absolutePoints[i + 1]
        const handle = this.virtualHandles[i]
        if (handle != null && point != null) {
          const x = pl.x + (point.x - pl.x) / 2
          const y = pl.y + (point.y - pl.y) / 2

          handle.bounds = new Rectangle(
            Math.floor(x - handle.bounds.width / 2),
            Math.floor(y - handle.bounds.height / 2),
            handle.bounds.width,
            handle.bounds.height,
          )
          handle.redraw()
          pl = point

          if (this.manageLabelHandle) {
            this.checkLabelHandle(handle.bounds)
          }
        }
      }
    }

    if (this.labelHandleShape != null) {
      this.labelHandleShape.redraw()
    }

    if (this.customHandles != null) {
      this.customHandles.forEach(c => c.redraw())
    }
  }

  protected drawPreview() {
    if (this.isLabelHandle) {
      if (this.labelHandleShape != null) {
        this.updateHandlePos(this.labelHandleShape, this.labelPos)
        this.labelHandleShape.redraw()
      }
    } else if (this.previewShape != null) {
      this.previewShape.apply(this.state)
      this.previewShape.points = this.absolutePoints
      this.previewShape.scale = this.state.view.scale

      const args = {
        graph: this.graph,
        cell: this.state.cell,
        shape: this.previewShape,
      }

      applySelectionPreviewStyle(args)
      this.previewShape.cursor = getSelectionPreviewCursor(args)
      this.previewShape.shadow = false
      this.previewShape.redraw()
    }

    if (this.parentHighlight != null) {
      this.parentHighlight.redraw()
    }
  }

  protected redrawTerminalHandle(handle: Shape, p: Point) {
    if (handle != null) {
      this.updateHandlePos(handle, p)
      handle.redraw()
      if (this.manageLabelHandle) {
        this.checkLabelHandle(handle.bounds)
      }
    }
  }

  protected redrawInnerHandles(p0: Point, pe: Point) {
    if (this.handles) {
      for (let i = 1, ii = this.handles.length - 1; i < ii; i += 1) {
        const handle = this.handles[i]
        if (handle != null) {
          if (this.absolutePoints[i] != null) {
            this.updateHandlePos(handle, this.absolutePoints[i])
            handle.elem!.style.display = ''

            if (this.manageLabelHandle) {
              this.checkLabelHandle(handle.bounds)
            } else if (
              this.labelHandleShape != null &&
              this.labelHandleShape.visible &&
              handle.bounds.isIntersectWith(this.labelHandleShape.bounds)
            ) {
              const b = handle.bounds
              const x = this.absolutePoints[i].x
              const y = this.absolutePoints[i].y
              const w = b.width + 3
              const h = b.height + 3
              handle.bounds = new Rectangle(
                Math.round(x - w / 2),
                Math.round(y - h / 2),
                w,
                h,
              )
            }

            handle.redraw()
          } else {
            handle.dispose()
            const handles = this.handles as any
            handles[i] = null
          }
        }
      }
    }
  }

  protected updateHandlePos(handle: Shape, p: Point | null) {
    if (handle != null && p != null) {
      const x = p.x
      const y = p.y
      const b = handle.bounds
      handle.bounds = new Rectangle(
        Math.round(x - b.width / 2),
        Math.round(y - b.height / 2),
        b.width,
        b.height,
      )
    }
  }

  protected isValidLabel(label: string | HTMLElement | null) {
    if (label != null) {
      if (typeof label === 'string') {
        return label.length > 0
      }
      return true
    }

    return false
  }

  /**
   * Checks if the label handle intersects the given bounds and
   * moves it if it intersects.
   */
  protected checkLabelHandle(b: Rectangle) {
    if (this.labelHandleShape != null) {
      const b2 = this.labelHandleShape.bounds
      if (b.isIntersectWith(b2)) {
        if (b.getCenterY() < b2.getCenterY()) {
          b2.y = b.y + b.height
        } else {
          b2.y = b.y - b2.height
        }
      }
    }
  }

  protected setHandlesVisible(visible: boolean) {
    this.handles &&
      this.handles.forEach(h => {
        if (h && h.elem) {
          h.elem.style.display = visible ? '' : 'none'
        }
      })

    this.virtualHandles &&
      this.virtualHandles.forEach(h => {
        if (h && h.elem) {
          h.elem.style.display = visible ? '' : 'none'
        }
      })

    if (this.labelHandleShape != null) {
      this.labelHandleShape.elem!.style.display = visible ? '' : 'none'
    }

    if (this.customHandles != null) {
      this.customHandles.forEach(c => c.setVisible(visible))
    }
  }

  protected destroyHandles(handles: (IDisposable | Handle | null)[] | null) {
    handles && handles.forEach(h => h && h.dispose())
  }

  @MouseHandler.dispose()
  dispose() {
    this.state.view.graph.off('escape', this.escapeHandler)
    this.escapeHandler = null

    this.marker.dispose()
    this.anchorHandler.dispose()

    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
    }

    if (this.parentHighlight != null) {
      this.parentHighlight.dispose()
      this.parentHighlight = null
    }

    if (this.labelHandleShape != null) {
      this.labelHandleShape.dispose()
      this.labelHandleShape = null
    }

    this.destroyHandles(this.virtualHandles)
    this.virtualHandles = null

    this.destroyHandles(this.customHandles)
    this.customHandles = null

    this.destroyHandles(this.handles)
    this.handles = null

    this.removeHint()
  }
}
