import * as util from '../util'
import { View } from '../core/view'
import { Graph, Model, Cell, State, Geometry } from '../core'
import { Rectangle, Point, Constraint } from '../struct'
import { constants, DomEvent, MouseEventEx, Disposable } from '../common'
import { Shape, ImageShape, Polyline } from '../shape'
import { Style } from '../types'
import { MouseHandler } from './handler-mouse'
import { CellMarker } from './cell-marker'
import { ConstraintHandler } from './constraint-handler'
import {
  ConnectionOptions,
  getConnectionIconOptions,
  getConnectionIcon,
  applyConnectionPreviewStyle,
  getConnectionHighlightOptions,
} from '../option/connection'

export class ConnectionHandler extends MouseHandler {
  marker: CellMarker
  constraintHandler: ConstraintHandler
  error: string | null = null
  edgeState: State | null = null

  factoryMethod?: (source: Cell, target: Cell, style: Style) => Cell
  autoSelect: boolean = true
  autoCreateTarget: boolean = false

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

  private changeHandler: (() => void) | null
  private resetHandler: (() => void) | null

  sourcePoint: Point | null
  sourceState: State | null
  sourceConstraint: Constraint | null

  private targetPoint: Point | null
  private currentPoint: Point | null
  private currentState: State | null
  private previewShape: Shape | null
  private waypoints: Point[] | null
  protected mouseDownCounter: number = 0

  private icon: ImageShape | null
  private icons: ImageShape[] | null
  private selectedIcon: ImageShape | null
  private iconState: State | null

  constructor(
    graph: Graph,
    factoryMethod?: (source: Cell, target: Cell, style: Style) => Cell,
  ) {
    super(graph)
    this.factoryMethod = factoryMethod
    this.graph.addMouseListener(this)
    this.init()
  }

  config(options: ConnectionOptions) {
    this.factoryMethod = options.createEdge
    this.autoSelect = options.autoSelect
    this.autoCreateTarget = options.autoCreateTarget
    this.waypointsEnabled = options.waypointsEnabled
    this.ignoreMouseDown = options.ignoreMouseDown
    this.livePreview = options.livePreview
    this.insertBeforeSource = options.insertBeforeSource
    this.outlineConnect = options.outlineConnect
  }

