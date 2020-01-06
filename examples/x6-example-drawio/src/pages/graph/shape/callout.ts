import { getFactor } from './util'
import {
  State,
  Shape,
  Perimeter,
  Point,
  Rectangle,
  SvgCanvas2D,
  ObjectExt,
  Margin,
} from '@antv/x6'

export class CalloutShape extends Shape.Actor {
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
      ObjectExt.getNumber(this.style, 'factor', this.factor) * this.scale,
    )
  }

  redrawPath(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
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
  const factor = getFactor(
    state.style,
    CalloutShape.prototype.factor,
    bounds.height,
  )

  const margin: Margin = {
    left: 0,
    top: 0,
    right: 0,
    bottom: factor * state.view.scale,
  }

  const directedBounds = State.getDirectedBounds(state, bounds, margin)
  return Perimeter.rectangle(directedBounds, state, next, orthogonal)
}

Shape.register('callout', CalloutShape)
Perimeter.register('calloutPerimeter', calloutPerimeter)
