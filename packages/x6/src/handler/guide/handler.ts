import { Point, Rectangle } from '../../geometry'
import * as movment from '../moving/util'
import { Cell } from '../../core/cell'
import { Guide } from './guide'
import { MouseHandler } from '../mouse-handler'
import { MouseEventEx } from '../mouse-event'
import { createGuide, isGuideEnabled } from './option'

export class GuideHandler extends MouseHandler {
  dx: number | null
  dy: number | null
  cell: Cell | null
  origin: Point | null
  bounds: Rectangle | null
  guide: Guide | null = null
  active: boolean = false

  enable() {
    this.graph.options.guide.enabled = true
    super.enable()
  }

  disable() {
    this.graph.options.guide.enabled = false
    super.disable()
  }

  mouseDown(e: MouseEventEx) {
    if (movment.isValid(this, e) && movment.canMove(this, e)) {
      this.cell = this.getCell(e)!
      this.origin = this.graph.clientToGraph(e)
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
    if (this.guide) {
      this.guide.dispose()
    }

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
      this.guide = createGuide(this.graph, states)
    }
  }

  isGuideEnabledForEvent(e: MouseEventEx | MouseEvent) {
    return isGuideEnabled({
      graph: this.graph,
      e: e instanceof MouseEventEx ? e.getEvent() : e,
    })
  }

  getStatesForGuide() {
    const parent = this.graph.getDefaultParent()
    const cells = this.graph.model.filterDescendants(
      cell =>
        this.graph.view.getState(cell) != null &&
        this.graph.model.isNode(cell) &&
        cell.geometry != null &&
        !cell.geometry.relative,
      parent,
    )

    return this.graph.view.getCellStates(cells)
  }

  @MouseHandler.dispose()
  dispose() {
    this.graph.removeHandler(this)
    this.reset()
  }
}
