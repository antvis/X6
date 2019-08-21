import { Point } from './point'

export class Rectangle {
  x: number
  y: number
  width: number
  height: number

  constructor(x?: number, y?: number, width?: number, height?: number) {
    this.x = x == null ? 0 : x
    this.y = y == null ? 0 : y
    this.width = width == null ? 0 : width
    this.height = height == null ? 0 : height
  }

  setRectangle(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  getCenterX() {
    return this.x + this.width / 2
  }

  getCenterY() {
    return this.y + this.height / 2
  }

  getCenter() {
    return new Point(
      this.getCenterX(),
      this.getCenterY(),
    )
  }

  getOrigin() {
    return new Point(this.x, this.y)
  }

  getCorner() {
    return new Point(this.x + this.width, this.y + this.height)
  }

  getTopRight() {
    return new Point(this.x + this.width, this.y)
  }

  getBottomLeft() {
    return new Point(this.x, this.y + this.height)
  }

  add(rect: Rectangle | Rectangle.RectangleLike) {
    if (rect != null) {
      const minX = Math.min(this.x, rect.x)
      const minY = Math.min(this.y, rect.y)
      const maxX = Math.max(this.x + this.width, rect.x + rect.width)
      const maxY = Math.max(this.y + this.height, rect.y + rect.height)

      this.x = minX
      this.y = minY
      this.width = maxX - minX
      this.height = maxY - minY
    }
  }

  intersect(rect: Rectangle | Rectangle.RectangleLike) {
    if (rect != null) {
      const r1 = this.x + this.width
      const r2 = rect.x + rect.width

      const b1 = this.y + this.height
      const b2 = rect.y + rect.height

      this.x = Math.max(this.x, rect.x)
      this.y = Math.max(this.y, rect.y)
      this.width = Math.min(r1, r2) - this.x
      this.height = Math.min(b1, b2) - this.y
    }
  }

  grow(amount: number) {
    this.x -= amount
    this.y -= amount
    this.width += 2 * amount
    this.height += 2 * amount
  }

  rotate90() {
    const t = (this.width - this.height) / 2
    this.x += t
    this.y -= t
    const tmp = this.width
    this.width = this.height
    this.height = tmp
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
    return Rectangle.clone(this)
  }

  valueOf() {
    return [this.x, this.y, this.width, this.height]
  }

  toString() {
    return this.valueOf().join(', ')
  }
}

export namespace Rectangle {
  export interface RectangleLike {
    x: number
    y: number
    width: number
    height: number
  }

  export function clone(rect: Rectangle | RectangleLike) {
    return new Rectangle(rect.x, rect.y, rect.width, rect.height)
  }
}
