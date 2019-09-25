import * as util from '../util'
import * as movment from './moving-handler-util'
import { Guide } from './guide'
import { Graph, Cell } from '../core'
import { Rectangle, Point } from '../struct'
import { MouseHandler } from './handler-mouse'
import { MouseEventEx, Disposable } from '../common'
import { isGuideEnabled, createGuide } from '../option'

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
      movment.canMove0(this, e) &&
      movment.canMove1(this, e)
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
      this.guide = createGuide(this.graph, this.getStatesForGuide())
    }
  }

  protected isGuideEnabledForEvent(e: MouseEventEx) {
    return isGuideEnabled({
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
  export interface Options {

  }
}
