import { Point } from './point'
import { Rectangle } from './rectangle'

export function round(num: number, precision = 0) {
  return Number.isInteger(num) ? num : +num.toFixed(precision)
}

export function random(): number
export function random(max: number): number
export function random(min: number, max: number): number
export function random(min?: number, max?: number): number {
  let mmin
  let mmax

  if (max == null) {
    mmax = min == null ? 1 : min
    mmin = 0
  } else {
    mmax = max
    mmin = min == null ? 0 : min
  }

  if (mmax < mmin) {
    const temp = mmin
    mmin = mmax
    mmax = temp
  }

  return Math.floor(Math.random() * (mmax - mmin + 1) + mmin)
}

export function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) {
    return NaN
  }

  if (Number.isNaN(min) || Number.isNaN(max)) {
    return 0
  }

  return min < max
    ? value < min
      ? min
      : value > max
      ? max
      : value
    : value < max
    ? max
    : value > min
    ? min
    : value
}

export function snapToGrid(value: number, gridSize: number) {
  return gridSize * Math.round(value / gridSize)
}

export function containsPoint(
  rect: Rectangle.RectangleLike,
  point: Point.PointLike,
) {
  return (
    point != null &&
    rect != null &&
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  )
}

export function squaredLength(p1: Point.PointLike, p2: Point.PointLike) {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return dx * dx + dy * dy
}
