import { Line } from '../line'
import { Point } from '../point'
import { Segment } from './segment'

export class LineTo extends Segment {
  constructor(line: Line)
  constructor(x: number, y: number)
  constructor(p: Point.PointLike | Point.PointData)
  constructor(
    x: number | Line | (Point.PointLike | Point.PointData),
    y?: number,
  ) {
    super()

    if (Line.isLine(x)) {
      this.endPoint = x.end.clone().round(2)
    } else {
      this.endPoint = Point.create(x, y).round(2)
    }
  }

  get type() {
    return 'L'
  }

  get line() {
    return new Line(this.start, this.end)
  }

  bbox() {
    return this.line.bbox()
  }

  closestPoint(p: Point.PointLike | Point.PointData) {
    return this.line.closestPoint(p)
  }

  closestPointLength(p: Point.PointLike | Point.PointData) {
    return this.line.closestPointLength(p)
  }

  closestPointNormalizedLength(p: Point.PointLike | Point.PointData) {
    return this.line.closestPointNormalizedLength(p)
  }

  closestPointTangent(p: Point.PointLike | Point.PointData) {
    return this.line.closestPointTangent(p)
  }

  length() {
    return this.line.length()
  }

  divideAt(ratio: number): [Segment, Segment] {
    const divided = this.line.divideAt(ratio)
    return [new LineTo(divided[0]), new LineTo(divided[1])]
  }

  divideAtLength(length: number): [Segment, Segment] {
    const divided = this.line.divideAtLength(length)
    return [new LineTo(divided[0]), new LineTo(divided[1])]
  }

  getSubdivisions() {
    return []
  }

  pointAt(ratio: number) {
    return this.line.pointAt(ratio)
  }

  pointAtLength(length: number) {
    return this.line.pointAtLength(length)
  }

  tangentAt(ratio: number) {
    return this.line.tangentAt(ratio)
  }

  tangentAtLength(length: number) {
    return this.line.tangentAtLength(length)
  }

  isDifferentiable() {
    if (this.previousSegment == null) {
      return false
    }

    return !this.start.equals(this.end)
  }

  clone() {
    return new LineTo(this.end)
  }

  scale(sx: number, sy: number, origin?: Point.PointLike | Point.PointData) {
    this.end.scale(sx, sy, origin)
    return this
  }

  rotate(angle: number, origin?: Point.PointLike | Point.PointData) {
    this.end.rotate(angle, origin)
    return this
  }

  translate(tx: number, ty: number): this
  translate(p: Point.PointLike | Point.PointData): this
  translate(tx: number | Point.PointLike | Point.PointData, ty?: number): this {
    if (typeof tx === 'number') {
      this.end.translate(tx, ty as number)
    } else {
      this.end.translate(tx)
    }
    return this
  }

  equals(s: Segment) {
    return (
      this.type === s.type &&
      this.start.equals(s.start) &&
      this.end.equals(s.end)
    )
  }

  toJSON() {
    return {
      type: this.type,
      start: this.start.toJSON(),
      end: this.end.toJSON(),
    }
  }

  serialize() {
    const end = this.end
    return `${this.type} ${end.x} ${end.y}`
  }
}

export namespace LineTo {
  export function create(line: Line): LineTo
  export function create(point: Point.PointLike): LineTo
  export function create(x: number, y: number): LineTo
  export function create(
    point: Point.PointLike,
    ...points: Point.PointLike[]
  ): LineTo[]
  export function create(x: number, y: number, ...coords: number[]): LineTo[]
  export function create(...args: any[]): LineTo | LineTo[] {
    const len = args.length
    const arg0 = args[0]

    // line provided
    if (Line.isLine(arg0)) {
      return new LineTo(arg0)
    }

    // points provided
    if (Point.isPointLike(arg0)) {
      if (len === 1) {
        return new LineTo(arg0)
      }

      // poly-line segment
      return args.map((arg) => new LineTo(arg as Point.PointLike))
    }

    // coordinates provided
    if (len === 2) {
      return new LineTo(+args[0], +args[1])
    }

    // poly-line segment
    const segments: LineTo[] = []
    for (let i = 0; i < len; i += 2) {
      const x = +args[i]
      const y = +args[i + 1]
      segments.push(new LineTo(x, y))
    }
    return segments
  }
}
