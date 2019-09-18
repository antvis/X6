import * as util from '../util'
import { Graph, Model, State } from '../core'
import { View } from '../core/view'
import { Rectangle, Point, Constraint } from '../struct'
import { DomEvent, MouseEventEx, Disposable } from '../common'
import { Shape, ImageShape } from '../shape'
import { BaseHandler } from './handler-base'
import {
  getConstraintOptions,
  createConstraintHighlightShape,
} from '../option'

export class ConstraintHandler extends BaseHandler {
  private resetHandler: (() => void) | null
  private containerEventInstalled = false
  private currentArea: Rectangle | null
  private highlight: Shape | null
  private icons: ImageShape[] | null
  private points: Point[] | null
  private constraints: Constraint[] | null

  currentState: State | null
  currentPoint: Point | null
  currentConstraint: Constraint | null

  constructor(graph: Graph) {
    super(graph)
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

    this.graph.on(Graph.events.root, this.resetHandler)
    this.graph.model.on(Model.events.change, this.resetHandler)
    this.graph.view.on(View.events.scale, this.resetHandler)
    this.graph.view.on(View.events.translate, this.resetHandler)
    this.graph.view.on(View.events.scaleAndTranslate, this.resetHandler)
  }

  /**
   * Resets the state of this handler.
   */
  reset() {
    this.destroyIcons()
    this.destroyHighlight()

    this.currentArea = null
    this.currentPoint = null
    this.currentState = null
    this.currentConstraint = null
  }

  destroyIcons() {
    if (this.icons != null) {
      this.icons.forEach(i => i.dispose())
      this.icons = null
      this.points = null
    }
  }

  destroyHighlight() {
    if (this.highlight) {
      this.highlight.dispose()
      this.highlight = null
    }
  }

  redraw() {
    if (
      this.currentState != null &&
      this.constraints != null &&
      this.icons != null &&
      this.points != null
    ) {
      const state = this.graph.view.getState(this.currentState.cell)!
      this.currentState = state
      this.currentArea = state.bounds.clone()

      for (let i = 0, ii = this.constraints.length; i < ii; i += 1) {
        const c = this.constraints[i]
        const p = this.graph.view.getConnectionPoint(state, c)!

        this.redrawConstraint(state, c, p, this.icons[i])
        this.points[i] = p
        this.currentArea.add(this.icons[i].bounds)
      }
    }
  }

  getTolerance(e: MouseEventEx) {
    return this.graph.getTolerance()
  }

  protected redrawConstraint(
    state: State,
    constraint: Constraint,
    point: Point,
    icon?: ImageShape,
  ) {
    const { image, cursor, className } = getConstraintOptions({
      constraint,
      point,
      graph: this.graph,
      cell: state.cell,
    })

    const bounds = new Rectangle(
      Math.round(point.x - image.width / 2),
      Math.round(point.y - image.height / 2),
      image.width,
      image.height,
    )

    if (icon == null) {
      // tslint:disable-next-line
      icon = new ImageShape(bounds, image.src)
      icon.dialect = 'svg'
      icon.preserveImageAspect = false
      icon.init(this.graph.view.getDecoratorPane())

      // Move the icon behind all other overlays
      util.toBack(icon.elem)

      const getState = () => (this.currentState != null)
        ? this.currentState
        : state

      MouseEventEx.redirectMouseEvents(icon.elem!, this.graph, getState)
    }

    const prefixCls = this.graph.prefixCls
    let cls = `${prefixCls}-constraint`
    if (className) {
      cls += ` ${className}`
    }

    icon.className = cls
    icon.image = image.src
    icon.bounds = bounds
    icon.cursor = cursor

    icon.redraw()

    return icon
  }

  isEventIgnored(e: MouseEventEx) {
    return false
  }

  isStateIgnored(state: State, isSource: boolean) {
    return false
  }

  /**
   * Returns true if the current focused state should not be changed
   * for the given event.
   *
   * This implementation returns true if shift is pressed.
   */
  isKeepFocusEvent(e: MouseEventEx) {
    return DomEvent.isShiftDown(e.getEvent())
  }

