import * as util from './util'
import { Angle } from './angle'
import { Geometry } from './geometry'
import { Rectangle } from './rectangle'

export class Point extends Geometry implements Point.PointLike {
  public x: number
  public y: number

  protected get [Symbol.toStringTag]() {
    return Point.toStringTag
  }

  constructor(x?: number, y?: number) {
    super()
    this.x = x == null ? 0 : x
    this.y = y == null ? 0 : y
  }

  /**
   * Rounds the point to the given precision.
   */
  round(precision = 0) {
    this.x = util.round(this.x, precision)
    this.y = util.round(this.y, precision)
    return this
  }

  add(x: number, y: number): this
  add(p: Point.PointLike | Point.PointData): this
  add(x: number | Point.PointLike | Point.PointData, y?: number): this {
    const p = Point.create(x, y)
    this.x += p.x
    this.y += p.y
    return this
  }

  /**
   * Update the point's `x` and `y` coordinates with new values and return the
   * point itself. Useful for chaining.
   */
  update(x: number, y: number): this
  update(p: Point.PointLike | Point.PointData): this
  update(x: number | Point.PointLike | Point.PointData, y?: number): this {
    const p = Point.create(x, y)
    this.x = p.x
    this.y = p.y
    return this
  }

  translate(dx: number, dy: number): this
  translate(p: Point.PointLike | Point.PointData): this
  translate(dx: number | Point.PointLike | Point.PointData, dy?: number): this {
    const t = Point.create(dx, dy)
    this.x += t.x
    this.y += t.y
    return this
  }

  /**
   * Rotate the point by `degree` around `center`.
   */
  rotate(degree: number, center?: Point.PointLike | Point.PointData): this {
    const p = Point.rotate(this, degree, center)
    this.x = p.x
    this.y = p.y
    return this
  }

  /**
   * Scale point by `sx` and `sy` around the given `origin`. If origin is not
   * specified, the point is scaled around `0,0`.
   */
  scale(
    sx: number,
    sy: number,
    origin: Point.PointLike | Point.PointData = new Point(),
  ) {
    const ref = Point.create(origin)
    this.x = ref.x + sx * (this.x - ref.x)
    this.y = ref.y + sy * (this.y - ref.y)
    return this
  }

