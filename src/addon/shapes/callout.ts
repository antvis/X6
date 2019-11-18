import * as util from '../../util'
import { Actor } from '../../shape'
import { SvgCanvas2D } from '../../canvas'
import { Point, Rectangle } from '../../struct'
import { State, registerShape, registerPerimeter } from '../../core'
import { rectanglePerimeter } from '../../perimeter'
import { getFactor } from './util'

export class CalloutShape extends Actor {
  base = 20
  factor = 30
  position1 = 0.5
  position2 = 0.5

  isRoundable() {
    return true
  }

  getLabelMargins() {
    return new Rectangle(
      0,
      0,
      0,
      util.getNumber(this.style, 'factor', this.factor) * this.scale,
    )
  }

  redrawPath(
    c: SvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    const arcSize = this.getLineArcSize()
    const s = getFactor(this.style, this.factor, h)
    const dx1 = getFactor(this.style, this.position1, w, 1, 'position')
    const dx2 = getFactor(this.style, this.position2, w, 1, 'position2')
    const base = getFactor(this.style, this.base, w, 1, 'base')

    this.drawPoints(
      c,
      [
        new Point(0, 0),
        new Point(w, 0),
        new Point(w, h - s),
        new Point(Math.min(w, dx1 + base), h - s),
        new Point(dx2, h),
        new Point(Math.max(0, dx1), h - s),
        new Point(0, h - s),
      ],
      this.rounded,
      arcSize,
      true,
      [4],
    )
  }
}

export function calloutPerimeter(
  bounds: Rectangle,
  state: State,
  next: Point,
  orthogonal: boolean,
) {
  const factor = getFactor(state.style, CalloutShape.prototype.factor, bounds.height)
  const rect = new Rectangle(0, 0, 0, factor * state.view.scale)
  const directedBounds = util.getDirectedBounds(bounds, rect, state.style)
  return rectanglePerimeter(directedBounds, state, next, orthogonal)
}

registerShape('callout', CalloutShape)
registerPerimeter('calloutPerimeter', calloutPerimeter)
