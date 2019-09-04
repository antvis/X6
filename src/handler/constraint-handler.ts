import * as util from '../util'
import * as images from '../assets/images'
import { Graph, Model, State } from '../core'
import { View } from '../core/view'
import { Rectangle, Point, Image, Constraint } from '../struct'
import { constants, DomEvent, CustomMouseEvent } from '../common'
import { RectangleShape, ImageShape } from '../shape'
import { BaseHandler } from './handler-base'

export class ConstraintHandler extends BaseHandler {
  /**
   * The image for fixed connection points.
   */
  pointImage: Image = images.point

  /**
   * Specifies the color for the highlight.
   */
  highlightColor: string = constants.DEFAULT_VALID_COLOR

  private resetHandler: (() => void) | null
  private containerEventInstalled = false
  private currentFocusArea: Rectangle | null
  private focusHighlight: RectangleShape | null
  private constraints: Constraint[] | null
  private focusIcons: ImageShape[] | null
  private focusPoints: Point[] | null

  currentFocus: State | null
  currentConstraint: Constraint | null
  currentPoint: Point | null

  constructor(graph: Graph) {
    super(graph)
    this.resetHandler = () => {
      if (
        this.currentFocus != null &&
        this.graph.view.getState(this.currentFocus.cell) == null
      ) {
        this.reset()
      } else {
        this.redraw()
      }
    }

    this.graph.model.on(Model.events.change, this.resetHandler)
    this.graph.view.on(View.events.scale, this.resetHandler)
    this.graph.view.on(View.events.translate, this.resetHandler)
    this.graph.view.on(View.events.scaleAndTranslate, this.resetHandler)
    this.graph.on(Graph.events.root, this.resetHandler)
  }

  /**
   * Resets the state of this handler.
   */
  reset() {
    this.destroyIcons()
    this.destroyFocusHighlight()

    this.currentConstraint = null
    this.currentFocusArea = null
    this.currentPoint = null
    this.currentFocus = null
  }

  destroyIcons() {
    if (this.focusIcons != null) {
      this.focusIcons.forEach(i => i.dispose())
      this.focusIcons = null
      this.focusPoints = null
    }
  }

  destroyFocusHighlight() {
    if (this.focusHighlight) {
      this.focusHighlight.dispose()
      this.focusHighlight = null
    }
  }

  redraw() {
    if (
      this.currentFocus != null &&
      this.constraints != null &&
      this.focusIcons != null &&
      this.focusPoints != null
    ) {
      const state = this.graph.view.getState(this.currentFocus.cell)!
      this.currentFocus = state
      this.currentFocusArea = state.bounds.clone()

      for (let i = 0; i < this.constraints.length; i += 1) {
        const cp = this.graph.getConnectionPoint(state, this.constraints[i])!
        const img = this.getImageForConstraint(state, this.constraints[i], cp)

        const bounds = new Rectangle(
          Math.round(cp.x - img.width / 2),
          Math.round(cp.y - img.height / 2),
          img.width,
          img.height,
        )

        this.focusIcons[i].bounds = bounds
        this.focusIcons[i].redraw()
        this.currentFocusArea.add(this.focusIcons[i].bounds)
        this.focusPoints[i] = cp
      }
    }
  }

  /**
   * Returns the tolerance to be used for intersecting connection points.
   */
  getTolerance(e: CustomMouseEvent) {
    return this.graph.getTolerance()
  }

  /**
   * Returns the tolerance to be used for intersecting connection points.
   */
  getImageForConstraint(
    state: State,
    constraint: Constraint,
    point?: Point | null,
  ) {
    return this.pointImage
  }

  /**
   * Returns true if the given event should be ignored in `update`.
   *
   * This implementation always returns false.
   */
  isEventIgnored(e: CustomMouseEvent) {
    return false
  }

  /**
   * Returns true if the given state should be ignored.
   *
   * This implementation always returns false.
   */
  isStateIgnored(state: State, isSource: boolean) {
    return false
  }

  /**
   * Returns true if the current focused state should not be changed
   * for the given event.
   *
   * This implementation returns true if shift and alt are pressed.
   */
  isKeepFocusEvent(e: CustomMouseEvent) {
    return DomEvent.isShiftDown(e.getEvent())
  }

