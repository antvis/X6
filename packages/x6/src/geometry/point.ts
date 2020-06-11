import * as util from './util'
import { Angle } from './angle'
import { Geometry } from './geometry'
import { Rectangle } from './rectangle'

export class Point extends Geometry implements Point.PointLike {
  public x: number
  public y: number

  constructor(x?: number, y?: number) {
    super()
    this.x = x == null ? 0 : x
    this.y = y == null ? 0 : y
  }

  round(precision: number = 0) {
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

  rotate(angle: number, center?: Point.PointLike | Point.PointData): this {
    const p = Point.rotate(this, angle, center)
    this.x = p.x
    this.y = p.y
    return this
  }

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
   * Chooses the point closest to this point from among `points`.
   * If `points` is an empty array, `null` is returned.
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

  distance(p: Point.PointLike | Point.PointData) {
    return Math.sqrt(this.squaredDistance(p))
  }

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
   * Returns the angle between vector from this point to `p` and the x axis.
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
   * Returns the angle between vector from this point to `p1` and the
   * vector from this point to `p2`.
   *
   * Ordering of points `p1` and `p2` is important!
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
   * Returns the angle between the vector from `0,0` to this point and the
   * vector from `0,0` to `p`. Returns `NaN` if `p` is at `0,0`.
   *
   * @returns the angle in degrees. `NaN` if `p` is at `0,0`.
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
   * Returns the change in angle from my previous position `-dx,-dy`
   * to my new position relative to `ref` point.
   */
  changeInAngle(
    dx: number,
    dy: number,
    ref: Point.PointLike | Point.PointData,
  ) {
    // Revert the translation and measure the change in angle around x-axis.
    return this.clone().translate(-dx, -dy).theta(ref) - this.theta(ref)
  }

  adhereToRect(rect: Rectangle.RectangleLike) {
    const area = Rectangle.create(rect)
    if (area.containsPoint(this)) {
      return this
    }

    this.x = Math.min(Math.max(this.x, area.x), area.x + area.width)
    this.y = Math.min(Math.max(this.y, area.y), area.y + area.height)

    return this
  }

  /**
   * Returns the bearing between me and the given point.
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
    if (index < 0) index += 360
    index = index / 45

    return bearings[index] as Point.Bearing
  }

  /**
   * Returns the cross product of the vector from me to `p1`
   * and the vector from me to `p2`.
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
   * Returns an interpolation between me and point `p` for a
   * parametert in the closed interval `[0, 1]`.
   */
  lerp(p: Point.PointLike | Point.PointData, t: number) {
    const x = this.x
    const y = this.y
    const ref = Point.create(p)
    return new Point((1 - t) * x + t * ref.x, (1 - t) * y + t * ref.y)
  }

  /**
   * Normalize the point vector, scale the line segment between `(0, 0)`
   * and the point in order for it to have the given length. If length is
   * not specified, it is considered to be `1`; in that case, a unit vector
   * is computed.
   */
  normalize(length: number = 1) {
    const scale = length / this.magnitude()
    return this.scale(scale, scale)
  }

  /**
   * Moves the point on a line that leads to another point `ref`
   * by a certain `distance`.
   */
  move(ref: Point.PointLike | Point.PointData, distance: number) {
    const p = Point.create(ref)
    const rad = Angle.toRad(p.theta(this))
    return this.translate(Math.cos(rad) * distance, -Math.sin(rad) * distance)
  }

  /**
   * Returns a point that is a reflection of the point with the
   * center of reflection at point `ref`.
   */
  reflection(ref: Point.PointLike | Point.PointData) {
    const p = Point.create(ref)
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

  equals(p: Point.PointLike | Point.PointData) {
    const ref = Point.create(p)
    return ref != null && ref.x === this.x && ref.y === this.y
  }

  clone() {
    return Point.clone(this)
  }

  toJSON() {
    return Point.toJSON(this)
  }

  serialize() {
    return `${this.x} ${this.y}`
  }
}

export namespace Point {
  export interface PointLike {
    x: number
    y: number
  }

  export type PointData = [number, number]

  export type Bearing = 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'N'

  export function isPointLike(o: any): o is PointLike {
    return (
      o != null &&
      typeof o === 'object' &&
      typeof o.x === 'number' &&
      typeof o.y === 'number'
    )
  }

  export function isPointData(o: any): o is PointData {
    return (
      o != null &&
      Array.isArray(o) &&
      o.length === 2 &&
      typeof o[0] === 'number' &&
      typeof o[1] === 'number'
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
    if (p instanceof Point) {
      return new Point(p.x, p.y)
    }

    if (Array.isArray(p)) {
      return new Point(p[0], p[1])
    }

    return new Point(p.x, p.y)
  }

  export function toJSON(p: Point | PointLike | PointData) {
    if (p instanceof Point) {
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
        if (p1[i] === p2[i] || (p1[i] != null && !equals(p1[i], p2[i]))) {
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
