import { Cell, Graph } from '../core'

export namespace Clipboard {
  /**
  * Defines the step size to offset the cells after each paste operation.
  *
  * Default is `10`.
  */
  const STEPSIZE = 10

  /**
   * Counts the number of times the clipboard data has been inserted.
   */
  let insertCount = 1

  /**
   * Holds the array of `Cells` currently in the clipboard.
   */
  let cells: Cell[] | null = null

  export function setCells(v: Cell[]) {
    cells = v
  }

  export function getCells() {
    return cells
  }

  export function isEmpty() {
    return cells == null || cells.length === 0
  }

  export function copy(
    graph: Graph,
    cells: Cell[] = graph.getSelectedCells(),
  ) {
    const ret = graph.getExportableCells(graph.model.getTopmostCells(cells))
    insertCount = 1
    setCells(graph.cloneCells(ret))
    return ret
  }

  export function cut(graph: Graph, cells: Cell[]) {
    const ret = copy(graph, cells)
    insertCount = 0
    graph.removeCells(cells)
    return ret
  }

  export function paste(graph: Graph) {
    let cells = getCells()

    if (!isEmpty()) {
      cells = graph.getImportableCells(cells!)
      const delta = insertCount * STEPSIZE
      const parent = graph.getDefaultParent()
      cells = graph.importCells(cells, delta, delta, parent)
      // Increments the counter and selects the inserted cells
      insertCount += 1
      graph.setSelectedCells(cells)
    }

    return cells
  }
}
