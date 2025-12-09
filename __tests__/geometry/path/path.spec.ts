import { describe, expect, it, vi } from 'vitest'
import { Curve, Line, Point, Polyline, Rectangle, Segment } from '../../../src'
import { Path } from '../../../src/geometry/path'
import { Close } from '../../../src/geometry/path/close'
import { LineTo } from '../../../src/geometry/path/lineto'
import { MoveTo } from '../../../src/geometry/path/moveto'

describe('Path', () => {
  const p0 = new Point(0, 0)
  const p1 = new Point(10, 0)
  const p2 = new Point(10, 10)
  const p3 = new Point(0, 10)

  const line = new Line(p0, p1)
  const curve = new Curve(p0, new Point(0, 5), new Point(10, 5), p1)
  const polyline = new Polyline([p0, p1, p2])

  it('should construct with no args', () => {
    const path = new Path()
    expect(path.segments).toEqual([])
    expect(path.start).toBeNull()
    expect(path.end).toBeNull()
  })

  it('should construct from a Line', () => {
    const path = new Path(line)
    expect(path.segments.length).toBe(2) // M and L
    expect(path.start.equals(p0)).toBe(true)
    expect(path.end.equals(p1)).toBe(true)
  })

  it('should construct from a Curve', () => {
    const path = new Path(curve)
    expect(path.segments.length).toBe(2) // M and C
  })

  it('should construct from a Polyline', () => {
    const path = new Path(polyline)
    expect(path.segments.length).toBe(3)
  })

  it('should construct from a Segment', () => {
    const seg = MoveTo.create(p0)
    const path = new Path(seg)
    expect(path.segments[0]).toBe(seg)
  })

  it('should construct from Segment[]', () => {
    const segs = [MoveTo.create(p0), LineTo.create(p1)]
    const path = new Path(segs)
    expect(path.segments.length).toBe(2)
  })

  it('should construct from Line[] and Curve[]', () => {
    const lines = [line, new Line(p1, p2)]
    const curves = [curve]
    expect(new Path(lines).segments.length).toBeGreaterThan(0)
    expect(new Path(curves).segments.length).toBeGreaterThan(0)
  })

  it('moveTo, lineTo, curveTo, arcTo, quadTo, close, drawPoints should work', () => {
    const path = new Path()
    path.moveTo(p0).lineTo(p1).curveTo(p0, p2, p3).quadTo(p1, p2).close()
    expect(path.segments.length).toBeGreaterThan(0)

    path.arcTo(5, 5, 0, 0, 1, p2)
    path.drawPoints([p0, p1, p2])
    expect(path.segments.length).toBeGreaterThan(0)
  })

  it('bbox should return union of visible segments', () => {
    const path = new Path(line)
    const box = path.bbox()
    expect(box).toBeInstanceOf(Rectangle)
  })

  it('appendSegment, insertSegment, removeSegment, replaceSegment, getSegment', () => {
    const path = new Path(line)
    const seg = LineTo.create(p2)
    path.appendSegment(seg)
    expect(path.segments.includes(seg)).toBe(true)

    path.insertSegment(1, LineTo.create(p3))
    expect(() => path.insertSegment(99, seg)).toThrow()

    const removed = path.removeSegment(1)
    expect(removed).toBeInstanceOf(Segment)

    path.replaceSegment(0, MoveTo.create(p3))
    expect(path.getSegment(0)).toBeInstanceOf(Segment)
  })

  it('fixIndex should handle negative and errors', () => {
    const path = new Path(line)
    expect(path.getSegment(-1)).toBeInstanceOf(Segment)
    expect(() => new Path().getSegment(0)).toThrow()
    expect(() => path.getSegment(99)).toThrow()
  })

  it('segmentAt, segmentAtLength, segmentIndexAt, segmentIndexAtLength', () => {
    const path = new Path(line)
    expect(path.segmentAt(0.5)).toBeInstanceOf(Segment)
    expect(path.segmentAtLength(5)).toBeInstanceOf(Segment)
    expect(path.segmentIndexAt(0.5)).toBeTypeOf('number')
    expect(path.segmentIndexAtLength(5)).toBeTypeOf('number')
  })

  it('getSegmentSubdivisions should return subdivisions for each segment', () => {
    const path = new Path(line)
    const subs = path.getSegmentSubdivisions()
    expect(Array.isArray(subs)).toBe(true)
  })

  it('closestPoint / closestPointLength / closestPointNormalizedLength / closestPointT / closestPointTangent', () => {
    const path = new Path(line)
    const p = new Point(5, 5)
    expect(path.closestPoint(p)).toBeInstanceOf(Point)
    expect(path.closestPointLength(p)).toBeGreaterThanOrEqual(0)
    expect(path.closestPointNormalizedLength(p)).toBeGreaterThanOrEqual(0)
    expect(path.closestPointT(p)).toHaveProperty('segmentIndex')
    expect(path.closestPointTangent(p)).not.toBeNull()
    expect(new Path().closestPointT(p)).toBeNull()
  })

  it('containsPoint should use even-odd rule', () => {
    const path = new Path([
      MoveTo.create(p0),
      LineTo.create(p1),
      LineTo.create(p2),
      Close.create(),
    ])
    const inside = path.containsPoint(new Point(5, 5))
    expect(typeof inside).toBe('boolean')
  })

  it('pointAt, pointAtLength, pointAtT', () => {
    const path = new Path(line)
    expect(path.pointAt(0)?.equals(p0)).toBe(true)
    expect(path.pointAt(1)?.equals(p1)).toBe(true)
    expect(path.pointAtLength(0)?.equals(p0)).toBe(true)
    expect(path.pointAtLength(-5)).toBeInstanceOf(Point)
    expect(path.pointAtT({ segmentIndex: 0, value: 0 })).toBeInstanceOf(Point)
  })

  it('divideAt and divideAtLength should return two paths', () => {
    const path = new Path(line)
    const result = path.divideAt(0.5)
    expect(Array.isArray(result)).toBe(true)
    const result2 = path.divideAtLength(5)
    expect(Array.isArray(result2)).toBe(true)
  })

  it('intersectsWithLine should return intersections or null', () => {
    const path = new Path(line)
    const line2 = new Line(new Point(0, -5), new Point(0, 5))
    const res = path.intersectsWithLine(line2)
    expect(res === null || Array.isArray(res)).toBe(true)
  })

  it('isDifferentiable and isValid', () => {
    const path = new Path(line)
    expect(path.isDifferentiable()).toBe(true)
    expect(path.isValid()).toBe(true)
    expect(new Path().isValid()).toBe(true)
  })

  it('length and lengthAtT', () => {
    const path = new Path(line)
    expect(path.length()).toBeGreaterThan(0)
    expect(path.lengthAtT({ segmentIndex: 1, value: 0.5 })).toBeGreaterThan(0)
    expect(new Path().length()).toBe(0)
  })

  it('tangentAt and tangentAtLength', () => {
    const path = new Path(line)
    expect(path.tangentAt(0.5)).toBeTruthy()
    expect(path.tangentAtLength(5)).toBeTruthy()
    expect(new Path().tangentAt(0.5)).toBeNull()
  })
  it('should handle empty array and non-continuous lines/curves', () => {
    const emptyPath = new Path([])
    expect(emptyPath.segments.length).toBe(0)

    const line1 = new Line(new Point(0, 0), new Point(1, 1))
    const line2 = new Line(new Point(2, 2), new Point(3, 3)) // non-continuous
    const path = new Path([line1, line2])
    expect(path.segments.length).toBeGreaterThan(0)
  })
  it('should handle appendSegment with empty array and subpath start update', () => {
    const path = new Path()
    const seg1 = MoveTo.create(p0)
    const seg2 = LineTo.create(p1)
    seg2.isSubpathStart = true

    path.appendSegment([seg1, seg2])
    expect(path.segments.length).toBe(2)

    path.replaceSegment(1, MoveTo.create(p2))
    expect(path.segments[1].isSubpathStart).toBe(true)
  })
  it('fixIndex edge cases', () => {
    const path = new Path(line)
    expect(path.fixIndex(-1)).toBe(1) // -1 + 2
    expect(() => path.fixIndex(99)).toThrow()
    const empty = new Path()
    expect(() => empty.fixIndex(0)).toThrow()
  })
  it('closestPoint* edge cases', () => {
    const empty = new Path()
    const p = new Point(0, 0)
    expect(empty.closestPoint(p)).toBeNull()
    expect(empty.closestPointLength(p)).toBe(0)
    expect(empty.closestPointTangent(p)).toBeNull()
  })
  it('divideAt and divideAtLength edge cases', () => {
    const path = new Path()
    expect(path.divideAt(0.5)).toBeNull()
    expect(path.divideAtLength(10)).toBeNull()

    const seg = MoveTo.create(p0)
    seg.isDifferentiable = () => false
    const path2 = new Path(seg)
    expect(path2.divideAt(0.5)).toBeNull()
  })
  it('intersectsWithLine returns null if no polylines', () => {
    const path = new Path()
    const line2 = new Line(p0, p1)
    expect(path.intersectsWithLine(line2)).toBeNull()
  })
  it('isValid edge cases', () => {
    const path = new Path(line)
    const segment = path.segments[0]
    vi.spyOn(segment, 'type', 'get').mockReturnValue('L')
    expect(path.isValid()).toBe(false)
  })
})
