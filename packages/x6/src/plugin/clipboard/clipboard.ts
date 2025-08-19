import { ArrayExt } from '@antv/x6-common'
import { Graph } from '../../graph'
import { Cell, Node, Edge, Model } from '../../model'
import { Config } from '../../config'

export class ClipboardImpl {
  protected options: ClipboardImpl.Options
  public cells: Cell[] = []

  copy(
    cells: Cell[],
    graph: Graph | Model,
    options: ClipboardImpl.CopyOptions = {},
  ) {
    this.options = { ...options }
    const model = Model.isModel(graph) ? graph : graph.model
    const cloned = model.cloneSubGraph(cells, options)

    // sort asc by cell type
    this.cells = ArrayExt.sortBy(
      Object.keys(cloned).map((key) => cloned[key]),
      (cell) => (cell.isEdge() ? 2 : 1),
    )

    this.serialize(options)
  }

  cut(
    cells: Cell[],
    graph: Graph | Model,
    options: ClipboardImpl.CopyOptions = {},
  ) {
    this.copy(cells, graph, options)
    const model = Graph.isGraph(graph) ? graph.model : graph
    model.batchUpdate('cut', () => {
      cells.forEach((cell) => cell.remove())
    })
  }

  paste(graph: Graph | Model, options: ClipboardImpl.PasteOptions = {}) {
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

  serialize(options: ClipboardImpl.PasteOptions) {
    if (options.useLocalStorage !== false) {
      Storage.save(this.cells)
    }
  }

  deserialize(options: ClipboardImpl.PasteOptions) {
    if (options.useLocalStorage) {
      const cells = Storage.fetch()
      if (cells) {
        this.cells = cells
      }
    }
  }

  isEmpty(options: ClipboardImpl.Options = {}) {
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

export namespace ClipboardImpl {
  export interface Options {
    useLocalStorage?: boolean
  }

  export interface CopyOptions extends Options {
    deep?: boolean
  }

  export interface PasteOptions extends Options {
    /**
     * Set of properties to be set on each copied node on every `paste()` call.
     * It is defined as an object. e.g. `{ zIndex: 1 }`.
     */
    nodeProps?: Node.Properties
    /**
     * Set of properties to be set on each copied edge on every `paste()` call.
     * It is defined as an object. e.g. `{ zIndex: 1 }`.
     */
    edgeProps?: Edge.Properties

    /**
     * An increment that is added to the pasted cells position on every
     * `paste()` call. It can be either a number or an object with `dx`
     * and `dy` attributes. It defaults to `{ dx: 20, dy: 20 }`.
     */
    offset?: number | { dx: number; dy: number }
  }
}

namespace Storage {
  const LOCAL_STORAGE_KEY = `${Config.prefixCls}.clipboard.cells`

  export function save(cells: Cell[]) {
    if (window.localStorage) {
      const data = cells.map((cell) => cell.toJSON())
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
    }
  }

  export function fetch() {
    if (window.localStorage) {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
      const cells = raw ? JSON.parse(raw) : []
      if (cells) {
        return Model.fromJSON(cells)
      }
    }
  }

  export function clean() {
    if (window.localStorage) {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
  }
}
