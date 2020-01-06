import { Point, Rectangle } from '../geometry'
import { State } from '../core/state'

export function ellipsePerimeter(
  bounds: Rectangle,
  state: State,
  next: Point | Point.PointLike = new Point(),
  orthogonal: boolean = false,
) {
  const x = bounds.x
  const y = bounds.y
  const a = bounds.width / 2
  const b = bounds.height / 2
  const cx = x + a
  const cy = y + b
  const px = next.x
  const py = next.y

  const dx = px - cx
  const dy = py - cy

  if (dx === 0 && dy === 0) {
    return new Point(px, py)
  }

  if (dx === 0 && dy !== 0) {
    return new Point(cx, cy + (dy > 0 ? b : -b))
  }

  if (orthogonal) {
    if (py >= y && py <= y + bounds.height) {
      const ty = py - cy
      /**
       * 椭圆标准方程 `x²/a² + y²/b² = 1`
       */
      let tx = Math.sqrt(a * a * (1 - (ty * ty) / (b * b))) || 0

      if (px <= x) {
        tx = -tx
      }

      return new Point(cx + tx, py)
    }

    if (px >= x && px <= x + bounds.width) {
      const tx = px - cx
      let ty = Math.sqrt(b * b * (1 - (tx * tx) / (a * a))) || 0

      if (py <= y) {
        ty = -ty
      }

      return new Point(px, cy + ty)
    }
  }

  /**
   * The line equation from center to point
   * `y = d * x + h`
   */
  const d = dy / dx
  const h = cy - d * cx
  /**
   * ellipse's standard equation
   * `(x-cx)²/a² + (y-cy)²/b² = 1`
   * `(x-cx)²/a² + d²(x-cx)²/b² = 1`
   */
  const m = a * a * d * d + b * b
  const n = -2 * cx * m
  const l = m * cx * cx - a * a * b * b
  /**
   * get quadratic equation `mx² + nx + l = 0`
   */
  const det = Math.sqrt(n * n - 4 * m * l)

  // two intersection points(near and far)
  const xo1 = (-n + det) / (2 * m)
  const xo2 = (-n - det) / (2 * m)
  const yo1 = d * xo1 + h
  const yo2 = d * xo2 + h

  const dist1 = Math.sqrt(Math.pow(xo1 - px, 2) + Math.pow(yo1 - py, 2))

  const dist2 = Math.sqrt(Math.pow(xo2 - px, 2) + Math.pow(yo2 - py, 2))

  const xo = dist1 < dist2 ? xo1 : xo2
  const yo = dist1 < dist2 ? yo1 : yo2
  return new Point(xo, yo)
}
