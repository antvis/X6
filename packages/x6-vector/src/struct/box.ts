import { Global } from '../global'
import { Matrix } from './matrix'
import { Point } from './point'

export class Box implements Box.BoxLike {
  x: number
  y: number
  width: number
  height: number

  get w() {
    return this.width
  }

  get h() {
    return this.height
  }

  get x2() {
    return this.x + this.width
  }

  get y2() {
    return this.y + this.height
  }

  get cx() {
    return this.x + this.width / 2
  }

  get cy() {
    return this.y + this.height / 2
  }

  constructor()
  constructor(string: string)
  constructor(array: number[])
  constructor(object: Box.BoxObject)
  constructor(x?: number, y?: number, width?: number, height?: number)
  constructor(
    x?: number | string | number[] | Box.BoxObject,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const source =
      typeof x === 'string'
        ? x.split(/[\s,]+/).map(parseFloat)
        : Array.isArray(x)
        ? x
        : typeof x === 'object'
        ? [
            x.left != null ? x.left : x.x,
            x.top != null ? x.top : x.y,
            x.width,
            x.height,
          ]
        : arguments.length === 4
        ? [x, y, width, height]
        : [0, 0, 0, 0]

    this.x = source[0] || 0
    this.y = source[1] || 0
    this.width = source[2] || 0
    this.height = source[3] || 0

    return this
  }

  addOffset() {
    // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
    this.x += Global.window.pageXOffset
    this.y += Global.window.pageYOffset
    return new Box(this)
  }

  isNull() {
    return Box.isNull(this)
  }

  merge(box: Box.BoxLike) {
    const x = Math.min(this.x, box.x)
    const y = Math.min(this.y, box.y)
    const width = Math.max(this.x + this.width, box.x + box.width) - x
    const height = Math.max(this.y + this.height, box.y + box.height) - y
    return new Box(x, y, width, height)
  }

  transform(matrix: Matrix | Matrix.Raw) {
    const m = matrix instanceof Matrix ? matrix : new Matrix(matrix)

    let xMin = Number.POSITIVE_INFINITY
    let xMax = Number.NEGATIVE_INFINITY
    let yMin = Number.POSITIVE_INFINITY
    let yMax = Number.NEGATIVE_INFINITY

    const points = [
      new Point(this.x, this.y),
      new Point(this.x2, this.y),
      new Point(this.x, this.y2),
      new Point(this.x2, this.y2),
    ]

    points.forEach((p) => {
      const point = p.transform(m)
      xMin = Math.min(xMin, point.x)
      xMax = Math.max(xMax, point.x)
      yMin = Math.min(yMin, point.y)
      yMax = Math.max(yMax, point.y)
    })

    return new Box(xMin, yMin, xMax - xMin, yMax - yMin)
  }

  toString() {
    return `${this.x} ${this.y} ${this.width} ${this.height}`
  }

  toArray(): Box.BoxArray {
    return [this.x, this.y, this.width, this.height]
  }

  valueOf() {
    return this.toArray()
  }
}

export namespace Box {
  export interface BoxLike extends Point.PointLike {
    width: number
    height: number
  }

  export interface BoxObject {
    x?: number
    y?: number
    left?: number
    top?: number
    width?: number
    height?: number
  }

  export type BoxArray = [number, number, number, number]

  export function isNull(box: BoxLike) {
    return !box.width && !box.height && !box.x && !box.y
  }
}
