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

  bbox() {
    return Curve.prototype.bbox.call(this)
  }

  closestPoint(p: Point | Point.PointLike | Point.PointData) {
    return Curve.prototype.closestPoint.call(this, p)
  }

  closestPointLength(p: Point | Point.PointLike | Point.PointData) {
    return Curve.prototype.closestPointLength.call(this, p)
  }

  closestPointNormalizedLength(p: Point | Point.PointLike | Point.PointData) {
    return Curve.prototype.closestPointNormalizedLength.call(this, p)
  }

  closestPointTangent(p: Point | Point.PointLike | Point.PointData) {
    return Curve.prototype.closestPointTangent.call(this, p)
  }

  length() {
    return Curve.prototype.length.call(this)
  }

  divideAt(ratio: number, options: Segment.Options = {}): [Segment, Segment] {
    const curve = new Curve(
      this.start,
      this.controlPoint1,
      this.controlPoint2,
      this.end,
    )
    // TODO: fix options
    const divided = curve.divideAt(ratio, options as any)
    return [new CurveTo(divided[0]), new CurveTo(divided[1])]
  }

  divideAtLength(
    length: number,
    options: Segment.Options = {},
  ): [Segment, Segment] {
    const curve = new Curve(
      this.start,
      this.controlPoint1,
      this.controlPoint2,
      this.end,
    )
    // TODO: fix options
    const divided = curve.divideAtLength(length, options as any)
    return [new CurveTo(divided[0]), new CurveTo(divided[1])]
  }

  divideAtT(t: number): [Segment, Segment] {
    const curve = new Curve(
      this.start,
      this.controlPoint1,
      this.controlPoint2,
      this.end,
    )
    const divided = curve.divideAtT(t)
    return [new CurveTo(divided[0]), new CurveTo(divided[1])]
  }

  getSubdivisions() {
    return []
  }

  pointAt(ratio: number) {
    return Curve.prototype.pointAt.call(this, ratio)
  }

  pointAtLength(length: number) {
    return Curve.prototype.pointAtLength.call(this, length)
  }

  tangentAt(ratio: number) {
    return Curve.prototype.tangentAt.call(this, ratio)
  }

  tangentAtLength(length: number) {
    return Curve.prototype.tangentAtLength.call(this, length)
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

  translate(tx: number, ty: number) {
    this.controlPoint1.translate(tx, ty)
    this.controlPoint2.translate(tx, ty)
    this.end.translate(tx, ty)
    return this
  }

  equals(s: Segment) {
    return Curve.prototype.equals.call(this, s)
  }

  clone() {
    return (new CurveTo(
      this.controlPoint1,
      this.controlPoint2,
      this.end,
    ) as any) as Segment
  }

  toString() {
    return [
      this.type,
      this.start.toString(),
      this.controlPoint1.toString(),
      this.controlPoint2.toString(),
      this.end.toString(),
    ].join(' ')
  }

  serialize() {
    const c1 = this.controlPoint1
    const c2 = this.controlPoint2
    const end = this.end
    return [this.type, c1.x, c1.y, c2.x, c2.y, end.x, end.y].join(' ')
  }
}
