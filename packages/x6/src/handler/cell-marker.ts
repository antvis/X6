import * as util from '../util'
import { Graph, State, Cell } from '../core'
import { MouseEventEx, Disposable } from '../common'
import { BaseHandler } from './handler-base'
import { CellHighlight } from './cell-highlight'

export class CellMarker extends BaseHandler {
  highlight: CellHighlight
  validState: State | null = null
  markedState: State | null = null

  validColor: string
  invalidColor: string
  currentColor: string | null = null

  hotspotable: boolean
  hotspot: number
  minHotspotSize: number
  maxHotspotSize: number

  constructor(graph: Graph, options: CellMarker.Options) {
    super(graph)
    this.validColor = options.validColor ? options.validColor : '#00FF00'
    this.invalidColor = options.invalidColor ? options.invalidColor : '#FF0000'
    this.hotspot = options.hotspot != null ? options.hotspot : 0.3
    this.hotspotable = options.hotspotable != null ? options.hotspotable : false
    this.minHotspotSize =
      options.minHotspotSize != null ? options.minHotspotSize : 8
    this.maxHotspotSize =
      options.maxHotspotSize != null ? options.maxHotspotSize : 0

    this.highlight = new CellHighlight(graph, options)
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

  protected setCurrentState(
    state: State | null,
    e: MouseEventEx,
    color?: string | null
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
      this.currentColor = color || null

      if (state != null && this.currentColor != null) {
        this.markedState = state
        this.mark()
      } else if (this.markedState != null) {
        this.unmark()
      }
    }
  }

  mark() {
    this.highlight.setHighlightColor(this.currentColor)
    this.highlight.highlight(this.markedState)
  }

  protected unmark() {
    this.markedState = null
    this.mark()
  }

  protected isValidState(state: State) {
    return true
  }

  protected getMarkerColor(
    e: Event,
    state: State | null,
    isValid: boolean
  ): string | null {
    return isValid ? this.validColor : this.invalidColor
  }

  markCell(cell: Cell, color: string = this.validColor) {
    const state = this.graph.view.getState(cell)
    if (state != null) {
      this.currentColor = color
      this.markedState = state
      this.mark()
    }
  }

  process(e: MouseEventEx) {
    let state = null
    if (this.isEnabled()) {
      state = this.getState(e)
      this.setCurrentState(state, e)
    }

    return state
  }

  protected getState(e: MouseEventEx) {
    const cell = this.getCell(e)
    const state = this.getStateToMark(this.graph.view.getState(cell))
    return this.intersects(state, e) ? state : null
  }

  protected getCell(e: MouseEventEx) {
    return e.getCell()
  }

  protected getStateToMark(state: State | null) {
    return state
  }

  protected intersects(state: State | null, e: MouseEventEx) {
    if (state == null) {
      return false
    }

    // 在中心区域按下鼠标触发连线
    // 在边缘区域按下鼠标触发移动
    if (this.hotspotable) {
      return util.isInHotspot(
        state,
        e.getGraphX(),
        e.getGraphY(),
        this.hotspot,
        this.minHotspotSize,
        this.maxHotspotSize
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
  export interface Options extends CellHighlight.Options {
    validColor?: string
    invalidColor?: string
    hotspot?: number
    hotspotable?: boolean
    minHotspotSize?: number
    maxHotspotSize?: number
  }
}
