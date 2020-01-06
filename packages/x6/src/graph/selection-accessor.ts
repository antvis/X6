import { Rectangle } from '../geometry'
import { Cell } from '../core/cell'
import { BaseGraph } from './base-graph'

export class SelectionAccessor extends BaseGraph {
  isSingleSelection() {
    return this.selection.isSingleSelection()
  }

  setSingleSelection(single: boolean) {
    this.selection.setSingleSelection(single)
    return this
  }

  isCellSelected(cell: Cell | null) {
    return this.selection.isSelected(cell)
  }

  setCellSelected(cell: Cell | null) {
    this.selection.setCell(cell)
    return this
  }

  setCellsSelected(cells: Cell[]) {
    this.selection.setCells(cells)
    return this
  }

  isSelectionEmpty() {
    return this.selection.isEmpty()
  }

  hasSelectedCell() {
    return this.selection.cells.length > 0
  }

  clearSelection() {
    return this.selection.clear()
  }

  getSelecedCellCount() {
    return this.selection.cells.length
  }

  getSelectedCell() {
    return this.selection.cells[0]
  }

  getSelectedCells() {
    return this.selection.cells.slice()
  }

  /**
   * Adds the given cell to the selection.
   */
  selectCell(cell: Cell | null) {
    this.selection.addCell(cell)
    return this
  }

  /**
   * Adds the given cells to the selection.
   */
  selectCells(cells: Cell[]) {
    this.selection.addCells(cells)
    return this
  }

  /**
   * Removes the given cell from the selection.
   */
  unSelectCell(cell: Cell | null) {
    this.selection.removeCell(cell)
    return this
  }

  /**
   * Removes the given cells from the selection.
   */
  unSelectCells(cells: Cell[]) {
    this.selection.removeCells(cells)
    return this
  }

  /**
   * Removes selected cells that are not in the model from the selection.
   */
  updateSelection() {
    this.selectionManager.updateSelection()
    return this
  }

  /**
   * Selects and returns the cells inside the given rectangle for the
   * specified event.
   */
  selectCellsInRegion(
    rect: Rectangle | Rectangle.RectangleLike,
    e: MouseEvent,
  ) {
    return this.selectionManager.selectCellsInRegion(rect, e)
  }

  selectNextCell() {
    this.selectionManager.selectCell(true)
    return this
  }

  selectPreviousCell() {
    this.selectionManager.selectCell()
    return this
  }

  selectParentCell() {
    this.selectionManager.selectCell(false, true)
    return this
  }

  selectChildCell() {
    this.selectionManager.selectCell(false, false, true)
    return this
  }

  /**
   * Selects all children of the given parent or the children of the
   * default parent if no parent is specified.
   *
   * @param parent Optional parent `Cell` whose children should be selected.
   * @param includeDescendants  Optional boolean specifying whether all
   * descendants should be selected.
   */
  selectAll(
    parent: Cell = this.getDefaultParent()!,
    includeDescendants: boolean = false,
  ) {
    this.selectionManager.selectAll(parent, includeDescendants)
    return this
  }

  /**
   * Select all nodes inside the given parent or the default parent.
   */
  selectNodes(parent: Cell = this.getDefaultParent()!) {
    this.selectionManager.selectCells(true, false, parent)
    return this
  }

  /**
   * Select all edges inside the given parent or the default parent.
   */
  selectEdges(parent: Cell = this.getDefaultParent()!) {
    this.selectionManager.selectCells(false, true, parent)
    return this
  }
}
