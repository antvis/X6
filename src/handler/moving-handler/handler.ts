import * as util from '../../util'
import * as movment from './util'
import { RectangleShape } from '../../shape'
import { Graph, Cell, Model } from '../../core'
import { Rectangle, Point } from '../../struct'
import { MouseHandler } from '../handler-mouse'
import { CellHighlight } from '../cell-highlight'
import { MouseEventEx, DomEvent, Disposable } from '../../common'
import { applyConnectionHighlightStyle } from '../connection-handler/option'
import {
  MovingPreviewOptions,
  applyMovingPreviewStyle,
  applyDropTargetHighlightStyle,
} from './option'

export class MovingHandler extends MouseHandler {
  /**
   * Specifies the minimum number of pixels for the width and height of a
   * selection bounds.
   *
   * Default is `6`.
   */
  minimumSize: number = 6

  /**
   * Specifies if draw a html preview. If this is used then drop target
   * detection relies entirely on `graph.getCellAt` because the HTML
   * preview does not "let events through".
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

  protected onPan: (() => void) | null
  protected onEscape: (() => void) | null
  protected onRefresh: (() => void) | null

  protected dx: number | null
  protected dy: number | null

  protected cell: Cell | null
  protected cells: Cell[]
  protected target: Cell | null
  protected origin: Point | null
  protected bounds: Rectangle | null
  protected previewBounds: Rectangle | null
  protected shouldConsumeMouseUp: boolean

  protected highlight: CellHighlight | null
  protected previewShape: RectangleShape | null

  constructor(graph: Graph) {
    super(graph)
    this.config()
    this.graph.addMouseListener(this)

    // Repaints the handler after autoscroll
    this.onPan = () => this.updatePreview()
    this.graph.on(Graph.events.translate, this.onPan)

    this.onEscape = () => this.reset()
    this.graph.on(Graph.events.escape, this.onEscape)

    this.onRefresh = () => {
      if (this.origin != null) {
        try {
          this.bounds = this.graph.view.getBounds(this.cells)
          this.previewBounds = movment.getPreviewBounds(this, this.cells)
          this.updatePreview()
        } catch (e) {
          this.reset()
        }
      }
    }

    this.graph.model.on(Model.events.change, this.onRefresh)
  }

  protected config() {
    const options = this.graph.options.movingPreview as MovingPreviewOptions

    this.htmlPreview = options.html
    this.minimumSize = options.minimumSize
  }

  mouseDown(e: MouseEventEx) {
    if (movment.isValid(this, e)) {
      if (movment.canMove(this, e)) {
        this.start(e)
      }

      const cell = this.getCell(e)
      if (cell && this.graph.isCellsMovable()) {
        this.shouldConsumeMouseUp = true
        this.consume(e, DomEvent.MOUSE_DOWN)
      }
    }
  }

  protected start(e: MouseEventEx) {
    this.cell = this.getCell(e)!
    this.cells = movment.getCells(this, this.cell, e)
    this.origin = util.clientToGraph(this.graph.container, e)
    this.bounds = this.graph.view.getBounds(this.cells)
    this.previewBounds = movment.getPreviewBounds(this, this.cells)
  }

  mouseMove(e: MouseEventEx) {
    if (
      !this.isConsumed(e) &&
      this.isMouseDown() &&
      this.cell != null &&
      this.origin != null &&
      this.bounds != null
    ) {
      // Stops moving if a multi touch event is received
      if (this.isMultiTouchEvent(e)) {
        this.reset()
        return
      }

      const graph = this.graph
      const tol = graph.tolerance
      const delta = movment.getDelta(this, this.origin, e)
      let dx = delta.x
      let dy = delta.y

      if (
        this.previewShape ||
        Math.abs(dx) > tol ||
        Math.abs(dy) > tol
      ) {
        // Highlight is used for highlighting drop targets
        if (this.highlight == null) {
          this.highlight = new CellHighlight(graph)
        }

        if (this.previewShape == null) {
          this.previewShape = this.createPreview(this.bounds)
        }

        if (graph.guideHandler.active) {

          dx = graph.guideHandler.dx!
          dy = graph.guideHandler.dy!

        } else if (graph.isGridEnabledForEvent(e.getEvent())) {

          const t = graph.view.translate
          const s = graph.view.scale
          const x = (graph.snap(this.bounds.x / s - t.x) + t.x) * s
          const y = (graph.snap(this.bounds.y / s - t.y) + t.y) * s

          const tx = this.bounds.x - x
          const ty = this.bounds.y - y
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

      this.consume(e, DomEvent.MOUSE_MOVE)

      // Cancels the bubbling of events to the container so
      // that the droptarget is not reset due to an mouseMove
      // fired on the container with no associated state.
      DomEvent.consume(e.getEvent())
    }
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

  protected updatePreview() {
    if (
      this.previewShape &&
      this.previewBounds &&
      this.dx != null &&
      this.dy != null
    ) {
      const bounds = this.previewShape.bounds = new Rectangle(
        Math.round(this.previewBounds.x + this.dx - this.graph.tx),
        Math.round(this.previewBounds.y + this.dy - this.graph.ty),
        this.previewBounds.width,
        this.previewBounds.height,
      )

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

  protected isClone(e: MouseEventEx) {
    return (
      this.graph.isCloneEvent(e.getEvent()) &&
      this.graph.isCellsCloneable()
    )
  }

  protected updateDropTarget(e: MouseEventEx) {
    const graph = this.graph
    const cell = this.getCell(e)
    const clone = this.isClone(e)

    let target = null

    if (graph.isDropEnabled()) {
      // Call getCellAt to find the cell under the mouse
      target = graph.getDropTarget(this.cells, e.getEvent(), cell, clone)
    }

    let state = graph.view.getState(target)
    let active = false

    if (state && (graph.model.getParent(this.cell) !== target || clone)) {
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
        this.graph.isConnectOnDrop() &&
        cell &&
        cell.isNode() &&
        this.cells.length === 1 &&
        graph.isCellConnectable(cell)
      ) {
        state = graph.view.getState(cell)
        if (state != null) {
          const error = graph.validator.getEdgeValidationError(
            null, this.cell, cell,
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

  /**
   * Handles the event by applying the changes to the selection cells.
   */
  mouseUp(e: MouseEventEx) {
    if (!this.isConsumed(e)) {
      if (
        this.cell &&
        this.origin &&
        this.previewShape &&
        this.dx != null &&
        this.dy != null
      ) {
        const graph = this.graph
        const cell = e.getCell()
        const evt = e.getEvent()

        if (
          this.graph.isConnectOnDrop() &&
          this.target == null &&
          cell != null &&
          cell.isNode() &&
          graph.isCellConnectable(cell) &&
          graph.isEdgeValid(null, this.cell, cell)
        ) {

          graph.connectionHandler.connect(this.cell, cell, evt, null)

        } else {
          const clone = this.isClone(e)
          const target = this.target
          const scale = graph.view.scale
          const dx = movment.roundLength(this.dx / scale)
          const dy = movment.roundLength(this.dy / scale)

          if (
            target &&
            graph.isSplitEnabled() &&
            graph.isSplitTarget(target, this.cells, evt)
          ) {
            graph.splitEdge(target, this.cells, null, dx, dy)
          } else {
            this.moveCells(this.cells, dx, dy, clone, this.target, evt)
          }
        }
      }
    }

    if (this.shouldConsumeMouseUp) {
      this.consume(e, DomEvent.MOUSE_UP)
    }

    this.reset()
  }

