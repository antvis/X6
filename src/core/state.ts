import { Dictionary } from '../common'
import { Point, Rectangle, Overlay } from '../struct'
import { Cell } from './cell'
import { View } from './view'
import { Shape, ImageShape, Text } from '../shape'
import { Style } from '../types'

export class State {
  /**
   * scale and translated bounds
   */
  bounds: Rectangle

  /**
   * The unscaled, untranslated bounds.
   */
  cellBounds: Rectangle

  /**
   * the unscaled, untranslated paint bounds. This is the same as
   * `cellBounds` but with a 90 degree rotation if the shape's
   * `isPaintBoundsInverted` returns true.
   */
  paintBounds: Rectangle

  boundingBox: Rectangle

  /**
   * The origin for all child cells.
   */
  origin: Point

  /**
   * For edges, this is the absolute coordinates of the label position.
   * For nodes, this is the offset of the label relative to the top, left
   * corner of the node.
   */
  absoluteOffset: Point

  /**
   * The unscaled width of the state.
   */
  unscaledWidth: number | null

  /**
   * The unscaled height of the state.
   */
  unscaledHeight: number | null

  /**
   * An array of `Point` that represent the absolute points of an edge.
   */
  absolutePoints: Point[]

  /**
   * The visible source terminal state.
   */
  visibleSourceState: State | null

  /**
   * The visible target terminal state.
   */
  visibleTargetState: State | null

  /**
   * The distance between the first and last point for an edge.
   */
  terminalDistance: number = 0

  /**
   * The length of an edge.
   */
  totalLength: number = 0

  /**
   * Array of numbers that represent the cached length of
   * each segment of the edge.
   */
  segmentsLength: number[]

  /**
   * Specifies if the state is invalid.
   */
  invalid: boolean = true

  /**
   * Specifies if the style is invalid.
   */
  invalidStyle: boolean = false

  /**
   * A `Shape` instance that represents the cell graphically.
   */
  shape: Shape | null

  /**
   * A `Text` instance that represents the label of the cell.
   * This may be null if the cell has no label.
   */
  text: Text | null

  /**
   * A `Shape` instance that represents the cell control graphically.
   */
  control: ImageShape | null

  overlays: Dictionary<Overlay, ImageShape> | null

  constructor(
    public view: View,
    public cell: Cell,
    /**
     * Key-Value pairs that represent the style of the cell.
     */
    public style: Style = {},
  ) {
    this.origin = new Point()
    this.bounds = new Rectangle()
    this.absoluteOffset = new Point()
  }

  /**
   * Returns the `Rectangle` that should be used as the perimeter
   * of the cell.
   *
   * @param border Optional border to be added around the perimeter bounds.
   * @param bounds Optional `Rectangle` to be used as the initial bounds.
   */
  getPerimeterBounds(
    border: number = 0,
    bounds: Rectangle = Rectangle.clone(this.bounds),
  ) {
    if (
      this.shape != null &&
      this.shape.stencil != null &&
      this.shape.stencil.aspect === 'fixed'
    ) {
      const aspect = this.shape.stencil.computeAspect(
        this.shape, bounds.x, bounds.y, bounds.width, bounds.height,
      )

      bounds.x = aspect.x
      bounds.y = aspect.y
      bounds.width = this.shape.stencil.w0 * aspect.width
      bounds.height = this.shape.stencil.h0 * aspect.height
    }

    if (border !== 0) {
      bounds.grow(border)
    }

    return bounds
  }

  setAbsoluteTerminalPoint(point: Point, isSource?: boolean) {
    if (this.absolutePoints == null) {
      this.absolutePoints = []
    }

    const len = this.absolutePoints.length

    if (isSource) {
      if (len === 0) {
        this.absolutePoints.push(point)
      } else {
        this.absolutePoints[0] = point
      }
    } else {
      if (len === 0) {
        this.absolutePoints.push(null as any)
        this.absolutePoints.push(point)
      } else if (len === 1) {
        this.absolutePoints.push(point)
      } else {
        this.absolutePoints[len - 1] = point
      }
    }
  }

  setCursor(cursor?: string) {
    if (this.shape != null) {
      this.shape.setCursor(cursor)
    }

    if (this.text != null) {
      this.text.setCursor(cursor)
    }
  }

  getVisibleTerminal(isSource?: boolean) {
    const state = this.getVisibleTerminalState(isSource)
    return state != null ? state.cell : null
  }

  getVisibleTerminalState(isSource?: boolean) {
    return isSource ? this.visibleSourceState : this.visibleTargetState
  }

  setVisibleTerminalState(state: State | null, isSource?: boolean) {
    if (isSource) {
      this.visibleSourceState = state
    } else {
      this.visibleTargetState = state
    }
  }

  /**
   * Returns the unscaled, untranslated bounds.
   */
  getCellBounds() {
    return this.cellBounds
  }

  /**
   * Returns the unscaled, untranslated paint bounds. This is the same as
   * `getCellBounds` but with a 90 degree rotation if the shape's
   * `isPaintBoundsInverted` returns true.
   */
  getPaintBounds() {
    return this.paintBounds
  }

  /**
   * Updates the cellBounds and paintBounds.
   */
  updateCachedBounds() {
    const s = this.view.scale
    const t = this.view.translate
    this.cellBounds = new Rectangle(
      this.bounds.x / s - t.x,
      this.bounds.y / s - t.y,
      this.bounds.width / s,
      this.bounds.height / s,
    )

    this.paintBounds = Rectangle.clone(this.cellBounds)
    if (this.shape != null && this.shape.isPaintBoundsInverted()) {
      this.paintBounds.rotate90()
    }
  }

  /**
   * Copies all fields from the given state to this state.
   */
  setState(state: State) {
    this.view = state.view
    this.cell = state.cell
    this.style = state.style
    this.origin = state.origin
    this.absolutePoints = state.absolutePoints
    this.absoluteOffset = state.absoluteOffset
    this.boundingBox = state.boundingBox
    this.terminalDistance = state.terminalDistance
    this.totalLength = state.totalLength
    this.segmentsLength = state.segmentsLength
    this.unscaledWidth = state.unscaledWidth

    this.bounds.update(
      state.bounds.x,
      state.bounds.y,
      state.bounds.width,
      state.bounds.height,
    )
  }

  clone() {
    const cloned = new State(this.view, this.cell, this.style)

    cloned.bounds = this.bounds.clone()

    if (this.absolutePoints != null) {
      cloned.absolutePoints = this.absolutePoints.map(p => p ? p.clone() : p)
    }

    if (this.origin != null) {
      cloned.origin = this.origin.clone()
    }

    if (this.absoluteOffset != null) {
      cloned.absoluteOffset = this.absoluteOffset.clone()
    }

    if (this.boundingBox != null) {
      cloned.boundingBox = this.boundingBox.clone()
    }

    cloned.terminalDistance = this.terminalDistance
    cloned.totalLength = this.totalLength
    cloned.segmentsLength = this.segmentsLength
    cloned.unscaledWidth = this.unscaledWidth

    return cloned
  }

  destroy() {
    this.view.graph.renderer.destroy(this)
  }
}
