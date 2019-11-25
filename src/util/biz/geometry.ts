/* tslint:disable:no-parameter-reassignment */

import { getValue } from '../object'
import { State } from '../../core'
import { Direction } from '../../types'
import { Point, Rectangle } from '../../struct'

export function toRad(deg: number) {
  return Math.PI * deg / 180
}

export function toDeg(rad: number) {
  return rad * 180 / Math.PI
}

export function rotatePoint(
  point: Point | Point.PointLike,
  degree: number,
  center: Point | Point.PointLike = new Point(),
) {
  let sin = 0
  let cos = 1

  const d = degree % 360
  if (d === 90) {
    sin = 1
  } else if (d === 180) {
    cos = -1
  } else if (d === 270) {
    sin = -1
  } else {
    const rad = toRad(degree)
    sin = Math.sin(rad)
    cos = Math.cos(rad)
  }

  return rotatePointEx(point, cos, sin, center)
}

export function rotatePointEx(
  point: Point | Point.PointLike,
  cos: number,
  sin: number,
  center: Point | Point.PointLike = new Point(),
) {
  const dx = point.x - center.x
  const dy = point.y - center.y
  const x1 = dx * cos - dy * sin
  const y1 = dy * cos + dx * sin

  return new Point(x1 + center.x, y1 + center.y)
}

export function rotateRectangle(rect: Rectangle, rotation: number, cx?: Point) {
  if (rect != null && rotation != null && rotation !== 0) {
    const rad = toRad(rotation)
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)

    cx = (cx != null) ? cx : rect.getCenter()

    let p1 = new Point(rect.x, rect.y)
    let p2 = new Point(rect.x + rect.width, rect.y)
    let p3 = new Point(p2.x, rect.y + rect.height)
    let p4 = new Point(rect.x, p3.y)

    p1 = rotatePointEx(p1, cos, sin, cx)
    p2 = rotatePointEx(p2, cos, sin, cx)
    p3 = rotatePointEx(p3, cos, sin, cx)
    p4 = rotatePointEx(p4, cos, sin, cx)

    const result = new Rectangle(p1.x, p1.y, 0, 0)
    result.add(new Rectangle(p2.x, p2.y, 0, 0))
    result.add(new Rectangle(p3.x, p3.y, 0, 0))
    result.add(new Rectangle(p4.x, p4.y, 0, 0))

    return result
  }

  return rect
}

/**
 * Converts the given arc to a series of curves.
 */
export function arcToCurves(
  x0: number, y0: number,
  r1: number, r2: number,
  angle: number,
  largeArcFlag: number,
  sweepFlag: number,
  x: number,
  y: number,
) {
  if (r1 === 0 || r2 === 0) {
    return []
  }

  x -= x0
  y -= y0
  r1 = Math.abs(r1)
  r2 = Math.abs(r2)

  const fS = sweepFlag
  const psai = angle
  const ctx = -x / 2
  const cty = -y / 2
  const cpsi = Math.cos(psai * Math.PI / 180)
  const spsi = Math.sin(psai * Math.PI / 180)
  const rxd = cpsi * ctx + spsi * cty
  const ryd = -1 * spsi * ctx + cpsi * cty
  const rxdd = rxd * rxd
  const rydd = ryd * ryd
  const r1x = r1 * r1
  const r2y = r2 * r2
  const lamda = rxdd / r1x + rydd / r2y

  let sds

  if (lamda > 1) {
    r1 = Math.sqrt(lamda) * r1
    r2 = Math.sqrt(lamda) * r2
    sds = 0
  } else {
    let seif = 1
    if (largeArcFlag === fS) {
      seif = -1
    }

    sds = seif * Math.sqrt(
      (r1x * r2y - r1x * rydd - r2y * rxdd) / (r1x * rydd + r2y * rxdd),
    )
  }

  const txd = sds * r1 * ryd / r2
  const tyd = -1 * sds * r2 * rxd / r1
  const tx = cpsi * txd - spsi * tyd + x / 2
  const ty = spsi * txd + cpsi * tyd + y / 2

  let rad = Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1) - Math.atan2(0, 1)
  let s1 = (rad >= 0) ? rad : 2 * Math.PI + rad
  rad = (
    Math.atan2((-ryd - tyd) / r2, (-rxd - txd) / r1) -
    Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1)
  )
  let dr = (rad >= 0) ? rad : 2 * Math.PI + rad

  if (fS === 0 && dr > 0) {
    dr -= 2 * Math.PI
  } else if (fS !== 0 && dr < 0) {
    dr += 2 * Math.PI
  }

  const sse = dr * 2 / Math.PI
  const seg = Math.ceil(sse < 0 ? -1 * sse : sse)
  const segr = dr / seg
  const t = 8 / 3 * Math.sin(segr / 4) * Math.sin(segr / 4) / Math.sin(segr / 2)
  const cpsir1 = cpsi * r1
  const cpsir2 = cpsi * r2
  const spsir1 = spsi * r1
  const spsir2 = spsi * r2

  let mc = Math.cos(s1)
  let ms = Math.sin(s1)
  let x2 = -t * (cpsir1 * ms + spsir2 * mc)
  let y2 = -t * (spsir1 * ms - cpsir2 * mc)
  let x3 = 0
  let y3 = 0

  const result = []

  for (let n = 0; n < seg; n += 1) {
    s1 += segr
    mc = Math.cos(s1)
    ms = Math.sin(s1)

    x3 = cpsir1 * mc - spsir2 * ms + tx
    y3 = spsir1 * mc + cpsir2 * ms + ty
    const dx = -t * (cpsir1 * ms + spsir2 * mc)
    const dy = -t * (spsir1 * ms - cpsir2 * mc)

    // CurveTo updates x0, y0 so need to restore it
    const index = n * 6
    result[index] = Number(x2 + x0)
    result[index + 1] = Number(y2 + y0)
    result[index + 2] = Number(x3 - dx + x0)
    result[index + 3] = Number(y3 - dy + y0)
    result[index + 4] = Number(x3 + x0)
    result[index + 5] = Number(y3 + y0)

    x2 = x3 + dx
    y2 = y3 + dy
  }

  return result
}

