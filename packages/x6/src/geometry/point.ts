import * as util from './util'
import { Angle } from './angle'
import { Line } from './line'
import { Rectangle } from './rectangle'

export class Point {
  public x: number
  public y: number

  constructor(x?: number, y?: number) {
    this.x = x == null ? 0 : x
    this.y = y == null ? 0 : y
  }

  round(precision: number = 0) {
    this.x = util.round(this.x, precision)
    this.y = util.round(this.y, precision)
    return this
  }

  add(x: number, y: number): this
  add(p: Point | Point.PointLike | Point.PointData): this
  add(x: number | Point | Point.PointLike | Point.PointData, y?: number): this {
    if (typeof x === 'number') {
      this.x += x
      this.y += y!
    } else {
      const p = Point.normalize(x)
      this.x += p.x
      this.y += p.y
    }

    return this
  }

  update(x: number, y: number): this
  update(p: Point | Point.PointLike | Point.PointData): this
  update(
    x: number | Point | Point.PointLike | Point.PointData,
    y?: number,
  ): this {
    if (typeof x === 'number') {
      this.x = x
      this.y = y!
    } else {
      const p = Point.normalize(x)
      this.x = p.x
      this.y = p.y
    }

    return this
  }

  translate(dx: number, dy: number): this
  translate(p: Point | Point.PointLike | Point.PointData): this
  translate(
    dx: number | Point | Point.PointLike | Point.PointData,
    dy?: number,
  ): this
  translate(
    dx: number | Point | Point.PointLike | Point.PointData,
    dy?: number,
  ): this {
    if (typeof dx === 'number') {
      this.x += dx
      this.y += dy!
    } else {
      const p = Point.normalize(dx)
      this.x += p.x
      this.y += p.y
    }

    return this
  }

  rotate(angle: number, center?: Point | Point.PointLike | Point.PointData) {
    this.update(Point.rotate(this, angle, center))
    return this
  }

  scale(
    sx: number,
    sy: number,
    origin: Point | Point.PointLike | Point.PointData = new Point(),
  ) {
    const ref = Point.normalize(origin)
    this.x = ref.x + sx * (this.x - ref.x)
    this.y = ref.y + sy * (this.y - ref.y)
    return this
  }

  /**
   * Chooses the point closest to this point from among `points`.
   * If `points` is an empty array, `null` is returned.
   */
  closest(points: Point[]) {
    if (points.length === 1) {
      return points[0]
    }

    let ret = null
    let min = Infinity
    for (let i = 0, ii = points.length; i < ii; i += 1) {
      const point = points[i].clone()
      const dist = this.squaredDistance(point)
      if (dist < min) {
        ret = point
        min = dist
      }
    }

    return ret
  }

  distance(p: Point | Point.PointLike | Point.PointData) {
    const ref = Point.normalize(p)
    return new Line(this, ref).length()
  }

  squaredDistance(p: Point | Point.PointLike | Point.PointData) {
    const ref = Point.normalize(p)
    return new Line(this, ref).squaredLength()
  }

  manhattanDistance(p: Point | Point.PointLike | Point.PointData) {
    const ref = Point.normalize(p)
    return Math.abs(ref.x - this.x) + Math.abs(ref.y - this.y)
  }

