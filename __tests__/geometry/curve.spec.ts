import { describe, it, expect } from 'vitest'
import { Curve, Point, Rectangle, Polyline, Line } from '../../src'

describe('Curve', () => {
  const start = new Point(0, 0)
  const cp1 = new Point(0, 10)
  const cp2 = new Point(10, 10)
  const end = new Point(10, 0)

  const curve = new Curve(start, cp1, cp2, end)

  it('should construct correctly', () => {
    expect(curve.start.equals(start)).toBe(true)
    expect(curve.end.equals(end)).toBe(true)
    expect(curve.controlPoint1.equals(cp1)).toBe(true)
    expect(curve.controlPoint2.equals(cp2)).toBe(true)
  })

  it('bbox() should return a Rectangle containing the curve', () => {
    const box = curve.bbox()
    expect(box).toBeInstanceOf(Rectangle)
    expect(box.width).toBeGreaterThan(0)
    expect(box.height).toBeGreaterThan(0)
  })

  it('endpointDistance() should compute straight-line distance', () => {
    expect(curve.endpointDistance()).toBeCloseTo(10, 5)
  })

  it('getSkeletonPoints() works for t=0, t=1 and 0<t<1', () => {
    const s0 = curve.getSkeletonPoints(0)
    expect(s0.divider.equals(start)).toBe(true)

    const s1 = curve.getSkeletonPoints(1)
    expect(s1.divider.equals(end)).toBe(true)

    const mid = curve.getSkeletonPoints(0.5)
    expect(mid.divider).toBeInstanceOf(Point)
  })

  it('divideAtT should split the curve correctly', () => {
    const [c1, c2] = curve.divideAtT(0.5)
    expect(c1).toBeInstanceOf(Curve)
    expect(c2).toBeInstanceOf(Curve)

    const [c3, c4] = curve.divideAtT(0)
    expect(c3.start.equals(c3.end)).toBe(true)

    const [c5, c6] = curve.divideAtT(1)
    expect(c6.start.equals(c6.end)).toBe(true)
  })

  it('length() should be positive and lengthAtT <= total length', () => {
    const len = curve.length()
    expect(len).toBeGreaterThan(0)
    expect(curve.lengthAtT(0.5)).toBeLessThanOrEqual(len)
  })

  it('pointAt and pointAtT should return points on curve', () => {
    expect(curve.pointAt(0).equals(start)).toBe(true)
    expect(curve.pointAt(1).equals(end)).toBe(true)
    expect(curve.pointAt(0.5)).toBeInstanceOf(Point)

    expect(curve.pointAtT(0).equals(start)).toBe(true)
    expect(curve.pointAtT(1).equals(end)).toBe(true)
  })

  it('tangentAt / tangentAtLength / tangentAtT should return Line or null', () => {
    const tan = curve.tangentAt(0.5)
    expect(tan).toBeInstanceOf(Line)

    const tan2 = curve.tangentAtLength(curve.length() / 2)
    expect(tan2).toBeInstanceOf(Line)

    const collapsed = new Curve(start, start, start, start)
    expect(collapsed.tangentAt(0.5)).toBeNull()
    expect(collapsed.tangentAtLength(1)).toBeNull()
    expect(collapsed.tangentAtT(0.5)).toBeNull()
  })

  it('closestPoint / closestPointT / closestPointLength / closestPointNormalizedLength', () => {
    const p = new Point(5, 5)
    const cp = curve.closestPoint(p)
    expect(cp).toBeInstanceOf(Point)

    const t = curve.closestPointT(p)
    expect(typeof t).toBe('number')

    const l = curve.closestPointLength(p)
    expect(l).toBeGreaterThan(0)

    const nl = curve.closestPointNormalizedLength(p)
    expect(nl).toBeGreaterThanOrEqual(0)
    expect(nl).toBeLessThanOrEqual(1)
  })

  it('containsPoint should check polyline containment', () => {
    const p = new Point(5, 5)
    expect(curve.containsPoint(p)).toBeTypeOf('boolean')
  })

  it('divideAt and divideAtLength should split properly', () => {
    const [a, b] = curve.divideAt(0.3)
    expect(a).toBeInstanceOf(Curve)
    expect(b).toBeInstanceOf(Curve)

    const [c, d] = curve.divideAtLength(curve.length() / 2)
    expect(c).toBeInstanceOf(Curve)
    expect(d).toBeInstanceOf(Curve)
  })

  it('toPoints / toPolyline return valid results', () => {
    const points = curve.toPoints()
    expect(points.length).toBeGreaterThan(2)
    const poly = curve.toPolyline()
    expect(poly).toBeInstanceOf(Polyline)
  })

  it('scale / rotate / translate should mutate curve and return itself', () => {
    const c2 = curve.clone().scale(2, 2)
    expect(c2.start.x).toBeCloseTo(0)

    const c3 = curve.clone().rotate(90, new Point(0, 0))
    expect(c3).toBeInstanceOf(Curve)

    const c4 = curve.clone().translate(5, 5)
    expect(c4.start.x).toBeGreaterThan(0)

    const c5 = curve.clone().translate(new Point(1, 1))
    expect(c5.start.x).toBeGreaterThan(0)
  })

  it('equals, clone, toJSON, serialize', () => {
    const c2 = curve.clone()
    expect(curve.equals(c2)).toBe(true)
    expect(curve.toJSON()).toHaveProperty('start')
    expect(typeof curve.serialize()).toBe('string')
  })

  it('Curve.isCurve works correctly', () => {
    expect(Curve.isCurve(curve)).toBe(true)
    expect(Curve.isCurve(null)).toBe(false)
  })

  it('Curve.throughPoints should generate curves', () => {
    const points = [new Point(0, 0), new Point(5, 5), new Point(10, 0)]
    const curves = Curve.throughPoints(points)
    expect(Array.isArray(curves)).toBe(true)
    expect(curves[0]).toBeInstanceOf(Curve)
  })

  it('Curve.throughPoints should throw on invalid input', () => {
    expect(() => Curve.throughPoints([])).toThrowError()
    expect(() => Curve.throughPoints(null as any)).toThrowError()
  })
})
