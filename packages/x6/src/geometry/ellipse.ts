import { Point } from './point'
import { Line } from './line'
import { Rectangle } from './rectangle'

export class Ellipse {
  x: number
  y: number
  a: number
  b: number

  get center() {
    return new Point(this.x, this.y)
  }

  constructor(x?: number, y?: number, a?: number, b?: number) {
    this.x = x == null ? 0 : x
    this.y = y == null ? 0 : y
    this.a = a == null ? 0 : a
    this.b = b == null ? 0 : b
  }

  /**
   * Returns a rectangle that is the bounding box of the ellipse.
   */
  bbox() {
    return Rectangle.fromEllipse(this)
  }

  /**
   * Returns a point that is the center of the ellipse.
   */
  getCenter() {
    return this.center
  }

  inflate(amount: number): this
  inflate(dx: number, dy: number): this
  inflate(dx: number, dy?: number): this {
    const w = dx
    const h = dy != null ? dy : dx
    this.a += 2 * w
    this.b += 2 * h

    return this
  }

  /**
   * Returns `true` if the point `p` is inside the ellipse (inclusive).
   * Returns `false` otherwise.
   */
  containsPoint(p: Point | Point.PointLike | Point.PointData) {
    return this.normalizedDistance(p) <= 1
  }

  /**
   * Returns a normalized distance from the ellipse center to point `p`.
   * Returns `n < 1` for points inside the ellipse, `n = 1` for points
   * lying on the ellipse boundary and `n > 1` for points outside the ellipse.
   */
  normalizedDistance(p: Point | Point.PointLike | Point.PointData) {
    const ref = Point.normalize(p)
    const dx = ref.x - this.x
    const dy = ref.y - this.y
    const a = this.a
    const b = this.b

    return (dx * dx) / (a * a) + (dy * dy) / (b * b)
  }

  /**
   * Returns an array of the intersection points of the ellipse and the line.
   * Returns `null` if no intersection exists.
   */
  intersectionWithLine(line: Line) {
    const intersections = []
    const rx = this.a
    const ry = this.b
    const a1 = line.start
    const a2 = line.end
    const dir = line.vector()
    const diff = a1.diff(new Point(this.x, this.y))
    const mDir = new Point(dir.x / (rx * rx), dir.y / (ry * ry))
    const mDiff = new Point(diff.x / (rx * rx), diff.y / (ry * ry))

    const a = dir.dot(mDir)
    const b = dir.dot(mDiff)
    const c = diff.dot(mDiff) - 1.0
    const d = b * b - a * c

    if (d < 0) {
      return null
    }

    if (d > 0) {
      const root = Math.sqrt(d)
      const ta = (-b - root) / a
      const tb = (-b + root) / a

      if ((ta < 0 || 1 < ta) && (tb < 0 || 1 < tb)) {
        // outside
        return null
      }

      if (0 <= ta && ta <= 1) {
        intersections.push(a1.lerp(a2, ta))
      }

      if (0 <= tb && tb <= 1) {
        intersections.push(a1.lerp(a2, tb))
      }
    } else {
      const t = -b / a
      if (0 <= t && t <= 1) {
        intersections.push(a1.lerp(a2, t))
      } else {
        // outside
        return null
      }
    }

    return intersections
  }

  /**
   * Returns the point on the boundary of the ellipse that is the
   * intersection of the ellipse with a line starting in the center
   * of the ellipse ending in the point `p`.
   *
   * If angle is specified, the intersection will take into account
   * the rotation of the ellipse by angle degrees around its center.
   */
  intersectionWithLineFromCenterToPoint(
    p: Point | Point.PointLike | Point.PointData,
    angle: number = 0,
  ) {
    const ref = Point.normalize(p)

    if (angle) {
      ref.rotate(angle, this.getCenter())
    }

    const dx = ref.x - this.x
    const dy = ref.y - this.y
    let result

    if (dx === 0) {
      result = this.bbox().pointNearestToPoint(p)
      if (angle) {
        return result.rotate(-angle, this.getCenter())
      }
      return result
    }

    const m = dy / dx
    const mSquared = m * m
    const aSquared = this.a * this.a
    const bSquared = this.b * this.b

    let x = Math.sqrt(1 / (1 / aSquared + mSquared / bSquared))
    x = dx < 0 ? -x : x

    const y = m * x
    result = new Point(this.x + x, this.y + y)

    if (angle) return result.rotate(-angle, this.getCenter())
    return result
  }

  tangentTheta(p: Point | Point.PointLike | Point.PointData) {
    const ref = Point.normalize(p)
    const x0 = ref.x
    const y0 = ref.y
    const a = this.a
    const b = this.b
    const center = this.bbox().center
    const cx = center.x
    const cy = center.y
    const refPointDelta = 30

    const q1 = x0 > center.x + a / 2
    const q3 = x0 < center.x - a / 2

    let x
    let y

    if (q1 || q3) {
      y = x0 > center.x ? y0 - refPointDelta : y0 + refPointDelta
      x =
        (a * a) / (x0 - cx) -
        (a * a * (y0 - cy) * (y - cy)) / (b * b * (x0 - cx)) +
        cx
    } else {
      x = y0 > center.y ? x0 + refPointDelta : x0 - refPointDelta
      y =
        (b * b) / (y0 - cy) -
        (b * b * (x0 - cx) * (x - cx)) / (a * a * (y0 - cy)) +
        cy
    }

    return new Point(x, y).theta(ref)
  }

  equals(ellipse: Ellipse) {
    return (
      ellipse != null &&
      ellipse.x === this.x &&
      ellipse.y === this.y &&
      ellipse.a === this.a &&
      ellipse.b === this.b
    )
  }

  clone() {
    return new Ellipse(this.x, this.y, this.a, this.b)
  }

  toJSON() {
    return { x: this.x, y: this.y, a: this.a, b: this.b }
  }

  valueOf() {
    return this.toJSON()
  }

  toString() {
    return `${this.x} ${this.y} ${this.a} ${this.b}`
  }
}

export namespace Ellipse {
  export interface EllipseLike {
    x: number
    y: number
    a: number
    b: number
  }

  export type EllipseData = [number, number, number, number]
}

export namespace Ellipse {
  export function create(): Ellipse
  export function create(x: number): Ellipse
  export function create(x: number, y: number): Ellipse
  export function create(x: number, y: number, a: number): Ellipse
  export function create(x: number, y: number, a: number, b: number): Ellipse
  export function create(rect: Ellipse | EllipseLike | EllipseData): Ellipse
  export function create(
    x?: number | Ellipse | EllipseLike | EllipseData,
    y?: number,
    a?: number,
    b?: number,
  ): Ellipse
  export function create(
    x?: number | Ellipse | EllipseLike | EllipseData,
    y?: number,
    a?: number,
    b?: number,
  ): Ellipse {
    if (x == null || typeof x === 'number') {
      return new Ellipse(x, y, a, b)
    }

    if (Array.isArray(x)) {
      return new Ellipse(x[0], x[1], x[2], x[3])
    }

    if (x instanceof Ellipse) {
      return x.clone()
    }

    return new Ellipse(x.x, x.y, x.a, x.b)
  }

  export function fromRect(rect: Rectangle) {
    const center = rect.center
    return new Ellipse(center.x, center.y, rect.width / 2, rect.height / 2)
  }
}
