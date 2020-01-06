import * as util from './util'
import { Angle } from './angle'
import { Point } from './point'
import { Line } from './line'
import { Ellipse } from './ellipse'
import { Side } from './types'

export class Rectangle {
  x: number
  y: number
  width: number
  height: number

  get origin() {
    return new Point(this.x, this.y)
  }

  get topLeft() {
    return new Point(this.x, this.y)
  }

  get topCenter() {
    return new Point(this.x + this.width / 2, this.y)
  }

  get topRight() {
    return new Point(this.x + this.width, this.y)
  }

  get center() {
    return new Point(this.x + this.width / 2, this.y + this.height / 2)
  }

  get bottomLeft() {
    return new Point(this.x, this.y + this.height)
  }

  get bottomCenter() {
    return new Point(this.x + this.width / 2, this.y + this.height)
  }

  get bottomRight() {
    return new Point(this.x + this.width, this.y + this.height)
  }

  get corner() {
    return new Point(this.x + this.width, this.y + this.height)
  }

  get rightMiddle() {
    return new Point(this.x + this.width, this.y + this.height / 2)
  }

  get leftMiddle() {
    return new Point(this.x, this.y + this.height / 2)
  }

  get topLine() {
    return new Line(this.topLeft, this.topRight)
  }

  get rightLine() {
    return new Line(this.topRight, this.bottomRight)
  }

  get bottomLine() {
    return new Line(this.bottomLeft, this.bottomRight)
  }

  get leftLine() {
    return new Line(this.topLeft, this.bottomLeft)
  }

  constructor(x?: number, y?: number, width?: number, height?: number) {
    this.x = x == null ? 0 : x
    this.y = y == null ? 0 : y
    this.width = width == null ? 0 : width
    this.height = height == null ? 0 : height
  }

  getOrigin() {
    return this.origin
  }

  getTopLeft() {
    return this.topLeft
  }

  getTopCenter() {
    return this.topCenter
  }

  getTopRight() {
    return this.topRight
  }

  getCenter() {
    return this.center
  }

  getCenterX() {
    return this.x + this.width / 2
  }

  getCenterY() {
    return this.y + this.height / 2
  }

  getBottomLeft() {
    return this.bottomLeft
  }

  getBottomCenter() {
    return this.bottomCenter
  }

  getBottomRight() {
    return this.bottomRight
  }

  getCorner() {
    return this.corner
  }

  getRightMiddle() {
    return this.rightMiddle
  }

  getLeftMiddle() {
    return this.leftMiddle
  }

  getTopLine() {
    return this.topLine
  }

  getRightLine() {
    return this.rightLine
  }

  getBottomLine() {
    return this.bottomLine
  }

  getLeftLine() {
    return this.leftLine
  }

  /**
   * Returns a rectangle that is the bounding box of the rectangle.
   *
   * If `angle` is specified, the bounding box calculation will take into
   * account the rotation of the rectangle by angle degrees around its center.
   */
  bbox(angle?: number) {
    if (!angle) {
      return this.clone()
    }

    const rad = Angle.toRad(angle)
    const st = Math.abs(Math.sin(rad))
    const ct = Math.abs(Math.cos(rad))
    const w = this.width * ct + this.height * st
    const h = this.width * st + this.height * ct
    return new Rectangle(
      this.x + (this.width - w) / 2,
      this.y + (this.height - h) / 2,
      w,
      h,
    )
  }

  round(precision: number = 0) {
    this.x = util.round(this.x, precision)
    this.y = util.round(this.y, precision)
    this.width = util.round(this.width, precision)
    this.height = util.round(this.height, precision)
    return this
  }

