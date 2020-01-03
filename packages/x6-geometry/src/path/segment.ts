import { Point } from '../point'
import { Line } from '../line'
import { Rectangle } from '../rectangle'

export abstract class Segment {
  isSegment = true
  isSubpathStart = false
  isVisible = true
  nextSegment: Segment | null
  previousSegment: Segment | null
  subpathStartSegment: Segment | null

  end: Point

  get start() {
    if (this.previousSegment == null) {
      throw new Error(
        'Missing previous segment. (This segment cannot be the ' +
          'first segment of a path, or segment has not yet been ' +
          'added to a path.)',
      )
    }

    return this.previousSegment.end
  }

  abstract get type(): string
  abstract bbox(): Rectangle | null
  abstract closestPoint(p: Point | Point.PointLike | Point.PointData): Point
  abstract closestPointLength(
    p: Point | Point.PointLike | Point.PointData,
  ): number
  abstract closestPointNormalizedLength(
    p: Point | Point.PointLike | Point.PointData,
  ): number
  closestPointT(
    p: Point | Point.PointLike | Point.PointData,
    options?: Segment.Options,
  ) {
    if (this.closestPointNormalizedLength) {
      return this.closestPointNormalizedLength(p)
    }

    throw new Error(
      'Neither `closestPointT` nor `closestPointNormalizedLength` method is implemented.',
    )
  }

  abstract closestPointTangent(
    p: Point | Point.PointLike | Point.PointData,
  ): Line | null

  abstract length(options?: Segment.Options): number

  lengthAtT(t: number, options?: Segment.Options) {
    if (t <= 0) {
      return 0
    }

    const length = this.length()
    if (t >= 1) {
      return length
    }

    return length * t
  }

  abstract divideAt(
    ratio: number,
    options?: Segment.Options,
  ): [Segment, Segment]
  abstract divideAtLength(
    length: number,
    options?: Segment.Options,
  ): [Segment, Segment]
  divideAtT(t: number) {
    if (this.divideAt) {
      return this.divideAt(t)
    }

    throw new Error('Neither `divideAtT` nor `divideAt` method is implemented.')
  }
  abstract getSubdivisions(options?: Segment.Options): Segment[]

  abstract pointAt(ratio: number): Point
  abstract pointAtLength(length: number, options?: Segment.Options): Point
  pointAtT(t: number): Point {
    if (this.pointAt) {
      return this.pointAt(t)
    }

    throw new Error('Neither `pointAtT` nor `pointAt` method is implemented.')
  }

  abstract tangentAt(ratio: number): Line | null
  abstract tangentAtLength(
    length: number,
    options?: Segment.Options,
  ): Line | null
  tangentAtT(t: number): Line | null {
    if (this.tangentAt) {
      return this.tangentAt(t)
    }

    throw new Error(
      'Neither `tangentAtT` nor `tangentAt` method is implemented.',
    )
  }

  abstract isDifferentiable(): boolean
  abstract scale(
    sx: number,
    sy: number,
    origin?: Point | Point.PointLike | Point.PointData,
  ): this
  abstract translate(tx: number, ty: number): this
  abstract equals(s: Segment): boolean
  abstract clone(): Segment
  abstract toString(): string
  abstract serialize(): string
}

export namespace Segment {
  export interface Options {
    precision?: number
    subdivisions?: Segment[]
  }
}
