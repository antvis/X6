import { Line } from '../line'
import { Point } from '../point'
import { LineTo } from './lineto'
import { Segment } from './segment'

export class Close extends Segment {
  get end() {
    if (!this.subpathStartSegment) {
      throw new Error(
        'Missing subpath start segment. (This segment needs a subpath ' +
          'start segment (e.g. MoveTo), or segment has not yet been added' +
          ' to a path.)',
      )
    }

    return this.subpathStartSegment.end
  }

  get type() {
    return 'Z'
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
    return [
      // do not actually cut into the segment, first divided part can stay as Z
      divided[1].isDifferentiable() ? new LineTo(divided[0]) : this.clone(),
      new LineTo(divided[1]),
    ]
  }

  divideAtLength(length: number): [Segment, Segment] {
    const line = new Line(this.start, this.end)
    const divided = line.divideAtLength(length)
    return [
      divided[1].isDifferentiable() ? new LineTo(divided[0]) : this.clone(),
      new LineTo(divided[1]),
    ]
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
    if (!this.previousSegment || !this.subpathStartSegment) {
      return false
    }

    return !this.start.equals(this.end)
  }

  scale() {
    return this
  }

  translate() {
    return this
  }

  equals(s: Segment) {
    return Line.prototype.equals.call(this, s)
  }

  clone() {
    return new Close()
  }

  toString() {
    return `${this.type} ${this.start.toString()} ${this.end.toString()}`
  }

  serialize() {
    return this.type
  }
}
