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
  private readonly schedule: Scheduler

  constructor(graph: any, options: Partial<Options.Manual>) {
    super()

    this.options = Options.get(options)
    this.model = new Model()
    this.model.graph = graph // todo
    this.schedule = new Scheduler(graph, this.model) // todo
  }

  findViewByElem(elem: string | Element | undefined | null) {
    return this.schedule.findViewByElem(elem)
  }

  findViewByCell(cellId: string | number): CellView | null
  findViewByCell(cell: Cell | null): CellView | null
  findViewByCell(
    cell: Cell | string | number | null | undefined,
  ): CellView | null {
    return this.schedule.findViewByCell(cell)
  }

  requestViewUpdate(
    view: CellView,
    flag: number,
    priority: number,
    options: any = {},
  ) {
    // todo
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
