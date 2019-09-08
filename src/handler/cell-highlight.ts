import * as util from '../util'
import { Graph, State, Model } from '../core'
import { View } from '../core/view'
import { constants, MouseEventEx } from '../common'
import { Shape } from '../shape'
import { Rectangle } from '../struct'
import { BaseHandler } from './handler-base'

export class CellHighlight extends BaseHandler {
  state: State | null
  shape: Shape | null
  opacity: number
  strokeWidth: number
  highlightColor: string | null
  dashed: boolean

  /**
   * Specifies if the highlights should appear on top of everything
   * else in the overlay pane.
   *
   * Default is `false`.
   */
  keepOnTop: boolean

  /**
   * Specifies the spacing between the highlight for vertices and the node.
   *
   * Default is `2`.
   */
  spacing: number

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
      shape.points = this.state.absolutePoints

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

      if (this.graph.model.isEdge(this.state.cell)) {
        this.shape.strokeWidth = this.getStrokeWidth(this.state)
        this.shape.points = this.state.absolutePoints
        this.shape.outline = false
      } else {
        this.shape.bounds = new Rectangle(
          this.state.bounds.x - this.spacing,
          this.state.bounds.y - this.spacing,
          this.state.bounds.width + 2 * this.spacing,
          this.state.bounds.height + 2 * this.spacing,
        )
        this.shape.rotation = util.getRotation(this.state)
        this.shape.strokeWidth = this.getStrokeWidth(this.state) / this.state.view.scale
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

  dispose() {
    if (this.disposed) {
      return
    }

    this.graph.view.off(null, this.resetHandler)
    this.graph.view.off(null, this.repaintHandler)
    this.graph.model.off(null, this.repaintHandler)

    if (this.shape != null) {
      this.shape.dispose()
      this.shape = null
    }

    super.dispose()
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
