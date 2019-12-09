import { Cell } from '../core/cell'
import { Align, VAlign } from '../types'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'

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
}
