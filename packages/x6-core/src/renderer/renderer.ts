import { Rectangle } from '@antv/x6-geometry'
import { Basecoat } from '../common'
import { Model, Cell } from '../model'
import { Options } from './options'
import { Schedule } from '../schedule'
import { CellView } from '../view'

export class Renderer extends Basecoat<Renderer.EventArgs> {
  public readonly options: Options.Definition
  public readonly model: Model
  private readonly schedule: Schedule

  constructor(graph: any, options: Partial<Options.Manual>) {
    super()

    this.options = Options.get(options)
    this.model = new Model()
    this.model.graph = graph // todo
    this.schedule = new Schedule(graph, this.model) // todo
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
    options: Schedule.RequestViewUpdateOptions = {},
  ) {
    return this.schedule.requestViewUpdate(view, flag, priority, options)
  }

  isAsync() {
    return this.schedule.isAsync()
  }

  dumpView(view: CellView, options: any = {}) {
    return this.schedule.dumpView(view, options)
  }

  isViewMounted(view: CellView) {
    return this.schedule.isViewMounted(view)
  }

  findViewsInArea(
    rect: Rectangle.RectangleLike,
    options: Schedule.FindViewsInAreaOptions = {},
  ) {
    return this.schedule.findViewsInArea(rect, options)
  }

  dispose() {
    this.schedule.dispose()
  }
}

export namespace Renderer {
  export interface EventArgs {}
}
