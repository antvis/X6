import { Angle } from './angle'
import { Point } from './point'
import { Bearing } from './types'
import { Rectangle } from './rectangle'
import { Ellipse } from './ellipse'
import { Polyline } from './polyline'
import { Path } from './path'

export class Line {
  public start: Point
  public end: Point

  get center() {
    return new Point(
      (this.start.x + this.end.x) / 2,
      (this.start.y + this.end.y) / 2,
    )
  }

  constructor(x1: number, y1: number, x2: number, y2: number)
  constructor(
    p1: Point | Point.PointLike | Point.PointData,
    p2: Point | Point.PointLike | Point.PointData,
  )
  constructor(
    x1: number | Point | Point.PointLike | Point.PointData,
    y1: number | Point | Point.PointLike | Point.PointData,
    x2?: number,
    y2?: number,
  ) {
    if (typeof x1 === 'number' && typeof y1 === 'number') {
      this.start = new Point(x1, y1)
      this.end = new Point(x2, y2)
    } else {
      this.start = Point.create(x1)
      this.end = Point.create(y1)
    }
  }

  getCenter() {
    return this.center
  }

  round(precision: number = 0) {
    this.start.round(precision)
    this.end.round(precision)
    return this
  }

  translate(tx: number, ty: number) {
    this.start.translate(tx, ty)
    this.end.translate(tx, ty)
    return this
  }

  rotate(angle: number, origin?: Point | Point.PointLike | Point.PointData) {
    this.start.rotate(angle, origin)
    this.end.rotate(angle, origin)
    return this
  }

  scale(
    sx: number,
    sy: number,
    origin?: Point | Point.PointLike | Point.PointData,
  ) {
    this.start.scale(sx, sy, origin)
    this.end.scale(sx, sy, origin)
    return this
  }

  length() {
    return Math.sqrt(this.squaredLength())
  }

  squaredLength() {
    const dx = this.start.x - this.end.x
    const dy = this.start.y - this.end.y
    return dx * dx + dy * dy
  }

  setLength(length: number) {
    const total = this.length()
    if (!total) {
      return this
    }

    const scale = length / total
    return this.scale(scale, scale, this.start)
  }

  /**
   * Returns the vector (point) of the line with length equal to
   * length of the line.
   */
  vector() {
    return new Point(this.end.x - this.start.x, this.end.y - this.start.y)
  }

  /**
   * Returns the angle of incline of the line.
   *
   * The function returns `NaN` if the two endpoints of the line
   * both lie at the same coordinates.
   */
  angle() {
    const horizontal = new Point(this.start.x + 1, this.start.y)
    return this.start.angleBetween(this.end, horizontal)
  }

  /**
   * Returns a rectangle that is the bounding box of the line.
   */
  bbox() {
    const left = Math.min(this.start.x, this.end.x)
    const top = Math.min(this.start.y, this.end.y)
    const right = Math.max(this.start.x, this.end.x)
    const bottom = Math.max(this.start.y, this.end.y)

    return new Rectangle(left, top, right - left, bottom - top)
  }

  /**
   * Returns the bearing (cardinal direction) of the line.
   *
   * The return value is one of the following strings:
   * 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW' and 'N'.
   *
   * The function returns 'N' if the two endpoints of the line are coincident.
   */
  bearing(): Bearing {
    const lat1 = Angle.toRad(this.start.y)
    const lat2 = Angle.toRad(this.end.y)
    const lon1 = this.start.x
    const lon2 = this.end.x
    const dLon = Angle.toRad(lon2 - lon1)
    const y = Math.sin(dLon) * Math.cos(lat2)
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)

    const brng = Angle.toDeg(Math.atan2(y, x))
    const bearings = ['NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N']

    let index = brng - 22.5
    if (index < 0) index += 360
    index = index / 45

