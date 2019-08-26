import * as util from '../util'

export class Point {
  x: number
  y: number

  constructor(x?: number, y?: number) {
    this.x = x == null ? 0 : x
    this.y = y == null ? 0 : y
  }

  equals(p: Point | Point.PointLike) {
    return (
      p != null &&
      p.x === this.x &&
      p.y === this.y
    )
  }

  translate(dx: number, dy: number) {
    this.x += dx
    this.y += dy
  }

  rotate(angle: number, center: Point = new Point()) {
    const rad = util.toRadians(angle)
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)

    const p = util.rotatePoint(this, cos, sin, center)

    this.x = p.x
    this.y = p.y
  }

  scalePoint(sx: number, sy: number = sx) {
    this.x *= sx
    this.y *= sy
  }

  clone() {
    return Point.fromPoint(this)
  }

  valueOf() {
    return [this.x, this.y]
  }

  toString() {
    return this.valueOf().join(', ')
  }
}

export namespace Point {
  export interface PointLike {
    x: number
    y: number
  }

  export function fromPoint(p: Point | PointLike) {
    return new Point(p.x, p.y)
  }
}
