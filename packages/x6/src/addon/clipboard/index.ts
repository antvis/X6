import { Rectangle } from '../../geometry'
import { Cell } from '../../core/cell'
import { Graph } from '../../graph'

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

  let copiedSize: Rectangle | null = null

  export function setCells(v: Cell[]) {
    cells = v
  }

  export function getCells() {
    return cells
  }

  export function isEmpty() {
    return cells == null || cells.length === 0
  }

  export function copy(graph: Graph, cells: Cell[] = graph.getSelectedCells()) {
    const ret = graph.getExportableCells(graph.model.getTopmostCells(cells))
    insertCount = 1
    setCells(graph.cloneCells(ret))
    return ret
  }

  export function cut(graph: Graph, cells: Cell[] = graph.getSelectedCells()) {
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
      graph.setCellsSelected(cells)
    }

    return cells
  }

  export function pasteHere(graph: Graph) {
    if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent())) {
      graph.batchUpdate(() => {
        const cells = paste(graph)
        if (cells != null) {
          let includeEdges = true

          for (let i = 0, ii = cells.length; i < ii && includeEdges; i += 1) {
            includeEdges = graph.model.isEdge(cells[i])
          }

          const t = graph.view.translate
          const s = graph.view.scale
          let p = null

          if (cells.length === 1 && includeEdges) {
            const geo = graph.getCellGeometry(cells[0])
            if (geo != null) {
              p = geo.getTerminalPoint(true)
            }
          }

          if (p == null) {
            p = graph.getBoundingBoxFromGeometry(cells, includeEdges)
          }

          if (p != null) {
            const triggerX = graph.contextMenuHandler.triggerX
            const triggerY = graph.contextMenuHandler.triggerY
            const x = Math.round(graph.snap(triggerX / s - t.x))
            const y = Math.round(graph.snap(triggerY / s - t.y))
            const dx = x - p.x
            const dy = y - p.y
            graph.movingManager.cellsMoved(cells, dx, dy, false, false)
          }
        }
      })
    }
  }

  export function copySize(graph: Graph, cell: Cell = graph.getSelectedCell()) {
    if (graph.isEnabled() && cell != null && graph.model.isNode(cell)) {
      const geo = graph.getCellGeometry(cell)
      if (geo != null) {
        copiedSize = geo.bounds.clone()
      }
    }
  }

  export function pasteSize(graph: Graph) {
    if (graph.isEnabled() && !graph.isSelectionEmpty() && copiedSize != null) {
      graph.model.batchUpdate(() => {
        const cells = graph.getSelectedCells()
        for (let i = 0, ii = cells.length; i < ii; i += 1) {
          if (graph.model.isNode(cells[i])) {
            let geo = graph.getCellGeometry(cells[i])
            if (geo != null) {
              geo = geo.clone()
              geo.bounds.width = copiedSize!.width
              geo.bounds.height = copiedSize!.height
              graph.model.setGeometry(cells[i], geo)
            }
          }
        }
      })
    }
  }
}
