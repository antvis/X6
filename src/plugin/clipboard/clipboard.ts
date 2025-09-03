import { ArrayExt } from '../../common'
import { Graph } from '../../graph'
import { type Cell, Model } from '../../model'
import * as Storage from './storage'
import type {
  ClipboardImplCopyOptions,
  ClipboardImplOptions,
  ClipboardImplPasteOptions,
} from './type'

export class ClipboardImpl {
  protected options: ClipboardImplOptions
  public cells: Cell[] = []

  copy(
    cells: Cell[],
    graph: Graph | Model,
    options: ClipboardImplCopyOptions = {},
  ) {
    this.options = { ...options }
    const model = Model.isModel(graph) ? graph : graph.model
    const cloned = model.cloneSubGraph(cells, options)

    // sort asc by cell type
    this.cells = ArrayExt.sortBy(
      Object.keys(cloned).map((key) => cloned[key]),
      (cell: Cell) => (cell.isEdge() ? 2 : 1),
    )

    this.serialize(options)
  }

  cut(
    cells: Cell[],
    graph: Graph | Model,
    options: ClipboardImplCopyOptions = {},
  ) {
    this.copy(cells, graph, options)
    const model = Graph.isGraph(graph) ? graph.model : graph
    model.batchUpdate('cut', () => {
      cells.forEach((cell) => cell.remove())
    })
  }

  paste(graph: Graph | Model, options: ClipboardImplPasteOptions = {}) {
    const localOptions = { ...this.options, ...options }
    const { offset, edgeProps, nodeProps } = localOptions

    let dx = 20
    let dy = 20
    if (offset) {
      dx = typeof offset === 'number' ? offset : offset.dx
      dy = typeof offset === 'number' ? offset : offset.dy
    }

    this.deserialize(localOptions)
    const cells = this.cells

    cells.forEach((cell) => {
      cell.model = null
      cell.removeProp('zIndex')
      if (dx || dy) {
        cell.translate(dx, dy)
      }

      if (nodeProps && cell.isNode()) {
        cell.prop(nodeProps)
      }

      if (edgeProps && cell.isEdge()) {
        cell.prop(edgeProps)
      }
    })

    const model = Graph.isGraph(graph) ? graph.model : graph
    model.batchUpdate('paste', () => {
      model.addCells(this.cells)
    })

    this.copy(cells, graph, options)

    return cells
  }

  serialize(options: ClipboardImplPasteOptions) {
    if (options.useLocalStorage !== false) {
      Storage.save(this.cells)
    }
  }

  deserialize(options: ClipboardImplPasteOptions) {
    if (options.useLocalStorage) {
      const cells = Storage.fetch()
      if (cells) {
        this.cells = cells
      }
    }
  }

  isEmpty(options: ClipboardImplOptions = {}) {
    if (options.useLocalStorage) {
      // With useLocalStorage turned on, no real cells can be obtained without deserialize first
      // https://github.com/antvis/X6/issues/2573
      this.deserialize(options)
    }
    return this.cells.length <= 0
  }

  clean() {
    this.options = {}
    this.cells = []
    Storage.clean()
  }
}
