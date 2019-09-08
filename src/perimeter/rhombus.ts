import { State } from '../core'
import { intersection } from '../util'
import { Rectangle, Point } from '../struct'

export function rhombus(
  bounds: Rectangle,
  state: State,
  next: Point = new Point(),
  orthogonal: boolean = false,
) {
  const x = bounds.x
  const y = bounds.y
  const w = bounds.width
  const h = bounds.height

  const cx = x + w / 2
  const cy = y + h / 2

  const px = next.x
  const py = next.y

  // Special case for intersecting the diamond's corners
  if (cx === px) {
    if (cy > py) {
      return new Point(cx, y) // top
    }

    return new Point(cx, y + h) // bottom

  }
  if (cy === py) {
    if (cx > px) {
      return new Point(x, cy) // left
    }

    return new Point(x + w, cy) // right

  }

  let tx = cx
  let ty = cy

  if (orthogonal) {
    if (px >= x && px <= x + w) {
      tx = px
    } else if (py >= y && py <= y + h) {
      ty = py
    }
  }

  // In which quadrant will the intersection be?
  // set the slope and offset of the border line accordingly
  if (px < cx) {
    if (py < cy) {
      return intersection(px, py, tx, ty, cx, y, x, cy)!
    }

    return intersection(px, py, tx, ty, cx, y + h, x, cy)!

  }

  if (py < cy) {
    return intersection(px, py, tx, ty, cx, y, x + w, cy)!
  }

  return intersection(px, py, tx, ty, cx, y + h, x + w, cy)!
}