  add(x: number, y: number, width: number, height: number): this
  add(rect: Rectangle | Rectangle.RectangleLike | Rectangle.RectangleData): this
  add(
    x: number | Rectangle | Rectangle.RectangleLike | Rectangle.RectangleData,
    y?: number,
    w?: number,
    h?: number,
  ): this {
    let minX: number
    let minY: number
    let maxX: number
    let maxY: number
    if (typeof x === 'number') {
      minX = Math.min(this.x, x)
      minY = Math.min(this.y, y!)
      maxX = Math.max(this.x + this.width, x + w!)
      maxY = Math.max(this.y + this.height, y! + h!)
    } else {
      const rect = Rectangle.normalize(x)
      minX = Math.min(this.x, rect.x)
      minY = Math.min(this.y, rect.y)
      maxX = Math.max(this.x + this.width, rect.x + rect.width)
      maxY = Math.max(this.y + this.height, rect.y + rect.height)
    }

    this.x = minX
    this.y = minY
    this.width = maxX - minX
    this.height = maxY - minY

    return this
  }

  update(x: number, y: number, width: number, height: number): this
  update(
    rect: Rectangle | Rectangle.RectangleLike | Rectangle.RectangleData,
  ): this
  update(
    x: number | Rectangle | Rectangle.RectangleLike | Rectangle.RectangleData,
    y?: number,
    w?: number,
    h?: number,
  ): this {
    if (typeof x === 'number') {
      this.x = x
      this.y = y!
      this.width = w!
      this.height = h!
    } else {
      const rect = Rectangle.normalize(x)
      this.x = rect.x
      this.y = rect.y
      this.width = rect.width
      this.height = rect.height
    }

    return this
  }

  inflate(amount: number): this
  inflate(dx: number, dy: number): this
  inflate(dx: number, dy?: number): this {
    const w = dx
    const h = dy != null ? dy : dx
    this.x -= w
    this.y -= h
    this.width += 2 * w
    this.height += 2 * h

    return this
  }

  snapToGrid(gridSize: number): this
  snapToGrid(gx: number, gy: number): this
  snapToGrid(gx: number, gy?: number): this
  snapToGrid(gx: number, gy?: number): this {
    const origin = this.origin.snapToGrid(gx, gy)
    const corner = this.corner.snapToGrid(gx, gy)
    this.x = origin.x
    this.y = origin.y
    this.width = corner.x - origin.x
    this.height = corner.y - origin.y
    return this
  }

  translate(dx: number, dy: number): this
  translate(p: Point | Point.PointLike | Point.PointData): this
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

  /**
   * Translates the rectangle by `rect.x` and `rect.y` and expand it
   * by `rect.width` and `rect.height`.
   */
  moveAndExpand(
    rect: Rectangle | Rectangle.RectangleLike | Rectangle.RectangleData,
  ) {
    const ref = Rectangle.normalize(rect)
    this.x += ref.x || 0
    this.y += ref.y || 0
    this.width += ref.width || 0
    this.height += ref.height || 0
    return this
  }

  scale(
    sx: number,
    sy: number,
    origin: Point | Point.PointLike | Point.PointData = new Point(),
  ) {
    const pos = this.origin.scale(sx, sy, origin)
    this.x = pos.x
    this.y = pos.y
    this.width *= sx
    this.height *= sy
    return this
  }

  rotate(
    degree: number,
    center: Point | Point.PointLike | Point.PointData = this.getCenter(),
  ) {
    if (degree !== 0) {
      const rad = Angle.toRad(degree)
      const cos = Math.cos(rad)
      const sin = Math.sin(rad)

      let p1 = this.getOrigin()
      let p2 = this.getTopRight()
      let p3 = this.getBottomRight()
      let p4 = this.getBottomLeft()

      p1 = Point.rotateEx(p1, cos, sin, center)
      p2 = Point.rotateEx(p2, cos, sin, center)
      p3 = Point.rotateEx(p3, cos, sin, center)
      p4 = Point.rotateEx(p4, cos, sin, center)

      const rect = new Rectangle(p1.x, p1.y, 0, 0)
      rect.add(p2.x, p2.y, 0, 0)
      rect.add(p3.x, p3.y, 0, 0)
      rect.add(p4.x, p4.y, 0, 0)

      this.update(rect)
    }
    return this
  }

  rotate90() {
    const t = (this.width - this.height) / 2
    this.x += t
    this.y -= t
    const tmp = this.width
    this.width = this.height
    this.height = tmp

    return this
  }