  /**
   * Returns the magnitude of the point vector.
   *
   * @see http://en.wikipedia.org/wiki/Magnitude_(mathematics)
   */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y) || 0.01
  }

  /**
   * Compute the angle between me and `p` and the x axis.
   * @param p The point the compute with.
   * @return The angle in degrees.
   */
  theta(p: Point | Point.PointLike | Point.PointData = new Point()): number {
    const ref = Point.normalize(p)
    const y = -(ref.y - this.y) // invert the y-axis.
    const x = ref.x - this.x
    let rad = Math.atan2(y, x)

    // Correction for III. and IV. quadrant.
    if (rad < 0) {
      rad = 2 * Math.PI + rad
    }

    return (180 * rad) / Math.PI
  }

  /**
   * Computes the angle between vector from me to `p1` and the
   * vector from me to `p2`.
   *
   * Ordering of points `p1` and `p2` is important!
   */
  angleBetween(
    p1: Point | Point.PointLike | Point.PointData,
    p2: Point | Point.PointLike | Point.PointData,
  ) {
    if (this.equals(p1) || this.equals(p2)) {
      return NaN
    }

    let angle = this.theta(p2) - this.theta(p1)
    if (angle < 0) {
      angle += 360
    }

    return angle
  }

  /**
   * Computes the angle between the vector from `0,0` to me and the
   * vector from `0,0` to `p`. Returns `NaN` if `p` is at `0,0`.
   *
   * @returns the angle in degrees. `NaN` if `p` is at `0,0`.
   */
  vectorAngle(p: Point | Point.PointLike | Point.PointData) {
    const zero = new Point(0, 0)
    return zero.angleBetween(this, p)
  }

  /**
   * Converts rectangular to polar coordinates.
   *
   * @param origin If not specified, it is considered to be `0,0`.
   */
  toPolar(origin?: Point | Point.PointLike | Point.PointData) {
    this.update(Point.toPolar(this, origin))
    return this
  }

  /**
   * Returns the change in angle from my previous position `-dx,-dy`
   * to my new position relative to `ref` point.
   */
  changeInAngle(
    dx: number,
    dy: number,
    ref: Point | Point.PointLike | Point.PointData,
  ) {
    // Revert the translation and measure the change in angle around x-axis.
    return (
      this.clone()
        .translate(-dx, -dy)
        .theta(ref) - this.theta(ref)
    )
  }

  adhereToRect(rect: Rectangle) {
    if (rect.containsPoint(this)) {
      return this
    }

    this.x = Math.min(Math.max(this.x, rect.x), rect.x + rect.width)
    this.y = Math.min(Math.max(this.y, rect.y), rect.y + rect.height)

    return this
  }

  /**
   * Returns the bearing between me and the given point.
   */
  bearing(p: Point | Point.PointLike | Point.PointData) {
    const ref = Point.normalize(p)
    return new Line(this, ref).bearing()
  }

  /**
   * Returns the cross product of the vector from the point passing
   * through `p1` and the vector from the point passing through `p2`.
   *
   * The left-hand rule is used because the coordinate system is left-handed.
   */
  cross(
    p1: Point | Point.PointLike | Point.PointData,
    p2: Point | Point.PointLike | Point.PointData,
  ) {
    if (p1 != null && p2 != null) {
      const a = Point.normalize(p1)
      const b = Point.normalize(p2)
      return (b.x - this.x) * (a.y - this.y) - (b.y - this.y) * (a.x - this.x)
    }

    return NaN
  }

  /**
   * Returns the dot product of this point with given other point.
   */
  dot(p: Point | Point.PointLike | Point.PointData) {
    const ref = Point.normalize(p)
    return this.x * ref.x + this.y * ref.y
  }

  diff(dx: number, dy: number): Point
  diff(p: Point | Point.PointLike | Point.PointData): Point
  diff(
    dx: number | Point | Point.PointLike | Point.PointData,
    dy?: number,
  ): Point {
    if (typeof dx === 'number') {
      return new Point(this.x - dx, this.y - dy!)
    }

    const p = Point.normalize(dx)
    return new Point(this.x - p.x, this.y - p.y)
  }

  /**
   * Returns an interpolation between me and point `p` for a
   * parametert in the closed interval `[0, 1]`.
   */
  lerp(p: Point | Point.PointLike | Point.PointData, t: number) {
    const x = this.x
    const y = this.y
    const ref = Point.normalize(p)
    return new Point((1 - t) * x + t * ref.x, (1 - t) * y + t * ref.y)
  }

  normalize(length: number = 1) {
    const scale = length / this.magnitude()
    return this.scale(scale, scale)
  }

  move(ref: Point | Point.PointLike | Point.PointData, distance: number) {
    const p = Point.normalize(ref)
    const rad = Angle.toRad(p.theta(this))
    return this.translate(Math.cos(rad) * distance, -Math.sin(rad) * distance)
  }

  reflection(ref: Point | Point.PointLike | Point.PointData) {
    const p = Point.normalize(ref)
    return p.move(this, this.distance(p))
  }

  snapToGrid(gridSize: number): this
  snapToGrid(gx: number, gy: number): this
  snapToGrid(gx: number, gy?: number): this
  snapToGrid(gx: number, gy?: number): this {
    this.x = util.snapToGrid(this.x, gx)
    this.y = util.snapToGrid(this.y, gy == null ? gx : gy)
    return this
  }

  equals(p: Point | Point.PointLike | Point.PointData) {
    const ref = Point.normalize(p)
    return ref != null && ref.x === this.x && ref.y === this.y
  }

  clone() {
    return new Point(this.x, this.y)
  }

  toJSON() {
    return { x: this.x, y: this.y }
  }

  valueOf() {
    return this.toJSON()
  }

  toString() {
    return `${this.x} ${this.y}`
  }
}

