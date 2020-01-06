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

  bbox() {
    return Line.prototype.bbox.call(this)
  }

  closestPoint(p: Point | Point.PointLike | Point.PointData) {
    return Line.prototype.closestPoint.call(this, p)
  }

  closestPointLength(p: Point | Point.PointLike | Point.PointData) {
    return Line.prototype.closestPointLength.call(this, p)
  }

  closestPointNormalizedLength(p: Point | Point.PointLike | Point.PointData) {
    return Line.prototype.closestPointNormalizedLength.call(this, p)
  }

  closestPointTangent(p: Point | Point.PointLike | Point.PointData) {
    return Line.prototype.closestPointTangent.call(this, p)
  }

  length() {
    return Line.prototype.length.call(this)
  }

  divideAt(ratio: number): [Segment, Segment] {
    const line = new Line(this.start, this.end)
    const divided = line.divideAt(ratio)
    return [new LineTo(divided[0]), new LineTo(divided[1])]
  }

  divideAtLength(length: number): [Segment, Segment] {
    const line = new Line(this.start, this.end)
    const divided = line.divideAtLength(length)
    return [new LineTo(divided[0]), new LineTo(divided[1])]
  }

  getSubdivisions() {
    return []
  }

  pointAt(ratio: number) {
    return Line.prototype.pointAt.call(this, ratio)
  }

  pointAtLength(length: number) {
    return Line.prototype.pointAtLength.call(this, length)
  }

  tangentAt(ratio: number) {
    return Line.prototype.tangentAt.call(this, ratio)
  }

  tangentAtLength(length: number) {
    return Line.prototype.tangentAtLength.call(this, length)
  }

  isDifferentiable() {
    if (this.previousSegment == null) {
      return false
    }

    return !this.start.equals(this.end)
  }

  equals(s: Segment) {
    return Line.prototype.equals.call(this, s)
  }

  clone() {
    return (new LineTo(this.end) as any) as Segment
  }

  scale(
    sx: number,
    sy: number,
    origin?: Point | Point.PointLike | Point.PointData,
  ) {
    this.end.scale(sx, sy, origin)
    return this
  }

  translate(tx: number, ty: number) {
    this.end.translate(tx, ty)
    return this
  }

  serialize() {
    const end = this.end
    return `${this.type} ${end.x} ${end.y}`
  }

  toString() {
    return `${this.type} ${this.start.toString()} ${this.end.toString()}`
  }
}
