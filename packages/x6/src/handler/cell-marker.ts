import { ObjectExt } from '../util'
import { Point, Rectangle } from '../geometry'
import { globals } from '../option/global'
import { Graph } from '../graph'
import { Cell } from '../core/cell'
import { State } from '../core/state'
import { MouseEventEx } from './mouse-event'
import { BaseHandler } from './base-handler'
import { CellHighlight } from './cell-highlight'

export class CellMarker extends BaseHandler {
  highlight: CellHighlight
  validState: State | null = null
  markedState: State | null = null

  validColor: string
  invalidColor: string
  currentColor: string | null = null

  hotspotable: boolean
  hotspotRate: number
  minHotspotSize: number
  maxHotspotSize: number

  constructor(graph: Graph, options: CellMarker.Options) {
    super(graph)

    this.validColor = ObjectExt.ensure(
      options.validColor,
      globals.defaultValidColor,
    )
    this.invalidColor = ObjectExt.ensure(
      options.invalidColor,
      globals.defaultInvalidColor,
    )

    this.hotspotRate = ObjectExt.ensure(options.hotspotRate, 0.3)
    this.hotspotable = ObjectExt.ensure(options.hotspotable, false)
    this.minHotspotSize = ObjectExt.ensure(options.minHotspotSize, 8)
    this.maxHotspotSize = ObjectExt.ensure(options.maxHotspotSize, 0)

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
      this.unmark()
    }
  }

  mark() {
    this.highlight.setHighlightColor(this.currentColor)
    this.highlight.highlight(this.markedState)
  }

  unmark() {
    this.markedState = null
    this.mark()
  }

  protected setCurrentState(
    state: State | null,
    e: MouseEventEx,
    color?: string | null,
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

  protected isValidState(state: State) {
    return true
  }

  protected getMarkerColor(
    e: Event,
    state: State | null,
    isValid: boolean,
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
      return CellMarker.isInHotspot(
        state,
        e.getGraphX(),
        e.getGraphY(),
        this.hotspotRate,
        this.minHotspotSize,
        this.maxHotspotSize,
      )
    }

    return true
  }

  @BaseHandler.dispose()
  dispose() {
    this.highlight.dispose()
  }
}

export namespace CellMarker {
  export interface Options extends CellHighlight.Options, HotspotOptions {
    validColor?: string
    invalidColor?: string
  }

  export interface HotspotOptions {
    hotspotable?: boolean
    hotspotRate?: number
    minHotspotSize?: number
    maxHotspotSize?: number
  }
}

export namespace CellMarker {
  export function isInHotspot(
    state: State,
    x: number,
    y: number,
    hotspotRate: number = 1,
    minHotspotSize: number = 0,
    maxHotspotSize: number = 0,
  ) {
    if (hotspotRate > 0) {
      let cx = state.bounds.getCenterX()
      let cy = state.bounds.getCenterY()
      let w = state.bounds.width
      let h = state.bounds.height

      const start = (state.style.startSize || 0) * state.view.scale
      if (start > 0) {
        if (state.style.horizontal !== false) {
          cy = state.bounds.y + start / 2
          h = start
        } else {
          cx = state.bounds.x + start / 2
          w = start
        }
      }

      if (minHotspotSize >= 0) {
        w = Math.max(minHotspotSize, w * hotspotRate)
        h = Math.max(minHotspotSize, h * hotspotRate)
      }

      if (maxHotspotSize > 0) {
        w = Math.min(w, maxHotspotSize)
        h = Math.min(h, maxHotspotSize)
      }

      const rect = new Rectangle(cx - w / 2, cy - h / 2, w, h)
      const rot = state.style.rotation || 0
      if (rot !== 0) {
        const cx = state.bounds.getCenter()
        const pt = new Point(x, y).rotate(-rot, cx)
        return rect.containsPoint(pt)
      }

      return rect.containsPoint({ x, y })
    }

    return true
  }
}