  protected init() {
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
        this.sourceState != null &&
        this.graph.view.getState(this.sourceState.cell) == null
      ) {
        this.reset()
      }
    }

    this.graph.view.on(View.events.scale, this.changeHandler)
    this.graph.view.on(View.events.translate, this.changeHandler)
    this.graph.view.on(View.events.scaleAndTranslate, this.changeHandler)
    this.graph.model.on(Model.events.change, this.changeHandler)

    // Removes the icon if we step into/up or start editing
    this.resetHandler = () => this.reset()
    this.graph.on(Graph.events.escape, this.resetHandler)
    this.graph.on(DomEvent.START_EDITING, this.resetHandler)
    this.graph.view.on(View.events.down, this.resetHandler)
    this.graph.view.on(View.events.up, this.resetHandler)
  }

  protected isInsertBefore(
    edge: Cell,
    source: Cell,
    target: Cell,
    evt: MouseEvent,
    dropTarget: Cell | null,
  ) {
    return this.insertBeforeSource && source !== target
  }

  protected isCreateTarget(e: MouseEvent) {
    return this.autoCreateTarget
  }

  protected isConnecting() {
    return this.sourcePoint != null && this.previewShape != null
  }

  protected isValidSource(cell: Cell) {
    return this.graph.isValidSource(cell)
  }

  protected isValidTarget(cell: Cell) {
    return this.graph.isValidTarget(cell)
  }

  protected isConnectableCell(cell: Cell) {
    return this.graph.isCellConnectable(cell)
  }

  protected isCellEnabled(cell: Cell) {
    return true
  }

  protected validateConnection(source: Cell, target: Cell) {
    if (!this.isValidTarget(target) || !this.isValidSource(source)) {
      return ''
    }

    return this.graph.validator.getEdgeValidationError(
      null, source, target,
    )
  }

  protected isStartEvent(e: MouseEventEx) {
    return (
      (
        this.constraintHandler.currentState != null &&
        this.constraintHandler.currentConstraint != null
      ) ||
      (
        this.sourceState != null &&
        this.error == null &&
        (
          this.icons == null || (this.icons != null && this.icon != null)
        )
      )
    )
  }

  protected isStopEvent(e: MouseEventEx) {
    return e.getState() != null
  }

  mouseDown(e: MouseEventEx) {
    this.mouseDownCounter += 1

    if (
      !e.isConsumed() &&
      this.isEnabled() &&
      this.graph.isEnabled() &&
      !this.isConnecting() &&
      this.isStartEvent(e)
    ) {
      if (
        this.constraintHandler.currentConstraint != null &&
        this.constraintHandler.currentState != null &&
        this.constraintHandler.currentPoint != null
      ) {
        this.sourceState = this.constraintHandler.currentState
        this.sourcePoint = this.constraintHandler.currentPoint.clone()
        this.sourceConstraint = this.constraintHandler.currentConstraint
      } else {
        // Stores the location of the initial mousedown
        this.sourcePoint = e.getGraphPos()
      }

      this.edgeState = this.createEdgeState(e)
      this.mouseDownCounter = 1

      if (this.waypointsEnabled && this.previewShape == null) {
        this.waypoints = null
        this.previewShape = this.createPreview()

        if (this.edgeState != null) {
          this.previewShape.apply(this.edgeState)
        }
      }

      // Stores the starting point in the geometry of the preview
      if (this.sourceState == null && this.edgeState != null) {
        const p = this.graph.getPointForEvent(e.getEvent())
        this.edgeState.cell.geometry!.setTerminalPoint(p, true)
      }

      this.trigger(ConnectionHandler.events.start, { state: this.sourceState })
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
  protected isImmediateConnectSource(state: State) {
    return !this.graph.isCellMovable(state.cell)
  }

  protected isOutlineConnectEvent(e: MouseEventEx) {
    const evt = e.getEvent()
    const state = e.getState()

    if (this.outlineConnect && !DomEvent.isShiftDown(evt)) {

      if (
        e.isSource(this.marker.highlight.shape) ||
        (DomEvent.isAltDown(evt) && state != null)
      ) {
        return true
      }

      const clientX = DomEvent.getClientX(evt)
      const clientY = DomEvent.getClientY(evt)

      if (this.marker.highlight.isHighlightAt(clientX, clientY)) {
        return true
      }

      const doc = document.documentElement
      const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
      const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
      const offset = util.getOffset(this.graph.container)
      const p = this.currentPoint!

      const gridX = p.x - this.graph.container.scrollLeft + offset.x - left
      const gridY = p.y - this.graph.container.scrollTop + offset.y - top

      if (
        state == null &&
        (gridX !== clientX || gridY !== clientY) &&
        this.marker.highlight.isHighlightAt(gridX, gridY)
      ) {
        return true
      }
    }

    return false
  }

  protected convertWaypoint(point: Point) {
    const s = this.graph.view.getScale()
    const t = this.graph.view.getTranslate()

    point.x = point.x / s - t.x
    point.y = point.y / s - t.y

    return point
  }

  /**
   * Handles the event by updating the preview edge or by highlighting
   * a possible source or target terminal.
   */
  mouseMove(e: MouseEventEx) {
    if (
      !e.isConsumed() &&
      (
        this.ignoreMouseDown ||
        this.sourcePoint != null ||
        !this.graph.eventloop.isMouseDown
      )
    ) {
      // Handles special case when handler is disabled during highlight
      if (!this.isEnabled() && this.currentState != null) {
        this.destroyIcons()
        this.currentState = null
      }

      const point = this.getMousePosition(e)
      this.currentPoint = point
      this.error = null

      if (
        (
          (this.isEnabled() && this.graph.isEnabled()) ||
          this.sourcePoint != null
        )
        &&
        (
          this.previewShape != null || this.sourcePoint == null ||
          Math.abs(e.getGraphX() - this.sourcePoint.x) > this.graph.tolerance ||
          Math.abs(e.getGraphY() - this.sourcePoint.y) > this.graph.tolerance
        )
      ) {
        this.updateCurrentState(e, point)
      }

      // 连线中
      if (this.sourcePoint != null) {

        let sourcePoint = this.sourcePoint
        let currentPoint = point
        let currentConstraint = null

        // Uses the current point from the constraint handler if available
        if (
          this.constraintHandler.currentConstraint != null &&
          this.constraintHandler.currentState != null &&
          this.constraintHandler.currentPoint != null
        ) {
          currentConstraint = this.constraintHandler.currentConstraint
          currentPoint = this.constraintHandler.currentPoint.clone()
        } else if (
          this.sourceState != null &&
          !this.graph.isConnectionIgnored(e.getEvent()) &&
          DomEvent.isShiftDown(e.getEvent())
        ) {
          if (
            Math.abs(this.sourceState.bounds.getCenterX() - currentPoint.x) <
            Math.abs(this.sourceState.bounds.getCenterY() - currentPoint.y)
          ) {
            currentPoint.x = this.sourceState.bounds.getCenterX()
          } else {
            currentPoint.y = this.sourceState.bounds.getCenterY()
          }
        }

        // 使 icon 跟随鼠标移动
        this.updateIcon(e)

        // Uses edge state to compute the terminal points
        if (this.edgeState != null) {
          this.updateEdgeState(currentPoint, currentConstraint)
          const lastIndex = this.edgeState.absolutePoints.length - 1
          currentPoint = this.edgeState.absolutePoints[lastIndex]
          sourcePoint = this.edgeState.absolutePoints[0]
        } else {
          if (this.currentState != null) {
            if (this.constraintHandler.currentConstraint == null) {
              const p = this.getTargetPerimeterPoint(this.currentState, e)
              if (p != null) {
                currentPoint = p
              }
            }
          }

          // Computes the source perimeter point
          if (this.sourceConstraint == null && this.sourceState != null) {
            const next = (this.waypoints != null && this.waypoints.length > 0)
              ? this.waypoints[0]
              : currentPoint
            const p = this.getSourcePerimeterPoint(this.sourceState, next, e)
            if (p != null) {
              sourcePoint = p
            }
          }
        }

        // Makes sure the cell under the mousepointer can be detected
        // by moving the preview shape away from the mouse. This
        // makes sure the preview shape does not prevent the detection
        // of the cell under the mousepointer even for slow gestures.
        if (this.currentState == null) {
          let tmp = sourcePoint

          if (this.edgeState && this.edgeState.absolutePoints.length >= 2) {
            const index = this.edgeState.absolutePoints.length - 2
            const tmp2 = this.edgeState.absolutePoints[index]
            if (tmp2 != null) {
              tmp = tmp2
            }
          }

          const dx = currentPoint.x - tmp.x
          const dy = currentPoint.y - tmp.y
          const len = Math.sqrt(dx * dx + dy * dy)

          if (len === 0) {
            return
          }

          // Stores old point to reuse when creating edge
          this.targetPoint = currentPoint.clone()
          currentPoint.x -= dx * 4 / len
          currentPoint.y -= dy * 4 / len
        } else {
          this.targetPoint = null
        }

        // Creates the preview shape (lazy)
        if (this.previewShape == null) {
          const dx = Math.abs(e.getGraphX() - this.sourcePoint.x)
          const dy = Math.abs(e.getGraphY() - this.sourcePoint.y)

          if (dx > this.graph.tolerance || dy > this.graph.tolerance) {
            this.previewShape = this.createPreview()
            if (this.edgeState != null) {
              this.previewShape.apply(this.edgeState)
            }

            // Revalidates current connection
            this.updateCurrentState(e, point)
          }
        }

        // Updates the points in the preview edge
        if (this.previewShape != null) {
          if (this.edgeState != null) {
            this.previewShape.points = this.edgeState.absolutePoints
          } else {
            const pts = [sourcePoint]
            if (this.waypoints != null) {
              pts.push(...this.waypoints)
            }
            pts.push(currentPoint)
            this.previewShape.points = pts
          }

          this.drawPreview()
        }

        this.setCursor()

        DomEvent.consume(e.getEvent())
        e.consume()

      } else if (!this.isEnabled() || !this.graph.isEnabled()) {
        this.constraintHandler.reset()
      } else if (
        // 当鼠标移动到 Node 中心附近位置，触发 CellMarker 高亮当前 Node 时
        this.sourceState !== this.currentState &&
        this.edgeState == null
      ) {

        this.destroyIcons()

        if (
          this.error == null &&
          this.currentState != null &&
          this.constraintHandler.currentConstraint == null
        ) {
          this.icons = this.createIcons(this.currentState)
          if (this.icons == null) {
            this.currentState.setCursor(constants.CURSOR_CONNECT)
            e.consume()
          }
        }

        this.sourceState = this.currentState

      } else if (
        // 鼠标在中心位置附近移动时，一切不变
        this.sourceState === this.currentState &&
        this.currentState != null &&
        this.icons == null &&
        !this.graph.eventloop.isMouseDown
      ) {
        e.consume()
      }

      // 更新 icons
      if (
        !this.graph.eventloop.isMouseDown &&
        this.currentState != null &&
        this.icons != null
      ) {
        let hitsIcon = false
        const target = e.getSource()
        for (let i = 0, ii = this.icons.length; i < ii && !hitsIcon; i += 1) {
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

  protected getMousePosition(e: MouseEventEx) {
    const view = this.graph.view
    const s = view.scale
    const t = view.translate
    const point = e.getGraphPos()

    // snap to grid
    if (this.graph.isGridEnabledForEvent(e.getEvent())) {
      point.update(
        (this.graph.snap(point.x / s - t.x) + t.x) * s,
        (this.graph.snap(point.y / s - t.y) + t.y) * s,
      )
    }

    // snap to sourcePoint
    if (!DomEvent.isAltDown(e.getEvent()) && this.sourceState != null) {
      const tol = this.graph.gridSize * this.graph.view.scale / 2
      const tmp = this.sourcePoint
        ? this.sourcePoint
        : this.sourceState.bounds.getCenter()

      if (Math.abs(tmp.x - e.getGraphX()) < tol) {
        point.x = tmp.x
      }

      if (Math.abs(tmp.y - e.getGraphY()) < tol) {
        point.y = tmp.y
      }
    }

    return point
  }

  protected updateCurrentState(e: MouseEventEx, point: Point) {
    this.constraintHandler.update(
      e,
      this.sourcePoint == null,
      false,
      (this.sourcePoint == null || e.isSource(this.marker.highlight.shape))
        ? null
        : point,
    )

    if (
      this.constraintHandler.currentState != null &&
      this.constraintHandler.currentConstraint != null
    ) {
      // Transparent cell hilight when constraint point is highlighted.
      const transparent = 'rgba(255,255,255,0)'
      if (
        this.marker &&
        this.marker.highlight != null &&
        this.marker.highlight.state != null &&
        this.marker.highlight.state.cell ===
        this.constraintHandler.currentState.cell
      ) {
        if (
          this.marker.highlight.shape != null &&
          this.marker.highlight.shape.stroke !== transparent
        ) {
          this.marker.highlight.shape.stroke = transparent
          this.marker.highlight.repaint()
        }
      } else {
        this.marker.markCell(
          this.constraintHandler.currentState.cell,
          transparent,
        )
      }

      // Updates validation state.
      if (this.sourceState != null) {
        this.error = this.validateConnection(
          this.sourceState.cell, this.constraintHandler.currentState.cell,
        )

        if (this.error == null) {
          this.currentState = this.constraintHandler.currentState
        } else {
          this.constraintHandler.reset()
        }
      }

    } else {

      if (this.graph.isConnectionIgnored(e.getEvent())) {
        this.marker.reset()
        this.currentState = null
      } else {
        this.marker.process(e)
        this.currentState = this.marker.getValidState()

        if (
          this.currentState != null &&
          !this.isCellEnabled(this.currentState.cell)
        ) {
          this.currentState = null
        }
      }

      const outline = this.isOutlineConnectEvent(e)

      if (this.currentState != null && outline) {
        // Handles special case where mouse is on outline away from actual
        // end point in which case the grid is ignored and mouse point is
        // used instead
        if (e.isSource(this.marker.highlight.shape)) {
          point = new Point(e.getGraphX(), e.getGraphY()) // tslint:disable-line
        }

        const constraint = this.graph.cellManager.getOutlineConstraint(
          point, this.currentState, e,
        )
        this.constraintHandler.focus(e, this.currentState, false)
        this.constraintHandler.currentConstraint = constraint
        this.constraintHandler.currentPoint = point
      }

      if (this.outlineConnect) {
        if (
          this.marker.highlight != null &&
          this.marker.highlight.shape != null
        ) {
          const s = this.graph.view.scale

          if (
            this.constraintHandler.currentConstraint != null &&
            this.constraintHandler.currentState != null
          ) {

            this.marker.highlight.shape.stroke = constants.OUTLINE_HIGHLIGHT_COLOR
            this.marker.highlight.shape.strokeWidth =
              constants.OUTLINE_HIGHLIGHT_STROKEWIDTH / s / s
            this.marker.highlight.repaint()

          } else if (this.marker.hasValidState()) {

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

  protected updateEdgeState(
    currentPoint: Point,
    constraint: Constraint | null,
  ) {
    if (this.edgeState == null) {
      return
    }

    if (this.sourceConstraint != null && this.sourceConstraint.point != null) {
      this.edgeState.style.exitX = this.sourceConstraint.point.x
      this.edgeState.style.exitY = this.sourceConstraint.point.y
    }

    if (constraint != null && constraint.point != null) {
      this.edgeState.style.entryX = constraint.point.x
      this.edgeState.style.entryY = constraint.point.y
    } else {
      delete this.edgeState.style.entryX
      delete this.edgeState.style.entryY
    }

    this.edgeState.absolutePoints = [
      null,
      (this.currentState != null) ? null : currentPoint,
    ] as any

    this.graph.view.updateFixedTerminalPoint(
      this.edgeState,
      this.sourceState!,
      true,
      this.sourceConstraint!,
    )

    if (this.currentState != null) {
      if (constraint == null) {
        // tslint:disable-next-line
        constraint = this.graph.getConnectionConstraint(
          this.edgeState, this.sourceState, false,
        )
      }

      this.edgeState.setAbsoluteTerminalPoint(null as any, false)
      this.graph.view.updateFixedTerminalPoint(
        this.edgeState, this.currentState, false, constraint,
      )
    }

    // Scales and translates the waypoints to the model
    let realPoints = null

    if (this.waypoints != null) {
      realPoints = this.waypoints.map(p => this.convertWaypoint(p.clone()))
    }

    this.graph.view.updateRouterPoints(
      this.edgeState, realPoints!, this.sourceState!, this.currentState!,
    )

    this.graph.view.updateFloatingTerminalPoints(
      this.edgeState, this.sourceState!, this.currentState!,
    )
  }

  protected getTargetPerimeterPoint(state: State, e: MouseEventEx) {
    let result = null
    const view = state.view
    const perimeterFn = view.getPerimeterFunction(state)

    if (perimeterFn != null) {
      const next = (this.waypoints != null && this.waypoints.length > 0)
        ? this.waypoints[this.waypoints.length - 1]
        : this.sourceState!.bounds.getCenter()

      const tmp = perimeterFn(
        view.getPerimeterBounds(state), this.edgeState!, next, false,
      )

      if (tmp != null) {
        result = tmp
      }
    } else {
      result = state.bounds.getCenter()
    }

    return result
  }

  protected getSourcePerimeterPoint(
    state: State,
    next: Point,
    e: MouseEventEx,
  ) {
    let result = null
    const view = state.view
    const center = state.bounds.getCenter()
    const perimeterFn = view.getPerimeterFunction(state)

    if (perimeterFn != null) {
      const rot = util.getRotation(state)
      if (rot !== 0) {
        // tslint:disable-next-line
        next = util.rotatePoint(next, -rot, center)
      }

      let tmp = perimeterFn(
        view.getPerimeterBounds(state), state, next, false,
      )

      if (tmp != null) {
        if (rot !== 0) {
          tmp = util.rotatePoint(tmp, rot, center)
        }

        result = tmp
      }
    } else {
      result = center
    }

    return result
  }

  mouseUp(e: MouseEventEx) {
    if (!e.isConsumed() && this.isConnecting()) {
      if (this.waypointsEnabled && !this.isStopEvent(e)) {
        this.addWaypointForEvent(e)
        e.consume()
        return
      }

      const c1 = this.sourceConstraint
      const c2 = this.constraintHandler.currentConstraint

      const source = (this.sourceState != null) ? this.sourceState.cell : null
      let target = null

      if (
        this.constraintHandler.currentConstraint != null &&
        this.constraintHandler.currentState != null
      ) {
        target = this.constraintHandler.currentState.cell
      }

      if (target == null && this.currentState != null) {
        target = this.currentState.cell
      }

      if (
        this.error == null && (
          source == null ||
          target == null ||
          source !== target ||
          this.checkConstraints(c1, c2)
        )
      ) {
        this.connect(source!, target!, e.getEvent(), e.getCell())
      } else {

        // Selects the source terminal for self-references
        if (
          this.sourceState != null &&
          this.marker.validState != null &&
          this.sourceState.cell === this.marker.validState.cell
        ) {
          this.graph.selectionManager.selectCellForEvent(
            this.marker.validState.cell, e.getEvent(),
          )
        }

        if (this.error != null && this.error.length > 0) {
          this.graph.validationWarn(this.error)
        }
      }

      this.destroyIcons()
      e.consume()
    }

    if (this.sourcePoint != null) {
      this.reset()
    }
  }

  protected addWaypointForEvent(e: MouseEventEx) {
    const point = util.clientToGraph(this.graph.container, e)
    const dx = Math.abs(point.x - this.sourcePoint!.x)
    const dy = Math.abs(point.y - this.sourcePoint!.y)
    const addPoint = this.waypoints != null || (
      this.mouseDownCounter > 1 &&
      (
        dx > this.graph.tolerance ||
        dy > this.graph.tolerance
      )
    )

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

  protected checkConstraints(c1: Constraint | null, c2: Constraint | null) {
    return (
      c1 == null ||
      c2 == null ||
      c1.point == null ||
      c2.point == null ||
      !c1.point.equals(c2.point) ||
      c1.dx !== c2.dx ||
      c1.dy !== c2.dy ||
      c1.perimeter !== c2.perimeter
    )
  }

  protected createMarker() {
    const options = getConnectionHighlightOptions({ graph: this.graph })
    const marker = new CellMarker(this.graph, options)

    marker.getCell = (e: MouseEventEx) => {
      let cell = CellMarker.prototype.getCell.call(marker, e)
      this.error = null

      // Checks for cell at preview point (with grid)
      if (cell == null && this.currentPoint != null) {
        cell = this.graph.getCellAt(this.currentPoint.x, this.currentPoint.y)
      }

      // Uses connectable parent node if one exists
      if (cell != null && !this.graph.isCellConnectable(cell)) {
        const parent = this.graph.getModel().getParent(cell)

        if (
          this.graph.model.isNode(parent) &&
          this.graph.isCellConnectable(parent)
        ) {
          cell = parent
        }
      }

      if (
        (
          this.graph.isSwimlane(cell) &&
          this.currentPoint != null &&
          this.graph.cellManager.hitsSwimlaneContent(
            cell, this.currentPoint.x, this.currentPoint.y,
          )
        ) ||
        !this.isConnectableCell(cell)
      ) {
        cell = null
      }

      if (cell != null) {

        if (this.isConnecting()) {
          if (this.sourceState != null) {
            this.error = this.validateConnection(this.sourceState.cell, cell)
            if (this.error != null && this.error.length >= 0) {
              cell = null
              if (this.isCreateTarget(e.getEvent())) {
                this.error = null
              }
            }
          }
        } else if (!this.isValidSource(cell)) {
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

    const hasConnectIcon = (state: State | null) => {
      if (state != null) {
        return getConnectionIcon({
          graph: this.graph,
          cell: state.cell,
        }) != null
      }

      return false
    }

    marker.getMarkerColor = (evt, state, isValid) => {
      return (!hasConnectIcon(state) || this.isConnecting())
        ? CellMarker.prototype.getMarkerColor.call(marker, evt, state, isValid)
        : null
    }

    // Overrides to use hotspot only for source selection otherwise
    // intersects always returns true when over a cell
    marker.intersects = (state, evt) => {
      if (hasConnectIcon(state) || this.isConnecting()) {
        return true
      }

      return CellMarker.prototype.intersects.call(marker, state, evt)
    }

    return marker
  }

  /**
   * Hook to return an `State` which may be used during the preview.
   */
  createEdgeState(e: MouseEventEx | null): State | null {
    return null
  }

  protected createIcons(state: State) {
    const opts = getConnectionIconOptions({
      graph: this.graph,
      cell: state.cell,
    })

    if (opts.image != null && state != null) {
      this.iconState = state
      const icons = []
      const bounds = new Rectangle(0, 0, opts.image.width, opts.image.height)
      const icon = new ImageShape(bounds, opts.image.src, null, null, 0)

      icon.preserveImageAspect = false
      icon.cursor = opts.cursor

      if (util.hasHtmlLabel(state) || opts.toFront) {
        icon.dialect = 'html'
        icon.init(this.graph.container)
      } else {
        icon.dialect = 'svg'
        icon.init(this.graph.view.getOverlayPane())
        if (opts.toBack) {
          util.toBack(icon.elem)
        }
      }

      const getState = () => this.currentState || state
      const mouseDown = (evt: MouseEvent) => {
        // Updates the local icon before firing the mouse down event.
        if (!DomEvent.isConsumed(evt)) {
          this.icon = icon
          this.graph.fireMouseEvent(
            DomEvent.MOUSE_DOWN, new MouseEventEx(evt, getState()),
          )
        }
      }

      MouseEventEx.redirectMouseEvents(
        icon.elem, this.graph, getState, mouseDown,
      )

      icons.push(icon)

      this.redrawIcons(icons, this.iconState)

      return icons
    }

    return null
  }

  protected redrawIcons(icons: ImageShape[] | null, state: State) {
    if (icons != null && icons[0] != null && state != null) {
      const pos = this.getIconPosition(icons[0], state)
      icons[0].bounds.x = pos.x
      icons[0].bounds.y = pos.y
      icons[0].redraw()
    }
  }

  protected getIconPosition(icon: ImageShape, state: State) {
    const s = this.graph.view.scale
    let cx = state.bounds.getCenterX()
    let cy = state.bounds.getCenterY()

    if (this.graph.isSwimlane(state.cell)) {
      const size = this.graph.getStartSize(state.cell)

      cx = (size.width !== 0) ? state.bounds.x + size.width * s / 2 : cx
      cy = (size.height !== 0) ? state.bounds.y + size.height * s / 2 : cy

      const rot = util.getRotation(state)
      if (rot !== 0) {
        const ct = state.bounds.getCenter()
        const pt = util.rotatePoint(new Point(cx, cy), rot, ct)
        cx = pt.x
        cy = pt.y
      }
    }

    return new Point(
      cx - icon.bounds.width / 2,
      cy - icon.bounds.height / 2,
    )
  }

  protected updateIcon(e: MouseEventEx) {
    if (this.selectedIcon != null) {
      const w = this.selectedIcon.bounds.width
      const h = this.selectedIcon.bounds.height
      const opts = getConnectionIconOptions({
        graph: this.graph,
        cell: this.sourceState!.cell,
      })

      if (this.currentState != null && opts.centerTarget) {
        const p = this.getIconPosition(this.selectedIcon, this.currentState)
        this.selectedIcon.bounds.x = p.x
        this.selectedIcon.bounds.y = p.y
      } else {
        const bounds = new Rectangle(
          e.getGraphX() + opts.offset.x,
          e.getGraphY() + opts.offset.y,
          w, h,
        )
        this.selectedIcon.bounds = bounds
      }

      this.selectedIcon.redraw()
    }
  }

  /**
   * Hook to update the icon position(s) based on a mouseOver event.
   */
  protected updateIcons(state: State, icons: ImageShape[], e: MouseEventEx) {
    // empty
  }

  protected destroyIcons() {
    if (this.icons != null) {
      this.icons.forEach(i => i.dispose())
      this.icons = null
      this.icon = null
      this.selectedIcon = null
      this.iconState = null
    }
  }

  protected createPreview() {
    const shape = (this.livePreview && this.edgeState)
      ? this.graph.renderer.createShape(this.edgeState)!
      : new Polyline()

    shape.dialect = 'svg'
    shape.scale = this.graph.view.scale
    shape.pointerEvents = false
    shape.init(this.graph.view.getOverlayPane())

    MouseEventEx.redirectMouseEvents(shape.elem, this.graph, null)

    return shape
  }

  protected updatePreview(valid: boolean) {
    if (this.previewShape != null) {
      applyConnectionPreviewStyle({
        valid,
        graph: this.graph,
        shape: this.previewShape,
        livePreview: this.livePreview,
      })
    }
  }

  protected drawPreview() {
    if (this.previewShape != null) {
      this.updatePreview(this.error == null)
      this.previewShape.redraw()
    }
  }

  private savedContainerCursor: string
  private setCursor() {
    if (this.cursor != null) {
      this.savedContainerCursor = this.graph.container.style.cursor
      this.graph.container.style.cursor = this.cursor
    }
  }

  private reverseCursor() {
    if (this.cursor != null && this.graph.container != null) {
      this.graph.container.style.cursor = this.savedContainerCursor
    }
  }

  protected reset() {
    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
    }

    this.reverseCursor()
    this.destroyIcons()
    this.marker.reset()
    this.constraintHandler.reset()

    this.sourceState = null
    this.sourcePoint = null
    this.sourceConstraint = null

    this.targetPoint = null
    this.currentPoint = null
    this.edgeState = null
    this.error = null

    this.mouseDownCounter = 0

    this.trigger(ConnectionHandler.events.reset)
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
  connect(
    source: Cell,
    target: Cell | null,
    evt: MouseEvent,
    dropTarget: Cell | null,
  ) {
    if (
      target != null ||
      this.isCreateTarget(evt) ||
      this.graph.allowDanglingEdges
    ) {

      // Uses the common parent of source and target or
      // the default parent to insert the edge
      const model = this.graph.getModel()
      let terminalInserted = false
      let edge = null

      model.batchUpdate(() => {
        if (
          source != null &&
          target == null &&
          !this.graph.isConnectionIgnored(evt) &&
          this.isCreateTarget(evt)
        ) {
          target = this.createTargetNode(evt, source) // tslint:disable-line

          if (target != null) {
            // tslint:disable-next-line
            dropTarget = this.graph.getDropTarget([target], evt, dropTarget)!
            terminalInserted = true

            // Disables edges as drop targets if the target cell was created
            if (
              dropTarget == null ||
              !this.graph.getModel().isEdge(dropTarget)
            ) {
              const pstate = this.graph.view.getState(dropTarget)
              if (pstate != null) {
                const geo = model.getGeometry(target)!
                geo.bounds.x -= pstate.origin.x
                geo.bounds.y -= pstate.origin.y
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

          if (
            (source.geometry != null && source.geometry.relative) &&
            (target.geometry != null && target.geometry.relative)
          ) {
            parent = model.getParent(parent)!
          }
        }

        // Uses the value of the preview edge state for inserting
        // the new edge into the graph
        let data = null
        let style = {}

        if (this.edgeState != null) {
          data = this.edgeState.cell.data
          style = this.edgeState.cell.style
        }

        edge = this.insertEdge(parent, null, data, source, target!, style)

        if (edge != null) {
          // Updates the connection constraints
          this.graph.setConnectionConstraint(
            edge, source, true, this.sourceConstraint,
          )

          this.graph.setConnectionConstraint(
            edge, target, false, this.constraintHandler.currentConstraint,
          )

          // Uses geometry of the preview edge state
          if (this.edgeState != null) {
            model.setGeometry(edge, this.edgeState.cell.geometry!)
          }

          const parent = model.getParent(source)

          // Inserts edge before source
          if (this.isInsertBefore(edge, source, target!, evt, dropTarget)) {
            let tmp = source

            while (tmp.parent != null && tmp.geometry != null &&
              tmp.geometry.relative && tmp.parent !== edge.parent) {
              tmp = this.graph.model.getParent(tmp)!
            }

            if (tmp != null && tmp.parent != null && tmp.parent === edge.parent) {
              model.add(parent, edge, tmp.parent.getChildIndex(tmp))
            }
          }

          const s = this.graph.view.scale
          const t = this.graph.view.translate

          // Makes sure the edge has a non-null, relative geometry
          let geo = model.getGeometry(edge)
          if (geo == null) {
            geo = new Geometry()
            geo.relative = true
            model.setGeometry(edge, geo)
          }

          // Uses scaled waypoints in geometry
          if (this.waypoints != null && this.waypoints.length > 0) {
            geo.points = this.waypoints.map(
              p => new Point(p.x / s - t.x, p.y / s - t.y),
            )
          }

          if (target == null) {
            const targetPoint = this.targetPoint || this.currentPoint!
            const p = new Point(
              targetPoint.x / s - t.x,
              targetPoint.y / s - t.y,
            )

            p.x -= this.graph.tx / s
            p.y -= this.graph.ty / s

            geo.setTerminalPoint(p, false)
          }

          this.trigger(ConnectionHandler.events.connect, {
            terminalInserted,
            edge,
            terminal: target,
            target: dropTarget,
            event: evt,
          })
        }
      })

      if (this.autoSelect && edge != null) {
        this.selectCells(edge, terminalInserted ? target : null)
      }
    }
  }

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
    style: Style,
  ) {
    if (this.factoryMethod == null) {
      return this.graph.addEdge({
        parent, id, data, sourceNode, targetNode, style,
      })
    }

    let edge = this.createEdge(data, sourceNode, targetNode, style)
    edge = this.graph.addEdge(edge, parent, sourceNode, targetNode)

    return edge
  }

  /**
   * Hook method for creating new vertices on the fly if no target was
   * under the mouse.
   */
  protected createTargetNode(evt: MouseEvent, source: Cell) {
    const cloned = this.graph.cloneCell(source)
    const geo = this.graph.model.getGeometry(cloned)

    if (geo != null) {
      const t = this.graph.view.translate
      const s = this.graph.view.scale
      const p = new Point(
        this.currentPoint!.x / s - t.x,
        this.currentPoint!.y / s - t.y,
      )
      geo.bounds.x = Math.round(p.x - geo.bounds.width / 2 - this.graph.tx / s)
      geo.bounds.y = Math.round(p.y - geo.bounds.height / 2 - this.graph.ty / s)

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

    return cloned
  }

  /**
   * Returns the tolerance for aligning new targets to sources.
   */
  protected getAlignmentTolerance(evt: MouseEvent) {
    return (this.graph.isGridEnabled())
      ? this.graph.gridSize / 2
      : this.graph.tolerance
  }

  protected createEdge(data: any, source: Cell, target: Cell, style: Style) {
    let edge = null

    // Creates a new edge using the factoryMethod
    if (this.factoryMethod != null) {
      edge = this.factoryMethod(source, target, style)
    }

    if (edge == null) {
      edge = new Cell(data)
      edge.asEdge(true)
      edge.setStyle(style)
      const geo = new Geometry()
      geo.relative = true
      edge.setGeometry(geo)
    }

    return edge
  }

  @Disposable.aop()
  dispose() {
    this.graph.removeMouseListener(this)

    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
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

    if (this.resetHandler != null) {
      this.graph.off(null, this.resetHandler)
      this.graph.view.off(null, this.resetHandler)
      this.resetHandler = null
    }
  }
}

export namespace ConnectionHandler {
  export const events = {
    start: 'start',
    reset: 'reset',
    connect: 'connect',
  }
}
