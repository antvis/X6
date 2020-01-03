import { Line } from '../line'
import { Curve } from '../curve'
import { Point } from '../point'
import { Segment } from './segment'

export class MoveTo extends Segment {
  isSubpathStart: true
  isVisible: false

  constructor(line: Line)
  constructor(curve: Curve)
  constructor(x: number, y: number)
  constructor(p: Point | Point.PointLike | Point.PointData)
  constructor(
    x: number | Curve | Line | (Point | Point.PointLike | Point.PointData),
    y?: number,
  ) {
    super()

    if (x instanceof Line || x instanceof Curve) {
      this.end = x.end.clone()
    } else {
      this.end = Point.create(x, y)
    }
  }

  get start(): Point {
    throw new Error(
      'Illegal access. Moveto segments should not need a start property.',
    )
  }

  get type() {
    return 'M'
  }

  bbox() {
    return null
  }

  closestPoint() {
    return this.end.clone()
  }

  closestPointLength() {
    return 0
  }

  closestPointNormalizedLength() {
    return 0
  }

  closestPointT() {
    return 1
  }

  closestPointTangent() {
    return null
  }

  length() {
    return 0
  }

  lengthAtT() {
    return 0
  }

  divideAt(): [Segment, Segment] {
    return [this.clone(), this.clone()]
  }

  divideAtLength(): [Segment, Segment] {
    return [this.clone(), this.clone()]
  }

  getSubdivisions() {
    return []
  }

  pointAt() {
    return this.end.clone()
  }
  pointAtLength() {
    return this.end.clone()
  }

  pointAtT() {
    return this.end.clone()
  }

  tangentAt() {
    return null
  }

  tangentAtLength() {
    return null
  }

  tangentAtT() {
    return null
  }

  isDifferentiable() {
    return false
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

  clone() {
    return (new MoveTo(this.end) as any) as Segment
  }

  equals(c: Segment) {
    return this.end.equals(c.end)
  }

  toString() {
    return `${this.type} ${this.end.toString()}`
  }

  serialize() {
    const end = this.end
    return `${this.type} ${end.x} ${end.y}`
  }
}