export namespace Point {
  export interface PointLike {
    x: number
    y: number
  }

  export type PointData = [number, number]
}

export namespace Point {
  export function create(): Point
  export function create(x: number): Point
  export function create(x: number, y: number): Point
  export function create(p: Point | PointLike | PointData): Point
  export function create(
    x?: number | Point | PointLike | PointData,
    y?: number,
  ): Point
  export function create(
    x?: number | Point | PointLike | PointData,
    y?: number,
  ): Point {
    if (x == null || typeof x === 'number') {
      return new Point(x, y)
    }

    if (Array.isArray(x)) {
      return new Point(x[0], x[1])
    }

    if (x instanceof Point) {
      return x.clone()
    }

    return new Point(x.x, x.y)
  }

  export function normalize(p: Point | PointLike | PointData) {
    return p instanceof Point ? p : create(p)
  }

  /**
   * Returns a new Point object from the given polar coordinates.
   * @see http://en.wikipedia.org/wiki/Polar_coordinate_system
   */
  export function fromPolar(
    r: number,
    rad: number,
    origin: Point | PointLike | PointData = new Point(),
  ) {
    let x = Math.abs(r * Math.cos(rad))
    let y = Math.abs(r * Math.sin(rad))
    const org = normalize(origin)
    const deg = Angle.normalize(Angle.toDeg(rad))

    if (deg < 90) {
      y = -y
    } else if (deg < 180) {
      x = -x
      y = -y
    } else if (deg < 270) {
      x = -x
    }

    return new Point(org.x + x, org.y + y)
  }

  export function toPolar(
    point: Point | PointLike | PointData,
    origin: Point | PointLike | PointData = new Point(),
  ) {
    const p = normalize(point)
    const o = normalize(origin)
    const dx = p.x - o.x
    const dy = p.y - o.y
    return new Point(
      Math.sqrt(dx * dx + dy * dy), // r
      Angle.toRad(o.theta(p)),
    )
  }

  export function equalPoints(p1: Point[], p2: Point[]) {
    if (
      (p1 == null && p2 != null) ||
      (p1 != null && p2 == null) ||
      (p1 != null && p2 != null && p1.length !== p2.length)
    ) {
      return false
    }

    if (p1 != null && p2 != null) {
      for (let i = 0, ii = p1.length; i < ii; i += 1) {
        if (p1[i] === p2[i] || (p1[i] != null && !p1[i].equals(p2[i]))) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Create a point with random coordinates that fall within
   * the range `[x1, x2]` and `[y1, y2]`.
   */
  export function random(x1: number, x2: number, y1: number, y2: number) {
    new Point(util.random(x1, x2), util.random(y1, y2))
  }

  export function rotate(
    point: Point | PointLike | PointData,
    angle: number,
    center?: Point | PointLike | PointData,
  ) {
    let sin = 0
    let cos = 1

    const degree = Angle.normalize(-angle)
    if (degree === 90) {
      sin = 1
    } else if (degree === 180) {
      cos = -1
    } else if (degree === 270) {
      sin = -1
    } else {
      const rad = Angle.toRad(degree)
      sin = Math.sin(rad)
      cos = Math.cos(rad)
    }

    return rotateEx(point, cos, sin, center)
  }

  export function rotateEx(
    point: Point | PointLike | PointData,
    cos: number,
    sin: number,
    center: Point | PointLike | PointData = new Point(),
  ) {
    const source = normalize(point)
    const origin = normalize(center)
    const dx = source.x - origin.x
    const dy = source.y - origin.y
    const x1 = dx * cos - dy * sin
    const y1 = dy * cos + dx * sin
    return new Point(x1 + origin.x, y1 + origin.y)
  }
}
