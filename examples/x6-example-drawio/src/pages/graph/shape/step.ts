import { getFactor, getPerimeterPoint } from './util'
import {
  State,
  Shape,
  Perimeter,
  SvgCanvas2D,
  Style,
  Point,
  Rectangle,
} from '@antv/x6'

export class StepShape extends Shape.Actor {
  factor: number = 0.2

  isRoundable() {
    return true
  }

  redrawPath(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    const f = getFactor(this.style, this.factor, w)
    const arcSize = this.getLineArcSize()

    this.drawPoints(
      c,
      [
        new Point(0, 0),
        new Point(w - f, 0),
        new Point(w, h / 2),
        new Point(w - f, h),
        new Point(0, h),
        new Point(f, h / 2),
      ],
      this.rounded,
      arcSize,
      true,
    )

    c.end()
  }
}

export function stepPerimeter(
  bounds: Rectangle,
  state: State,
  next: Point,
  orthogonal: boolean,
) {
  const defaultFactor = StepShape.prototype.factor
  const style: Style = state ? state.style : {}

  const x = bounds.x
  const y = bounds.y
  const w = bounds.width
  const h = bounds.height

  const cx = bounds.getCenterX()
  const cy = bounds.getCenterY()

  const direction = (state != null && state.style.direction) || 'east'
  let points: Point[]

  if (direction === 'east') {
    const dx = getFactor(style, defaultFactor, w)
    points = [
      new Point(x, y),
      new Point(x + w - dx, y),
      new Point(x + w, cy),
      new Point(x + w - dx, y + h),
      new Point(x, y + h),
      new Point(x + dx, cy),
      new Point(x, y),
    ]
  } else if (direction === 'west') {
    const dx = getFactor(style, defaultFactor, w)
    points = [
      new Point(x + dx, y),
      new Point(x + w, y),
      new Point(x + w - dx, cy),
      new Point(x + w, y + h),
      new Point(x + dx, y + h),
      new Point(x, cy),
      new Point(x + dx, y),
    ]
  } else if (direction === 'north') {
    const dy = getFactor(style, defaultFactor, h)
    points = [
      new Point(x, y + dy),
      new Point(cx, y),
      new Point(x + w, y + dy),
      new Point(x + w, y + h),
      new Point(cx, y + h - dy),
      new Point(x, y + h),
      new Point(x, y + dy),
    ]
  } else {
    const dy = getFactor(style, defaultFactor, h)
    points = [
      new Point(x, y),
      new Point(cx, y + dy),
      new Point(x + w, y),
      new Point(x + w, y + h - dy),
      new Point(cx, y + h),
      new Point(x, y + h - dy),
      new Point(x, y),
    ]
  }

  const center = new Point(cx, cy)

  if (orthogonal) {
    if (next.x < x || next.x > x + w) {
      center.y = next.y
    } else {
      center.x = next.x
    }
  }

  return getPerimeterPoint(points, center, next) as Point
}

Shape.register('step', StepShape)
Perimeter.register('stepPerimeter', stepPerimeter)
