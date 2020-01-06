import { Point, Rectangle, Line } from '../geometry'
import { State } from '../core/state'

export function trianglePerimeter(
  bounds: Rectangle,
  state: State,
  next: Point = new Point(),
  orthogonal: boolean = false,
) {
  const direction = state != null ? state.style.direction : null
  const vertical = direction === 'north' || direction === 'south'

  const x = bounds.x
  const y = bounds.y
  const w = bounds.width
  const h = bounds.height

  let cx = x + w / 2
  let cy = y + h / 2

  let start = new Point(x, y)
  let corner = new Point(x + w, cy)
  let end = new Point(x, y + h)

  if (direction === 'north') {
    start = end
    corner = new Point(cx, y)
    end = new Point(x + w, y + h)
  } else if (direction === 'south') {
    corner = new Point(cx, y + h)
    end = new Point(x + w, y)
  } else if (direction === 'west') {
    start = new Point(x + w, y)
    corner = new Point(x, cy)
    end = new Point(x + w, y + h)
  }

  const dx = next.x - cx
  const dy = next.y - cy

  const alpha = vertical ? Math.atan2(dx, dy) : Math.atan2(dy, dx)
  const t = vertical ? Math.atan2(w, h) : Math.atan2(h, w)

  let base = false

  if (direction === 'north' || direction === 'west') {
    base = alpha > -t && alpha < t
  } else {
    base = alpha < -Math.PI + t || alpha > Math.PI - t
  }

  let result = null

  if (base) {
    if (
      orthogonal &&
      ((vertical && next.x >= start.x && next.x <= end.x) ||
        (!vertical && next.y >= start.y && next.y <= end.y))
    ) {
      if (vertical) {
        result = new Point(next.x, start.y)
      } else {
        result = new Point(start.x, next.y)
      }
    } else {
      if (direction === 'north') {
        result = new Point(x + w / 2 + (h * Math.tan(alpha)) / 2, y + h)
      } else if (direction === 'south') {
        result = new Point(x + w / 2 - (h * Math.tan(alpha)) / 2, y)
      } else if (direction === 'west') {
        result = new Point(x + w, y + h / 2 + (w * Math.tan(alpha)) / 2)
      } else {
        result = new Point(x, y + h / 2 - (w * Math.tan(alpha)) / 2)
      }
    }
  } else {
    if (orthogonal) {
      const pt = new Point(cx, cy)

      if (next.y >= y && next.y <= y + h) {
        pt.x = vertical ? cx : direction === 'west' ? x + w : x
        pt.y = next.y
      } else if (next.x >= x && next.x <= x + w) {
        pt.x = next.x
        pt.y = !vertical ? cy : direction === 'north' ? y + h : y
      }

      cx = pt.x
      cy = pt.y
    }

    const line1 = new Line(next.x, next.y, cx, cy)
    let line2

    if (
      (vertical && next.x <= x + w / 2) ||
      (!vertical && next.y <= y + h / 2)
    ) {
      line2 = new Line(start, corner)
    } else {
      line2 = new Line(corner, end)
    }

    result = line1.intersectionWithLine(line2)
  }

  if (result == null) {
    result = new Point(cx, cy)
  }

  return result
}
