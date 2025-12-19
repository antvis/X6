import { describe, expect, it } from 'vitest'
import { Curve, Point } from '../../../src'
import { CurveTo } from '../../../src/geometry/path/curveto'
import { MoveTo } from '../../../src/geometry/path/moveto'

describe('CurveTo', () => {
  const p0 = new Point(0, 0)
  const p1 = new Point(10, 0)
  const p2 = new Point(20, 10)
  const p3 = new Point(30, 0)
  const curve = new Curve(p0, p1, p2, p3)
  const previousSegment = new MoveTo(p0)

  it('should construct from Curve', () => {
    const c = new CurveTo(curve)
    expect(c.controlPoint1.equals(p1)).toBe(true)
    expect(c.controlPoint2.equals(p2)).toBe(true)
    expect(c.end.equals(p3)).toBe(true)
  })

  it('should construct from coordinates', () => {
    const c = new CurveTo(1, 2, 3, 4, 5, 6)
    expect(c.controlPoint1.equals(new Point(1, 2))).toBe(true)
    expect(c.controlPoint2.equals(new Point(3, 4))).toBe(true)
    expect(c.end.equals(new Point(5, 6))).toBe(true)
  })

  it('should construct from three points', () => {
    const c = new CurveTo({ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 })
    expect(c.controlPoint1.equals(new Point(1, 2))).toBe(true)
    expect(c.controlPoint2.equals(new Point(3, 4))).toBe(true)
    expect(c.end.equals(new Point(5, 6))).toBe(true)
  })

  it('type should be "C"', () => {
    const c = new CurveTo(curve)
    expect(c.type).toBe('C')
  })

  it('curve getter should return Curve instance', () => {
    const c = new CurveTo(curve)
    c.previousSegment = previousSegment
    const cc = c.curve
    expect(cc).toBeInstanceOf(Curve)
    expect(cc.end.equals(c.end)).toBe(true)
  })

  it('bbox / closestPoint / tangent / length should delegate to Curve', () => {
    const c = new CurveTo(curve)
    c.previousSegment = previousSegment
    expect(c.bbox()).toEqual(curve.bbox())
    expect(c.closestPoint({ x: 5, y: 1 })).toEqual(
      curve.closestPoint({ x: 5, y: 1 }),
    )
    expect(c.length()).toBeCloseTo(curve.length())
    expect(c.tangentAt(0.5)).toEqual(curve.tangentAt(0.5))
  })

  it('divideAtLength should return two CurveTo segments', () => {
    const c = new CurveTo(curve)
    c.previousSegment = previousSegment
    const [a, b] = c.divideAtLength(c.length() / 2)
    expect(a).toBeInstanceOf(CurveTo)
    expect(b).toBeInstanceOf(CurveTo)
  })

  it('divideAtT should return two CurveTo segments', () => {
    const c = new CurveTo(curve)
    c.previousSegment = previousSegment
    const [a, b] = c.divideAtT(0.5)
    expect(a).toBeInstanceOf(CurveTo)
    expect(b).toBeInstanceOf(CurveTo)
  })

  it('getSubdivisions should return []', () => {
    const c = new CurveTo(curve)
    expect(c.getSubdivisions()).toEqual([])
  })

  it('pointAt / pointAtLength / tangentAtLength should delegate to Curve', () => {
    const c = new CurveTo(curve)
    c.previousSegment = previousSegment
    expect(c.pointAt(0.5)).toEqual(curve.pointAt(0.5))
    expect(c.pointAtLength(c.length() / 2)).toEqual(
      curve.pointAtLength(c.length() / 2),
    )
    expect(c.tangentAtLength(c.length() / 2)).toEqual(
      curve.tangentAtLength(c.length() / 2),
    )
  })

  it('isDifferentiable should return false if no previousSegment', () => {
    const c = new CurveTo(curve)
    expect(c.isDifferentiable()).toBe(false)
  })

  it('isDifferentiable should detect degenerate curve', () => {
    const c = new CurveTo(new Point(0, 0), new Point(0, 0), new Point(0, 0))
    // fake previousSegment to bypass guard
    ;(c as any).previousSegment = { end: new Point(0, 0) }
    expect(c.isDifferentiable()).toBe(false)
  })

  it('scale / rotate / translate should transform points', () => {
    const c = new CurveTo(1, 2, 3, 4, 5, 6)
    c.scale(2, 2)
    expect(c.controlPoint1.x).toBe(2)
    c.rotate(90, { x: 0, y: 0 })
    c.translate(1, 1)
    expect(c.controlPoint1).toBeInstanceOf(Point)
  })

  it('translate with point-like should work', () => {
    const c = new CurveTo(1, 2, 3, 4, 5, 6)
    c.translate({ x: 10, y: 20 })
    expect(c.controlPoint1.x).toBe(11)
  })

  it('equals should compare control points and end', () => {
    const c1 = new CurveTo(1, 2, 3, 4, 5, 6)
    const c2 = new CurveTo(1, 2, 3, 4, 5, 6)
    const c3 = new CurveTo(7, 8, 9, 10, 11, 12)
    ;(c1 as any).previousSegment = { end: new Point(0, 0) }
    ;(c2 as any).previousSegment = { end: new Point(0, 0) }
    ;(c3 as any).previousSegment = { end: new Point(0, 0) }
    expect(c1.equals(c2)).toBe(true)
    expect(c1.equals(c3)).toBe(false)
  })

  it('divideAt should return two CurveTo segments', () => {
    const c = new CurveTo(curve)
    c.previousSegment = previousSegment
    const [a, b] = c.divideAt(0.5)
    expect(a).toBeInstanceOf(CurveTo)
    expect(b).toBeInstanceOf(CurveTo)
  })

  it('clone should produce equal CurveTo', () => {
    const c1 = new CurveTo(1, 2, 3, 4, 5, 6)
    c1.previousSegment = previousSegment
    const c2 = c1.clone()
    c2.previousSegment = previousSegment
    expect(c1.equals(c2)).toBe(true)
    expect(c1).not.toBe(c2)
  })

  it('toJSON should return serializable object', () => {
    const c = new CurveTo(1, 2, 3, 4, 5, 6)
    ;(c as any).previousSegment = { end: new Point(0, 0) }
    const json = c.toJSON()
    expect(json.type).toBe('C')
    expect(json.end).toEqual({ x: 5, y: 6 })
  })

  it('serialize should output string', () => {
    const c = new CurveTo(1, 2, 3, 4, 5, 6)
    expect(c.serialize()).toBe('C 1 2 3 4 5 6')
  })
})

describe('CurveTo.create', () => {
  const p1 = new Point(1, 2)
  const p2 = new Point(3, 4)
  const p3 = new Point(5, 6)

  it('should create from Curve', () => {
    const curve = new Curve(new Point(0, 0), p1, p2, p3)
    const c = CurveTo.create(curve) as CurveTo
    expect(c).toBeInstanceOf(CurveTo)
  })

  it('should create from three points', () => {
    const c = CurveTo.create(p1, p2, p3) as CurveTo
    expect(c).toBeInstanceOf(CurveTo)
  })

  it('should create multiple from poly-bezier points', () => {
    const segs = CurveTo.create(p1, p2, p3, p1, p2, p3) as CurveTo[]
    expect(segs.length).toBe(2)
    expect(segs[0]).toBeInstanceOf(CurveTo)
  })

  it('should create from 6 coordinates', () => {
    const c = CurveTo.create(1, 2, 3, 4, 5, 6) as CurveTo
    expect(c).toBeInstanceOf(CurveTo)
  })

  it('should create multiple from coordinate list', () => {
    const segs = CurveTo.create(
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
    ) as CurveTo[]
    expect(segs.length).toBe(2)
  })
})
