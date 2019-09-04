import * as util from '../util'
import { Graph, State } from '../core'
import { BaseManager } from './manager-base'
import { Point, Constraint } from '../struct'

export class ConnectionManager extends BaseManager {
  constructor(graph: Graph) {
    super(graph)
  }

  getOutlineConstraint(point: Point, terminalState: State, me: any) {
    if (terminalState.shape != null) {
      const bounds = this.view.getPerimeterBounds(terminalState)
      const direction = terminalState.style.direction

      if (direction === 'north' || direction === 'south') {
        bounds.x += bounds.width / 2 - bounds.height / 2
        bounds.y += bounds.height / 2 - bounds.width / 2
        const tmp = bounds.width
        bounds.width = bounds.height
        bounds.height = tmp
      }

      const alpha = util.toRad(terminalState.shape.getShapeRotation())

      if (alpha !== 0) {
        const cos = Math.cos(-alpha)
        const sin = Math.sin(-alpha)

        const ct = new Point(bounds.getCenterX(), bounds.getCenterY())
        // tslint:disable-next-line
        point = util.rotatePoint(point, cos, sin, ct)
      }

      let sx = 1
      let sy = 1
      let dx = 0
      let dy = 0

      // LATER: Add flipping support for image shapes
      if (this.model.isNode(terminalState.cell)) {
        let flipH = terminalState.style.flipH
        let flipV = terminalState.style.flipV

        if (direction === 'north' || direction === 'south') {
          const tmp = flipH
          flipH = flipV
          flipV = tmp
        }

        if (flipH) {
          sx = -1
          dx = -bounds.width
        }

        if (flipV) {
          sy = -1
          dy = -bounds.height
        }
      }

      // tslint:disable-next-line
      point = new Point(
        (point.x - bounds.x) * sx - dx + bounds.x,
        (point.y - bounds.y) * sy - dy + bounds.y,
      )

      const x = (bounds.width === 0)
        ? 0
        : Math.round((point.x - bounds.x) * 1000 / bounds.width) / 1000

      const y = (bounds.height === 0)
        ? 0
        : Math.round((point.y - bounds.y) * 1000 / bounds.height) / 1000

      return new Constraint(new Point(x, y), false)
    }

    return null
  }
}
