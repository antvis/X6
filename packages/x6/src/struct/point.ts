// import { rotatePoint } from '../util'

export class Point {
  x: number
  y: number

  constructor(x?: number, y?: number) {
    this.x = x == null ? 0 : x
    this.y = y == null ? 0 : y
  }

  equals(p: Point | Point.PointLike) {
    return p != null && p.x === this.x && p.y === this.y
  }

  add(x: number, y: number): void
  add(p: Point | Point.PointLike): void
  add(x: number | Point | Point.PointLike, y?: number) {
    const p = typeof x === 'number' ? { x, y: y! } : x
    this.x += p.x
    this.y += p.y
  }

  update(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  translate(dx: number, dy: number) {
    this.x += dx
    this.y += dy
  }

  rotate(angle: number, center: Point = new Point()) {
    // const p = rotatePoint(this, angle, center)
    // this.x = p.x
    // this.y = p.y
  }

  scalePoint(sx: number, sy: number = sx) {
    this.x *= sx
    this.y *= sy
  }

  round() {
    this.x = Math.round(this.x)
    this.y = Math.round(this.y)
  }

  clone() {
    return Point.clone(this)
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

  export type PointData = [number, number]

  export function clone(p: Point | PointLike | PointData) {
    if (Array.isArray(p)) {
      return new Point(p[0], p[1])
    }

    return new Point(p.x, p.y)
  }

  /**
   * Create a point with random coordinates that fall into
   * the range `[x1, x2]` and `[y1, y2]`.
   */
  export function random(x1: number, x2: number, y1: number, y2: number) {
    const x = Math.floor(Math.random() * (x2 - x1 + 1) + x1)
    const y = Math.floor(Math.random() * (y2 - y1 + 1) + y1)

    return new Point(x, y)
  }

  export function equalPoints(a: Point[], b: Point[]) {
    if (
      (a == null && b != null) ||
      (a != null && b == null) ||
      (a != null && b != null && a.length !== b.length)
    ) {
      return false
    }

    if (a != null && b != null) {
      for (let i = 0, ii = a.length; i < ii; i += 1) {
        if (a[i] === b[i] || (a[i] != null && !a[i].equals(b[i]))) {
          return false
        }
      }
    }

    return true
  }
}
