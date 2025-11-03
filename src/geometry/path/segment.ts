import { Geometry } from '../geometry'
import { Line } from '../line'
import { Point, PointOptions } from '../point'
import { Rectangle } from '../rectangle'

export interface SegmentOptions {
  precision?: number
  subdivisions?: Segment[]
}
export abstract class Segment extends Geometry {
  isVisible = true
  isSegment = true
  isSubpathStart = false
  nextSegment: Segment | null
  previousSegment: Segment | null
  subpathStartSegment: Segment | null
  protected endPoint: Point

  get end() {
    return this.endPoint
  }

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

  abstract closestPoint(p: PointOptions): Point

  abstract closestPointLength(p: PointOptions): number

  abstract closestPointNormalizedLength(p: PointOptions): number

  closestPointT(
    p: PointOptions,
    options?: SegmentOptions, // eslint-disable-line
  ) {
    if (this.closestPointNormalizedLength) {
      return this.closestPointNormalizedLength(p)
    }

    throw new Error(
      'Neither `closestPointT` nor `closestPointNormalizedLength` method is implemented.',
    )
  }

  abstract closestPointTangent(p: PointOptions): Line | null

  abstract length(options?: SegmentOptions): number

  // eslint-disable-next-line
  lengthAtT(t: number, options?: SegmentOptions) {
    if (t <= 0) {
      return 0
    }

    const length = this.length()
    if (t >= 1) {
      return length
    }

    return length * t
  }

  abstract divideAt(ratio: number, options?: SegmentOptions): [Segment, Segment]

  abstract divideAtLength(
    length: number,
    options?: SegmentOptions,
  ): [Segment, Segment]

  divideAtT(t: number) {
    if (this.divideAt) {
      return this.divideAt(t)
    }

    throw new Error('Neither `divideAtT` nor `divideAt` method is implemented.')
  }

  abstract getSubdivisions(options?: SegmentOptions): Segment[]

  abstract pointAt(ratio: number): Point

  abstract pointAtLength(length: number, options?: SegmentOptions): Point

  pointAtT(t: number): Point {
    if (this.pointAt) {
      return this.pointAt(t)
    }

    throw new Error('Neither `pointAtT` nor `pointAt` method is implemented.')
  }

  abstract tangentAt(ratio: number): Line | null

  abstract tangentAtLength(
    length: number,
    options?: SegmentOptions,
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

  abstract clone(): Segment
}
