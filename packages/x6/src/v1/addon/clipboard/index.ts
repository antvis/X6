import { ArrayExt } from '../../../util'
import { Cell } from '../../core/cell'
import { Edge } from '../../core/edge'
import { Node } from '../../core/node'
import { Model } from '../../core/model'
import { Graph } from '../../core/graph'
import { Globals } from '../../core/globals'

export class Clipboard {
  protected readonly LOCAL_STORAGE_KEY = `${Globals.prefixCls}.clipboard.cells`
  protected readonly useLocalStorage: boolean
  protected options: Clipboard.Options
  protected cells: Cell[]

  copy(
    cells: Cell[],
    graph: Graph | Model,
    options: Clipboard.CopyOptions = {},
  ) {
    this.options = { ...options }
    const model = graph instanceof Graph ? graph.model : graph
    const cloned = model.cloneSubGraph(cells, options)

    // sort asc by cell type
    this.cells = ArrayExt.sortBy(
      Object.keys(cloned).map(key => cloned[key]),
      cell => (cell.isEdge() ? 2 : 1),
    )

    if (options.useLocalStorage !== false && window.localStorage) {
      const data = this.cells.map(cell => cell.toJSON())
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data))
    }
  }

  cut(
    cells: Cell[],
    graph: Graph | Model,
    options: Clipboard.CopyOptions = {},
  ) {
    this.copy(cells, graph, options)
    const model = graph instanceof Graph ? graph.model : graph
    model.executeBatch('cut', () => {
      cells.forEach(cell => cell.remove())
    })
  }

  paste(graph: Graph | Model, options: Clipboard.PasteOptions = {}) {
    const localOptions = { ...options, ...this.options }
    if (localOptions.useLocalStorage && window.localStorage) {
      const raw = localStorage.getItem(this.LOCAL_STORAGE_KEY)
      const cells = raw ? JSON.parse(raw) : []
      if (cells) {
        this.cells = Model.fromJSON(cells)
      }
    }

    const { offset, edgeProps, nodeProps } = localOptions

    let dx = 20
    let dy = 20
    if (offset) {
      dx = typeof offset === 'number' ? offset : offset.dx
      dy = typeof offset === 'number' ? offset : offset.dy
    }

    this.cells.map(cell => {
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

    const model = graph instanceof Graph ? graph.model : graph
    model.executeBatch('paste', () => {
      model.addCells(this.cells)
    })
  }

  isEmpty() {
    return this.cells.length <= 0
  }

  clean() {
    this.options = {}
    this.cells = []
    if (window.localStorage) {
      localStorage.removeItem(this.LOCAL_STORAGE_KEY)
    }
  }
}

export namespace Clipboard {
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
