import { Events } from '../common'
import { Cell, Graph } from '.'
import { SelectionChange, UndoableEdit } from '../change'

export class GraphSelectionModel extends Events {
  graph: Graph
  cells: Cell[]
  private single: boolean

  constructor(graph: Graph) {
    super()
    this.graph = graph
    this.cells = []
  }

  isSingleSelection() {
    return this.single
  }

  setSingleSelection(single: boolean) {
    this.single = single
  }

  isSelected(cell: Cell) {
    if (cell != null) {
      return this.cells.includes(cell)
    }

    return false
  }

  isEmpty() {
    return this.cells.length === 0
  }

  clear() {
    this.changeSelection(null, this.cells)
  }

  setCell(cell: Cell) {
    if (cell != null) {
      this.setCells([cell])
    }
  }

  setCells(cells: Cell[]) {
    if (cells != null) {
      const arr = this.single ? [this.getFirstSelectableCell(cells)] : cells
      const added = arr.filter(cell => this.graph.isCellSelectable(cell))
      this.changeSelection(added as Cell[], this.cells)
    }
  }

  addCell(cell: Cell) {
    if (cell != null) {
      this.addCells([cell])
    }
  }

  addCells(cells: Cell[]) {
    if (cells != null) {
      let removed = null
      let candidate = cells

      if (this.single) {
        removed = this.cells
        candidate = [this.getFirstSelectableCell(cells)!]
      }

      const added = candidate.filter(cell => (
        !this.isSelected(cell) &&
        this.graph.isCellSelectable(cell)
      ))

      this.changeSelection(added, removed)
    }
  }

  removeCell(cell: Cell) {
    if (cell != null) {
      this.removeCells([cell])
    }
  }

  removeCells(cells: Cell[]) {
    if (cells != null) {
      const removed = cells.filter(cell => this.isSelected(cell))
      this.changeSelection(null, removed)
    }
  }

  private getFirstSelectableCell(cells: Cell[]) {
    if (cells != null) {
      for (let i = 0, ii = cells.length; i < ii; i += 1) {
        if (this.graph.isCellSelectable(cells[i])) {
          return cells[i]
        }
      }
    }

    return null
  }

  private changeSelection(
    added: Cell[] | null = null,
    removed: Cell[] | null = null,
  ) {
    if (
      (added != null && added.length > 0 && added[0] != null) ||
      (removed != null && removed.length > 0 && removed[0] != null)
    ) {
      const change = new SelectionChange(this, added, removed)
      change.execute()
      const edit = new UndoableEdit(this.graph.model, { significant: false })
      edit.add(change)
      this.trigger('undo', edit)
    }
  }

  doAddCell(cell: Cell) {
    if (cell != null && !this.isSelected(cell)) {
      this.cells.push(cell)
    }
  }

  doRemoveCell(cell: Cell) {
    if (cell != null) {
      const index = this.cells.indexOf(cell)
      if (index >= 0) {
        this.cells.splice(index, 1)
      }
    }
  }
}