    return bearings[index] as Bearing
  }

  /**
   * Returns the point on the line that lies closest to point.
   */
  closestPoint(p: Point | Point.PointLike | Point.PointData) {
    return this.pointAt(this.closestPointNormalizedLength(p))
  }

  /**
   * Returns the length of the line up to the point that lies
   * closest to point.
   */
  closestPointLength(p: Point | Point.PointLike | Point.PointData) {
    return this.closestPointNormalizedLength(p) * this.length()
  }

  /**
   * Returns a line that is tangent to the line at the point that
   * lies closest to point.
   */
  closestPointTangent(p: Point | Point.PointLike | Point.PointData) {
    return this.tangentAt(this.closestPointNormalizedLength(p))
  }

  /**
   * Returns the normalized length (distance from the start of the
   * line / total line length) of the line up to the point that lies
   * closest to point.
   */
  closestPointNormalizedLength(p: Point | Point.PointLike | Point.PointData) {
    const product = this.vector().dot(new Line(this.start, p).vector())
    const normalized = Math.min(1, Math.max(0, product / this.squaredLength()))

    // normalized returns `NaN` if this line has zero length
    if (normalized !== normalized) {
      return 0
    }

    return normalized
  }

  /**
   * Returns a point on the line that lies `rate` (normalized length)
   * away from the beginning of the line.
   */
  pointAt(ratio: number) {
    const start = this.start
    const end = this.end

    if (ratio <= 0) {
      return start.clone()
    }

    if (ratio >= 1) {
      return end.clone()
    }

    return start.lerp(end, ratio)
  }

  /**
   * Returns a point on the line that lies length away from the
   * beginning of the line.
   */
  pointAtLength(length: number) {
    const start = this.start
    const end = this.end

    let fromStart = true

    if (length < 0) {
      fromStart = false // start calculation from end point
      length = -length // tslint:disable-line
    }

    const total = this.length()
    if (length >= total) {
      return fromStart ? end.clone() : start.clone()
    }

    const rate = (fromStart ? length : total - length) / total
    return this.pointAt(rate)
  }

  /**
   * Divides the line into two lines at the point that lies `rate`
   * (normalized length) away from the beginning of the line.
   */
  divideAt(ratio: number) {
    const dividerPoint = this.pointAt(ratio)
    return [
      new Line(this.start, dividerPoint),
      new Line(dividerPoint, this.end),
    ]
  }

  /**
   * Divides the line into two lines at the point that lies length
   * away from the beginning of the line.
   */
  divideAtLength(length: number) {
    const dividerPoint = this.pointAtLength(length)
    return [
      new Line(this.start, dividerPoint),
      new Line(dividerPoint, this.end),
    ]
  }

  containsPoint(p: Point | Point.PointLike | Point.PointData) {
    const start = this.start
    const end = this.end

    // cross product of 0 indicates that this line and
    // the vector to `p` are collinear.
    if (start.cross(p, end) !== 0) {
      return false
    }

    const length = this.length()
    if (new Line(start, p).length() > length) {
      return false
    }

    if (new Line(p, end).length() > length) {
      return false
    }

    return true
  }

  intersect(geom: Line | Rectangle | Polyline | Ellipse): Point[] | null
  intersect(geom: Path, options?: Path.Options): Point[] | null
  intersect(
    geom: Line | Rectangle | Polyline | Ellipse | Path,
    options?: Path.Options,
  ): Point[] | null {
    if (geom instanceof Line) {
      const p = geom.intersectionWithLine(this)
      if (p != null) {
        return [p]
      }
    } else if (geom instanceof Path) {
      return geom.intersectionWithLine(this, options)
    } else if (
      geom instanceof Rectangle ||
      geom instanceof Ellipse ||
      geom instanceof Polyline
    ) {
      return geom.intersectionWithLine(this)
    }

    return null
  }

  /**
   * Returns the intersection point of the line with another line.
   * Returns `null` if no intersection exists.
   */
  intersectionWithLine(line: Line) {
    const pt1Dir = new Point(
      this.end.x - this.start.x,
      this.end.y - this.start.y,
    )
    const pt2Dir = new Point(
      line.end.x - line.start.x,
      line.end.y - line.start.y,
    )
    const det = pt1Dir.x * pt2Dir.y - pt1Dir.y * pt2Dir.x
    const deltaPt = new Point(
      line.start.x - this.start.x,
      line.start.y - this.start.y,
    )
    const alpha = deltaPt.x * pt2Dir.y - deltaPt.y * pt2Dir.x
    const beta = deltaPt.x * pt1Dir.y - deltaPt.y * pt1Dir.x

    if (det === 0 || alpha * det < 0 || beta * det < 0) {
      return null
    }

    if (det > 0) {
      if (alpha > det || beta > det) {
        return null
      }
    } else {
      if (alpha < det || beta < det) {
        return null
      }
    }

    return new Point(
      this.start.x + (alpha * pt1Dir.x) / det,
      this.start.y + (alpha * pt1Dir.y) / det,
    )
  }

  isDifferentiable() {
    return !this.start.equals(this.end)
  }

  /**
   * Returns the perpendicular distance between the line and point.
   * The distance is positive if the point lies to the right of the
   * line, negative if the point lies to the left of the line, and
   * `0` if the point lies on the line.
   */
  pointOffset(p: Point | Point.PointLike | Point.PointData) {
    const ref = Point.normalize(p)
    const start = this.start
    const end = this.end
    const determinant =
      (end.x - start.x) * (ref.y - start.y) -
      (end.y - start.y) * (ref.x - start.x)

    return determinant / this.length()
  }

  /**
   * Returns the squared distance between the line and the point.
   */
  pointSquaredDistance(x: number, y: number): number
  pointSquaredDistance(p: Point | Point.PointLike | Point.PointData): number
  pointSquaredDistance(
    x: number | Point | Point.PointLike | Point.PointData,
    y?: number,
  ) {
    const p = typeof x === 'number' ? { x, y: y! } : Point.normalize(x)
    return this.closestPoint(p).squaredDistance(p)
  }

  /**
   * Returns the distance between the line and the point.
   */
  pointDistance(x: number, y: number): number
  pointDistance(p: Point | Point.PointLike | Point.PointData): number
  pointDistance(
    x: number | Point | Point.PointLike | Point.PointData,
    y?: number,
  ) {
    const p = typeof x === 'number' ? { x, y: y! } : Point.normalize(x)
    return this.closestPoint(p).distance(p)
  }

  /**
   * Returns a line tangent to the line at point that lies `rate`
   * (normalized length) away from the beginning of the line.
   */
  tangentAt(ratio: number) {
    if (!this.isDifferentiable()) {
      return null
    }

    const start = this.start
    const end = this.end

    const tangentStart = this.pointAt(ratio)
    const tangentLine = new Line(start, end)
    tangentLine.translate(tangentStart.x - start.x, tangentStart.y - start.y)

    return tangentLine
  }

  /**
   * Returns a line tangent to the line at point that lies `length`
   * away from the beginning of the line.
   */
  tangentAtLength(length: number) {
    if (!this.isDifferentiable()) {
      return null
    }

    const start = this.start
    const end = this.end

    const tangentStart = this.pointAtLength(length)
    const tangentLine = new Line(start, end)
    tangentLine.translate(tangentStart.x - start.x, tangentStart.y - start.y)

    return tangentLine
  }

  /**
   * Returns which direction the line would have to rotate in order to
   * direct itself at a point.
   *
   * Returns 1 if the given point on the right side of the segment, 0 if its
   * on the segment, and -1 if the point is on the left side of the segment.
   *
   * @see https://softwareengineering.stackexchange.com/questions/165776/what-do-ptlinedist-and-relativeccw-do
   */
  relativeCcw(x: number, y: number): -1 | 0 | 1
  relativeCcw(p: Point | Point.PointLike | Point.PointData): -1 | 0 | 1
  relativeCcw(
    x: number | Point | Point.PointLike | Point.PointData,
    y?: number,
  ) {
    const ref = typeof x === 'number' ? new Point(x, y) : Point.normalize(x)

    let dx1 = ref.x - this.start.x
    let dy1 = ref.y - this.start.y
    const dx2 = this.end.x - this.start.x
    const dy2 = this.end.y - this.start.y

    let ccw = dx1 * dy2 - dy1 * dx2
    if (ccw === 0) {
      ccw = dx1 * dx2 + dy1 * dy2
      if (ccw > 0.0) {
        dx1 -= dx2
        dy1 -= dy2
        ccw = dx1 * dx2 + dy1 * dy2
        if (ccw < 0.0) {
          ccw = 0.0
        }
      }
    }

    return ccw < 0.0 ? -1 : ccw > 0.0 ? 1 : 0
  }

  equals(l: Line) {
    return (
      l != null &&
      this.start.x === l.start.x &&
      this.start.y === l.start.y &&
      this.end.x === l.end.x &&
      this.end.y === l.end.y
    )
  }

  clone() {
    return new Line(this.start, this.end)
  }

  toJSON() {
    return { start: this.start.toJSON, end: this.end.toJSON() }
  }

  valueOf() {
    return this.toJSON()
  }

  toString() {
    return `${this.start.toString()} ${this.end.toString()}`
  }
}

export namespace Line {}