  maxRectScaleToFit(
    limitRectangle:
      | Rectangle
      | Rectangle.RectangleLike
      | Rectangle.RectangleData,
    origin: Point = this.center,
  ) {
    const rect = Rectangle.normalize(limitRectangle)
    const ox = origin.x
    const oy = origin.y

    let sx1
    let sx2
    let sx3
    let sx4
    let sy1
    let sy2
    let sy3
    let sy4

    // Find the maximal possible scale for all corners, so when the scale
    // is applied the point is still inside the rectangle.

    sx1 = sx2 = sx3 = sx4 = sy1 = sy2 = sy3 = sy4 = Infinity

    // Top Left
    const p1 = rect.topLeft
    if (p1.x < ox) {
      sx1 = (this.x - ox) / (p1.x - ox)
    }
    if (p1.y < oy) {
      sy1 = (this.y - oy) / (p1.y - oy)
    }

    // Bottom Right
    const p2 = rect.bottomRight
    if (p2.x > ox) {
      sx2 = (this.x + this.width - ox) / (p2.x - ox)
    }
    if (p2.y > oy) {
      sy2 = (this.y + this.height - oy) / (p2.y - oy)
    }

    // Top Right
    const p3 = rect.topRight
    if (p3.x > ox) {
      sx3 = (this.x + this.width - ox) / (p3.x - ox)
    }
    if (p3.y < oy) {
      sy3 = (this.y - oy) / (p3.y - oy)
    }

    // Bottom Left
    const p4 = rect.bottomLeft
    if (p4.x < ox) {
      sx4 = (this.x - ox) / (p4.x - ox)
    }
    if (p4.y > oy) {
      sy4 = (this.y + this.height - oy) / (p4.y - oy)
    }

    return {
      sx: Math.min(sx1, sx2, sx3, sx4),
      sy: Math.min(sy1, sy2, sy3, sy4),
    }
  }

  maxRectUniformScaleToFit(
    limitRectangle:
      | Rectangle
      | Rectangle.RectangleLike
      | Rectangle.RectangleData,
    origin: Point = this.center,
  ) {
    const scale = this.maxRectScaleToFit(limitRectangle, origin)
    return Math.min(scale.sx, scale.sy)
  }

  /**
   * Returns `true` if the point is inside the rectangle (inclusive).
   * Returns `false` otherwise.
   */
  containsPoint(x: number, y: number): boolean
  containsPoint(point: Point | Point.PointLike | Point.PointData): boolean
  containsPoint(
    x: number | Point | Point.PointLike | Point.PointData,
    y?: number,
  ): boolean {
    const point = typeof x === 'number' ? { x, y: y! } : Point.normalize(x)
    return (
      point != null &&
      point.x >= this.x &&
      point.x <= this.x + this.width &&
      point.y >= this.y &&
      point.y <= this.y + this.height
    )
  }

  /**
   * Returns `true` if the rectangle is (completely) inside the
   * rectangle (inclusive). Returns `false` otherwise.
   */
  containsRect(x: number, y: number, w: number, h: number): boolean
  containsRect(
    rect: Rectangle | Rectangle.RectangleLike | Rectangle.RectangleData,
  ): boolean
  containsRect(
    x: number | Rectangle | Rectangle.RectangleLike | Rectangle.RectangleData,
    y?: number,
    w?: number,
    h?: number,
  ) {
    const b = this.parse(x, y, w, h)
    const x1 = this.x
    const y1 = this.y
    const w1 = this.width
    const h1 = this.height

    const x2 = b.x
    const y2 = b.y
    const w2 = b.width
    const h2 = b.height

    return x2 >= x1 && y2 >= y1 && x2 + w2 <= x1 + w1 && y2 + h2 <= y1 + h1
  }

