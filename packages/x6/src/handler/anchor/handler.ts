import { DomUtil, DomEvent } from '../../dom'
import { Point, Rectangle } from '../../geometry'
import { Graph } from '../../graph'
import { State } from '../../core/state'
import { Shape } from '../../shape'
import { BaseHandler } from '../base-handler'
import { MouseEventEx } from '../mouse-event'
import { Anchor } from '../../struct'
import { createAnchorShape, createAnchorHighlightShape } from './option'

export class AnchorHandler extends BaseHandler {
  inductiveSize: number
  adsorbNearestTarget: boolean
  currentState: State | null
  currentPoint: Point | null
  currentArea: Rectangle | null
  currentAnchor: Anchor | null

  protected knobs: Shape[] | null
  protected points: Point[] | null
  protected anchors: Anchor[] | null
  protected highlight: Shape | null

  private resetHandler: (() => void) | null
  private containerEventInstalled = false

  constructor(graph: Graph) {
    super(graph)

    const options = graph.options.anchor
    this.inductiveSize = options.inductiveSize
    this.adsorbNearestTarget = options.adsorbNearestTarget

    this.resetHandler = () => {
      if (
        this.currentState != null &&
        this.graph.view.getState(this.currentState.cell) == null
      ) {
        this.reset()
      } else {
        this.redraw()
      }
    }

    this.graph.on('root:changed', this.resetHandler)
    this.graph.model.on('change', this.resetHandler)
    this.graph.view.on('scale', this.resetHandler)
    this.graph.view.on('translate', this.resetHandler)
    this.graph.view.on('scaleAndTranslate', this.resetHandler)
  }

  reset() {
    this.destroyIcons()
    this.destroyHighlight()

    this.currentArea = null
    this.currentPoint = null
    this.currentState = null
    this.currentAnchor = null
  }

  redraw() {
    if (
      this.currentState != null &&
      this.anchors != null &&
      this.knobs != null &&
      this.points != null
    ) {
      const state = this.graph.view.getState(this.currentState.cell)!
      this.currentState = state
      this.currentArea = state.bounds.clone()

      for (let i = 0, ii = this.anchors.length; i < ii; i += 1) {
        const anchor = this.anchors[i]
        const point = this.graph.view.getConnectionPoint(state, anchor)!

        this.redrawAnchor(state, anchor, point, this.knobs[i])
        this.points[i] = point
        this.currentArea.add(this.knobs[i].bounds)
      }
    }
  }

  protected redrawAnchor(
    state: State,
    anchor: Anchor,
    point: Point,
    icon?: Shape,
  ) {
    if (icon == null) {
      // tslint:disable-next-line
      icon = createAnchorShape({
        anchor,
        point,
        graph: this.graph,
        cell: state.cell,
      })
      icon.init(this.graph.view.getDecoratorPane())
      DomUtil.toBack(icon.elem)

      const getState = () => this.currentState || state
      MouseEventEx.redirectMouseEvents(icon.elem, this.graph, getState)
    }

    icon.bounds.x = point.x - icon.bounds.width / 2
    icon.bounds.y = point.y - icon.bounds.height / 2
    icon.redraw()

    return icon
  }

  protected getTolerance(e: MouseEventEx) {
    return this.graph.tolerance
  }

  protected isEventIgnored(e: MouseEventEx) {
    return false
  }

  protected isStateIgnored(state: State, isSource: boolean) {
    return false
  }

  /**
   * Returns true if the current focused state should not be changed
   * for the given event.
   *
   * This implementation returns true if shift is pressed.
   */
  protected isKeepFocusEvent(e: MouseEventEx) {
    return DomEvent.isShiftDown(e.getEvent())
  }

  protected getAnchors(state: State, isSource: boolean) {
    if (
      this.isEnabled() &&
      state != null &&
      !this.isStateIgnored(state, isSource) &&
      this.graph.isCellConnectable(state.cell)
    ) {
      return this.graph.connectionManager.getConnectableAnchors(
        state.cell,
        isSource,
      )
    }

    return null
  }

