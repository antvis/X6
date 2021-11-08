import { Matrix } from './matrix'

export class Point implements Point.PointLike {
  public x: number
  public y: number

  constructor()
  constructor(p: Point.PointLike)
  constructor(array: Point.PointArray)
  constructor(x: number, y: number)
  constructor(x?: number | Point.PointLike | Point.PointArray, y?: number)
  constructor(x?: number | Point.PointLike | Point.PointArray, y?: number) {
    const source = Array.isArray(x)
      ? { x: x[0], y: x[1] }
      : typeof x === 'object'
      ? { x: x.x, y: x.y }
      : { x, y }

    this.x = source.x == null ? 0 : source.x
    this.y = source.y == null ? 0 : source.y
  }

  clone() {
    return new Point(this)
  }

  toJSON(): Point.PointLike {
    return { x: this.x, y: this.y }
  }

  toArray(): Point.PointArray {
    return [this.x, this.y]
  }

  toString() {
    return `${this.x} ${this.y}`
  }

  valueOf() {
    return this.toArray()
  }

  transform(matrix: Matrix.Raw) {
    return this.clone().transformO(matrix)
  }

  transformO(matrix: Matrix.Raw) {
    const { x, y } = this
    const m = Matrix.isMatrixLike(matrix) ? matrix : new Matrix(matrix)

    this.x = m.a * x + m.c * y + m.e
    this.y = m.b * x + m.d * y + m.f

    return this
  }
}

export namespace Point {
  export interface PointLike {
    x: number
    y: number
  }

  export type PointArray = [number, number]
}
