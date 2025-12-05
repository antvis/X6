import { describe, expect, it } from 'vitest'
import { Line, Point, Rectangle } from '../../../src/geometry'
import { Segment } from '../../../src/geometry/path/segment'

// Dummy 实现，用于测试 Segment 基类逻辑
class DummySegment extends Segment {
  type = 'dummy'

  constructor(start: Point, end: Point) {
    super()
    this.previousSegment = { end: start } as any
    this.nextSegment = null
    this.subpathStartSegment = null
    this.endPoint = end
  }

  bbox(): Rectangle | null {
    return new Rectangle(this.start.x, this.start.y, 10, 10)
  }

  closestPoint(p: Point.PointLike | Point.PointData): Point {
    return Point.create(p)
  }

  closestPointLength(): number {
    return 5
  }

  closestPointNormalizedLength(): number {
    return 0.5
  }

  closestPointTangent(): Line {
    return new Line(this.start, this.end)
  }

  length(): number {
    return 10
  }

  divideAt(): [Segment, Segment] {
    return [this, this.clone()]
  }

  divideAtLength(): [Segment, Segment] {
    return [this, this.clone()]
  }

  getSubdivisions(): Segment[] {
    return [this.clone()]
  }

  pointAt(): Point {
    return this.start.clone()
  }

  pointAtLength(): Point {
    return this.end.clone()
  }

  tangentAt(): Line {
    return new Line(this.start, this.end)
  }

  tangentAtLength(): Line {
    return new Line(this.start, this.end)
  }

  isDifferentiable(): boolean {
    return true
  }

  clone(): Segment {
    return new DummySegment(this.start.clone(), this.end.clone())
  }
}

describe('Segment 基类', () => {
  const start = new Point(0, 0)
  const end = new Point(10, 0)
  const seg = new DummySegment(start, end)

  it('should expose start and end points', () => {
    expect(seg.start).toEqual(start)
    expect(seg.end).toEqual(end)
  })

  it('bbox should return rectangle', () => {
    const box = seg.bbox()
    expect(box).toBeInstanceOf(Rectangle)
  })

  it('closestPoint / length should work', () => {
    expect(seg.closestPoint({ x: 1, y: 1 })).toBeInstanceOf(Point)
    expect(seg.closestPointLength({ x: 1, y: 1 })).toBe(5)
    expect(seg.closestPointNormalizedLength({ x: 1, y: 1 })).toBe(0.5)
    expect(seg.closestPointT({ x: 1, y: 1 })).toBe(0.5)
    expect(seg.closestPointTangent({ x: 1, y: 1 })).toBeInstanceOf(Line)
  })

  it('length and lengthAtT', () => {
    expect(seg.length()).toBe(10)
    expect(seg.lengthAtT(0)).toBe(0)
    expect(seg.lengthAtT(1)).toBe(10)
    expect(seg.lengthAtT(0.5)).toBe(5)
  })

  it('divideAt / divideAtLength / divideAtT', () => {
    const [s1, s2] = seg.divideAt(0.5)
    expect(s1).toBeInstanceOf(Segment)
    expect(s2).toBeInstanceOf(Segment)

    const [s3, s4] = seg.divideAtLength(5)
    expect(s3).toBeInstanceOf(Segment)
    expect(s4).toBeInstanceOf(Segment)

    const [s5, s6] = seg.divideAtT(0.5)
    expect(s5).toBeInstanceOf(Segment)
    expect(s6).toBeInstanceOf(Segment)
  })

  it('pointAt / pointAtLength / pointAtT', () => {
    expect(seg.pointAt(0)).toBeInstanceOf(Point)
    expect(seg.pointAtLength(5)).toBeInstanceOf(Point)
    expect(seg.pointAtT(0.5)).toBeInstanceOf(Point)
  })

  it('tangentAt / tangentAtLength / tangentAtT', () => {
    expect(seg.tangentAt(0)).toBeInstanceOf(Line)
    expect(seg.tangentAtLength(5)).toBeInstanceOf(Line)
    expect(seg.tangentAtT(0.5)).toBeInstanceOf(Line)
  })

  it('isDifferentiable and clone', () => {
    expect(seg.isDifferentiable()).toBe(true)
    expect(seg.clone()).toBeInstanceOf(Segment)
  })

  it('should throw if start accessed without previousSegment', () => {
    const broken = new DummySegment(start, end)
    ;(broken as any).previousSegment = null
    expect(() => broken.start).toThrowError()
  })
})

describe('Segment 基类', () => {
  const start = new Point(0, 0)
  const end = new Point(10, 0)
  const seg = new DummySegment(start, end)

  it('should expose start and end points', () => {
    expect(seg.start).toEqual(start)
    expect(seg.end).toEqual(end)
  })

  it('bbox should return rectangle', () => {
    const box = seg.bbox()
    expect(box).toBeInstanceOf(Rectangle)
  })

  it('closestPoint / length should work', () => {
    expect(seg.closestPoint({ x: 1, y: 1 })).toBeInstanceOf(Point)
    expect(seg.closestPointLength({ x: 1, y: 1 })).toBe(5)
    expect(seg.closestPointNormalizedLength({ x: 1, y: 1 })).toBe(0.5)
    expect(seg.closestPointT({ x: 1, y: 1 })).toBe(0.5)
    expect(seg.closestPointTangent({ x: 1, y: 1 })).toBeInstanceOf(Line)
  })

  it('length and lengthAtT', () => {
    expect(seg.length()).toBe(10)
    expect(seg.lengthAtT(0)).toBe(0)
    expect(seg.lengthAtT(1)).toBe(10)
    expect(seg.lengthAtT(0.5)).toBe(5)
  })

  it('divideAt / divideAtLength / divideAtT', () => {
    const [s1, s2] = seg.divideAt(0.5)
    expect(s1).toBeInstanceOf(Segment)
    expect(s2).toBeInstanceOf(Segment)

    const [s3, s4] = seg.divideAtLength(5)
    expect(s3).toBeInstanceOf(Segment)
    expect(s4).toBeInstanceOf(Segment)

    const [s5, s6] = seg.divideAtT(0.5)
    expect(s5).toBeInstanceOf(Segment)
    expect(s6).toBeInstanceOf(Segment)
  })

  it('pointAt / pointAtLength / pointAtT', () => {
    expect(seg.pointAt(0)).toBeInstanceOf(Point)
    expect(seg.pointAtLength(5)).toBeInstanceOf(Point)
    expect(seg.pointAtT(0.5)).toBeInstanceOf(Point)
  })

  it('tangentAt / tangentAtLength / tangentAtT', () => {
    expect(seg.tangentAt(0)).toBeInstanceOf(Line)
    expect(seg.tangentAtLength(5)).toBeInstanceOf(Line)
    expect(seg.tangentAtT(0.5)).toBeInstanceOf(Line)
  })

  it('isDifferentiable and clone', () => {
    expect(seg.isDifferentiable()).toBe(true)
    expect(seg.clone()).toBeInstanceOf(Segment)
  })

  it('should throw if start accessed without previousSegment', () => {
    const broken = new DummySegment(start, end)
    ;(broken as any).previousSegment = null
    expect(() => broken.start).toThrowError()
  })
})
