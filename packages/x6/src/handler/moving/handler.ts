import * as util from '../../util'
import * as movment from './util'
import { Graph, Cell, Model } from '../../core'
import { MouseEventEx, DomEvent, Disposable } from '../../common'
import { MouseHandler } from '../handler-mouse'
import { Preview } from './preview'

export class MovingHandler extends MouseHandler {
  protected preview: Preview
  protected onPan: (() => void) | null
  protected onEscape: (() => void) | null
  protected onRefresh: (() => void) | null
  protected shouldConsumeMouseUp: boolean

  constructor(graph: Graph) {
    super(graph)
    this.preview = new Preview(this)
    this.onPan = () => this.preview.updatePreview()
    this.graph.on(Graph.events.pan, this.onPan)

    this.onEscape = () => this.reset()
    this.graph.on(Graph.events.escape, this.onEscape)

    this.onRefresh = () => this.preview.refresh()
    this.graph.model.on(Model.events.change, this.onRefresh)
  }

  mouseDown(e: MouseEventEx) {
    if (movment.isValid(this, e)) {
      if (movment.canMove(this, e)) {
        this.preview.start(e)
      }

      const cell = this.getCell(e)
      if (cell && this.graph.isCellsMovable()) {
        this.shouldConsumeMouseUp = true
        this.consume(e, DomEvent.MOUSE_DOWN)
      }
    }
  }

  mouseMove(e: MouseEventEx) {
    if (!this.isConsumed(e) && this.isMouseDown() && this.preview.isStarted()) {
      // Stops moving if a multi touch event is received
      if (this.isMultiTouchEvent(e)) {
        this.reset()
        return
      }

      this.preview.process(e)
      this.consume(e, DomEvent.MOUSE_MOVE)

      // Cancels the bubbling of events to the container so
      // that the droptarget is not reset due to an mouseMove
      // fired on the container with no associated state.
      DomEvent.consume(e.getEvent())
    }
  }

  mouseUp(e: MouseEventEx) {
    if (!this.isConsumed(e)) {
      if (this.preview.isStarted() && this.preview.isMoved()) {
        const graph = this.graph
        const cell = e.getCell()
        const evt = e.getEvent()
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
          const clone = this.isClone(e)
          const scale = graph.view.scale
          const dx = movment.roundLength(this.preview.dx! / scale)
          const dy = movment.roundLength(this.preview.dy! / scale)
          const cells = this.preview.cells!

          if (
            target &&
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
      this.consume(e, DomEvent.MOUSE_UP)
    }

    this.reset()
  }

  isClone(e: MouseEventEx) {
    return (
      this.graph.isCloneEvent(e.getEvent()) && this.graph.isCellsCloneable()
    )
  }

  protected shouldRemoveCellsFromParent(
    parent: Cell | null,
    cells: Cell[],
    e: MouseEvent
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

  protected moveCells(
    cells: Cell[],
    dx: number,
    dy: number,
    clone: boolean,
    target: Cell | null,
    evt: MouseEvent
  ) {
    if (clone) {
      // tslint:disable-next-line
      cells = this.graph.getCloneableCells(cells)
    }

    // Removes cells from parent
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
        cells.forEach((cell) => dict.set(cell, true))
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
        dx - this.graph.panDx / this.graph.view.scale,
        dy - this.graph.panDy / this.graph.view.scale,
        clone,
        target,
        evt
      )

      // Removes parent if all child cells are removed
      const temp = parents.filter((parent) => this.shouldRemoveParent(parent))
      this.graph.removeCells(temp, false)
    })

    // Selects the new cells if cells have been cloned
    if (clone) {
      this.graph.setSelectedCells(cells)
    }

    if (this.graph.isCellsSelectable() && this.graph.isScrollOnMove()) {
      this.graph.scrollCellToVisible(cells[0])
    }
  }

  protected reset() {
    this.preview.reset()
    this.shouldConsumeMouseUp = false
  }

  @Disposable.aop()
  dispose() {
    this.graph.removeMouseListener(this)

    this.graph.off(Graph.events.pan, this.onPan)
    this.onPan = null

    this.graph.off(Graph.events.escape, this.onEscape)
    this.onEscape = null

    this.graph.model.off(Model.events.change, this.onRefresh)
    this.onRefresh = null

    this.preview.dispose()
  }
}
