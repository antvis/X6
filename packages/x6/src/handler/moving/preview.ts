import { Point, Rectangle } from '../../geometry'
import * as movment from './util'
import { Disposable } from '../../entity'
import { Cell } from '../../core/cell'
import { MovingHandler } from './handler'
import { CellHighlight } from '../cell-highlight'
import { RectangleShape } from '../../shape'
import { MouseEventEx } from '../mouse-event'
import { applyConnectionHighlightStyle } from '../connection/option'
import {
  applyMovingPreviewStyle,
  applyDropTargetHighlightStyle,
} from './option'

export class Preview extends Disposable {
  /**
   * Specifies the minimum number of pixels for the width and height
   * of a selection bounds.
   *
   * Default is `6`.
   */
  minimumSize: number = 6

  /**
   * Specifies if draw a html preview. If this is true then drop
   * target detection relies entirely on `graph.getCellAt` because
   * the HTML preview does not "let events through".
   *
   * Default is `false`.
   */
  htmlPreview: boolean = false

  /**
   * Specifies if the grid should be scaled.
   *
   * Default is `false`.
   */
  scaleGrid: boolean = false

  cell: Cell | null
  cells: Cell[]
  target: Cell | null

  dx: number | null
  dy: number | null

  protected origin: Point | null
  protected bounds: Rectangle | null
  protected previewBounds: Rectangle | null

  protected highlight: CellHighlight | null
  protected previewShape: RectangleShape | null

  constructor(public master: MovingHandler) {
    super()

    const options = this.graph.options.movingPreview
    this.htmlPreview = options.html
    this.minimumSize = options.minimumSize
  }

  get graph() {
    return this.master.graph
  }

  start(e: MouseEventEx) {
    this.cell = this.master.getCell(e)!
    this.cells = movment.getCells(this.master, this.cell, e)
    this.origin = this.graph.clientToGraph(e)
    this.updateBounds()
  }

  protected updateBounds() {
    this.bounds = this.graph.view.getBounds(this.cells)
    this.previewBounds = movment.getPreviewBounds(
      this.graph,
      this.minimumSize,
      this.cells,
    )
  }

  isStarted() {
    return this.cell != null && this.origin != null && this.bounds != null
  }

  process(e: MouseEventEx) {
    const graph = this.graph
    const tol = graph.tolerance
    const delta = movment.getDelta(this.master, this.origin!, e)
    const bounds = this.bounds!

    let dx = delta.x
    let dy = delta.y

    if (this.previewShape || Math.abs(dx) > tol || Math.abs(dy) > tol) {
      // Highlight is used for highlighting drop targets
      if (this.highlight == null) {
        this.highlight = new CellHighlight(graph)
      }

      if (this.previewShape == null) {
        this.previewShape = this.createPreview(bounds)
      }

      if (graph.guideHandler.active) {
        dx = graph.guideHandler.dx!
        dy = graph.guideHandler.dy!
      } else if (graph.isGridEnabledForEvent(e.getEvent())) {
        const s = graph.view.scale
        const t = graph.view.translate
        const x = (graph.snap(bounds.x / s - t.x) + t.x) * s
        const y = (graph.snap(bounds.y / s - t.y) + t.y) * s

        const tx = bounds.x - x
        const ty = bounds.y - y
        const v = this.snap(new Point(dx, dy))

        dx = v.x - tx
        dy = v.y - ty
      }

      // Constrained movement if shift key is pressed
      if (graph.isConstrainedEvent(e.getEvent())) {
        if (Math.abs(dx) > Math.abs(dy)) {
          dy = 0
        } else {
          dx = 0
        }
      }

      this.dx = dx
      this.dy = dy

      this.updatePreview()
      this.updateDropTarget(e)
    }
  }

  isMoved() {
    return this.dx != null && this.dy != null
  }

  protected snap(p: Point) {
    const s = this.scaleGrid ? this.graph.view.scale : 1
    p.x = this.graph.snap(p.x / s) * s
    p.y = this.graph.snap(p.y / s) * s
    return p
  }

  protected createPreview(bounds: Rectangle) {
    const shape = new RectangleShape(bounds)
    if (this.htmlPreview) {
      shape.dialect = 'html'
      shape.init(this.graph.container)
    } else {
      shape.dialect = 'svg'
      shape.pointerEvents = false
      shape.init(this.graph.view.getOverlayPane())
    }
    return shape
  }

  updatePreview() {
    if (
      this.previewShape &&
      this.previewBounds &&
      this.dx != null &&
      this.dy != null
    ) {
      const bounds = (this.previewShape.bounds = new Rectangle(
        Math.round(this.previewBounds.x + this.dx - this.graph.panX),
        Math.round(this.previewBounds.y + this.dy - this.graph.panY),
        this.previewBounds.width,
        this.previewBounds.height,
      ))

      applyMovingPreviewStyle({
        graph: this.graph,
        shape: this.previewShape,
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      })

      this.previewShape.redraw()
    }
  }

  refresh() {
    if (this.origin) {
      this.updateBounds()
      this.updatePreview()
    }
  }

  protected destory() {
    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
    }

    if (this.highlight != null) {
      this.highlight.dispose()
      this.highlight = null
    }
  }

  protected updateDropTarget(e: MouseEventEx) {
    const graph = this.graph
    const cell = this.master.getCell(e)
    const clone = this.master.isClone(e)

    let target = null

    if (graph.isDropEnabled()) {
      target = graph.getDropTarget(e.getEvent(), this.cells, cell, clone)
    }

    let state = graph.view.getState(target)
    let active = false

    if (
      state != null &&
      (graph.model.getParent(this.cell) !== target || clone)
    ) {
      if (this.target !== target) {
        this.target = target
        applyDropTargetHighlightStyle({
          graph,
          cell: target!,
          highlight: this.highlight!,
        })
      }

      active = true
    } else {
      this.target = null

      // Drag a cell onto another cell, then drop it to trigger a connection.
      if (
        graph.isConnectOnDrop() &&
        cell != null &&
        cell.isNode() &&
        this.cells.length === 1 &&
        graph.isCellConnectable(cell)
      ) {
        state = graph.view.getState(cell)
        if (state != null) {
          const error = graph.validationManager.getEdgeValidationError(
            null,
            this.cell,
            cell,
          )
          applyConnectionHighlightStyle({
            graph,
            cell,
            valid: error == null,
            highlight: this.highlight!,
          })

          active = true
        }
      }
    }

    if (this.highlight) {
      if (state != null && active) {
        this.highlight.highlight(state)
      } else {
        this.highlight.hide()
      }
    }
  }

  reset() {
    this.destory()
    this.dx = null
    this.dy = null
    this.cell = null
    this.cells = []
    this.origin = null
    this.target = null
  }

  @Disposable.dispose()
  dispose() {
    this.reset()
  }
}
