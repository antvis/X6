import { Cell } from './cell'
import { View } from './view'
import { Style } from '../types'
import { Dictionary, Disablable, Disposable } from '../common'
import { Shape, ImageShape, Text } from '../shape'
import { Point, Rectangle, Overlay } from '../struct'

export class State extends Disablable {
  /**
   * Specifies if the state is invalid.
   */
  invalid: boolean = true

  /**
   * Specifies if the style is invalid.
   */
  invalidStyle: boolean = false

  /**
   * The scale and translated bounds.
   */
  bounds: Rectangle

  /**
   * The smallest rectangle that includes all pixels of shapes in the state.
   */
  boundingBox: Rectangle

  /**
   * The unscaled, untranslated bounds.
   */
  cellBounds: Rectangle

  /**
   * The unscaled, untranslated bounds. This is the same as `cellBounds`
   * but with a 90 degree rotation if the shape's `isPaintBoundsInverted`
   * returns true.
   */
  paintBounds: Rectangle

  /**
   * The origin for all child cells.
   *
   * It is a unscaled, untranslated point.
   */
  origin: Point

  /**
   * The unscaled width of the state.
   */
  unscaledWidth: number | null

  /**
   * The unscaled height of the state.
   */
  unscaledHeight: number | null

  /**
   * For edges, this is the absolute coordinates of the label position.
   * For nodes, this is the offset of the label relative to the top, left
   * corner of the node.
   */
  absoluteOffset: Point

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
    public cell: Cell = new Cell(),
    public style: Style = {}
  ) {
    super()
    this.origin = new Point()
    this.bounds = new Rectangle()
    this.absoluteOffset = new Point()
  }

  /**
   * Returns the `Rectangle` that should be used as the perimeter of the cell.
   *
   * @param border Optional border to be added around the perimeter bounds.
   * @param bounds Optional `Rectangle` to be used as the initial bounds.
   */
  getPerimeterBounds(
    border: number = 0,
    bounds: Rectangle = Rectangle.clone(this.bounds)
  ) {
    if (
      this.shape != null &&
      this.shape.stencil != null &&
      this.shape.stencil.aspect === 'fixed'
    ) {
      const aspect = this.shape.stencil.computeAspect(
        this.shape,
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height
      )

      bounds.x = aspect.x
      bounds.y = aspect.y
      bounds.width = this.shape.stencil.width * aspect.sx
      bounds.height = this.shape.stencil.height * aspect.sy
    }

    if (border !== 0) {
      bounds.grow(border)
    }

    return bounds
  }

  setAbsoluteTerminalPoint(point: Point, isSource: boolean) {
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
   * `getCellBounds()` but with a 90 degree rotation if the shape's
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
      this.bounds.height / s
    )

    this.paintBounds = this.cellBounds.clone()

    if (this.shape != null && this.shape.drawBoundsInverted()) {
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
    this.bounds.update(state.bounds)
    this.boundingBox = state.boundingBox
    this.absoluteOffset = state.absoluteOffset
    this.absolutePoints = state.absolutePoints
    this.terminalDistance = state.terminalDistance
    this.totalLength = state.totalLength
    this.segmentsLength = state.segmentsLength
    this.unscaledWidth = state.unscaledWidth
    this.unscaledHeight = state.unscaledHeight
  }

  setCursor(cursor?: string) {
    if (this.shape != null) {
      this.shape.setCursor(cursor)
    }

    if (this.text != null) {
      this.text.setCursor(cursor)
    }
  }

  clone() {
    const cloned = new State(this.view, this.cell, this.style)

    cloned.bounds = this.bounds.clone()
    if (this.absolutePoints != null) {
      cloned.absolutePoints = this.absolutePoints.map((p) =>
        p ? p.clone() : p
      )
    }

    if (this.absoluteOffset != null) {
      cloned.absoluteOffset = this.absoluteOffset.clone()
    }

    if (this.origin != null) {
      cloned.origin = this.origin.clone()
    }

    if (this.boundingBox != null) {
      cloned.boundingBox = this.boundingBox.clone()
    }

    cloned.terminalDistance = this.terminalDistance
    cloned.totalLength = this.totalLength
    cloned.segmentsLength = this.segmentsLength
    cloned.unscaledWidth = this.unscaledWidth
    cloned.unscaledHeight = this.unscaledHeight

    return cloned
  }

  @Disposable.aop()
  dispose() {
    if (this.shape != null) {
      if (this.text != null) {
        this.text.dispose()
        this.text = null
      }

      if (this.overlays !== null) {
        this.overlays.each((shape) => shape && shape.dispose())
      }

      if (this.control != null) {
        this.control.dispose()
        this.control = null
      }

      this.shape.dispose()
      this.shape = null
    }
  }
}
