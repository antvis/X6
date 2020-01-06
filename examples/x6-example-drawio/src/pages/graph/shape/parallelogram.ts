import { getFactor, getPerimeterPoint } from './util'
import {
  State,
  Shape,
  Perimeter,
  SvgCanvas2D,
  Point,
  Rectangle,
} from '@antv/x6'

export class ParallelogramShape extends Shape.Actor {
  factor = 0.2

  isRoundable() {
    return true
  }

  redrawPath(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    const dx = getFactor(this.style, this.factor, w)
    const arcSize = (this.state.style.arcSize || 20) / 2

    this.drawPoints(
      c,
      [
        new Point(0, h),
        new Point(dx, 0),
        new Point(w, 0),
        new Point(w - dx, h),
      ],
      this.rounded,
      arcSize,
      true,
    )
  }
}

export function parallelogramPerimeter(
  bounds: Rectangle,
  state: State,
  next: Point = new Point(),
  orthogonal: boolean = false,
) {
  const style = state ? state.style : {}
  const defaultFactor = ParallelogramShape.prototype.factor

  const x = bounds.x
  const y = bounds.y
  const w = bounds.width
  const h = bounds.height

  const direction = (state != null && state.style.direction) || 'east'
  const vertical = direction === 'north' || direction === 'south'

  let points: Point[]

  if (vertical) {
    const dy = getFactor(style, defaultFactor, h)
    points = [
      new Point(x, y),
      new Point(x + w, y + dy),
      new Point(x + w, y + h),
      new Point(x, y + h - dy),
      new Point(x, y),
    ]
  } else {
    const dx = getFactor(style, defaultFactor, w)
    points = [
      new Point(x + dx, y),
      new Point(x + w, y),
      new Point(x + w - dx, y + h),
      new Point(x, y + h),
      new Point(x + dx, y),
    ]
  }

  const center = bounds.getCenter()
  if (orthogonal) {
    if (next.x < x || next.x > x + w) {
      center.y = next.y
    } else {
      center.x = next.x
    }
  }

  return getPerimeterPoint(points, center, next) as Point
}

Shape.register('parallelogram', ParallelogramShape)
Perimeter.register('parallelogramPerimeter', parallelogramPerimeter)
