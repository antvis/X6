import * as util from '../util'
import { Graph, State, Cell } from '../core'
import { constants, MouseEventEx, Disposable } from '../common'
import { BaseHandler } from './handler-base'
import { CellHighlight } from './cell-highlight'

export class CellMarker extends BaseHandler {
  /**
   * Specifies if the hotspot is enabled.
   *
   * Default is `false`.
   */
  hotspotable: boolean = false

  /**
   * The current marker color.
   */
  currentColor: string | null = null

  /**
   * The marked `CellState` if it is valid.
   */
  validState: State | null = null

  /**
   * The marked `CellState`.
   */
  markedState: State | null = null

  highlight: CellHighlight
  validColor: string
  invalidColor: string
  hotspot: number

  constructor(
    graph: Graph,
    options: CellMarker.Options = {},
  ) {
    super(graph)
    this.validColor = options.validColor != null
      ? options.validColor
      : constants.DEFAULT_VALID_COLOR

    this.invalidColor = options.invalidColor != null
      ? options.invalidColor
      : constants.DEFAULT_INVALID_COLOR

    this.hotspot = options.hotspot != null
      ? options.hotspot
      : constants.DEFAULT_HOTSPOT

    this.highlight = new CellHighlight(graph)
  }

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

  setCurrentState(
    state: State | null,
    e: MouseEventEx,
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
    this.markedState = null
    this.mark()
  }

  isValidState(state: State) {
    return true
  }

  getMarkerColor(
    e: Event,
    state: State | null,
    isValid: boolean,
  ) {
    return isValid ? this.validColor : this.invalidColor
  }

  process(e: MouseEventEx) {
    let state = null
    if (this.isEnabled()) {
      state = this.getState(e)
      this.setCurrentState(state, e)
    }

    return state
  }

  getState(e: MouseEventEx) {
    const cell = this.getCell(e)
    const state = this.getStateToMark(this.graph.view.getState(cell))
    return (state != null && this.intersects(state, e)) ? state : null
  }

  getCell(e: MouseEventEx) {
    return e.getCell()
  }

  getStateToMark(state: State | null) {
    return state
  }

  intersects(state: State, e: MouseEventEx) {
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

  @Disposable.aop()
  dispose() {
    this.highlight.dispose()
  }
}

export namespace CellMarker {
  export const events = {
    mark: 'mark',
  }

  export interface Options {
    validColor?: string
    invalidColor?: string
    /**
     * Specifies the portion of the width and height that should trigger
     * a highlight. The area around the center of the cell to be marked
     * is used as the hotspot. Possible values are between 0 and 1.
     */
    hotspot?: number
  }
}