/**
 * Adds the given margins to the given rectangle and rotates and flips the
 * rectangle according to the respective styles in style.
 */
export function getDirectedBounds(
  rect: Rectangle,
  m: Rectangle,
  style: any,
  flipH?: boolean,
  flipV?: boolean,
) {
  const d = getValue(style, 'direction', 'east') as Direction
  // tslint:disable-next-line:no-parameter-reassignment
  flipH = (flipH != null) ? flipH : getValue(style, 'flipH', false) as boolean
  // tslint:disable-next-line:no-parameter-reassignment
  flipV = (flipV != null) ? flipV : getValue(style, 'flipV', false) as boolean

  m.x = Math.round(Math.max(0, Math.min(rect.width, m.x)))
  m.y = Math.round(Math.max(0, Math.min(rect.height, m.y)))
  m.width = Math.round(Math.max(0, Math.min(rect.width, m.width)))
  m.height = Math.round(Math.max(0, Math.min(rect.height, m.height)))

  if (
    (flipV && (d === 'south' || d === 'north')) ||
    (flipH && (d === 'east' || d === 'west'))
  ) {
    const tmp = m.x
    m.x = m.width
    m.width = tmp
  }

  if (
    (flipH && (d === 'south' || d === 'north')) ||
    (flipV && (d === 'east' || d === 'west'))
  ) {
    const tmp = m.y
    m.y = m.height
    m.height = tmp
  }

  const m2 = Rectangle.clone(m)
  if (d === 'south') {
    m2.y = m.x
    m2.x = m.height
    m2.width = m.y
    m2.height = m.width
  } else if (d === 'west') {
    m2.y = m.height
    m2.x = m.width
    m2.width = m.x
    m2.height = m.y
  } else if (d === 'north') {
    m2.y = m.width
    m2.x = m.y
    m2.width = m.height
    m2.height = m.x
  }

  return new Rectangle(
    rect.x + m2.x,
    rect.y + m2.y,
    rect.width - m2.width - m2.x,
    rect.height - m2.height - m2.y,
  )
}

/**
 * Returns the intersection of two lines as an `Point`.
 *
 * see: https://stackoverflow.com/a/38977789
*/
export function getLinesIntersection(
  x1: number, y1: number, x2: number, y2: number, // first line
  x3: number, y3: number, x4: number, y4: number, // second line
) {
  const a = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))
  const b = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))
  const d = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1))

  // Two lines are parallel.
  if (d === 0) {
    return null
  }

  const ua = a / d
  const ub = b / d

  if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0) {
    const x = x1 + ua * (x2 - x1)
    const y = y1 + ua * (y2 - y1)

    return new Point(x, y)
  }

  // No intersection
  return null
}