  intersectionWithLine(line: Line) {
    const rectLines = [
      this.topLine,
      this.rightLine,
      this.bottomLine,
      this.leftLine,
    ]
    const points: Point[] = []
    const dedupeArr: string[] = []
    rectLines.forEach(l => {
      const pt = line.intersectionWithLine(l)
      if (pt !== null && dedupeArr.indexOf(pt.toString()) < 0) {
        points.push(pt)
        dedupeArr.push(pt.toString())
      }
    })

    return points.length > 0 ? points : null
  }

  /**
   * Returns the point on the boundary of the rectangle that is the
   * intersection of the rectangle with a line starting in the center
   * of the rectangle ending in the point `p`.
   *
   * If angle is specified, the intersection will take into account the
   * rotation of the rectangle by angle degrees around its center.
   */
  intersectionWithLineFromCenterToPoint(
    p: Point | Point.PointLike | Point.PointData,
    angle?: number,
  ) {
    const ref = Point.normalize(p)
    const center = this.center
    let result

    if (angle) {
      ref.rotate(angle, center)
    }

    const sides = [this.topLine, this.rightLine, this.bottomLine, this.leftLine]
    const connector = new Line(center, p)

    for (let i = sides.length - 1; i >= 0; i -= 1) {
      const intersection = sides[i].intersectionWithLine(connector)
      if (intersection !== null) {
        result = intersection
        break
      }
    }
    if (result && angle) {
      result.rotate(-angle, center)
    }

    return result
  }

  /**
   * Normalize the rectangle, i.e. make it so that it has non-negative
   * width and height.
   *
   * If width is less than `0`, the function swaps left and right corners
   * and if height is less than `0`, the top and bottom corners are swapped.
   */
  normalize() {
    let newx = this.x
    let newy = this.y
    let newwidth = this.width
    let newheight = this.height
    if (this.width < 0) {
      newx = this.x + this.width
      newwidth = -this.width
    }
    if (this.height < 0) {
      newy = this.y + this.height
      newheight = -this.height
    }
    this.x = newx
    this.y = newy
    this.width = newwidth
    this.height = newheight
    return this
  }

  /**
   * Returns a rectangle that is a subtraction of the two rectangles
   * if such an object exists (the two rectangles intersect).
   *
   * Returns `null` otherwise.
   */
  intersect(x: number, y: number, w: number, h: number): Rectangle | null
  intersect(
    rect: Rectangle | Rectangle.RectangleLike | Rectangle.RectangleData,
  ): Rectangle | null
  intersect(
    x: number | Rectangle | Rectangle.RectangleLike | Rectangle.RectangleData,
    y?: number,
    w?: number,
    h?: number,
  ) {
    const ref = this.parse(x, y, w, h)

    // no intersection
    if (!this.isIntersectWith(ref)) {
      return null
    }

    const myOrigin = this.origin
    const myCorner = this.corner
    const rOrigin = ref.origin
    const rCorner = ref.corner

    const xx = Math.max(myOrigin.x, rOrigin.x)
    const yy = Math.max(myOrigin.y, rOrigin.y)

    return new Rectangle(
      xx,
      yy,
      Math.min(myCorner.x, rCorner.x) - xx,
      Math.min(myCorner.y, rCorner.y) - yy,
    )
  }

  isIntersectWith(x: number, y: number, w: number, h: number): boolean
  isIntersectWith(
    rect: Rectangle | Rectangle.RectangleLike | Rectangle.RectangleData,
  ): boolean
  isIntersectWith(
    x: number | Rectangle | Rectangle.RectangleLike | Rectangle.RectangleData,
    y?: number,
    w?: number,
    h?: number,
  ) {
    const ref = this.parse(x, y, w, h)
    const myOrigin = this.origin
    const myCorner = this.corner
    const rOrigin = ref.origin
    const rCorner = ref.corner

    if (
      rCorner.x <= myOrigin.x ||
      rCorner.y <= myOrigin.y ||
      rOrigin.x >= myCorner.x ||
      rOrigin.y >= myCorner.y
    ) {
      return false
    }
    return true
  }

