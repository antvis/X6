import * as util from '../../util'
import { View } from '../../core/view'
import { Graph, Model, State } from '../../core'
import { Shape, ImageShape } from '../../shape'
import { BaseHandler } from '../handler-base'
import { Rectangle, Point, Constraint } from '../../struct'
import { DomEvent, MouseEventEx, Disposable } from '../../common'
import { getConstraintOptions, createConstraintHighlightShape } from './option'

export class ConstraintHandler extends BaseHandler {
  currentState: State | null
  currentPoint: Point | null
  currentArea: Rectangle | null
  currentConstraint: Constraint | null

  protected icons: ImageShape[] | null
  protected points: Point[] | null
  protected highlight: Shape | null
  protected constraints: Constraint[] | null

  private resetHandler: (() => void) | null
  private containerEventInstalled = false

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

  reset() {
    this.destroyIcons()
    this.destroyHighlight()

    this.currentArea = null
    this.currentPoint = null
    this.currentState = null
    this.currentConstraint = null
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
      util.toBack(icon.elem)

      const getState = () => this.currentState || state
      MouseEventEx.redirectMouseEvents(icon.elem, this.graph, getState)
    }

    util.applyClassName(icon, this.graph.prefixCls, 'constraint', className)

    icon.image = image.src
    icon.bounds = bounds
    icon.cursor = cursor

    icon.redraw()

    return icon
  }

  protected getTolerance(e: MouseEventEx) {
    return this.graph.getTolerance()
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

  protected getConstraints(state: State, isSource: boolean) {
    if (
      this.isEnabled() &&
      state != null &&
      !this.isStateIgnored(state, isSource) &&
      this.graph.isCellConnectable(state.cell)
    ) {
      return this.graph.getConstraints(state.cell, isSource)
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

      const tol = this.getTolerance(e)
      const x = currentPoint != null ? currentPoint.x : e.getGraphX()
      const y = currentPoint != null ? currentPoint.y : e.getGraphY()
      const grid = new Rectangle(x - tol, y - tol, 2 * tol, 2 * tol)
      const mouse = new Rectangle(
        e.getGraphX() - tol,
        e.getGraphY() - tol,
        2 * tol,
        2 * tol,
      )

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
        this.currentState = null
        this.currentArea = null
        this.focus(e, state!, isSource)
      }

      this.currentPoint = null
      this.currentConstraint = null

      // highlight hovering constraint
      if (
        this.icons != null &&
        this.points != null &&
        this.constraints != null &&
        (state == null || this.currentState === state)
      ) {
        let bounds: Rectangle | null = null
        let minDist: number | null = null

        const cx = mouse.getCenterX()
        const cy = mouse.getCenterY()

        for (let i = 0, ii = this.icons.length; i < ii; i += 1) {
          const dx = cx - this.icons[i].bounds.getCenterX()
          const dy = cy - this.icons[i].bounds.getCenterY()
          const dis = dx * dx + dy * dy

          if (
            (this.intersects(this.icons[i], mouse, isSource, existingEdge) ||
              (currentPoint != null &&
                this.intersects(
                  this.icons[i],
                  grid,
                  isSource,
                  existingEdge,
                ))) &&
            (minDist == null || dis < minDist)
          ) {
            this.currentPoint = this.points[i]
            this.currentConstraint = this.constraints[i]
            minDist = dis
            bounds = this.icons[i].bounds.clone()

            if (this.highlight == null) {
              // lazy
              this.highlight = this.createHighlightShape(state)
            }
          }
        }

        if (bounds != null && this.highlight != null) {
          this.highlight.bounds = bounds
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

  focus(e: MouseEventEx, state: State, isSource: boolean) {
    this.constraints = this.getConstraints(state, isSource)

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
        this.icons.push(icon)
        this.points.push(p)
        this.currentArea.add(icon.bounds)
      }

      this.currentArea.grow(this.getTolerance(e))
    } else {
      this.destroyIcons()
      this.destroyHighlight()
    }
  }

  protected createHighlightShape(state: State | null) {
    const s = (this.currentState || state)!
    const shape = createConstraintHighlightShape({
      graph: this.graph,
      cell: s.cell,
    })

    shape.init(this.graph.view.getOverlayPane())
    const getState = () => (this.currentState || state) as State
    MouseEventEx.redirectMouseEvents(shape.elem, this.graph, getState)

    return shape
  }

  protected intersects(
    icon: ImageShape,
    mouse: Rectangle,
    isSource: boolean,
    existingEdge: boolean,
  ) {
    return icon.bounds.isIntersectWith(mouse)
  }

  protected destroyIcons() {
    if (this.icons != null) {
      this.icons.forEach((i) => i.dispose())
      this.icons = null
      this.points = null
    }
  }

  protected destroyHighlight() {
    if (this.highlight) {
      this.highlight.dispose()
      this.highlight = null
    }
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
