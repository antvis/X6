import * as util from '../util'
import * as movment from './moving-handler-util'
import { Guide } from './guide'
import { Rectangle, Point } from '../struct'
import { Graph, Cell, State } from '../core'
import { MouseHandler } from './handler-mouse'
import { MouseEventEx, Disposable } from '../common'
import { StrokeStyle, OptionItem, drill } from '../option'

export class GuideHandler extends MouseHandler {
  dx: number | null
  dy: number | null
  cell: Cell | null
  origin: Point | null
  bounds: Rectangle | null
  guide: Guide | null = null
  active: boolean = false

  constructor(graph: Graph) {
    super(graph)
    this.graph.addMouseListener(this)
  }

  mouseDown(e: MouseEventEx) {
    if (
      movment.isValid(this, e) &&
      movment.canMove(this, e)
    ) {
      this.origin = util.clientToGraph(this.graph.container, e)
      this.cell = this.getCell(e)!
      this.bounds = this.graph.view.getBounds(
        movment.getCells(this, this.cell, e),
      )
    }
  }

  mouseMove(e: MouseEventEx) {
    if (this.canProcess(true)) {
      const tol = this.graph.tolerance
      const delta = movment.getDelta(this, this.origin!, e)
      if (Math.abs(delta.x) > tol || Math.abs(delta.y) > tol) {
        this.active = this.isGuideEnabledForEvent(e)
        if (this.active) {
          this.ensureGuide()
          this.updateGuide(e, delta)
        }
      } else {
        this.active = false
      }

      if (!this.active) {
        this.hideGuide()
      }
    }
  }

  mouseUp(e: MouseEventEx) {
    if (this.canProcess(false)) {
      this.reset()
    }
  }

  protected canProcess(checkMouseDown: boolean) {
    return (
      (!checkMouseDown || this.isMouseDown()) &&
      this.cell != null &&
      this.origin != null &&
      this.bounds != null
    )
  }

  protected reset() {
    this.hideGuide()
    this.dx = null
    this.dy = null
    this.cell = null
    this.guide = null
    this.origin = null
    this.bounds = null
    this.active = false
  }

  protected hideGuide() {
    if (this.guide) {
      this.guide.hide()
    }
  }

  protected updateGuide(e: MouseEventEx, delta: Point) {
    if (this.guide) {
      const gridEnabled = this.graph.isGridEnabledForEvent(e.getEvent())
      const newDelta = this.guide.move(this.bounds!, delta, gridEnabled)
      this.dx = newDelta.x
      this.dy = newDelta.y
    }
  }

  protected ensureGuide() {
    if (!this.guide) {
      const states = this.getStatesForGuide()
      this.guide = GuideHandler.createGuide(this.graph, states)
    }
  }

  protected isGuideEnabledForEvent(e: MouseEventEx) {
    return GuideHandler.isGuideEnabled({
      graph: this.graph,
      e: e.getEvent(),
    })
  }

  protected getStatesForGuide() {
    const parent = this.graph.getDefaultParent()
    const cells = this.graph.model.filterDescendants(
      cell => (
        this.graph.view.getState(cell) != null &&
        this.graph.model.isNode(cell) &&
        cell.geometry != null &&
        !cell.geometry.relative
      ),
      parent,
    )

    return this.graph.view.getCellStates(cells)
  }

  @Disposable.aop()
  dispose() {
    this.graph.removeMouseListener(this)
    this.reset()
  }
}

export namespace GuideHandler {

  export interface GuideSubOptions extends StrokeStyle<GetGuideStyleArgs> {
    /**
     * Specifies if horizontal or vertical guide are enabled.
     *
     * Default is `true`.
     */
    enabled: boolean,
    className: OptionItem<GetGuideStyleArgs, string>,
  }

  export interface GuideOptions extends StrokeStyle<GetGuideStyleArgs> {
    /**
     * Specifies if guides are enabled.
     *
     * Default is `false`.
     */
    enabled: OptionItem<IsGuideEnabledArgs, boolean>,

    /**
     * Specifies if rounded coordinates should be used.
     *
     * Default is `false`.
     */
    rounded: boolean,
    className?: OptionItem<GetGuideStyleArgs, string>,
    horizontal: Partial<GuideSubOptions> | boolean,
    vertical: Partial<GuideSubOptions> | boolean,
  }

  export interface IsGuideEnabledArgs {
    graph: Graph,
    e: MouseEvent,
  }

  export function isGuideEnabled(o: IsGuideEnabledArgs) {
    const guide = o.graph.options.guide as GuideOptions
    return drill(guide.enabled, o.graph, o)
  }

  export interface GetGuideStyleArgs {
    graph: Graph,
    cell: Cell,
    horizontal: boolean
  }

  function getGuideStrockStyle(o: GetGuideStyleArgs) {
    const graph = o.graph
    const options = o.graph.options.guide as GuideOptions
    const sub = (o.horizontal
      ? options.horizontal
      : options.vertical
    ) as GuideSubOptions

    const dashed = (sub.dashed || options.dashed)
    const stroke = (sub.stroke || options.stroke)
    const strokeWidth = (sub.strokeWidth || options.strokeWidth)
    const className = (sub.className || options.className)

    return {
      dashed: drill(dashed, graph, o),
      stroke: drill(stroke, graph, o),
      strokeWidth: drill(strokeWidth, graph, o),
      className: drill(className, graph, o),
    }
  }

  export function createGuide(graph: Graph, states: State[]) {
    const options = graph.options.guide as GuideOptions
    const horizontal = options.horizontal as GuideSubOptions
    const vertical = options.vertical as GuideSubOptions

    const guide = new Guide(
      graph,
      states,
      {
        getStrockStyle: o => getGuideStrockStyle({ ...o, graph }),
      },
    )

    guide.rounded = options.rounded

    guide.horizontal = horizontal && horizontal.enabled != null
      ? horizontal.enabled
      : true

    guide.vertical = vertical && vertical.enabled != null
      ? vertical.enabled
      : true

    return guide
  }
}