  /**
   * Returns a rectangle that is a union of this rectangle and rectangle `rect`.
   */
  union(rect: Rectangle | Rectangle.RectangleLike | Rectangle.RectangleData) {
    const ref = Rectangle.normalize(rect)
    const myOrigin = this.origin
    const myCorner = this.corner
    const rOrigin = ref.origin
    const rCorner = ref.corner

    const originX = Math.min(myOrigin.x, rOrigin.x)
    const originY = Math.min(myOrigin.y, rOrigin.y)
    const cornerX = Math.max(myCorner.x, rCorner.x)
    const cornerY = Math.max(myCorner.y, rCorner.y)

    return new Rectangle(originX, originY, cornerX - originX, cornerY - originY)
  }

  sideNearestToPoint(p: Point | Point.PointLike | Point.PointData): Side {
    const ref = Point.normalize(p)
    const distLeft = ref.x - this.x
    const distRight = this.x + this.width - ref.x
    const distTop = ref.y - this.y
    const distBottom = this.y + this.height - ref.y
    let closest = distLeft
    let side: Side = 'left'

    if (distRight < closest) {
      closest = distRight
      side = 'right'
    }

    if (distTop < closest) {
      closest = distTop
      side = 'top'
    }

    if (distBottom < closest) {
      side = 'bottom'
    }

    return side
  }

  pointNearestToPoint(p: Point | Point.PointLike | Point.PointData) {
    const ref = Point.normalize(p)
    if (this.containsPoint(ref)) {
      const side = this.sideNearestToPoint(ref)
      switch (side) {
        case 'right':
          return new Point(this.x + this.width, ref.y)
        case 'left':
          return new Point(this.x, ref.y)
        case 'bottom':
          return new Point(ref.x, this.y + this.height)
        case 'top':
          return new Point(ref.x, this.y)
      }
    }

    return ref.adhereToRect(this)
  }

  equals(rect: Rectangle | Rectangle.RectangleLike) {
    return (
      rect != null &&
      rect.x === this.x &&
      rect.y === this.y &&
      rect.width === this.width &&
      rect.height === this.height
    )
  }

  clone() {
    return new Rectangle(this.x, this.y, this.width, this.height)
  }

  toJSON() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  valueOf() {
    return this.toJSON()
  }

  toString() {
    return `${this.x} ${this.y} ${this.width} ${this.height}`
  }

  private parse(
    x: number | Rectangle | Rectangle.RectangleLike | Rectangle.RectangleData,
    y?: number,
    w?: number,
    h?: number,
  ) {
    return typeof x === 'number'
      ? new Rectangle(x, y, w, h)
      : Rectangle.normalize(x)
  }
}

export namespace Rectangle {
  export interface RectangleLike {
    x: number
    y: number
    width: number
    height: number
  }

  export type RectangleData = [number, number, number, number]
}

export namespace Rectangle {
  export function create(): Rectangle
  export function create(x: number): Rectangle
  export function create(x: number, y: number): Rectangle
  export function create(x: number, y: number, width: number): Rectangle
  export function create(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Rectangle
  export function create(
    rect: Rectangle | RectangleLike | RectangleData,
  ): Rectangle
  export function create(
    x?: number | Rectangle | RectangleLike | RectangleData,
    y?: number,
    width?: number,
    height?: number,
  ): Rectangle
  export function create(
    x?: number | Rectangle | RectangleLike | RectangleData,
    y?: number,
    width?: number,
    height?: number,
  ): Rectangle {
    if (x == null || typeof x === 'number') {
      return new Rectangle(x, y, width, height)
    }

    if (Array.isArray(x)) {
      return new Rectangle(x[0], x[1], x[2], x[3])
    }

    if (x instanceof Rectangle) {
      return x.clone()
    }

    return new Rectangle(x.x, x.y, x.width, x.height)
  }

  export function normalize(rect: Rectangle | RectangleLike | RectangleData) {
    return rect instanceof Rectangle ? rect : create(rect)
  }

  export function fromEllipse(ellipse: Ellipse) {
    return new Rectangle(
      ellipse.x - ellipse.a,
      ellipse.y - ellipse.b,
      2 * ellipse.a,
      2 * ellipse.b,
    )
  }
}
