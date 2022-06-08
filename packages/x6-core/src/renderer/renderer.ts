/* eslint-disable @typescript-eslint/no-unused-vars */
import { Rectangle } from '@antv/x6-geometry'
import { Basecoat } from '../common'
import { Model, Cell } from '../model'
import { Options } from './options'
import { Scheduler } from '../scheduler'
import { CellView } from '../view'

export class Renderer extends Basecoat<Renderer.EventArgs> {
  public readonly options: Options.Definition
  public readonly model: Model
  protected readonly graph: any
  private readonly schedule: Scheduler

  constructor(graph: any, options: Partial<Options.Manual>) {
    super()
    this.graph = graph // todo
    this.options = Options.get(options)
    this.model = new Model()
    this.model.graph = graph // todo
    this.schedule = new Scheduler(graph, this.model) // todo
  }

  setRenderArea(area?: Rectangle) {
    this.schedule.setRenderArea(area)
  }

  findViewByElem(elem: string | Element | undefined | null) {
    if (elem == null) {
      return null
    }
    const container = this.options.container
    const target =
      typeof elem === 'string'
        ? container.querySelector(elem)
        : elem instanceof Element
        ? elem
        : elem[0]

    if (target) {
      const id = this.graph.view.findAttr('data-cell-id', target)
      if (id) {
        const views = this.schedule.views
        return views[id].view
      }
    }

    return null
  }

  findViewByCell(cellId: string | number): CellView | null
  findViewByCell(cell: Cell | null): CellView | null
  findViewByCell(
    cell: Cell | string | number | null | undefined,
  ): CellView | null {
    if (cell == null) {
      return null
    }
    const id = Cell.isCell(cell) ? cell.id : cell
    const views = this.schedule.views
    return views[id].view
  }

  requestViewUpdate(view: CellView, flag: number, options: any = {}) {
    this.schedule.requestViewUpdate(view, flag, options)
  }

  isAsync() {
    return false
  }

  dumpView(view: CellView, options: any = {}) {
    // todo
  }

  isViewMounted(view: CellView) {
    // todo
    return true
  }

  findViewsInArea(rect: Rectangle.RectangleLike, options: any = {}) {
    // todo
  }

  dispose() {
    this.schedule.dispose()
  }
}

export namespace Renderer {
  export interface EventArgs {}
}