  protected getCell(e: MouseEventEx, point: Point | null) {
    let cell = e.getCell()

    // Gets cell under actual point if different from event location
    if (
      cell == null &&
      point != null &&
      (e.getGraphX() !== point.x || e.getGraphY() !== point.y)
    ) {
      cell = this.graph.getCellAt(point.x, point.y)
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

    return this.graph.isCellLocked(cell) ? null : cell
  }

  update(
    e: MouseEventEx,
    isSource: boolean,
    existingEdge: boolean,
    currentPoint: Point | null,
  ) {
    if (this.isEnabled() && !this.isEventIgnored(e)) {
      if (!this.containerEventInstalled && this.graph.container) {
        DomEvent.addListener(
          this.graph.container,
          'mouseleave',
          this.resetHandler!,
        )
      }

      const graphX = e.getGraphX()
      const graphY = e.getGraphY()
      const tol = this.getTolerance(e)
      const x = currentPoint != null ? currentPoint.x : graphX
      const y = currentPoint != null ? currentPoint.y : graphY
      const grid = new Rectangle(x - tol, y - tol, 2 * tol, 2 * tol)
      const mouse = new Rectangle(graphX - tol, graphY - tol, 2 * tol, 2 * tol)
      const state = this.graph.view.getState(this.getCell(e, currentPoint))

      // Keeps focus icons visible while over node bounds and
      // no other cell under mouse or shift is pressed
      if (
        !this.isKeepFocusEvent(e) &&
        (this.currentState == null ||
          this.currentArea == null ||
          state != null ||
          !this.graph.model.isNode(this.currentState.cell) ||
          !this.currentArea.isIntersectWith(mouse)) &&
        state !== this.currentState
      ) {
        this.currentArea = null
        this.currentState = null
        this.focus(e, state!, isSource)
      }

      this.currentPoint = null
      this.currentAnchor = null

      // highlight hovering anchor
      if (
        this.knobs != null &&
        this.points != null &&
        this.anchors != null &&
        (state == null || this.currentState === state)
      ) {
        let bounds: Rectangle | null = null
        let minDist: number | null = null

        for (let i = 0, ii = this.knobs.length; i < ii; i += 1) {
          const dx = graphX - this.knobs[i].bounds.getCenterX()
          const dy = graphY - this.knobs[i].bounds.getCenterY()
          const dis = Math.sqrt(dx * dx + dy * dy)

          // prettier-ignore
          if (
            (
              // 进行目标链接桩查找时
              (this.adsorbNearestTarget && !isSource) ||
              // 在感应区域内时
              (this.inductiveSize > 0 && dis < this.inductiveSize) ||
              this.isIntersected(this.knobs[i], mouse) ||
              (currentPoint != null && this.isIntersected(this.knobs[i], grid))
            ) &&
            (minDist == null || dis < minDist)
          ) {
            this.currentPoint = this.points[i]
            this.currentAnchor = this.anchors[i]
            minDist = dis
            bounds = this.knobs[i].bounds.clone()

            if (this.highlight == null) {
              this.highlight = this.createHighlightShape(state)
            }
          }
        }

        if (bounds != null && this.highlight != null) {
          this.highlight.bounds = bounds
          this.highlight.redraw()
        }
      }

      if (this.currentAnchor == null) {
        this.destroyHighlight()
      }
    } else {
      this.currentState = null
      this.currentPoint = null
      this.currentAnchor = null
    }
  }

  focus(e: MouseEventEx, state: State, isSource: boolean) {
    this.anchors = this.getAnchors(state, isSource)
    if (this.anchors != null) {
      this.currentState = state
      this.currentArea = state.bounds.clone()

      this.destroyIcons()

      this.knobs = []
      this.points = []

      for (let i = 0, ii = this.anchors.length; i < ii; i += 1) {
        const c = this.anchors[i]
        const p = this.graph.view.getConnectionPoint(state, c)!
        const icon = this.redrawAnchor(state, c, p)
        this.knobs.push(icon)
        this.points.push(p)
        this.currentArea.add(icon.bounds)
      }

      this.currentArea.inflate(this.getTolerance(e))
    } else {
      this.destroyIcons()
      this.destroyHighlight()
    }
  }

  protected createHighlightShape(state: State | null) {
    const s = (this.currentState || state)!
    const shape = createAnchorHighlightShape({
      graph: this.graph,
      cell: s.cell,
    })

    shape.init(this.graph.view.getOverlayPane())
    const getState = () => (this.currentState || state) as State
    MouseEventEx.redirectMouseEvents(shape.elem, this.graph, getState)

    return shape
  }

  protected isIntersected(icon: Shape, mouse: Rectangle) {
    return icon.bounds.isIntersectWith(mouse)
  }

  protected destroyIcons() {
    if (this.knobs != null) {
      this.knobs.forEach(i => i.dispose())
      this.knobs = null
      this.points = null
    }
  }

  protected destroyHighlight() {
    if (this.highlight) {
      this.highlight.dispose()
      this.highlight = null
    }
  }

  @BaseHandler.dispose()
  dispose() {
    this.reset()

    if (this.resetHandler != null) {
      this.graph.off(null, this.resetHandler)
      this.graph.model.off(null, this.resetHandler)
      this.graph.view.off(null, this.resetHandler)

      if (this.containerEventInstalled && this.graph.container) {
        DomEvent.removeListener(
          this.graph.container,
          'mouseleave',
          this.resetHandler,
        )
      }

      this.resetHandler = null
    }
  }
}
