import { Line } from '../line'
import { Curve } from '../curve'
import { Point } from '../point'
import { Segment } from './segment'

export class MoveTo extends Segment {
  constructor(line: Line)
  constructor(curve: Curve)
  constructor(x: number, y: number)
  constructor(p: Point | Point.PointLike | Point.PointData)
  constructor(
    x: number | Curve | Line | (Point | Point.PointLike | Point.PointData),
    y?: number,
  ) {
    super()

    this.isVisible = false
    this.isSubpathStart = true

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

  translate(tx: number, ty: number): this
  translate(p: Point | Point.PointLike | Point.PointData): this
  translate(
    tx: number | Point | Point.PointLike | Point.PointData,
    ty?: number,
  ) {
    if (typeof tx === 'number') {
      this.end.translate(tx, ty as number)
    } else {
      this.end.translate(tx)
    }
    return this
  }

  clone() {
    return new MoveTo(this.end)
  }

  equals(s: Segment) {
    return this.type === s.type && this.end.equals(s.end)
  }

  toJSON() {
    return {
      type: this.type,
      end: this.end.toJSON(),
    }
  }

  serialize() {
    const end = this.end
    return `${this.type} ${end.x} ${end.y}`
  }
}