  protected shouldRemoveCellsFromParent(
    parent: Cell | null,
    cells: Cell[],
    e: MouseEvent,
  ) {
    if (this.graph.model.isNode(parent)) {
      const pState = this.graph.view.getState(parent)
      if (pState != null) {
        let pos = util.clientToGraph(this.graph.container, e)
        const rot = util.getRotation(pState)
        if (rot !== 0) {
          const cx = pState.bounds.getCenter()
          pos = util.rotatePoint(pos, -rot, cx)
        }

        return !pState.bounds.containsPoint(pos)
      }
    }

    return false
  }

  protected shouldRemoveParent(parent: Cell) {
    const state = this.graph.view.getState(parent)
    if (
      state != null && (
        this.graph.model.isEdge(state.cell) ||
        this.graph.model.isNode(state.cell)
      ) &&
      this.graph.isCellDeletable(state.cell) &&
      this.graph.model.getChildCount(state.cell) === 0
    ) {
      const NONE = 'none'
      const stroke = state.style.stroke || NONE
      const fill = state.style.fill || NONE

      return stroke === NONE && fill === NONE
    }

    return false
  }

  protected moveCells(
    cells: Cell[],
    dx: number,
    dy: number,
    clone: boolean,
    target: Cell | null,
    evt: MouseEvent,
  ) {
    if (clone) {
      // tslint:disable-next-line
      cells = this.graph.getCloneableCells(cells)
    }

    // Removes cells from parent
    const parent = this.graph.model.getParent(this.cell)

    if (
      target == null &&
      this.graph.isRemoveCellsFromParentAllowed() &&
      this.shouldRemoveCellsFromParent(parent, cells, evt)
    ) {
      // tslint:disable-next-line
      target = this.graph.getDefaultParent()
    }

    // Cloning into locked cells is not allowed
    // tslint:disable-next-line
    clone = clone && !this.graph.isCellLocked(
      target || this.graph.getDefaultParent(),
    )

    this.graph.batchUpdate(() => {
      const parents: Cell[] = []

      // Removes parent if all child cells are removed
      if (!clone && target != null && this.graph.isAutoRemoveEmptyParent()) {
        // Collects all non-selected parents
        const dict = new WeakMap<Cell, boolean>()
        cells.forEach(cell => (dict.set(cell, true)))
        cells.forEach((cell) => {
          const parent = this.graph.model.getParent(cell)
          if (parent != null && !dict.get(parent)) {
            dict.set(parent, true)
            parents.push(parent)
          }
        })
      }

      // Passes all selected cells in order to correctly clone or move into
      // the target cell. The method checks for each cell if its movable.
      // tslint:disable-next-line
      cells = this.graph.moveCells(
        cells,
        dx - this.graph.tx / this.graph.view.scale,
        dy - this.graph.ty / this.graph.view.scale,
        clone,
        target,
        evt,
      )

      // Removes parent if all child cells are removed
      const temp = parents.filter(parent => this.shouldRemoveParent(parent))
      this.graph.removeCells(temp, false)
    })

    // Selects the new cells if cells have been cloned
    if (clone) {
      this.graph.setSelectedCells(cells)
    }

    if (
      this.graph.isCellsSelectable() &&
      this.graph.isScrollOnMove()
    ) {
      this.graph.scrollCellToVisible(cells[0])
    }
  }

  protected destoryShapes() {
    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
    }

    if (this.highlight != null) {
      this.highlight.dispose()
      this.highlight = null
    }
  }

  protected reset() {
    this.destoryShapes()
    this.dx = null
    this.dy = null
    this.origin = null
    this.cell = null
    this.target = null
    this.shouldConsumeMouseUp = false
  }

  @Disposable.aop()
  dispose() {
    this.graph.removeMouseListener(this)

    this.graph.off(Graph.events.translate, this.onPan)
    this.onPan = null

    this.graph.off(Graph.events.escape, this.onEscape)
    this.onEscape = null

    this.graph.model.off(Model.events.change, this.onRefresh)
    this.onRefresh = null

    this.destoryShapes()
  }
}
