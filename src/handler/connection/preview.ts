import * as util from '../../util'
import { Disposable, MouseEventEx, DomEvent } from '../../common'
import { ConnectionMarker } from './marker'
import { ConnectionHandler } from './handler'
import { ConstraintHandler } from '../constraint/handler'
import { Point, Constraint } from '../../struct'
import { State } from '../../core'
import { Polyline, Shape } from '../../shape'
import { transparentMarker } from './util'
import { applyConnectionPreviewStyle } from './option'

export class Preview extends Disposable {
  marker: ConnectionMarker
  constraintHandler: ConstraintHandler

  sourcePoint: Point | null
  sourceState: State | null
  sourceConstraint: Constraint | null

  currentPoint: Point | null
  targetPoint: Point | null
  currentState: State | null
  edgeState: State | null = null
  error: string | null = null
  waypoints: Point[] | null

  private previewShape: Shape | null

  constructor(public master: ConnectionHandler) {
    super()
    this.marker = new ConnectionMarker(this.master)
    this.constraintHandler = new ConstraintHandler(this.graph)
  }

  get graph() {
    return this.master.graph
  }

  isEnabled() {
    return this.master.isEnabled() && this.graph.isEnabled()
  }

  isStarted() {
    return this.sourcePoint != null
  }

  isConnecting() {
    return this.sourcePoint != null && this.previewShape != null
  }

  isStartEvent(e: MouseEventEx) {
    return (
      (
        this.constraintHandler.currentState != null &&
        this.constraintHandler.currentConstraint != null
      ) ||
      (
        this.sourceState != null &&
        this.error == null &&
        this.master.knobs.isStarted()
      )
    )
  }

  isStopEvent(e: MouseEventEx) {
    return e.getState() != null
  }