export function isInHotspot(
  state: State,
  x: number,
  y: number,
  hotspot: number = 1,
  min: number = 0,
  max: number = 0,
) {
  if (hotspot > 0) {
    let cx = state.bounds.getCenterX()
    let cy = state.bounds.getCenterY()
    let w = state.bounds.width
    let h = state.bounds.height

    const start = (state.style.startSize || 0) * state.view.scale
    if (start > 0) {
      if (state.style.horizontal !== false) {
        cy = state.bounds.y + start / 2
        h = start
      } else {
        cx = state.bounds.x + start / 2
        w = start
      }
    }

    w = Math.max(min, w * hotspot)
    h = Math.max(min, h * hotspot)

    if (max > 0) {
      w = Math.min(w, max)
      h = Math.min(h, max)
    }

    const rect = new Rectangle(cx - w / 2, cy - h / 2, w, h)

    const rot = state.style.rotation || 0
    if (rot !== 0) {
      const cx = state.bounds.getCenter()
      const pt = rotatePoint(new Point(x, y), -rot, cx)
      return rect.containsPoint(pt)
    }

    return rect.containsPoint({ x, y })
  }

  return true
}

/**
 * Returns the square distance between a segment and a point. To get the
 * distance between a point and a line (with infinite length) use
 * `ptLineDist`.
 *
 * @param x1 X-coordinate of point 1 of the line.
 * @param y1 Y-coordinate of point 1 of the line.
 * @param x2 X-coordinate of point 2 of the line.
 * @param y2 Y-coordinate of point 2 of the line.
 * @param px X-coordinate of the point.
 * @param py Y-coordinate of the point.
 */
export function ptSegmentDist(
  x1: number, y1: number,
  x2: number, y2: number,
  px: number, py: number,
) {

  x2 -= x1
  y2 -= y1
  px -= x1
  py -= y1

  let dotprod = px * x2 + py * y2
  let projlenSq

  if (dotprod <= 0.0) {
    projlenSq = 0.0
  } else {
    px = x2 - px
    py = y2 - py
    dotprod = px * x2 + py * y2

    if (dotprod <= 0.0) {
      projlenSq = 0.0
    } else {
      projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2)
    }
  }

  let lenSq = px * px + py * py - projlenSq

  if (lenSq < 0) {
    lenSq = 0
  }

  return lenSq
}

/**
 * Returns the distance between a line defined by two points and a point.
 * To get the distance between a point and a segment (with a specific
 * length) use `util.ptSeqDistSq`.
 *
 * @param x1 X-coordinate of point 1 of the line.
 * @param y1 Y-coordinate of point 1 of the line.
 * @param x2 X-coordinate of point 2 of the line.
 * @param y2 Y-coordinate of point 2 of the line.
 * @param px X-coordinate of the point.
 * @param py Y-coordinate of the point.
 */
export function ptLineDist(
  x1: number, y1: number,
  x2: number, y2: number,
  px: number, py: number,
) {
  return Math.abs(
    (y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1) /
    Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1),
    )
}

/**
 * Returns 1 if the given point on the right side of the segment, 0 if its
 * on the segment, and -1 if the point is on the left side of the segment.
 *
 * @param x1 X-coordinate of the startpoint of the segment.
 * @param y1 Y-coordinate of the startpoint of the segment.
 * @param x2 X-coordinate of the endpoint of the segment.
 * @param y2 Y-coordinate of the endpoint of the segment.
 * @param px X-coordinate of the point.
 * @param py Y-coordinate of the point.
 */
export function relativeCcw(
  x1: number, y1: number,
  x2: number, y2: number,
  px: number, py: number,
) {
  x2 -= x1
  y2 -= y1
  px -= x1
  py -= y1
  let ccw = px * y2 - py * x2

  if (ccw === 0.0) {
    ccw = px * x2 + py * y2

    if (ccw > 0.0) {
      px -= x2
      py -= y2
      ccw = px * x2 + py * y2

      if (ccw < 0.0) {
        ccw = 0.0
      }
    }
  }

  return (ccw < 0.0) ? -1 : ((ccw > 0.0) ? 1 : 0)
}

export function findNearestSegment(state: State, x: number, y: number) {
  const len = state.absolutePoints.length
  let index = -1
  if (len > 0) {
    let last = state.absolutePoints[0]!
    let min = null

    for (let i = 1; i < len; i += 1) {
      const point = state.absolutePoints[i]!
      const dist = ptSegmentDist(
        last.x, last.y,
        point.x, point.y,
        x, y,
      )

      if (min == null || dist < min) {
        min = dist
        index = i - 1
      }

      last = point
    }
  }

  return index
}

export function getPerimeterPoint(pts: Point[], center: Point, point: Point) {
  let min = null

  for (let i = 0, ii = pts.length - 1; i < ii; i += 1) {
    const pt = getLinesIntersection(
      pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y,
      center.x, center.y, point.x, point.y,
    )

    if (pt != null) {
      const dx = point.x - pt.x
      const dy = point.y - pt.y
      const ip = { p: pt, distSq: dy * dy + dx * dx }

      if (ip != null && (min == null || min.distSq > ip.distSq)) {
        min = ip
      }
    }
  }

  return (min != null) ? min.p : null
}
