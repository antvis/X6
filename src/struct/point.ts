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
