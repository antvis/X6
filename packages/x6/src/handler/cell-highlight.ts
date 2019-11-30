import * as util from '../util'
import { Graph, State, Model } from '../core'
import { View } from '../core/view'
import { MouseEventEx, Disposable } from '../common'
import { Shape } from '../shape'
import { BaseHandler } from './handler-base'
import { COLOR_VALID } from '../option/preset'

export class CellHighlight extends BaseHandler {
  state: State | null
  shape: Shape | null
  opacity: number
  highlightColor: string | null
  strokeWidth: number
  dashed: boolean
  spacing: number
  topMost: boolean
  className: string | null
  cellClassName: string | null

  private resetHandler: () => void
  private repaintHandler: () => void

  constructor(graph: Graph, options: CellHighlight.Options = {}) {
    super(graph)

    this.highlightColor = options.highlightColor || COLOR_VALID
    this.strokeWidth = options.strokeWidth || 3
    this.opacity = options.opacity || 1
    this.dashed = options.dashed != null ? options.dashed : false
    this.topMost = options.keepOnTop != null ? options.keepOnTop : false
    this.spacing = options.spacing || 2
    this.className = options.className || null
    this.cellClassName = options.cellClassName || null

    this.repaintHandler = () => {
      if (this.state != null) {
        const state = this.graph.view.getState(this.state.cell)
        if (state == null) {
          this.hide()
        } else {
          this.state = state
          this.repaint()
        }
      }
    }

    this.graph.view.on(View.events.scale, this.repaintHandler)
    this.graph.view.on(View.events.translate, this.repaintHandler)
    this.graph.view.on(View.events.scaleAndTranslate, this.repaintHandler)
    this.graph.model.on(Model.events.change, this.repaintHandler)

    // Hides the marker if the current root changes
    this.resetHandler = () => this.hide()
    this.graph.view.on(View.events.up, this.resetHandler)
    this.graph.view.on(View.events.down, this.resetHandler)
  }

  setHighlightColor(color: string | null) {
    this.highlightColor = color
    if (this.shape != null) {
      this.shape.strokeColor = color
    }
  }

  drawHighlight() {
    this.shape = this.createShape()
    this.repaint()

    if (!this.topMost && this.shape) {
      util.toBack(this.shape.elem)
    }
  }

  protected createShape() {
    if (this.state) {
      const shape = this.graph.renderer.createShape(this.state)!

      shape.svgStrokeTolerance = this.graph.tolerance
      shape.apply(this.state)
      shape.strokeColor = this.highlightColor
      shape.opacity = this.opacity
      shape.dashed = this.dashed
      shape.shadow = false
      shape.dialect = 'svg'
      shape.svgPointerEvents = 'stroke'
      shape.init(this.graph.view.getOverlayPane())

      MouseEventEx.redirectMouseEvents(shape.elem, this.graph, this.state)

      return shape
    }

    return null
  }

  repaint() {
    if (this.state != null && this.shape != null) {
      this.shape.scale = this.state.view.scale
      if (this.graph.model.isEdge(this.state.cell)) {
        this.shape.strokeWidth = this.strokeWidth
        this.shape.points = this.state.absolutePoints
        this.shape.outline = false
      } else {
        this.shape.bounds = this.state.bounds.clone().grow(this.spacing)
        this.shape.rotation = util.getRotation(this.state)
        this.shape.strokeWidth = this.strokeWidth / this.state.view.scale
        this.shape.outline = true
      }

      if (this.state.shape) {
        this.shape.setCursor(this.state.shape.getCursor())
      }

      this.shape.redraw()
    }
  }

  hide() {
    this.highlight(null)
  }

  highlight(state: State | null) {
    if (this.state !== state) {
      if (this.shape != null) {
        this.shape.dispose()
        this.shape = null
      }

      const prev = this.state
      this.state = state

      if (this.state != null) {
        this.drawHighlight()
      } else if (prev != null && this.cellClassName != null) {
        // remove target cell class name
      }
    }
  }

  isHighlightAt(x: number, y: number) {
    let hit = false

    if (this.shape != null && document.elementFromPoint != null) {
      let elt = document.elementFromPoint(x, y) as Element

      while (elt != null) {
        if (elt === this.shape.elem) {
          hit = true
          break
        }
        elt = elt.parentNode as Element
      }
    }

    return hit
  }

  @Disposable.aop()
  dispose() {
    this.graph.view.off(null, this.resetHandler)
    this.graph.view.off(null, this.repaintHandler)
    this.graph.model.off(null, this.repaintHandler)

    if (this.shape != null) {
      this.shape.dispose()
      this.shape = null
    }
  }
}

export namespace CellHighlight {
  export interface Options {
    highlightColor?: string
    strokeWidth?: number
    opacity?: number
    dashed?: boolean
    spacing?: number
    /**
     * Specifies if the highlights should appear on top of everything
     * else in the overlay pane.
     *
     * Default is `false`.
     */
    keepOnTop?: boolean
    className?: string
    cellClassName?: string
  }
}
