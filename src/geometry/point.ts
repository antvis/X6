import { type RectangleLike } from './rectangle'
import { round, random, snapToGrid, containsPoint } from './util'
import * as Angle from './angle'
import { Geometry } from './geometry'
import type { PointLike, PointData, PointBearing, PointOptions } from '@/types'

export { PointLike, PointData, PointBearing, PointOptions }
export class Point extends Geometry implements PointLike {
  static create(x?: number | Point | PointOptions, y?: number): Point {
    if (x == null || typeof x === 'number') {
      // @ts-ignore
      return new Point(x, y)
    }

    return Point.clone(x)
  }
  static clone(p: Point | PointOptions) {
    if (Point.isPoint(p)) {
      return new Point(p.x, p.y)
    }

    if (Array.isArray(p)) {
      return new Point(p[0], p[1])
    }

    return new Point(p.x, p.y)
  }

  static equals(p1?: PointLike, p2?: PointLike) {
    if (p1 === p2) {
      return true
    }

    if (p1 != null && p2 != null) {
      return p1.x === p2.x && p1.y === p2.y
    }

    return false
  }

  static rotateEx(
    point: Point | PointOptions,
    cos: number,
    sin: number,
    center: Point | PointOptions = new Point(),
  ) {
    const source = Point.clone(point)
    const origin = Point.clone(center)
    const dx = source.x - origin.x
    const dy = source.y - origin.y
    const x1 = dx * cos - dy * sin
    const y1 = dy * cos + dx * sin
    return new Point(x1 + origin.x, y1 + origin.y)
  }

  static toJSON(p: Point | PointOptions) {
    if (Point.isPoint(p)) {
      return { x: p.x, y: p.y }
    }

    if (Array.isArray(p)) {
      return { x: p[0], y: p[1] }
    }

    return { x: p.x, y: p.y }
  }

