/* eslint-disable @typescript-eslint/no-unused-vars */
import { Point, Rectangle } from '@antv/x6-geometry'
import { Basecoat } from '../common'
import { Model, Cell } from '../model'
import { Options } from './options'
import { Scheduler } from './scheduler'
import { CellView, GraphView } from '../view'
import { HighlightManager } from './highlight'
import { DefsManager } from './defs'
import { CoordManager } from './coord'
import { Util } from '../util'

export class Renderer extends Basecoat<Renderer.EventArgs> {
  private readonly schedule: Scheduler

  public readonly options: Options.Definition
  public readonly model: Model
  public readonly graphView: GraphView
  public readonly defs: DefsManager
  public readonly highlight: HighlightManager
  public readonly coord: CoordManager

  public get container() {
    return this.options.container
  }

  constructor(options: Options.Definition) {
    super()
    this.options = options

    this.graphView = new GraphView(this)

    if (this.options.model) {
      this.model = this.options.model
    } else {
      this.model = new Model()
      this.model.renderer = this
    }

    this.defs = new DefsManager(this)
    this.highlight = new HighlightManager(this)
    this.coord = new CoordManager(this)

    this.schedule = new Scheduler(this)
  }

  getCellById(id: string) {
    return this.model.getCell(id)
  }

  setRenderArea(area?: Rectangle) {
    this.schedule.setRenderArea(area)
  }

  defineFilter(options: DefsManager.FilterOptions) {
    return this.defs.filter(options)
  }

  defineGradient(options: DefsManager.GradientOptions) {
    return this.defs.gradient(options)
  }

  defineMarker(options: DefsManager.MarkerOptions) {
    return this.defs.marker(options)
  }

  snapToGrid(p: Point.PointLike): Point
  snapToGrid(x: number, y: number): Point
  snapToGrid(x: number | Point.PointLike, y?: number) {
    return this.coord.snapToGrid(x, y)
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
      const id = this.graphView.findAttr('data-cell-id', target)
      if (id) {
        const views = this.schedule.views
        if (views[id]) {
          return views[id].view
        }
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

  findViewsInArea(
    rect: Rectangle.RectangleLike,
    options: { strict?: boolean } = {},
  ) {
    const area = Rectangle.create(rect)
    return this.model
      .getNodes()
      .map((node) => this.findViewByCell(node))
      .filter((view) => {
        if (view) {
          const bbox = Util.getBBox(view.container as SVGElement, {
            target: this.graphView.stage,
          })
          return options.strict
            ? area.containsRect(bbox)
            : area.isIntersectWithRect(bbox)
        }
        return false
      }) as CellView[]
  }

  dispose() {
    this.graphView.dispose()
    this.schedule.dispose()
    this.highlight.dispose()
  }
}

export namespace Renderer {
  interface CommonEventArgs<E> {
    e: E
  }
  interface PositionEventArgs<E> extends CommonEventArgs<E> {
    x: number
    y: number
  }
  export interface EventArgs
    extends Omit<Model.EventArgs, 'sorted' | 'updated' | 'reseted'>,
      CellView.EventArgs {
    'model:sorted'?: Model.EventArgs['sorted']
    'model:updated': Model.EventArgs['updated']
    'model:reseted': Model.EventArgs['reseted']

    'blank:click': PositionEventArgs<JQuery.ClickEvent>
    'blank:dblclick': PositionEventArgs<JQuery.DoubleClickEvent>
    'blank:contextmenu': PositionEventArgs<JQuery.ContextMenuEvent>
    'blank:mousedown': PositionEventArgs<JQuery.MouseDownEvent>
    'blank:mousemove': PositionEventArgs<JQuery.MouseMoveEvent>
    'blank:mouseup': PositionEventArgs<JQuery.MouseUpEvent>
    'blank:mouseout': CommonEventArgs<JQuery.MouseOutEvent>
    'blank:mouseover': CommonEventArgs<JQuery.MouseOverEvent>
    'graph:mouseenter': CommonEventArgs<JQuery.MouseEnterEvent>
    'graph:mouseleave': CommonEventArgs<JQuery.MouseLeaveEvent>
    'blank:mousewheel': PositionEventArgs<JQuery.TriggeredEvent> & {
      delta: number
    }
  }
}
