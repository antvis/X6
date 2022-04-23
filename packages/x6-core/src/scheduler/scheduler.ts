import { KeyValue } from '@antv/x6-common'
import { Model, Cell } from '../model'
import { View, CellView, NodeView, EdgeView } from '../view'
import { queueJob, queueFlush } from './queueJob'
// import { FlagManager } from '../view/flag'

export class Scheduler {
  protected model: Model
  protected views: KeyValue<CellView>
  protected graph: any // todo

  constructor(graph: any, model: Model) {
    this.model = model
    // todo
    this.graph = graph
    this.init()
  }

  get options() {
    return this.graph.options
  }

  get view() {
    return this.graph.view
  }

  protected init() {
    this.startListening()
  }

  protected startListening() {
    this.model.on('reseted', this.onModelReseted, this)
  }

  protected stopListening() {
    this.model.off('reseted', this.onModelReseted, this)
  }

  protected onModelReseted({ options }: Model.EventArgs['reseted']) {
    this.resetViews(this.model.getCells(), options)
  }

  protected resetViews(cells: Cell[] = [], options: any = {}) {
    this.removeViews()
    for (let i = 0, n = cells.length; i < n; i += 1) {
      queueJob({
        id: cells[i].id,
        cb: () => {
          this.renderView(cells[i], options)
        },
      })
    }
    queueFlush()
  }

  protected removeView(cell: Cell) {
    const view = this.views[cell.id]
    if (view) {
      view.remove()
    }
    return view
  }

  protected removeViews() {
    if (this.views) {
      Object.keys(this.views).forEach((id) => {
        const view = this.views[id]
        if (view) {
          this.removeView(view.cell)
        }
      })
    }
    this.views = {}
  }

  protected createCellView(cell: Cell) {
    const options = { graph: this.graph }

    const view = cell.view
    if (view != null && typeof view === 'string') {
      const def = CellView.registry.get(view)
      if (def) {
        return new def(cell, options) // eslint-disable-line new-cap
      }

      return CellView.registry.onNotFound(view)
    }

    if (cell.isNode()) {
      return new NodeView(cell, options)
    }

    if (cell.isEdge()) {
      return new EdgeView(cell, options)
    }

    return null
  }

  protected renderView(cell: Cell, options: any = {}) {
    const id = cell.id
    const views = this.views
    let flag = 0
    let view = views[id]

    if (view) {
      flag = Scheduler.FLAG_INSERT
    } else {
      const tmp = this.createCellView(cell)
      if (tmp) {
        view = views[cell.id] = tmp
        view.graph = this.graph
        flag = Scheduler.FLAG_INSERT | view.getBootstrapFlag()
      }
    }

    if (view) {
      this.updateView(view, flag, options)
    }
  }

  updateView(view: View, flag: number, options: any = {}) {
    if (view == null) {
      return 0
    }

    if (CellView.isCellView(view)) {
      if (flag & Scheduler.FLAG_REMOVE) {
        this.removeView(view.cell as any)
        return 0
      }

      if (flag & Scheduler.FLAG_INSERT) {
        this.insertView(view)
        flag ^= Scheduler.FLAG_INSERT // eslint-disable-line
      }
    }

    if (!flag) {
      return 0
    }

    return view.confirmUpdate(flag, options)
  }

  insertView(view: CellView) {
    const stage = this.view.stage
    stage.appendChild(view.container)
  }

  findViewByCell(
    cell: Cell | string | number | null | undefined,
  ): CellView | null {
    if (cell == null) {
      return null
    }
    const id = Cell.isCell(cell) ? cell.id : cell
    return this.views[id]
  }

  findViewByElem(elem: string | Element | undefined | null) {
    if (elem == null) {
      return null
    }

    const target =
      typeof elem === 'string'
        ? this.view.stage.querySelector(elem)
        : elem instanceof Element
        ? elem
        : elem[0]

    if (target) {
      const id = this.view.findAttr('data-cell-id', target)
      if (id) {
        return this.views[id]
      }
    }

    return null
  }

  dispose() {
    this.stopListening()
  }
}
export namespace Scheduler {
  export const FLAG_INSERT = 1 << 30
  export const FLAG_REMOVE = 1 << 29
  export const MOUNT_BATCH_SIZE = 1000
  export const UPDATE_BATCH_SIZE = 1000
  export const MIN_PRIORITY = 2
  export const SORT_DELAYING_BATCHES: Model.BatchName[] = [
    'add',
    'to-front',
    'to-back',
  ]
  export const UPDATE_DELAYING_BATCHES: Model.BatchName[] = ['translate']
}
