import { Config, Graph, Cell, Node, Edge, Model, ArrayExt } from '@antv/x6'

export class ClipboardImpl {
  protected options: ClipboardImpl.Options & { action: ClipboardImpl.Action }
  public cells: Cell[] = []

  // current action
  get currentAction() {
    return this.options.action || 'none'
  }

  copy(
    cells: Cell[],
    graph: Graph | Model,
    options: ClipboardImpl.CopyOptions = {},
  ) {
    this.addToClipboard('copy', cells, graph, options)
  }

  cut(
    cells: Cell[],
    graph: Graph | Model,
    options: ClipboardImpl.CopyOptions = {},
  ) {
    this.addToClipboard('cut', cells, graph, options)
    const model = Graph.isGraph(graph) ? graph.model : graph
    model.batchUpdate('cut', () => {
      cells.forEach((cell) => cell.remove())
    })
  }

  private addToClipboard(
    action: ClipboardImpl.Action,
    cells: Cell[],
    graph: Graph | Model,
    options: ClipboardImpl.CopyOptions = {},
  ) {
    this.options = { ...options, action }
    const model = Model.isModel(graph) ? graph : graph.model
    const cloned = model.cloneSubGraph(cells, options)

    // sort asc by cell type
    this.cells = ArrayExt.sortBy(
      Object.keys(cloned).map((key) => cloned[key]),
      (cell) => (cell.isEdge() ? 2 : 1),
    )

    this.serialize(options)
  }

  paste(graph: Graph | Model, options: ClipboardImpl.PasteOptions = {}) {
    const localOptions = { ...this.options, ...options }
    if (typeof localOptions.keepCopy !== 'boolean') {
      if (localOptions.action === 'cut' && localOptions.cutOnce) {
        localOptions.keepCopy = false
      } else {
        localOptions.keepCopy = true
      }
    }
    const { offset, edgeProps, nodeProps, keepCopy } = localOptions

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
      model.addCells(this.cells, { origin: `clipboard:${this.options.action}` })
    })

    if (keepCopy) {
      this.addToClipboard(this.options.action, cells, graph, localOptions)
    } else {
      this.clean()
    }

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
    this.options = { action: 'none' }
    this.cells = []
    Storage.clean()
  }
}

export namespace ClipboardImpl {
  export type Action = 'copy' | 'cut' | 'none'

  export interface Options {
    useLocalStorage?: boolean

    cutOnce?: boolean
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

    keepCopy?: boolean
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