  /**
   * Returns the cell for the given event.
   */
  getCellForEvent(e: CustomMouseEvent, point: Point) {
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

  /**
   * Updates the state of this handler based on the given <mxMouseEvent>.
   * Source is a boolean indicating if the cell is a source or target.
   */
  update(
    e: CustomMouseEvent,
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
      const state = this.graph.view.getState(this.getCellForEvent(e, point!))

      // Keeps focus icons visible while over node bounds and
      // no other cell under mouse or shift is pressed
      if (
        !this.isKeepFocusEvent(e) &&
        (
          this.currentFocusArea == null ||
          this.currentFocus == null ||
          state != null ||
          !this.graph.model.isNode(this.currentFocus.cell) ||
          !util.intersects(this.currentFocusArea, mouse)
        ) &&
        (state !== this.currentFocus)
      ) {
        this.currentFocusArea = null
        this.currentFocus = null
        this.setFocus(e, state!, isSource)
      }

      this.currentConstraint = null
      this.currentPoint = null
      let minDistSq: number | null = null

      if (
        this.focusIcons != null &&
        this.constraints != null &&
        (state == null || this.currentFocus === state)
      ) {
        const cx = mouse.getCenterX()
        const cy = mouse.getCenterY()

        for (let i = 0; i < this.focusIcons.length; i += 1) {
          const dx = cx - this.focusIcons[i].bounds.getCenterX()
          const dy = cy - this.focusIcons[i].bounds.getCenterY()
          const dis = dx * dx + dy * dy

          if (
            (this.intersects(this.focusIcons[i], mouse, isSource, existingEdge) ||
              (
                point != null &&
                this.intersects(this.focusIcons[i], grid, isSource, existingEdge))
            ) &&
            (minDistSq == null || dis < minDistSq)
          ) {
            this.currentConstraint = this.constraints[i]
            this.currentPoint = this.focusPoints![i]
            minDistSq = dis

            const tmp = this.focusIcons[i].bounds.clone()
            tmp.grow(constants.CONSTRAINT_HIGHLIGHT_SIZE + 1)
            tmp.width -= 1
            tmp.height -= 1

            if (this.focusHighlight == null) {
              const hl = this.createHighlightShape()
              hl.dialect = 'svg'
              hl.pointerEvents = false

              hl.init(this.graph.getView().getOverlayPane())
              this.focusHighlight = hl

              const getState = () => (this.currentFocus || state) as State

              CustomMouseEvent.redirectMouseEvents(
                hl.elem!, this.graph, getState,
              )
            }

            if (this.focusHighlight) {
              this.focusHighlight.bounds = tmp
              this.focusHighlight.redraw()
            }
          }
        }
      }

      if (this.currentConstraint == null) {
        this.destroyFocusHighlight()
      }
    } else {
      this.currentConstraint = null
      this.currentFocus = null
      this.currentPoint = null
    }
  }

  /**
   * Transfers the focus to the given state as a source or target terminal. If
   * the handler is not enabled then the outline is painted, but the constraints
   * are ignored.
   */
  setFocus(e: CustomMouseEvent, state: State, isSource: boolean) {
    this.constraints = (
      state != null &&
      !this.isStateIgnored(state, isSource) &&
      this.graph.isCellConnectable(state.cell)
    ) ? (
        this.isEnabled()
          ? (this.graph.getAllConnectionConstraints(state, isSource) || [])
          : []
      )
      : null

    // Only uses cells which have constraints
    if (this.constraints != null) {
      this.currentFocus = state
      this.currentFocusArea = state.bounds.clone()

      this.destroyIcons()

      this.focusPoints = []
      this.focusIcons = []

      for (let i = 0; i < this.constraints.length; i += 1) {
        const cp = this.graph.getConnectionPoint(state, this.constraints[i])!
        const img = this.getImageForConstraint(state, this.constraints[i], cp)
        const src = img.src
        const bounds = new Rectangle(
          Math.round(cp.x - img.width / 2),
          Math.round(cp.y - img.height / 2),
          img.width,
          img.height,
        )

        const icon = new ImageShape(bounds, src)
        icon.dialect = 'svg'
        icon.preserveImageAspect = false
        icon.init(this.graph.getView().getDecoratorPane())

        if (icon.elem && icon.elem.previousSibling && icon.elem.parentNode) {
          // Move the icon behind all other overlays
          icon.elem.parentNode.insertBefore(
            icon.elem,
            icon.elem.parentNode.firstChild,
          )
        }

        const getState = () => (this.currentFocus != null)
          ? this.currentFocus
          : state

        icon.redraw()

        CustomMouseEvent.redirectMouseEvents(icon.elem!, this.graph, getState)
        this.currentFocusArea.add(icon.bounds)
        this.focusIcons.push(icon)
        this.focusPoints.push(cp)
      }

      this.currentFocusArea.grow(this.getTolerance(e))

    } else {
      this.destroyIcons()
      this.destroyFocusHighlight()
    }
  }

  /**
   * Create the shape used to paint the highlight.
   *
   * Returns true if the given icon intersects the given point.
   */
  createHighlightShape() {
    const hl = new RectangleShape(
      new Rectangle(),
      this.highlightColor,
      this.highlightColor,
      constants.HIGHLIGHT_STROKEWIDTH,
    )

    hl.opacity = constants.HIGHLIGHT_OPACITY

    return hl
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
    return util.intersects(icon.bounds, mouse)
  }

  dispose() {
    if (this.disposed) {
      return
    }

    this.reset()

    if (this.resetHandler != null) {
      this.graph.model.off(null, this.resetHandler)
      this.graph.view.off(null, this.resetHandler)
      this.graph.off(null, this.resetHandler)

      if (this.containerEventInstalled && this.graph.container) {
        DomEvent.removeListener(
          this.graph.container,
          'mouseleave',
          this.resetHandler,
        )
      }

      this.resetHandler = null
    }

    super.dispose()
  }
}
