import { Point } from '../geometry'
import { DomUtil, DomEvent } from '../dom'
import { Cell } from '../core/cell'
import { Align, VAlign } from '../types'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'
import { MouseEventEx } from '../handler'

export class MovingAccessor extends BaseGraph {
  @hook()
  isCellMovable(cell: Cell | null) {
    const style = this.getStyle(cell)
    return (
      this.isCellsMovable() &&
      !this.isCellLocked(cell) &&
      style.movable !== false
    )
  }

  getMovableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.isCellMovable(cell))
  }

  moveCell(
    cell: Cell,
    dx: number = 0,
    dy: number = 0,
    clone: boolean = false,
    target?: Cell | null,
    e?: MouseEvent,
    cache?: WeakMap<Cell, Cell>,
  ) {
    return this.moveCells([cell], dx, dy, clone, target, e, cache)
  }

  /**
   * Moves or clones the specified cells and moves the cells or clones by the
   * given amount, adding them to the optional target cell.
   *
   * @param cells Array of `Cell`s to be moved, cloned or added to the target.
   * @param dx Specifies the x-coordinate of the vector. Default is `0`.
   * @param dy Specifies the y-coordinate of the vector. Default is `0`.
   * @param clone Indicating if the cells should be cloned. Default is `false`.
   * @param target The new parent of the cells.
   * @param e Mouseevent that triggered the invocation.
   * @param cache Optional mapping for existing clones.
   */
  moveCells(
    cells: Cell[],
    dx: number = 0,
    dy: number = 0,
    clone: boolean = false,
    target?: Cell | null,
    e?: MouseEvent,
    cache?: WeakMap<Cell, Cell>,
  ) {
    return this.movingManager.moveCells(cells, dx, dy, clone, target, e, cache)
  }

  /**
   * Clones and inserts the given cells into the graph.
   *
   * @param cells Array of `Cell`s to be cloned.
   * @param dx Specifies the x-coordinate of the vector. Default is `0`.
   * @param dy Specifies the y-coordinate of the vector. Default is `0`.
   * @param target The new parent of the cells.
   * @param e Mouseevent that triggered the invocation.
   * @param cache Optional mapping for existing clones.
   */
  importCells(
    cells: Cell[],
    dx: number,
    dy: number,
    target?: Cell,
    e?: MouseEvent,
    cache?: WeakMap<Cell, Cell>,
  ) {
    return this.moveCells(cells, dx, dy, true, target, e, cache)
  }

  /**
   * Moves the given cells to the front or back.
   */
  orderCells(
    toBack: boolean = false,
    cells: Cell[] = Cell.sortCells(this.getSelectedCells(), true),
  ) {
    return this.movingManager.orderCells(toBack, cells)
  }

  /**
   * Aligns the given cells vertically or horizontally according to the
   * given alignment using the optional parameter as the coordinate.
   */
  alignCells(
    align: Align | VAlign,
    cells: Cell[] = this.getSelectedCells(),
    param?: number,
  ) {
    return this.movingManager.alignCells(align, cells, param)
  }

  /**
   * Translates the geometry of the given cell and stores the new,
   * translated geometry in the model as an atomic change.
   */
  translateCell(cell: Cell, dx: number, dy: number) {
    this.movingManager.translateCell(cell, dx, dy)
  }

  /**
   * Resets the control points of the edges that are connected to the given
   * cells if not both ends of the edge are in the given cells array.
   */
  resetOtherEdges(cells: Cell[]) {
    this.movingManager.resetOtherEdges(cells)
    return this
  }

  /**
   * Resets the control points of the given edge.
   */
  resetEdge(edge: Cell) {
    this.movingManager.resetEdge(edge)
    return this
  }

  @hook()
  isSwimlane(cell: Cell | null) {
    if (cell != null) {
      if (this.model.getParent(cell) !== this.model.getRoot()) {
        const style = this.getStyle(cell)
        if (style != null && !this.model.isEdge(cell)) {
          return style.shape === 'swimlane'
        }
      }
    }
    return false
  }

  @hook()
  isValidDropTarget(target: Cell, cells: Cell[], e: MouseEvent) {
    return (
      target != null &&
      ((this.isSplitEnabled() && this.isSplitTarget(target, cells, e)) ||
        (!this.model.isEdge(target) &&
          (this.isSwimlane(target) ||
            (this.model.getChildCount(target) > 0 &&
              !this.isCellCollapsed(target)))))
    )
  }

  @hook()
  isSplitTarget(target: Cell, cells: Cell[], e: MouseEvent) {
    if (
      this.model.isEdge(target) &&
      cells != null &&
      cells.length === 1 &&
      this.isCellConnectable(cells[0]) &&
      this.validationManager.isEdgeValid(
        target,
        this.model.getTerminal(target, true),
        cells[0],
      )
    ) {
      const src = this.model.getTerminal(target, true)!
      const trg = this.model.getTerminal(target, false)!

      return (
        !this.model.isAncestor(cells[0], src) &&
        !this.model.isAncestor(cells[0], trg)
      )
    }

    return false
  }

  /**
   * Returns the given cell if it is a drop target for the given cells or the
   * nearest ancestor that may be used as a drop target for the given cells.
   *
   * @param e Mouseevent for the drag and drop.
   * @param cells Array of `Cell`s which are to be dropped onto the target.
   * @param cell `Cell` that is under the mousepointer.
   * @param clone Optional boolean to indicate of cells will be cloned.
   */
  getDropTarget(
    e: MouseEvent,
    cells: Cell[],
    cell: Cell | null,
    clone?: boolean,
  ): Cell | null {
    if (!this.isSwimlaneNesting()) {
      for (let i = 0; i < cells.length; i += 1) {
        if (this.isSwimlane(cells[i])) {
          return null
        }
      }
    }

    const p = this.clientToGraph(e)
    p.x -= this.panX
    p.y -= this.panY
    const swimlane = this.retrievalManager.getSwimlaneAt(p.x, p.y)

    let target = cell
    if (target == null) {
      target = swimlane!
    } else if (swimlane != null) {
      // Checks if the cell is an ancestor of the swimlane
      // under the mouse and uses the swimlane in that case
      let tmp = this.model.getParent(swimlane)

      while (tmp != null && this.isSwimlane(tmp) && tmp !== target) {
        tmp = this.model.getParent(tmp)
      }

      if (tmp === target) {
        target = swimlane
      }
    }

    while (
      target != null &&
      !this.isValidDropTarget(target, cells, e) &&
      !this.model.isLayer(target)
    ) {
      target = this.model.getParent(target)!
    }

    // Checks if parent is dropped into child if not cloning
    let parent = null
    if (clone == null || !clone) {
      parent = target
      while (parent != null && cells.indexOf(parent) < 0) {
        parent = this.model.getParent(parent)!
      }
    }

    return !this.model.isLayer(target) && parent == null ? target : null
  }

  clientToGraph(e: TouchEvent): Point
  clientToGraph(e: MouseEvent): Point
  clientToGraph(e: MouseEventEx): Point
  clientToGraph(x: number, y: number): Point
  clientToGraph(
    x: number | MouseEvent | TouchEvent | MouseEventEx,
    y?: number,
  ) {
    const container = this.container
    const origin = DomUtil.getScrollOrigin(container, false)
    const offset = DomUtil.getOffset(container)

    offset.x -= origin.x
    offset.y -= origin.y

    let clientX
    let clisntY

    if (x instanceof MouseEventEx) {
      clientX = x.getClientX()
      clisntY = x.getClientY()
    } else if (x instanceof Event) {
      clientX = DomEvent.getClientX(x)
      clisntY = DomEvent.getClientY(x)
    } else {
      clientX = x
      clisntY = y!
    }

    return new Point(clientX - offset.x, clisntY - offset.y)
  }
}
