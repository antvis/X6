import { Rectangle } from '../geometry'
import { Cell } from '../core/cell'
import { Graph } from '../graph'
import { BaseManager } from './base-manager'

export class SelectionManager extends BaseManager {
  constructor(graph: Graph) {
    super(graph)
  }

  private setSelectedCell(cell: Cell | null) {
    this.graph.setCellSelected(cell)
  }

  private setSelectedCells(cells: Cell[]) {
    this.graph.setCellsSelected(cells)
  }

  updateSelection() {
    const cells = this.graph.getSelectedCells()
    const removed: Cell[] = []

    cells.forEach(cell => {
      if (!this.model.contains(cell) || !this.graph.isCellVisible(cell)) {
        removed.push(cell)
      } else {
        let parent = this.model.getParent(cell)

        while (parent != null && parent !== this.view.currentRoot) {
          if (
            this.graph.isCellCollapsed(parent) ||
            !this.graph.isCellVisible(parent)
          ) {
            removed.push(cell)
            break
          }
          parent = this.model.getParent(parent)
        }
      }
    })

    if (removed.length) {
      this.graph.unSelectCells(removed)
    }
  }

  /**
   * Selects and returns the cells inside the given rectangle for the
   * specified event.
   */
  selectCellsInRegion(
    rect: Rectangle | Rectangle.RectangleLike,
    e: MouseEvent,
  ) {
    const cells = this.graph.getCellsInRegion(
      rect.x,
      rect.y,
      rect.width,
      rect.height,
    )
    this.selectCellsForEvent(cells, e)

    return cells
  }

  /**
   * Selects the next, parent, first child or previous cell.
   *
   * @param isNext Boolean indicating if the next cell should be selected.
   * @param isParent Boolean indicating if the parent cell should be selected.
   * @param isChild Boolean indicating if the first child cell should be selected.
   */
  selectCell(
    isNext: boolean = false,
    isParent: boolean = false,
    isChild: boolean = false,
  ) {
    const selection = this.graph.selection
    const cell = selection.cells.length > 0 ? selection.cells[0] : null

    if (selection.cells.length > 1) {
      selection.clear()
    }

    const parent =
      cell != null
        ? this.model.getParent(cell)!
        : this.graph.getDefaultParent()!

    const childCount = this.model.getChildCount(parent)

    if (cell == null && childCount > 0) {
      const child = this.model.getChildAt(parent, 0)!
      this.setSelectedCell(child)
    } else if (
      (cell == null || isParent) &&
      this.view.getState(parent) != null &&
      this.model.getGeometry(parent) != null
    ) {
      if (this.graph.getCurrentRoot() !== parent) {
        this.setSelectedCell(parent)
      }
    } else if (cell != null && isChild) {
      const tmp = this.model.getChildCount(cell)
      if (tmp > 0) {
        const child = this.model.getChildAt(cell, 0)!
        this.setSelectedCell(child)
      }
    } else if (childCount > 0) {
      let i = parent.getChildIndex(cell!)
      if (isNext) {
        i += 1
        const child = this.model.getChildAt(parent, i % childCount)!
        this.setSelectedCell(child)
      } else {
        i -= 1
        const index = i < 0 ? childCount - 1 : i
        const child = this.model.getChildAt(parent, index)!
        this.setSelectedCell(child)
      }
    }
  }

  selectAll(parent: Cell, includeDescendants: boolean) {
    const cells = includeDescendants
      ? this.model.filterDescendants(
          cell => cell !== parent && this.view.getState(cell) != null,
          parent,
        )
      : this.model.getChildren(parent)

    if (cells != null) {
      this.setSelectedCells(cells)
    }
  }

  /**
   * Selects all nodes and/or edges depending on the given boolean
   * arguments recursively, starting at the given parent or the default
   * parent if no parent is specified.
   *
   * @param includeNodes Indicating if nodes should be selected.
   * @param includeEdges Indicating if edges should be selected.
   * @param parent Optional parent `Cell` that acts as the root of the recursion.
   */
  selectCells(
    includeNodes: boolean,
    includeEdges: boolean,
    parent: Cell = this.graph.getDefaultParent()!,
  ) {
    const cells = this.model.filterDescendants(
      cell =>
        this.view.getState(cell) != null &&
        // nodes
        ((this.model.getChildCount(cell) === 0 &&
          this.model.isNode(cell) &&
          includeNodes &&
          !this.model.isEdge(this.model.getParent(cell))) ||
          // edges
          (this.model.isEdge(cell) && includeEdges)),
      parent,
    )

    if (cells != null) {
      this.setSelectedCells(cells)
    }
  }

  selectCellForEvent(cell: Cell | null, e: MouseEvent) {
    const isSelected = this.graph.isCellSelected(cell)

    if (this.graph.isToggleEvent(e)) {
      if (isSelected) {
        this.graph.unSelectCell(cell)
      } else {
        this.graph.selectCell(cell)
      }
    } else if (!isSelected || this.graph.getSelecedCellCount() !== 1) {
      this.setSelectedCell(cell)
    }
  }

  /**
   * Selects the given cells by either adding them to the selection or
   * replacing the selection depending on whether the given mouse event
   * is a toggle event.
   */
  selectCellsForEvent(cells: Cell[], e: MouseEvent) {
    if (this.graph.isToggleEvent(e)) {
      this.graph.selectCells(cells)
    } else {
      this.graph.setCellsSelected(cells)
    }
  }
}
