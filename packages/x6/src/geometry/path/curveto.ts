import { Curve } from '../curve'
import { Point } from '../point'
import { Segment } from './segment'

export class CurveTo extends Segment {
  controlPoint1: Point
  controlPoint2: Point

  constructor(curve: Curve)
  constructor(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  )
  constructor(
    p1: Point | Point.PointLike | Point.PointData,
    p2: Point | Point.PointLike | Point.PointData,
    p3: Point | Point.PointLike | Point.PointData,
  )
  constructor(
    arg0: number | Curve | (Point | Point.PointLike | Point.PointData),
    arg1?: number | (Point | Point.PointLike | Point.PointData),
    arg2?: number | (Point | Point.PointLike | Point.PointData),
    arg3?: number,
    arg4?: number,
    arg5?: number,
  ) {
    super()

    if (arg0 instanceof Curve) {
      this.controlPoint1 = arg0.controlPoint1.clone()
      this.controlPoint2 = arg0.controlPoint2.clone()
      this.end = arg0.end.clone()
    } else if (typeof arg0 === 'number') {
      this.controlPoint1 = new Point(arg0, arg1 as number)
      this.controlPoint2 = new Point(arg2 as number, arg3)
      this.end = new Point(arg4, arg5)
    } else {
      this.controlPoint1 = Point.create(arg0)
      this.controlPoint2 = Point.create(arg1)
      this.end = Point.create(arg2)
    }
  }

  get type() {
    return 'C'
  }

  get curve() {
    return new Curve(
      this.start,
      this.controlPoint1,
      this.controlPoint2,
      this.end,
    )
  }

  bbox() {
    return this.curve.bbox()
  }

  closestPoint(p: Point | Point.PointLike | Point.PointData) {
    return this.curve.closestPoint(p)
  }

  closestPointLength(p: Point | Point.PointLike | Point.PointData) {
    return this.curve.closestPointLength(p)
  }

  closestPointNormalizedLength(p: Point | Point.PointLike | Point.PointData) {
    return this.curve.closestPointNormalizedLength(p)
  }

  closestPointTangent(p: Point | Point.PointLike | Point.PointData) {
    return this.curve.closestPointTangent(p)
  }

  length() {
    return this.curve.length()
  }

  divideAt(ratio: number, options: Segment.Options = {}): [Segment, Segment] {
    // TODO: fix options
    const divided = this.curve.divideAt(ratio, options as any)
    return [new CurveTo(divided[0]), new CurveTo(divided[1])]
  }

  divideAtLength(
    length: number,
    options: Segment.Options = {},
  ): [Segment, Segment] {
    // TODO: fix options
    const divided = this.curve.divideAtLength(length, options as any)
    return [new CurveTo(divided[0]), new CurveTo(divided[1])]
  }

  divideAtT(t: number): [Segment, Segment] {
    const divided = this.curve.divideAtT(t)
    return [new CurveTo(divided[0]), new CurveTo(divided[1])]
  }

  getSubdivisions() {
    return []
  }

  pointAt(ratio: number) {
    return this.curve.pointAt(ratio)
  }

  pointAtLength(length: number) {
    return this.curve.pointAtLength(length)
  }

  tangentAt(ratio: number) {
    return this.curve.tangentAt(ratio)
  }

  tangentAtLength(length: number) {
    return this.curve.tangentAtLength(length)
  }

  isDifferentiable() {
    if (!this.previousSegment) {
      return false
    }

    const start = this.start
    const control1 = this.controlPoint1
    const control2 = this.controlPoint2
    const end = this.end

    return !(
      start.equals(control1) &&
      control1.equals(control2) &&
      control2.equals(end)
    )
  }

  scale(
    sx: number,
    sy: number,
    origin?: Point | Point.PointLike | Point.PointData,
  ) {
    this.controlPoint1.scale(sx, sy, origin)
    this.controlPoint2.scale(sx, sy, origin)
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
      this.controlPoint1.translate(tx, ty as number)
      this.controlPoint2.translate(tx, ty as number)
      this.end.translate(tx, ty as number)
    } else {
      this.controlPoint1.translate(tx)
      this.controlPoint2.translate(tx)
      this.end.translate(tx)
    }

    return this
  }

  equals(s: Segment) {
    return (
      this.start.equals(s.start) &&
      this.end.equals(s.end) &&
      this.controlPoint1.equals((s as any).controlPoint1) &&
      this.controlPoint2.equals((s as any).controlPoint2)
    )
  }

  clone() {
    return new CurveTo(this.controlPoint1, this.controlPoint2, this.end)
  }

  toJSON() {
    return {
      type: this.type,
      start: this.start.toJSON(),
      controlPoint1: this.controlPoint1.toJSON(),
      controlPoint2: this.controlPoint2.toJSON(),
      end: this.end.toJSON(),
    }
  }

  serialize() {
    const c1 = this.controlPoint1
    const c2 = this.controlPoint2
    const end = this.end
    return [this.type, c1.x, c1.y, c2.x, c2.y, end.x, end.y].join(' ')
  }
}
