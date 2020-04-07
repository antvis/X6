import { Line } from '../line'
import { Point } from '../point'
import { Segment } from './segment'

export class LineTo extends Segment {
  constructor(line: Line)
  constructor(x: number, y: number)
  constructor(p: Point | Point.PointLike | Point.PointData)
  constructor(
    x: number | Line | (Point | Point.PointLike | Point.PointData),
    y?: number,
  ) {
    super()

    if (x instanceof Line) {
      this.end = x.end.clone()
    } else {
      this.end = Point.create(x, y)
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

  closestPoint(p: Point | Point.PointLike | Point.PointData) {
    return this.line.closestPoint(p)
  }

  closestPointLength(p: Point | Point.PointLike | Point.PointData) {
    return this.line.closestPointLength(p)
  }

  closestPointNormalizedLength(p: Point | Point.PointLike | Point.PointData) {
    return this.line.closestPointNormalizedLength(p)
  }

  closestPointTangent(p: Point | Point.PointLike | Point.PointData) {
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

  scale(
    sx: number,
    sy: number,
    origin?: Point | Point.PointLike | Point.PointData,
  ) {
    this.end.scale(sx, sy, origin)
    return this
  }

  translate(tx: number, ty: number): this
  translate(p: Point | Point.PointLike | Point.PointData): this
  translate(
    tx: number | Point | Point.PointLike | Point.PointData,
    ty?: number,
  ): this {
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
