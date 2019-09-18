import * as util from '../util'
import { Graph, State, Model } from '../core'
import { View } from '../core/view'
import { constants, MouseEventEx, Disposable } from '../common'
import { Shape } from '../shape'
import { BaseHandler } from './handler-base'

export class CellHighlight extends BaseHandler {
  state: State | null
  shape: Shape | null
  opacity: number
  highlightColor: string | null
  strokeWidth: number
  dashed: boolean
  spacing: number

  /**
   * Specifies if the highlights should appear on top of everything
   * else in the overlay pane.
   *
   * Default is `false`.
   */
  keepOnTop: boolean

  private resetHandler: () => void
  private repaintHandler: () => void

  constructor(
    graph: Graph,
    options: CellHighlight.Options = {},
  ) {
    super(graph)

    this.highlightColor = options.highlightColor || constants.DEFAULT_VALID_COLOR
    this.strokeWidth = options.strokeWidth || constants.HIGHLIGHT_STROKEWIDTH
    this.opacity = options.opacity || constants.HIGHLIGHT_OPACITY
    this.dashed = options.dashed != null ? options.dashed : false
    this.keepOnTop = options.keepOnTop != null ? options.keepOnTop : false
    this.spacing = options.spacing || 2

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

  /**
   * Sets the color of the rectangle used to highlight drop targets.
   */
  setHighlightColor(color: string | null) {
    this.highlightColor = color
    if (this.shape != null) {
      this.shape.stroke = color
    }
  }

  /**
   * Updates the highlight after a change of the model or view.
   */
  getStrokeWidth(state: State) {
    return this.strokeWidth
  }

  /**
   * Creates and returns the highlight shape for the given state.
   */
  drawHighlight() {
    this.shape = this.createShape()
    this.repaint()

    if (!this.keepOnTop && this.shape) {
      util.toBack(this.shape.elem)
    }
  }

  protected createShape() {
    if (this.state) {
      const shape = this.graph.renderer.createShape(this.state)!

      shape.svgStrokeTolerance = this.graph.tolerance

      shape.apply(this.state)

      shape.stroke = this.highlightColor
      shape.opacity = this.opacity
      shape.dashed = this.dashed
      shape.shadow = false

      shape.dialect = 'svg'
      shape.svgPointerEvents = 'stroke'

      shape.init(this.graph.view.getOverlayPane())

      MouseEventEx.redirectMouseEvents(shape.elem!, this.graph, this.state)

      return shape
    }

    return null
  }

  /**
   * Updates the highlight after a change of the model or view.
   */
  repaint() {
    if (this.state != null && this.shape != null) {
      this.shape.scale = this.state.view.scale
      const sw = this.getStrokeWidth(this.state)

      if (this.graph.model.isEdge(this.state.cell)) {
        this.shape.strokeWidth = sw
        this.shape.points = this.state.absolutePoints
        this.shape.outline = false
      } else {
        this.shape.bounds = this.state.bounds.clone().grow(this.spacing)
        this.shape.rotation = util.getRotation(this.state)
        this.shape.strokeWidth = sw / this.state.view.scale
        this.shape.outline = true
      }

      // Uses cursor from shape in highlight
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

      this.state = state

      if (this.state != null) {
        this.drawHighlight()
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
    keepOnTop?: boolean
    spacing?: number
  }
}
