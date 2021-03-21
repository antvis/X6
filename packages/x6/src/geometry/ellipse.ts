import { Point } from './point'
import { Line } from './line'
import { Rectangle } from './rectangle'
import { Geometry } from './geometry'

export class Ellipse extends Geometry implements Ellipse.EllipseLike {
  public x: number
  public y: number
  public a: number
  public b: number

  protected get [Symbol.toStringTag]() {
    return Ellipse.toStringTag
  }

  get center() {
    return new Point(this.x, this.y)
  }

  constructor(x?: number, y?: number, a?: number, b?: number) {
    super()
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

  /**
   * Returns ellipse inflated in axis-x by `2 * amount` and in axis-y by
   * `2 * amount`.
   */
  inflate(amount: number): this
  /**
   * Returns ellipse inflated in axis-x by `2 * dx` and in axis-y by `2 * dy`.
   */
  inflate(dx: number, dy: number): this
  inflate(dx: number, dy?: number): this {
    const w = dx
    const h = dy != null ? dy : dx
    this.a += 2 * w
    this.b += 2 * h

    return this
  }

  /**
   * Returns a normalized distance from the ellipse center to point `p`.
   * Returns `n < 1` for points inside the ellipse, `n = 1` for points
   * lying on the ellipse boundary and `n > 1` for points outside the ellipse.
   */
  normalizedDistance(x: number, y: number): number
  normalizedDistance(p: Point.PointLike | Point.PointData): number
  normalizedDistance(
    x: number | Point.PointLike | Point.PointData,
    y?: number,
  ) {
    const ref = Point.create(x, y)
    const dx = ref.x - this.x
    const dy = ref.y - this.y
    const a = this.a
    const b = this.b

    return (dx * dx) / (a * a) + (dy * dy) / (b * b)
  }

  /**
   * Returns `true` if the point `p` is inside the ellipse (inclusive).
   * Returns `false` otherwise.
   */
  containsPoint(x: number, y: number): boolean
  containsPoint(p: Point.PointLike | Point.PointData): boolean
  containsPoint(x: number | Point.PointLike | Point.PointData, y?: number) {
    return this.normalizedDistance(x as number, y as number) <= 1
  }

  /**
   * Returns an array of the intersection points of the ellipse and the line.
   * Returns `null` if no intersection exists.
   */
  intersectsWithLine(line: Line) {
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

      if ((ta < 0 || ta > 1) && (tb < 0 || tb > 1)) {
        // outside
        return null
      }

      if (ta >= 0 && ta <= 1) {
        intersections.push(a1.lerp(a2, ta))
      }

      if (tb >= 0 && tb <= 1) {
        intersections.push(a1.lerp(a2, tb))
      }
    } else {
      const t = -b / a
      if (t >= 0 && t <= 1) {
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
  intersectsWithLineFromCenterToPoint(
    p: Point.PointLike | Point.PointData,
    angle = 0,
  ) {
    const ref = Point.clone(p)
    if (angle) {
      ref.rotate(angle, this.getCenter())
    }

    const dx = ref.x - this.x
    const dy = ref.y - this.y
    let result

    if (dx === 0) {
      result = this.bbox().getNearestPointToPoint(ref)
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

    if (angle) {
      return result.rotate(-angle, this.getCenter())
    }

    return result
  }

  /**
   * Returns the angle between the x-axis and the tangent from a point. It is
   * valid for points lying on the ellipse boundary only.
   */
  tangentTheta(p: Point.PointLike | Point.PointData) {
    const ref = Point.clone(p)
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

  scale(sx: number, sy: number) {
    this.a *= sx
    this.b *= sy
    return this
  }

  rotate(angle: number, origin?: Point.PointLike | Point.PointData) {
    const rect = Rectangle.fromEllipse(this)
    rect.rotate(angle, origin)
    const ellipse = Ellipse.fromRect(rect)
    this.a = ellipse.a
    this.b = ellipse.b
    this.x = ellipse.x
    this.y = ellipse.y
    return this
  }

  translate(dx: number, dy: number): this
  translate(p: Point.PointLike | Point.PointData): this
  translate(dx: number | Point.PointLike | Point.PointData, dy?: number): this {
    const p = Point.create(dx, dy)
    this.x += p.x
    this.y += p.y
    return this
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

  serialize() {
    return `${this.x} ${this.y} ${this.a} ${this.b}`
  }
}

export namespace Ellipse {
  export const toStringTag = `X6.Geometry.${Ellipse.name}`

  export function isEllipse(instance: any): instance is Ellipse {
    if (instance == null) {
      return false
    }

    if (instance instanceof Ellipse) {
      return true
    }

    const tag = instance[Symbol.toStringTag]
    const ellipse = instance as Ellipse

    if (
      (tag == null || tag === toStringTag) &&
      typeof ellipse.x === 'number' &&
      typeof ellipse.y === 'number' &&
      typeof ellipse.a === 'number' &&
      typeof ellipse.b === 'number' &&
      typeof ellipse.inflate === 'function' &&
      typeof ellipse.normalizedDistance === 'function'
    ) {
      return true
    }

    return false
  }
}

export namespace Ellipse {
  export interface EllipseLike extends Point.PointLike {
    x: number
    y: number
    a: number
    b: number
  }

  export type EllipseData = [number, number, number, number]
}

export namespace Ellipse {
  export function create(
    x?: number | Ellipse | EllipseLike | EllipseData,
    y?: number,
    a?: number,
    b?: number,
  ): Ellipse {
    if (x == null || typeof x === 'number') {
      return new Ellipse(x, y, a, b)
    }

    return parse(x)
  }

  export function parse(e: Ellipse | EllipseLike | EllipseData) {
    if (Ellipse.isEllipse(e)) {
      return e.clone()
    }

    if (Array.isArray(e)) {
      return new Ellipse(e[0], e[1], e[2], e[3])
    }

    return new Ellipse(e.x, e.y, e.a, e.b)
  }

  export function fromRect(rect: Rectangle) {
    const center = rect.center
    return new Ellipse(center.x, center.y, rect.width / 2, rect.height / 2)
  }
}