  start(e: MouseEventEx) {
    if (
      this.constraintHandler.currentConstraint != null &&
      this.constraintHandler.currentState != null &&
      this.constraintHandler.currentPoint != null
    ) {
      this.sourceState = this.constraintHandler.currentState
      this.sourcePoint = this.constraintHandler.currentPoint.clone()
      this.sourceConstraint = this.constraintHandler.currentConstraint
    } else {
      this.sourcePoint = e.getGraphPos()
    }

    this.edgeState = this.createEdgeState(e)

    // init preview
    if (this.master.waypointsEnabled && this.previewShape == null) {
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
  }

  // #region process mouse move

  process(e: MouseEventEx) {
    const point = this.getCurrentPosition(e)
    this.currentPoint = point
    this.error = null

    // 准备中或连线中
    if (this.shouldUpdateCurrentState(e)) {
      this.updateCurrentState(e, point)
    }

    if (this.isStarted()) {
      this.onConnecting(e, point)
      DomEvent.consume(e.getEvent())
      e.consume()
    } else if (!this.isEnabled()) {
      this.resetConstraint()
    } else if (this.shouldUpdateSourceState()) {
      // 开始连线前，更新 sourceState
      this.updateSourceState(e)
    } else if (this.isCellHighlighting()) {
      e.consume()
    }
  }

  protected getCurrentPosition(e: MouseEventEx) {
    const s = this.graph.view.scale
    const t = this.graph.view.translate
    const p = e.getGraphPos()

    // snap to grid
    if (this.graph.isGridEnabledForEvent(e.getEvent())) {
      p.update(
        (this.graph.snap(p.x / s - t.x) + t.x) * s,
        (this.graph.snap(p.y / s - t.y) + t.y) * s,
      )
    }

    // snap to sourcePoint
    if (!DomEvent.isAltDown(e.getEvent()) && this.sourceState != null) {
      const tol = this.graph.gridSize * s / 2
      const tmp = this.sourcePoint
        ? this.sourcePoint
        : this.sourceState.bounds.getCenter()

      if (Math.abs(tmp.x - e.getGraphX()) < tol) {
        p.x = tmp.x
      }

      if (Math.abs(tmp.y - e.getGraphY()) < tol) {
        p.y = tmp.y
      }
    }

    return p
  }

  protected onConnecting(e: MouseEventEx, point: Point) {
    // Update icon position when mouse-moving.
    this.master.knobs.updateIcon(e)

    const {
      sourcePoint,
      currentPoint,
    } = this.updateTerminalPoints(e, point)
    this.updateTargetPoint(sourcePoint, currentPoint)

    // Creates the preview shape (lazy)
    if (this.previewShape == null) {
      const dx = Math.abs(e.getGraphX() - this.sourcePoint!.x)
      const dy = Math.abs(e.getGraphY() - this.sourcePoint!.y)
      const tol = this.graph.tolerance

      if (dx > tol || dy > tol) {
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

    this.master.setGlobalCursor(this.master.cursor)
  }

  protected updateTerminalPoints(e: MouseEventEx, point: Point) {
    let sourcePoint = this.sourcePoint!
    let currentPoint = point
    let currentConstraint = null

    // Uses the fixed point from the constraint handler if available
    if (
      this.constraintHandler.currentConstraint != null &&
      this.constraintHandler.currentState != null &&
      this.constraintHandler.currentPoint != null
    ) {
      currentPoint = this.constraintHandler.currentPoint.clone()
      currentConstraint = this.constraintHandler.currentConstraint
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

    // Update terminal points.
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

    return { sourcePoint, currentPoint }
  }

  protected updateEdgeState(
    currentPoint: Point,
    currentConstraint: Constraint | null,
  ) {
    if (this.edgeState == null) {
      return
    }

    if (this.sourceConstraint != null && this.sourceConstraint.point != null) {
      this.edgeState.style.exitX = this.sourceConstraint.point.x
      this.edgeState.style.exitY = this.sourceConstraint.point.y
    }

    if (currentConstraint != null && currentConstraint.point != null) {
      this.edgeState.style.entryX = currentConstraint.point.x
      this.edgeState.style.entryY = currentConstraint.point.y
    } else {
      delete this.edgeState.style.entryX
      delete this.edgeState.style.entryY
    }

    this.edgeState.absolutePoints = [
      null,
      this.currentState != null ? null : currentPoint,
    ] as any

    this.graph.view.updateFixedTerminalPoint(
      this.edgeState,
      this.sourceState!,
      true,
      this.sourceConstraint!,
    )

    if (this.currentState != null) {
      if (currentConstraint == null) {
        // tslint:disable-next-line
        currentConstraint = this.graph.getConnectionConstraint(
          this.edgeState, this.sourceState, false,
        )
      }

      this.edgeState.setAbsoluteTerminalPoint(null as any, false)
      this.graph.view.updateFixedTerminalPoint(
        this.edgeState,
        this.currentState,
        false,
        currentConstraint,
      )
    }

    // Scales and translates the waypoints to the model
    let pts = null
    if (this.waypoints != null) {
      pts = this.waypoints.map(p => this.normalizeWaypoint(p))
    }

    this.graph.view.updateRouterPoints(
      this.edgeState, pts!, this.sourceState!, this.currentState!,
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

  protected updateTargetPoint(sourcePoint: Point, currentPoint: Point) {
    // Ensure the cell under the mousepointer can be detected
    // by moving the preview shape away from the mouse.
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
  }

  protected shouldUpdateCurrentState(e: MouseEventEx) {
    return (
      (
        this.isStarted() ||
        (this.master.isEnabled() && this.graph.isEnabled())
      )
      &&
      (
        this.sourcePoint == null ||
        Math.abs(e.getGraphX() - this.sourcePoint.x) > this.graph.tolerance ||
        Math.abs(e.getGraphY() - this.sourcePoint.y) > this.graph.tolerance ||
        this.previewShape != null
      )
    )
  }

  protected updateCurrentState(e: MouseEventEx, point: Point) {
    const isSource = this.sourcePoint == null
    const existingEdge = false
    const currentPoint = (
      this.sourcePoint == null ||
      e.isSource(this.marker.highlight.shape)
    ) ? null : point

    this.constraintHandler.update(
      e,
      isSource,
      existingEdge,
      currentPoint,
    )

    if (
      this.constraintHandler.currentState != null &&
      this.constraintHandler.currentConstraint != null
    ) {
      transparentMarker(this.constraintHandler, this.marker)

      // Updates validation state.
      if (this.sourceState != null) {
        this.error = this.master.validateConnection(
          this.sourceState.cell,
          this.constraintHandler.currentState.cell,
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
      }
    }
  }

  protected shouldUpdateSourceState() {
    return (
      this.sourceState !== this.currentState &&
      this.edgeState == null
    )
  }

  protected updateSourceState(e: MouseEventEx) {
    this.master.knobs.destroyIcons()

    if (
      this.error == null &&
      this.currentState != null &&
      this.constraintHandler.currentConstraint == null
    ) {
      this.master.knobs.resetIcons(this.currentState)
      if (this.master.knobs.isEmpty() && this.master.cursor != null) {
        this.currentState.setCursor(this.master.cursor)
        e.consume()
      }
    }

    // update source state
    this.sourceState = this.currentState
  }

  protected isCellHighlighting() {
    return (
      this.sourceState === this.currentState &&
      this.currentState != null &&
      this.master.knobs.isEmpty() &&
      !this.master.isMouseDown()
    )
  }

  // endregion

  execute(e: MouseEventEx) {
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
      this.master.connect(source!, target, e.getEvent(), e.getCell())
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

  addWaypoint(e: MouseEventEx, mouseDownCounter: number) {
    const point = util.clientToGraph(this.graph.container, e)
    const dx = Math.abs(point.x - this.sourcePoint!.x)
    const dy = Math.abs(point.y - this.sourcePoint!.y)
    const addPoint = (this.waypoints != null) ||
      (
        mouseDownCounter > 1 &&
        (
          dx > this.graph.tolerance ||
          dy > this.graph.tolerance
        )
      )

    if (addPoint) {
      if (this.waypoints == null) {
        this.waypoints = []
      }

      const s = this.graph.view.scale
      const p = new Point(
        this.graph.snap(e.getGraphX() / s) * s,
        this.graph.snap(e.getGraphY() / s) * s,
      )
      this.waypoints.push(p)
    }
  }

  normalizeWaypoint(point: Point) {
    const s = this.graph.view.getScale()
    const t = this.graph.view.getTranslate()

    return new Point(
      point.x / s - t.x,
      point.y / s - t.y,
    )
  }

  protected createEdgeState(e: MouseEventEx | null): State | null {
    return null
  }

  protected createPreview() {
    const shape = (this.master.livePreview && this.edgeState)
      ? this.graph.renderer.createShape(this.edgeState)!
      : new Polyline()

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
        livePreview: this.master.livePreview,
      })
    }
  }

  protected drawPreview() {
    if (this.previewShape != null) {
      this.updatePreview(this.error == null)
      this.previewShape.redraw()
    }
  }

  reset() {
    this.master.resetGlobalCursor()

    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
    }

    this.marker.reset()
    this.constraintHandler.reset()

    this.sourceState = null
    this.sourcePoint = null
    this.sourceConstraint = null

    this.targetPoint = null
    this.currentPoint = null
    this.edgeState = null
    this.error = null
  }

  resetConstraint() {
    this.constraintHandler.reset()
  }

  @Disposable.aop()
  dispose() {
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
  }
}
