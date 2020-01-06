import { Point } from '../../geometry'
import { State } from '../../core/state'
import { Shape } from '../../shape'
import { Anchor } from '../../struct'
import { BaseHandler } from '../base-handler'
import { createAnchorTipShape } from './option'
import { Preview } from '../connection/preview'

export class AnchorTipHandler extends BaseHandler {
  constructor(public master: Preview) {
    super(master.graph)
  }

  protected showing: boolean
  protected shapes: Shape[] | null

  process() {
    if (
      this.master.sourceState &&
      this.master.sourcePoint &&
      this.master.sourceAnchor &&
      this.master.anchorHandler.currentState == null &&
      this.graph.options.anchorTip.enabled &&
      !this.showing
    ) {
      this.show()
    } else if (this.master.anchorHandler.currentState && this.showing) {
      this.hide()
    }
  }

  show() {
    this.showing = true
    this.shapes = []

    const sourceAnchor = this.master.sourceAnchor
    const cells = this.getCellsForTip()
    cells.forEach(cell => {
      const state = this.graph.view.getState(cell)
      if (state != null) {
        const anchors = this.graph.connectionManager.getConnectableAnchors(cell)
        if (anchors != null) {
          for (let i = 0, ii = anchors.length; i < ii; i += 1) {
            const anchor = anchors[i]
            if (sourceAnchor !== anchor) {
              const point = this.graph.view.getConnectionPoint(state, anchor)!
              this.shapes!.push(this.redrawTip(state, anchor, point))
            }
          }
        }
      }
    })
  }

  hide() {
    this.showing = false
    if (this.shapes != null) {
      this.shapes.forEach(s => s.dispose())
      this.shapes = null
    }
  }

  protected getCellsForTip() {
    const parent = this.graph.getDefaultParent()
    const cells = this.graph.model.filterDescendants(
      cell =>
        this.graph.view.getState(cell) != null &&
        this.graph.model.isNode(cell) &&
        this.graph.isCellConnectable(cell),
      parent,
    )

    return cells
  }

  protected redrawTip(
    state: State,
    anchor: Anchor,
    point: Point,
    shape?: Shape,
  ) {
    if (shape == null) {
      // tslint:disable-next-line
      shape = createAnchorTipShape({
        anchor,
        point,
        graph: this.graph,
        cell: state.cell,
      })
      shape.init(this.graph.view.getOverlayPane())
    }

    shape.bounds.x = point.x - shape.bounds.width / 2
    shape.bounds.y = point.y - shape.bounds.height / 2
    shape.redraw()

    return shape
  }
}
