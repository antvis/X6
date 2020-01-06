import { Point } from '../../geometry'
import { DomEvent } from '../../dom'
import { Disposable } from '../../entity'
import { State } from '../../core/state'
import { Anchor } from '../../struct'
import { Polyline, Shape } from '../../shape'
import { MouseEventEx } from '../mouse-event'
import { AnchorHandler } from '../anchor/handler'
import { AnchorTipHandler } from '../anchor/tip'
import { ConnectionMarker } from './marker'
import { ConnectionHandler } from './handler'
import { transparentMarker } from './util'
import { applyConnectionPreviewStyle } from './option'

export class Preview extends Disposable {
  marker: ConnectionMarker
  anchorTip: AnchorTipHandler
  anchorHandler: AnchorHandler

  sourcePoint: Point | null
  sourceState: State | null
  sourceAnchor: Anchor | null

  currentPoint: Point | null
  targetPoint: Point | null
  currentState: State | null
  edgeState: State | null = null
  error: string | null = null
  waypoints: Point[] | null

  private previewShape: Shape | null

  constructor(public master: ConnectionHandler, options: Preview.Options) {
    super()
    this.marker = new ConnectionMarker(this.master, options)
    this.anchorHandler = new AnchorHandler(this.graph)
    this.anchorTip = new AnchorTipHandler(this)
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
    // prettier-ignore
    return (
      (
        this.anchorHandler.currentState != null &&
        this.anchorHandler.currentAnchor != null
      ) ||
      (
        this.error == null &&
        this.sourceState != null &&
        this.master.knobs.isStarted()
      )
    )
  }

  isStopEvent(e: MouseEventEx) {
    return e.getState() != null
  }