  /**
   * Returns a new Point object from the given polar coordinates.
   * @see http://en.wikipedia.org/wiki/Polar_coordinate_system
   */
  static fromPolar(
    r: number,
    rad: number,
    origin: Point | PointOptions = new Point(),
  ) {
    let x = Math.abs(r * Math.cos(rad))
    let y = Math.abs(r * Math.sin(rad))
    const org = Point.clone(origin)
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

  /**
   * Converts rectangular to polar coordinates.
   */
  static toPolar(
    point: Point | PointOptions,
    origin: Point | PointOptions = new Point(),
  ) {
    const p = Point.clone(point)
    const o = Point.clone(origin)
    const dx = p.x - o.x
    const dy = p.y - o.y
    return new Point(
      Math.sqrt(dx * dx + dy * dy), // r
      Angle.toRad(o.theta(p)),
    )
  }

  static equalPoints(p1: PointLike[], p2: PointLike[]) {
    if (
      (p1 == null && p2 != null) ||
      (p1 != null && p2 == null) ||
      (p1 != null && p2 != null && p1.length !== p2.length)
    ) {
      return false
    }

    if (p1 != null && p2 != null) {
      for (let i = 0, ii = p1.length; i < ii; i += 1) {
        if (!Point.equals(p1[i], p2[i])) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Returns a point with random coordinates that fall within the range
   * `[x1, x2]` and `[y1, y2]`.
   */
  static random(x1: number, x2: number, y1: number, y2: number) {
    return new Point(random(x1, x2), random(y1, y2))
  }

  static rotate(
    point: Point | PointOptions,
    angle: number,
    center?: Point | PointOptions,
  ) {
    const rad = Angle.toRad(Angle.normalize(-angle))
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)

    return Point.rotateEx(point, cos, sin, center)
  }

  static isPoint(instance: any): instance is Point {
    return instance != null && instance instanceof Point
  }
  static isPointLike(p: any): p is PointLike {
    return (
      p != null &&
      typeof p === 'object' &&
      typeof p.x === 'number' &&
      typeof p.y === 'number'
    )
  }

  static isPointData(p: any): p is PointData {
    return (
      p != null &&
      Array.isArray(p) &&
      p.length === 2 &&
      typeof p[0] === 'number' &&
      typeof p[1] === 'number'
    )
  }
  public x: number
  public y: number

  constructor()
  constructor(x?: number, y?: number)
  constructor(x?: number, y?: number) {
    super()
    this.x = x == null ? 0 : x
    this.y = y == null ? 0 : y
  }

  /**
   * Rounds the point to the given precision.
   */
  round(precision = 0) {
    this.x = round(this.x, precision)
    this.y = round(this.y, precision)
    return this
  }

  add(x: number, y: number): this
  add(p: PointOptions): this
  add(x: number | PointOptions, y?: number): this {
    const p = Point.create(x, y)
    this.x += p.x
    this.y += p.y
    return this
  }

  update(x: number, y: number): this
  update(p: PointOptions): this
  update(x: number | PointOptions, y?: number): this {
    const p = Point.create(x, y)
    this.x = p.x
    this.y = p.y
    return this
  }

  translate(dx: number, dy: number): this
  translate(p: PointOptions): this
  translate(dx: number | PointOptions, dy?: number): this {
    const t = Point.create(dx, dy)
    this.x += t.x
    this.y += t.y
    return this
  }

  /**
   * Rotate the point by `degree` around `center`.
   */
  rotate(degree: number, center?: PointOptions): this {
    const p = Point.rotate(this, degree, center)
    this.x = p.x
    this.y = p.y
    return this
  }

  /**
   * Scale point by `sx` and `sy` around the given `origin`. If origin is
   * not specified, the point is scaled around `0, 0`.
   */
  scale(sx: number, sy: number, origin: PointOptions = new Point()) {
    const ref = Point.create(origin)
    this.x = ref.x + sx * (this.x - ref.x)
    this.y = ref.y + sy * (this.y - ref.y)
    return this
  }

  /**
   * Chooses the point closest to this point from among `points`. If `points`
   * is an empty array, `null` is returned.
   */
  closest(points: PointOptions[]) {
    if (points.length === 1) {
      return Point.create(points[0])
    }

    let ret: PointOptions | null = null
    let min = Infinity
    points.forEach((p) => {
      const dist = this.squaredDistance(p)
      if (dist < min) {
        ret = p
        min = dist
      }
    })

    return ret ? Point.create(ret) : null
  }

  /**
   * Returns the distance between the point and another point `p`.
   */
  distance(p: PointOptions) {
    return Math.sqrt(this.squaredDistance(p))
  }

  /**
   * Returns the squared distance between the point and another point `p`.
   *
   * Useful for distance comparisons in which real distance is not necessary
   * (saves one `Math.sqrt()` operation).
   */
  squaredDistance(p: PointOptions) {
    const ref = Point.create(p)
    const dx = this.x - ref.x
    const dy = this.y - ref.y
    return dx * dx + dy * dy
  }

  manhattanDistance(p: PointOptions) {
    const ref = Point.create(p)
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
   * Returns the angle(in degrees) between vector from this point to `p` and
   * the x-axis.
   */
  theta(p: PointOptions = new Point()): number {
    const ref = Point.create(p)
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
   * Returns the angle(in degrees) between vector from this point to `p1` and
   * the vector from this point to `p2`.
   *
   * The ordering of points `p1` and `p2` is important.
   *
   * The function returns a value between `0` and `180` when the angle (in the
   * direction from `p1` to `p2`) is clockwise, and a value between `180` and
   * `360` when the angle is counterclockwise.
   *
   * Returns `NaN` if either of the points `p1` and `p2` is equal with this point.
   */
  angleBetween(p1: PointOptions, p2: PointOptions) {
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
   * Returns the angle(in degrees) between the line from `(0,0)` and this point
   * and the line from `(0,0)` to `p`.
   *
   * The function returns a value between `0` and `180` when the angle (in the
   * direction from this point to `p`) is clockwise, and a value between `180`
   * and `360` when the angle is counterclockwise. Returns `NaN` if called from
   * point `(0,0)` or if `p` is `(0,0)`.
   */
  vectorAngle(p: PointOptions) {
    const zero = new Point(0, 0)
    return zero.angleBetween(this, p)
  }

  /**
   * Converts rectangular to polar coordinates.
   */
  toPolar(origin?: PointOptions) {
    this.update(Point.toPolar(this, origin))
    return this
  }

  /**
   * Returns the change in angle(in degrees) that is the result of moving the
   * point from its previous position to its current position.
   *
   * More specifically, this function computes the angle between the line from
   * the ref point to the previous position of this point(i.e. current position
   * `-dx`, `-dy`) and the line from the `ref` point to the current position of
   * this point.
   *
   * The function returns a positive value between `0` and `180` when the angle
   * (in the direction from previous position of this point to its current
   * position) is clockwise, and a negative value between `0` and `-180` when
   * the angle is counterclockwise.
   *
   * The function returns `0` if the previous and current positions of this
   * point are the same (i.e. both `dx` and `dy` are `0`).
   */
  changeInAngle(dx: number, dy: number, ref: PointOptions = new Point()) {
    // Revert the translation and measure the change in angle around x-axis.
    return this.clone().translate(-dx, -dy).theta(ref) - this.theta(ref)
  }

  /**
   * If the point lies outside the rectangle `rect`, adjust the point so that
   * it becomes the nearest point on the boundary of `rect`.
   */
  adhereToRect(rect: RectangleLike) {
    if (!containsPoint(rect, this)) {
      this.x = Math.min(Math.max(this.x, rect.x), rect.x + rect.width)
      this.y = Math.min(Math.max(this.y, rect.y), rect.y + rect.height)
    }
    return this
  }

  /**
   * Returns the bearing(cardinal direction) between me and the given point.
   *
   * @see https://en.wikipedia.org/wiki/Cardinal_direction
   */
  bearing(p: PointOptions) {
    const ref = Point.create(p)
    const lat1 = Angle.toRad(this.y)
    const lat2 = Angle.toRad(ref.y)
    const lon1 = this.x
    const lon2 = ref.x
    const dLon = Angle.toRad(lon2 - lon1)
    const y = Math.sin(dLon) * Math.cos(lat2)
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)

    const brng = Angle.toDeg(Math.atan2(y, x))
    const bearings = ['NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N']

    let index = brng - 22.5
    if (index < 0) {
      index += 360
    }
    index = parseInt((index / 45) as any, 10)
    return bearings[index] as PointBearing
  }

  /**
   * Returns the cross product of the vector from me to `p1` and the vector
   * from me to `p2`.
   *
   * The left-hand rule is used because the coordinate system is left-handed.
   */
  cross(p1: PointOptions, p2: PointOptions) {
    if (p1 != null && p2 != null) {
      const a = Point.create(p1)
      const b = Point.create(p2)
      return (b.x - this.x) * (a.y - this.y) - (b.y - this.y) * (a.x - this.x)
    }

    return NaN
  }

  /**
   * Returns the dot product of this point with given other point.
   */
  dot(p: PointOptions) {
    const ref = Point.create(p)
    return this.x * ref.x + this.y * ref.y
  }

  /**
   * Returns a point that has coordinates computed as a difference between the
   * point and another point with coordinates `dx` and `dy`.
   *
   * If only `dx` is specified and is a number, `dy` is considered to be zero.
   * If only `dx` is specified and is an object, it is considered to be another
   * point or an object in the form `{ x: [number], y: [number] }`
   */
  diff(dx: number, dy: number): Point
  diff(p: PointOptions): Point
  diff(dx: number | PointOptions, dy?: number): Point {
    if (typeof dx === 'number') {
      return new Point(this.x - dx, this.y - dy!)
    }

    const p = Point.create(dx)
    return new Point(this.x - p.x, this.y - p.y)
  }

  /**
   * Returns an interpolation between me and point `p` for a parametert in
   * the closed interval `[0, 1]`.
   */
  lerp(p: PointOptions, t: number) {
    const ref = Point.create(p)
    return new Point((1 - t) * this.x + t * ref.x, (1 - t) * this.y + t * ref.y)
  }

  /**
   * Normalize the point vector, scale the line segment between `(0, 0)`
   * and the point in order for it to have the given length. If length is
   * not specified, it is considered to be `1`; in that case, a unit vector
   * is computed.
   */
  normalize(length = 1) {
    const scale = length / this.magnitude()
    return this.scale(scale, scale)
  }

  /**
   * Moves this point along the line starting from `ref` to this point by a
   * certain `distance`.
   */
  move(ref: PointOptions, distance: number) {
    const p = Point.create(ref)
    const rad = Angle.toRad(p.theta(this))
    return this.translate(Math.cos(rad) * distance, -Math.sin(rad) * distance)
  }

  /**
   * Returns a point that is the reflection of me with the center of inversion
   * in `ref` point.
   */
  reflection(ref: PointOptions) {
    return Point.create(ref).move(this, this.distance(ref))
  }

  /**
   * Snaps the point(change its x and y coordinates) to a grid of size `gridSize`
   * (or `gridSize` x `gridSizeY` for non-uniform grid).
   */
  snapToGrid(gridSize: number): this
  snapToGrid(gx: number, gy: number): this
  snapToGrid(gx: number, gy?: number): this
  snapToGrid(gx: number, gy?: number): this {
    this.x = snapToGrid(this.x, gx)
    this.y = snapToGrid(this.y, gy == null ? gx : gy)
    return this
  }

  equals(p: PointOptions) {
    const ref = Point.create(p)
    return ref != null && ref.x === this.x && ref.y === this.y
  }

  clone() {
    return Point.clone(this)
  }

  /**
   * Returns the point as a simple JSON object. For example: `{ x: 0, y: 0 }`.
   */
  toJSON() {
    return Point.toJSON(this)
  }

  serialize() {
    return `${this.x} ${this.y}`
  }
}
