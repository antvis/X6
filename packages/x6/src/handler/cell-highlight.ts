import { ObjectExt } from '../util'
import { DomUtil } from '../dom'
import { globals } from '../option/global'
import { Shape } from '../shape'
import { Graph } from '../graph'
import { State } from '../core/state'
import { MouseEventEx } from './mouse-event'
import { BaseHandler } from './base-handler'

export class CellHighlight extends BaseHandler {
  state: State | null
  shape: Shape | null
  className: string | null
  cellClassName: string | null
  opacity: number
  highlightColor: string | null
  strokeWidth: number
  dashed: boolean
  spacing: number
  topMost: boolean

  private resetHandler: () => void
  private repaintHandler: () => void

  constructor(graph: Graph, options: CellHighlight.Options = {}) {
    super(graph)

    this.className = ObjectExt.ensure(options.className, null)
    this.cellClassName = ObjectExt.ensure(options.cellClassName, null)
    this.highlightColor = ObjectExt.ensure(
      options.highlightColor,
      globals.defaultValidColor,
    )
    this.dashed = ObjectExt.ensure(options.dashed, false)
    this.strokeWidth = ObjectExt.ensure(options.strokeWidth, 3)
    this.opacity = ObjectExt.ensure(options.opacity, 1)
    this.spacing = ObjectExt.ensure(options.spacing, 2)
    this.topMost = ObjectExt.ensure(options.keepOnTop, false)

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

    this.graph.view.on('scale', this.repaintHandler)
    this.graph.view.on('translate', this.repaintHandler)
    this.graph.view.on('scaleAndTranslate', this.repaintHandler)
    this.graph.model.on('change', this.repaintHandler)

    // Hides the marker if the current root changes
    this.resetHandler = () => this.hide()
    this.graph.view.on('up', this.resetHandler)
    this.graph.view.on('down', this.resetHandler)
  }

  setHighlightColor(color: string | null) {
    this.highlightColor = color
    if (this.shape != null) {
      this.shape.strokeColor = color
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
      shape.className = this.className
      shape.shadow = false
      shape.dialect = 'svg'
      shape.svgPointerEvents = 'stroke'
      shape.init(this.graph.view.getOverlayPane())

      MouseEventEx.redirectMouseEvents(shape.elem, this.graph, this.state)

      return shape
    }

    return null
  }

  draw() {
    this.shape = this.createShape()
    this.repaint()

    if (!this.topMost && this.shape != null) {
      DomUtil.toBack(this.shape.elem)
    }
  }

  repaint() {
    if (this.state != null && this.shape != null) {
      this.shape.scale = this.state.view.scale
      if (this.graph.model.isEdge(this.state.cell)) {
        this.shape.strokeWidth = this.strokeWidth
        this.shape.points = this.state.absolutePoints
        this.shape.outline = false
      } else {
        this.shape.bounds = this.state.bounds.clone().inflate(this.spacing)
        this.shape.rotation = State.getRotation(this.state)
        this.shape.strokeWidth = this.strokeWidth / this.state.view.scale
        this.shape.outline = true
      }

      if (this.state.shape != null) {
        this.shape.setCursor(this.state.shape.getCursor())
        if (this.cellClassName != null) {
          this.state.shape.addClass(this.cellClassName)
        }
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
        this.draw()
      } else if (
        prev != null &&
        prev.shape != null &&
        this.cellClassName != null
      ) {
        // remove target cell class name
        prev.shape.removeClass(this.cellClassName)
      }
    }
  }

  isHighlightAt(x: number, y: number) {
    let hit = false

    if (this.shape != null && document.elementFromPoint != null) {
      let elem = document.elementFromPoint(x, y) as Element

      while (elem != null) {
        if (elem === this.shape.elem) {
          hit = true
          break
        }
        elem = elem.parentNode as Element
      }
    }

    return hit
  }

  @BaseHandler.dispose()
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
    /**
     * The class name of the highlight shape
     */
    className?: string
    /**
     * The class name added to cell when cell was highlighted
     */
    cellClassName?: string
    highlightColor?: string
    strokeWidth?: number
    dashed?: boolean
    opacity?: number
    spacing?: number
    /**
     * Specifies if the highlights should appear on top of everything
     * else in the overlay pane.
     *
     * Default is `false`.
     */
    keepOnTop?: boolean
  }
}