  start(e: MouseEventEx) {
    if (
      this.anchorHandler.currentAnchor != null &&
      this.anchorHandler.currentState != null &&
      this.anchorHandler.currentPoint != null
    ) {
      this.sourceState = this.anchorHandler.currentState
      this.sourcePoint = this.anchorHandler.currentPoint.clone()
      this.sourceAnchor = this.anchorHandler.currentAnchor
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
      const p = this.graph.eventloopManager.getPointForEvent(e.getEvent())
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
      this.resetAnchor()
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
      const tol = (this.graph.getGridSize() * s) / 2
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

    const { sourcePoint, currentPoint } = this.updateTerminalPoints(e, point)

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

    this.anchorTip.process()
  }

  protected updateTerminalPoints(e: MouseEventEx, point: Point) {
    let sourcePoint = this.sourcePoint!
    let currentPoint = point.clone()
    let currentAnchor = null

    // Uses the fixed point from the anchor handler if available
    if (
      this.anchorHandler.currentAnchor != null &&
      this.anchorHandler.currentState != null &&
      this.anchorHandler.currentPoint != null
    ) {
      currentPoint = this.anchorHandler.currentPoint.clone()
      currentAnchor = this.anchorHandler.currentAnchor
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
      this.updateEdgeState(currentPoint, currentAnchor)
      const lastIndex = this.edgeState.absolutePoints.length - 1
      sourcePoint = this.edgeState.absolutePoints[0]
      currentPoint = this.edgeState.absolutePoints[lastIndex]
    } else {
      if (this.currentState != null) {
        if (this.anchorHandler.currentAnchor == null) {
          const p = this.getTargetPerimeterPoint(this.currentState, e)
          if (p != null) {
            currentPoint = p
          }
        }
      }

      // Computes the source perimeter point
      if (this.sourceAnchor == null && this.sourceState != null) {
        const next =
          this.waypoints != null && this.waypoints.length > 0
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

  protected updateEdgeState(currentPoint: Point, currentAnchor: Anchor | null) {
    if (this.edgeState == null) {
      return
    }

    if (this.sourceAnchor != null && this.sourceAnchor.position != null) {
      this.edgeState.style.sourceAnchorX = this.sourceAnchor.position.x
      this.edgeState.style.sourceAnchorY = this.sourceAnchor.position.y
    }

    if (currentAnchor != null && currentAnchor.position != null) {
      this.edgeState.style.targetAnchorX = currentAnchor.position.x
      this.edgeState.style.targetAnchorY = currentAnchor.position.y
    } else {
      delete this.edgeState.style.targetAnchorX
      delete this.edgeState.style.targetAnchorY
    }

    this.edgeState.absolutePoints = [
      null,
      this.currentState != null ? null : currentPoint,
    ] as any

    this.graph.view.updateFixedTerminalPoint(
      this.edgeState,
      this.sourceState!,
      true,
      this.sourceAnchor!,
    )

    if (this.currentState != null) {
      if (currentAnchor == null) {
        // tslint:disable-next-line
        currentAnchor = this.graph.getConnectionAnchor(
          this.edgeState,
          this.sourceState,
          false,
        )
      }

      this.edgeState.setAbsoluteTerminalPoint(null as any, false)
      this.graph.view.updateFixedTerminalPoint(
        this.edgeState,
        this.currentState,
        false,
        currentAnchor,
      )
    }

    // Scales and translates the waypoints to the model
    let pts = null
    if (this.waypoints != null) {
      pts = this.waypoints.map(p => this.normalizeWaypoint(p))
    }

    this.graph.view.updateRouterPoints(
      this.edgeState,
      pts!,
      this.sourceState!,
      this.currentState!,
    )

    this.graph.view.updateFloatingTerminalPoints(
      this.edgeState,
      this.sourceState!,
      this.currentState!,
    )
  }

  protected getTargetPerimeterPoint(state: State, e: MouseEventEx) {
    let result = null
    const view = state.view
    const perimeterFn = view.getPerimeterFunction(state)

    if (perimeterFn != null) {
      const next =
        this.waypoints != null && this.waypoints.length > 0
          ? this.waypoints[this.waypoints.length - 1]
          : this.sourceState!.bounds.getCenter()

      const tmp = perimeterFn(
        view.getPerimeterBounds(state),
        this.edgeState!,
        next,
        false,
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
      const rot = State.getRotation(state)
      if (rot !== 0) {
        // tslint:disable-next-line
        next = Point.rotate(next, -rot, center)
      }

      const tmp = perimeterFn(
        view.getPerimeterBounds(state),
        state,
        next,
        false,
      )

      if (tmp != null) {
        if (rot !== 0) {
          tmp.rotate(rot, center)
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
      currentPoint.x -= (dx * 4) / len
      currentPoint.y -= (dy * 4) / len
    } else {
      this.targetPoint = null
    }
  }

  protected shouldUpdateCurrentState(e: MouseEventEx) {
    return (
      (this.isStarted() || this.isEnabled()) &&
      (this.sourcePoint == null ||
        this.previewShape != null ||
        Math.abs(e.getGraphX() - this.sourcePoint.x) > this.graph.tolerance ||
        Math.abs(e.getGraphY() - this.sourcePoint.y) > this.graph.tolerance)
    )
  }

  protected updateCurrentState(e: MouseEventEx, point: Point) {
    const isSource = this.sourcePoint == null
    const existingEdge = false
    const currentPoint =
      this.sourcePoint == null || e.isSource(this.marker.highlight.shape)
        ? null
        : point

    this.anchorHandler.update(e, isSource, existingEdge, currentPoint)

    if (
      this.anchorHandler.currentState != null &&
      this.anchorHandler.currentAnchor != null
    ) {
      transparentMarker(this.anchorHandler, this.marker)

      // Updates validation state.
      if (this.sourceState != null) {
        this.error = this.master.validateConnection(
          this.sourceState.cell,
          this.anchorHandler.currentState.cell,
        )

        if (this.error == null) {
          this.currentState = this.anchorHandler.currentState
        } else {
          this.anchorHandler.reset()
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
    return this.sourceState !== this.currentState && this.edgeState == null
  }

  protected updateSourceState(e: MouseEventEx) {
    this.master.knobs.destroyIcons()

    if (
      this.error == null &&
      this.currentState != null &&
      this.anchorHandler.currentAnchor == null
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
    this.anchorTip.hide()

    const c1 = this.sourceAnchor
    const c2 = this.anchorHandler.currentAnchor
    const source = this.sourceState != null ? this.sourceState.cell : null
    let target = null

    if (
      this.anchorHandler.currentAnchor != null &&
      this.anchorHandler.currentState != null
    ) {
      target = this.anchorHandler.currentState.cell
    }

    if (target == null && this.currentState != null) {
      target = this.currentState.cell
    }

    if (
      this.error == null &&
      (source == null ||
        target == null ||
        source !== target ||
        this.checkAnchors(c1, c2))
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
          this.marker.validState.cell,
          e.getEvent(),
        )
      }

      if (this.error != null && this.error.length > 0) {
        this.graph.validationManager.warning(this.error)
      }
    }
  }

  protected checkAnchors(c1: Anchor | null, c2: Anchor | null) {
    return (
      c1 == null ||
      c2 == null ||
      c1 !== c2 ||
      c1.position == null ||
      c2.position == null ||
      !c1.position.equals(c2.position) ||
      c1.dx !== c2.dx ||
      c1.dy !== c2.dy ||
      c1.perimeter !== c2.perimeter
    )
  }

  addWaypoint(e: MouseEventEx, mouseDownCounter: number) {
    const point = this.graph.clientToGraph(e)
    const dx = Math.abs(point.x - this.sourcePoint!.x)
    const dy = Math.abs(point.y - this.sourcePoint!.y)
    const addPoint =
      this.waypoints != null ||
      (mouseDownCounter > 1 &&
        (dx > this.graph.tolerance || dy > this.graph.tolerance))

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

    return new Point(point.x / s - t.x, point.y / s - t.y)
  }

  createEdgeState(e: MouseEventEx | null): State | null {
    const style = this.graph.options.edgeStyle
    const edge = this.graph.createEdge({ ...style })
    const state = new State(this.graph.view, edge, style)
    return state
  }

  protected createPreview() {
    const shape =
      this.master.livePreview && this.edgeState
        ? this.graph.renderer.createShape(this.edgeState)!
        : new Polyline()

    shape.scale = this.graph.view.scale
    shape.pointerEvents = false
    shape.init(this.graph.view.getDecoratorPane())

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
    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
    }

    this.marker.reset()
    this.anchorHandler.reset()

    this.sourceState = null
    this.sourcePoint = null
    this.sourceAnchor = null

    this.targetPoint = null
    this.currentPoint = null
    this.edgeState = null
    this.error = null
  }

  resetAnchor() {
    this.anchorHandler.reset()
  }

  @Disposable.dispose()
  dispose() {
    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
    }

    if (this.marker != null) {
      this.marker.dispose()
      delete this.marker
    }

    if (this.anchorHandler != null) {
      this.anchorHandler.dispose()
      delete this.anchorHandler
    }
  }
}

export namespace Preview {
  export interface Options extends ConnectionMarker.Options {}
}