  /**
   * Chooses the point closest to this point from among `points`. If `points`
   * is an empty array, `null` is returned.
   */
  closest(points: (Point.PointLike | Point.PointData)[]) {
    if (points.length === 1) {
      return Point.create(points[0])
    }

    let ret: Point.PointLike | Point.PointData | null = null
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
  distance(p: Point.PointLike | Point.PointData) {
    return Math.sqrt(this.squaredDistance(p))
  }

  /**
   * Returns the squared distance between the point and another point `p`.
   *
   * Useful for distance comparisons in which real distance is not necessary
   * (saves one `Math.sqrt()` operation).
   */
  squaredDistance(p: Point.PointLike | Point.PointData) {
    const ref = Point.create(p)
    const dx = this.x - ref.x
    const dy = this.y - ref.y
    return dx * dx + dy * dy
  }

  manhattanDistance(p: Point.PointLike | Point.PointData) {
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
  theta(p: Point.PointLike | Point.PointData = new Point()): number {
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
  angleBetween(
    p1: Point.PointLike | Point.PointData,
    p2: Point.PointLike | Point.PointData,
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
   * Returns the angle(in degrees) between the line from `(0,0)` and this point
   * and the line from `(0,0)` to `p`.
   *
   * The function returns a value between `0` and `180` when the angle (in the
   * direction from this point to `p`) is clockwise, and a value between `180`
   * and `360` when the angle is counterclockwise. Returns `NaN` if called from
   * point `(0,0)` or if `p` is `(0,0)`.
   */
  vectorAngle(p: Point.PointLike | Point.PointData) {
    const zero = new Point(0, 0)
    return zero.angleBetween(this, p)
  }

  /**
   * Converts rectangular to polar coordinates.
   */
  toPolar(origin?: Point.PointLike | Point.PointData) {
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
  changeInAngle(
    dx: number,
    dy: number,
    ref: Point.PointLike | Point.PointData = new Point(),
  ) {
    // Revert the translation and measure the change in angle around x-axis.
    return this.clone().translate(-dx, -dy).theta(ref) - this.theta(ref)
  }

  /**
   * If the point lies outside the rectangle `rect`, adjust the point so that
   * it becomes the nearest point on the boundary of `rect`.
   */
  adhereToRect(rect: Rectangle.RectangleLike) {
    if (!util.containsPoint(rect, this)) {
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
  bearing(p: Point.PointLike | Point.PointData) {
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
    return bearings[index] as Point.Bearing
  }

  /**
   * Returns the cross product of the vector from me to `p1` and the vector
   * from me to `p2`.
   *
   * The left-hand rule is used because the coordinate system is left-handed.
   */
  cross(
    p1: Point.PointLike | Point.PointData,
    p2: Point.PointLike | Point.PointData,
  ) {
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
  dot(p: Point.PointLike | Point.PointData) {
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
  diff(p: Point.PointLike | Point.PointData): Point
  diff(dx: number | Point.PointLike | Point.PointData, dy?: number): Point {
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
  lerp(p: Point.PointLike | Point.PointData, t: number) {
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
  move(ref: Point.PointLike | Point.PointData, distance: number) {
    const p = Point.create(ref)
    const rad = Angle.toRad(p.theta(this))
    return this.translate(Math.cos(rad) * distance, -Math.sin(rad) * distance)
  }

  /**
   * Returns a point that is the reflection of me with the center of inversion
   * in `ref` point.
   */
  reflection(ref: Point.PointLike | Point.PointData) {
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
    this.x = util.snapToGrid(this.x, gx)
    this.y = util.snapToGrid(this.y, gy == null ? gx : gy)
    return this
  }

  equals(p: Point.PointLike | Point.PointData) {
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

export namespace Point {
  export const toStringTag = `X6.Geometry.${Point.name}`

  export function isPoint(instance: any): instance is Point {
    if (instance == null) {
      return false
    }
    if (instance instanceof Point) {
      return true
    }

    const tag = instance[Symbol.toStringTag]
    const point = instance as Point

    if (
      (tag == null || tag === toStringTag) &&
      typeof point.x === 'number' &&
      typeof point.y === 'number' &&
      typeof point.toPolar === 'function'
    ) {
      return true
    }

    return false
  }
}

export namespace Point {
  export interface PointLike {
    x: number
    y: number
  }

  export type PointData = [number, number]

  export type Bearing = 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'N'

  export function isPointLike(p: any): p is PointLike {
    return (
      p != null &&
      typeof p === 'object' &&
      typeof p.x === 'number' &&
      typeof p.y === 'number'
    )
  }

  export function isPointData(p: any): p is PointData {
    return (
      p != null &&
      Array.isArray(p) &&
      p.length === 2 &&
      typeof p[0] === 'number' &&
      typeof p[1] === 'number'
    )
  }
}

export namespace Point {
  export function create(
    x?: number | Point | PointLike | PointData,
    y?: number,
  ): Point {
    if (x == null || typeof x === 'number') {
      return new Point(x, y)
    }

    return clone(x)
  }

  export function clone(p: Point | PointLike | PointData) {
    if (Point.isPoint(p)) {
      return new Point(p.x, p.y)
    }

    if (Array.isArray(p)) {
      return new Point(p[0], p[1])
    }

    return new Point(p.x, p.y)
  }

  export function toJSON(p: Point | PointLike | PointData) {
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
  export function fromPolar(
    r: number,
    rad: number,
    origin: Point | PointLike | PointData = new Point(),
  ) {
    let x = Math.abs(r * Math.cos(rad))
    let y = Math.abs(r * Math.sin(rad))
    const org = clone(origin)
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
  export function toPolar(
    point: Point | PointLike | PointData,
    origin: Point | PointLike | PointData = new Point(),
  ) {
    const p = clone(point)
    const o = clone(origin)
    const dx = p.x - o.x
    const dy = p.y - o.y
    return new Point(
      Math.sqrt(dx * dx + dy * dy), // r
      Angle.toRad(o.theta(p)),
    )
  }

  export function equals(p1?: Point.PointLike, p2?: Point.PointLike) {
    if (p1 === p2) {
      return true
    }

    if (p1 != null && p2 != null) {
      return p1.x === p2.x && p1.y === p2.y
    }

    return false
  }

  export function equalPoints(p1: Point.PointLike[], p2: Point.PointLike[]) {
    if (
      (p1 == null && p2 != null) ||
      (p1 != null && p2 == null) ||
      (p1 != null && p2 != null && p1.length !== p2.length)
    ) {
      return false
    }

    if (p1 != null && p2 != null) {
      for (let i = 0, ii = p1.length; i < ii; i += 1) {
        if (!equals(p1[i], p2[i])) {
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
  export function random(x1: number, x2: number, y1: number, y2: number) {
    return new Point(util.random(x1, x2), util.random(y1, y2))
  }

  export function rotate(
    point: Point | PointLike | PointData,
    angle: number,
    center?: Point | PointLike | PointData,
  ) {
    const rad = Angle.toRad(Angle.normalize(-angle))
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)

    return rotateEx(point, cos, sin, center)
  }

  export function rotateEx(
    point: Point | PointLike | PointData,
    cos: number,
    sin: number,
    center: Point | PointLike | PointData = new Point(),
  ) {
    const source = clone(point)
    const origin = clone(center)
    const dx = source.x - origin.x
    const dy = source.y - origin.y
    const x1 = dx * cos - dy * sin
    const y1 = dy * cos + dx * sin
    return new Point(x1 + origin.x, y1 + origin.y)
  }
}
