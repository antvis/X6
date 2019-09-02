import * as util from '../util'
import { Graph, CellState, Cell } from '../core'
import { constants, CustomMouseEvent } from '../common'
import { BaseHandler } from './handler-base'
import { CellHighlight } from './cell-highlight'

export class CellMarker extends BaseHandler {
  constructor(
    graph: Graph,
    public validColor: string = constants.DEFAULT_VALID_COLOR,
    public invalidColor: string = constants.DEFAULT_INVALID_COLOR,
    /**
     * Specifies the portion of the width and height that should trigger
     * a highlight. The area around the center of the cell to be marked
     * is used as the hotspot. Possible values are between 0 and 1.
     */
    public hotspot: number = constants.DEFAULT_HOTSPOT,
  ) {
    super(graph)
    this.highlight = new CellHighlight(graph)
  }

  highlight: CellHighlight

  /**
   * Specifies if the hotspot is enabled.
   *
   * Default is `false`.
   */
  hotspotable: boolean = false

  /**
   * Holds the current marker color.
   */
  currentColor: string | null = null

  /**
   * Holds the marked `CellState` if it is valid.
   */
  validState: CellState | null = null

  /**
   * Holds the marked `CellState`.
   */
  markedState: CellState | null = null

  hasValidState() {
    return this.validState != null
  }

  getValidState() {
    return this.validState
  }

  getMarkedState() {
    return this.markedState
  }

  reset() {
    this.validState = null

    if (this.markedState != null) {
      this.markedState = null
      this.unmark()
    }
  }

  process(e: CustomMouseEvent) {
    let state = null
    if (this.isEnabled()) {
      state = this.getState(e)
      this.setCurrentState(state, e)
    }

    return state
  }

  /**
   * Sets and marks the current valid state.
   */
  setCurrentState(
    state: CellState | null,
    e: CustomMouseEvent,
    color?: string,
  ) {
    const isValid = state ? this.isValidState(state) : false
    // tslint:disable-next-line
    color = color || this.getMarkerColor(e.getEvent(), state, isValid)

    if (isValid) {
      this.validState = state
    } else {
      this.validState = null
    }

    if (state !== this.markedState || color !== this.currentColor) {
      this.currentColor = color

      if (state != null && this.currentColor != null) {
        this.markedState = state
        this.mark()
      } else if (this.markedState != null) {
        this.markedState = null
        this.unmark()
      }
    }
  }

  /**
   * Marks the given cell using the given color.
   */
  markCell(cell: Cell, color: string = this.validColor) {
    const state = this.graph.view.getState(cell)
    if (state != null) {
      this.currentColor = color
      this.markedState = state
      this.mark()
    }
  }

  mark() {
    this.highlight.setHighlightColor(this.currentColor)
    this.highlight.highlight(this.markedState)
    this.trigger(CellMarker.events.mark, { state: this.markedState })
  }

  unmark() {
    this.mark()
  }

  isValidState(state: CellState) {
    return true
  }

  getMarkerColor(
    e: Event,
    state: CellState | null,
    isValid: boolean,
  ) {
    return isValid ? this.validColor : this.invalidColor
  }

  getState(e: CustomMouseEvent) {
    const cell = this.getCell(e)
    const state = this.getStateToMark(this.graph.view.getState(cell))

    return (state != null && this.intersects(state, e)) ? state : null
  }

  getCell(e: CustomMouseEvent) {
    return e.getCell()
  }

  getStateToMark(state: CellState | null) {
    return state
  }

  intersects(state: CellState, e: CustomMouseEvent) {
    if (this.hotspotable) {
      return util.intersectsHotspot(
        state,
        e.getGraphX(),
        e.getGraphY(),
        this.hotspot,
        constants.MIN_HOTSPOT_SIZE,
        constants.MAX_HOTSPOT_SIZE,
      )
    }

    return true
  }

  dispose() {
    if (!this.disposed) {
      this.disposed = true
      this.highlight.dispose()
    }
  }
}

export namespace CellMarker {
  export const events = {
    mark: 'mark',
  }
}
