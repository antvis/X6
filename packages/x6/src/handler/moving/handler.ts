import { DomEvent } from '../../dom'
import * as movment from './util'
import { Cell } from '../../core/cell'
import { State } from '../../core/state'
import { Graph } from '../../graph'
import { Preview } from './preview'
import { MouseHandler } from '../mouse-handler'
import { MouseEventEx } from '../mouse-event'

export class MovingHandler extends MouseHandler {
  protected onPan: (() => void) | null
  protected onEscape: (() => void) | null
  protected onRefresh: (() => void) | null
  protected preview: Preview
  protected shouldConsumeMouseUp: boolean

  constructor(graph: Graph) {
    super(graph)

    this.preview = new Preview(this)
    this.onPan = () => this.preview.updatePreview()
    this.graph.on('pan', this.onPan)

    this.onEscape = () => this.reset()
    this.graph.on('escape', this.onEscape)

    this.onRefresh = () => this.preview.refresh()
    this.graph.model.on('change', this.onRefresh)
  }

  mouseDown(e: MouseEventEx) {
    if (movment.isValid(this, e)) {
      if (movment.canMove(this, e)) {
        this.preview.start(e)
      }

      const cell = this.getCell(e)
      if (cell && this.graph.isCellsMovable()) {
        this.shouldConsumeMouseUp = true
        this.consume(e, 'mouseDown')
      }
    }
  }

  mouseMove(e: MouseEventEx) {
    if (!this.isConsumed(e) && this.isMouseDown() && this.preview.isStarted()) {
      // Stop moving if a multi touch event is received
      if (this.isMultiTouchEvent(e)) {
        this.reset()
        return
      }

      this.preview.process(e)
      this.consume(e, 'mouseMove')

      // Cancel the bubbling of event to the container so
      // that the droptarget is not reset due to an mouseMove
      // fired on the container with no associated state.
      DomEvent.consume(e.getEvent())
    }
  }

  mouseUp(e: MouseEventEx) {
    if (!this.isConsumed(e)) {
      if (this.preview.isStarted() && this.preview.isMoved()) {
        const cell = e.getCell()
        const evt = e.getEvent()
        const graph = this.graph
        const target = this.preview.target
        const sourceCell = this.preview.cell!

        if (
          this.graph.isConnectOnDrop() &&
          target == null &&
          cell != null &&
          cell.isNode() &&
          graph.isCellConnectable(cell) &&
          graph.isEdgeValid(null, sourceCell, cell)
        ) {
          graph.connectionHandler.connect(sourceCell, cell, evt, null)
        } else {
          const s = graph.view.scale
          const dx = movment.roundLength(this.preview.dx! / s)
          const dy = movment.roundLength(this.preview.dy! / s)
          const cells = this.preview.cells!
          const clone = this.isClone(e)

          if (
            target != null &&
            graph.isSplitEnabled() &&
            graph.isSplitTarget(target, cells, evt)
          ) {
            graph.splitEdge(target, cells, null, dx, dy)
          } else {
            this.moveCells(cells, dx, dy, clone, target, evt)
          }
        }
      }
    }

    if (this.shouldConsumeMouseUp) {
      this.consume(e, 'mouseUp')
    }

    this.reset()
  }

  isClone(e: MouseEventEx) {
    return (
      this.graph.isCloneEvent(e.getEvent()) && this.graph.isCellsCloneable()
    )
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

    // Remove cells from parent
    const parent = this.graph.model.getParent(this.preview.cell)

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
    clone =
      clone && !this.graph.isCellLocked(target || this.graph.getDefaultParent())

    this.graph.batchUpdate(() => {
      const parents: Cell[] = []

      // Removes parent if all child cells are removed
      if (!clone && target != null && this.graph.isAutoRemoveEmptyParent()) {
        // Collects all non-selected parents
        const dict = new WeakMap<Cell, boolean>()
        cells.forEach(cell => dict.set(cell, true))
        cells.forEach(cell => {
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
        dx - this.graph.panX / this.graph.view.scale,
        dy - this.graph.panY / this.graph.view.scale,
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
      this.graph.setCellsSelected(cells)
    }

    if (this.graph.isCellsSelectable() && this.graph.isScrollOnMove()) {
      this.graph.scrollCellToVisible(cells[0])
    }
  }

  protected shouldRemoveCellsFromParent(
    parent: Cell | null,
    cells: Cell[],
    e: MouseEvent,
  ) {
    if (this.graph.model.isNode(parent)) {
      const pState = this.graph.view.getState(parent)
      if (pState != null) {
        const pos = this.graph.clientToGraph(e)
        const rot = State.getRotation(pState)
        if (rot !== 0) {
          const cx = pState.bounds.getCenter()
          pos.rotate(-rot, cx)
        }

        return !pState.bounds.containsPoint(pos)
      }
    }

    return false
  }

  protected shouldRemoveParent(parent: Cell) {
    const state = this.graph.view.getState(parent)
    if (
      state != null &&
      (this.graph.model.isEdge(state.cell) ||
        this.graph.model.isNode(state.cell)) &&
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

  protected reset() {
    this.preview.reset()
    this.shouldConsumeMouseUp = false
  }

  @MouseHandler.dispose()
  dispose() {
    this.graph.removeHandler(this)

    this.graph.off('pan', this.onPan)
    this.graph.off('escape', this.onEscape)
    this.graph.model.off('change', this.onRefresh)

    this.onPan = null
    this.onEscape = null
    this.onRefresh = null

    this.preview.dispose()
  }
}