  /**
   * Returns the cell for the given event.
   */
  getCellForEvent(e: MouseEventEx, point: Point | null) {
    let cell = e.getCell()

    // Gets cell under actual point if different from event location
    if (cell == null && point != null &&
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
    point: Point | null,
  ) {
    if (this.isEnabled() && !this.isEventIgnored(e)) {

      if (!this.containerEventInstalled && this.graph.container) {
        DomEvent.addListener(
          this.graph.container,
          'mouseleave',
          this.resetHandler!,
        )
      }

      const tol = this.getTolerance(e)
      const x = (point != null) ? point.x : e.getGraphX()
      const y = (point != null) ? point.y : e.getGraphY()
      const grid = new Rectangle(x - tol, y - tol, 2 * tol, 2 * tol)
      const mouse = new Rectangle(
        e.getGraphX() - tol,
        e.getGraphY() - tol,
        2 * tol,
        2 * tol,
      )

      const state = this.graph.view.getState(this.getCellForEvent(e, point))

      // Keeps focus icons visible while over node bounds and
      // no other cell under mouse or shift is pressed
      if (
        !this.isKeepFocusEvent(e) &&
        (
          this.currentState == null ||
          this.currentArea == null ||
          state != null ||
          !this.graph.model.isNode(this.currentState.cell) ||
          !this.currentArea.isIntersectWith(mouse)
        ) &&
        (state !== this.currentState)
      ) {
        this.currentState = null
        this.currentArea = null
        this.setFocus(e, state!, isSource)
      }

      this.currentPoint = null
      this.currentConstraint = null
      let minDistSq: number | null = null

      // highlight hovering constraint
      if (
        this.icons != null &&
        this.points != null &&
        this.constraints != null &&
        (state == null || this.currentState === state)
      ) {
        let highlightBounds: Rectangle | null = null
        const cx = mouse.getCenterX()
        const cy = mouse.getCenterY()

        for (let i = 0, ii = this.icons.length; i < ii; i += 1) {
          const dx = cx - this.icons[i].bounds.getCenterX()
          const dy = cy - this.icons[i].bounds.getCenterY()
          const dis = dx * dx + dy * dy

          if (
            (
              this.intersects(this.icons[i], mouse, isSource, existingEdge) ||
              (
                point != null &&
                this.intersects(this.icons[i], grid, isSource, existingEdge)
              )
            )
            &&
            (minDistSq == null || dis < minDistSq)
          ) {
            this.currentPoint = this.points[i]
            this.currentConstraint = this.constraints[i]
            minDistSq = dis

            highlightBounds = this.icons[i].bounds.clone()
            highlightBounds.grow(1)
            highlightBounds.width -= 1
            highlightBounds.height -= 1

            if (this.highlight == null) {
              this.highlight = this.createHighlightShape(state)
            }
          }
        }

        if (highlightBounds != null && this.highlight != null) {
          this.highlight.bounds = highlightBounds
          this.highlight.redraw()
        }
      }

      if (this.currentConstraint == null) {
        this.destroyHighlight()
      }

    } else {
      this.currentState = null
      this.currentPoint = null
      this.currentConstraint = null
    }
  }

  /**
   * Transfers the focus to the given state as a source or target terminal.
   * If the handler is not enabled then the outline is painted, but the
   * constraints are ignored.
   */
  setFocus(e: MouseEventEx, state: State, isSource: boolean) {
    this.constraints = (
      state != null &&
      !this.isStateIgnored(state, isSource) &&
      this.graph.isCellConnectable(state.cell)
    ) ? (
        this.isEnabled()
          ? (this.graph.getConstraints(state.cell, isSource) || [])
          : []
      )
      : null

    // Only uses cells which have constraints
    if (this.constraints != null) {
      this.currentState = state
      this.currentArea = state.bounds.clone()

      this.destroyIcons()

      this.icons = []
      this.points = []

      for (let i = 0, ii = this.constraints.length; i < ii; i += 1) {
        const c = this.constraints[i]
        const p = this.graph.view.getConnectionPoint(state, c)!
        const icon = this.redrawConstraint(state, c, p)
        this.currentArea.add(icon.bounds)
        this.icons.push(icon)
        this.points.push(p)
      }

      this.currentArea.grow(this.getTolerance(e))

    } else {
      this.destroyIcons()
      this.destroyHighlight()
    }
  }

  /**
   * Create the shape used to paint the highlight.
   */
  createHighlightShape(state: State | null) {
    const s = (this.currentState || state)!
    const shape = createConstraintHighlightShape({
      graph: this.graph,
      cell: s.cell,
    })

    shape.dialect = 'svg'
    shape.init(this.graph.view.getOverlayPane())
    const getState = () => (this.currentState || state) as State
    MouseEventEx.redirectMouseEvents(shape.elem, this.graph, getState)

    return shape
  }

  /**
   * Returns true if the given icon intersects the given rectangle.
   */
  intersects(
    icon: ImageShape,
    mouse: Rectangle,
    isSource: boolean,
    existingEdge: boolean,
  ) {
    return icon.bounds.isIntersectWith(mouse)
  }

  @Disposable.aop()
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
