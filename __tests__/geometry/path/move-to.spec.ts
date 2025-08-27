import { describe, it, expect } from 'vitest'
import { Curve, Point, Line } from '@'
import { MoveTo } from '@/geometry/path/moveTo'
import { LineTo } from '@/geometry/path/lineTo'

describe('MoveTo', () => {
  const p = new Point(10, 20)

  it('should construct with point', () => {
    const m = new MoveTo(p)
    expect(m.end.x).toBe(10)
    expect(m.end.y).toBe(20)
    expect(m.isVisible).toBe(false)
    expect(m.isSubpathStart).toBe(true)
  })

  it('should construct with coordinates', () => {
    const m = new MoveTo(5, 15)
    expect(m.end.x).toBe(5)
    expect(m.end.y).toBe(15)
  })

  it('should construct with Line', () => {
    const line = new Line(new Point(0, 0), new Point(30, 40))
    const m = new MoveTo(line)
    expect(m.end.equals(new Point(30, 40))).toBe(true)
  })

  it('should construct with Curve', () => {
    const c = new Curve(
      new Point(0, 0),
      new Point(10, 10),
      new Point(20, 20),
      new Point(30, 30),
    )
    const m = new MoveTo(c)
    expect(m.end.equals(new Point(30, 30))).toBe(true)
  })

  it('should throw when accessing start', () => {
    const m = new MoveTo(1, 2)
    expect(() => m.start).toThrow(/Illegal access/)
  })

  it('type should be "M"', () => {
    const m = new MoveTo(1, 2)
    expect(m.type).toBe('M')
  })

  it('bbox should return null', () => {
    const m = new MoveTo(1, 2)
    expect(m.bbox()).toBeNull()
  })

  it('closestPoint should return end clone', () => {
    const m = new MoveTo(1, 2)
    const cp = m.closestPoint()
    expect(cp).not.toBe(m.end) // clone
    expect(cp.equals(m.end)).toBe(true)
  })

  it('should have constant length/closest metrics', () => {
    const m = new MoveTo(1, 2)
    expect(m.closestPointLength()).toBe(0)
    expect(m.closestPointNormalizedLength()).toBe(0)
    expect(m.closestPointT()).toBe(1)
    expect(m.length()).toBe(0)
    expect(m.lengthAtT(0.5)).toBe(0)
  })

  it('divideAt and divideAtLength should return clones', () => {
    const m = new MoveTo(1, 2)
    const [a, b] = m.divideAt()
    expect(a.equals(m)).toBe(true)
    expect(b.equals(m)).toBe(true)

    const [c, d] = m.divideAtLength()
    expect(c.equals(m)).toBe(true)
    expect(d.equals(m)).toBe(true)
  })

  it('getSubdivisions should return empty array', () => {
    const m = new MoveTo(1, 2)
    expect(m.getSubdivisions()).toEqual([])
  })

  it('pointAt / pointAtLength / pointAtT should return end clone', () => {
    const m = new MoveTo(1, 2)
    expect(m.pointAt().equals(m.end)).toBe(true)
    expect(m.pointAtLength().equals(m.end)).toBe(true)
    expect(m.pointAtT().equals(m.end)).toBe(true)
  })

  it('tangentAt methods should return null', () => {
    const m = new MoveTo(1, 2)
    expect(m.tangentAt()).toBeNull()
    expect(m.tangentAtLength()).toBeNull()
    expect(m.tangentAtT()).toBeNull()
  })

  it('isDifferentiable should be false', () => {
    const m = new MoveTo(1, 2)
    expect(m.isDifferentiable()).toBe(false)
  })

  it('scale should modify end', () => {
    const m = new MoveTo(2, 3)
    m.scale(2, 2)
    expect(m.end.x).toBe(4)
    expect(m.end.y).toBe(6)
  })

  it('rotate should modify end', () => {
    const m = new MoveTo(10, 0)
    m.rotate(90, { x: 0, y: 0 })
    expect(Math.round(m.end.x)).toBeCloseTo(0)
    expect(Math.round(m.end.y)).toBe(-10)
  })

  it('translate with numbers should modify end', () => {
    const m = new MoveTo(1, 2)
    m.translate(5, 5)
    expect(m.end.x).toBe(6)
    expect(m.end.y).toBe(7)
  })

  it('translate with point should modify end', () => {
    const m = new MoveTo(1, 2)
    m.translate({ x: 3, y: 4 })
    expect(m.end.x).toBe(4)
    expect(m.end.y).toBe(6)
  })

  it('clone should produce equal but not same instance', () => {
    const m = new MoveTo(1, 2)
    const c = m.clone()
    expect(c.equals(m)).toBe(true)
    expect(c).not.toBe(m)
  })

  it('equals should compare type and end', () => {
    const a = new MoveTo(1, 2)
    const b = new MoveTo(1, 2)
    const c = new MoveTo(3, 4)
    expect(a.equals(b)).toBe(true)
    expect(a.equals(c)).toBe(false)
  })

  it('toJSON should return serializable object', () => {
    const m = new MoveTo(1, 2)
    expect(m.toJSON()).toEqual({
      type: 'M',
      end: { x: 1, y: 2 },
    })
  })

  it('serialize should return correct string', () => {
    const m = new MoveTo(1.123, 2.456)
    expect(m.serialize()).toBe('M 1.12 2.46') // round(2)
  })
})

describe('MoveTo.create', () => {
  it('should create from line', () => {
    const line = new Line(new Point(0, 0), new Point(5, 6))
    const m = MoveTo.create(line)
    expect(m).toBeInstanceOf(MoveTo)
    expect((m as MoveTo).end.equals(new Point(5, 6))).toBe(true)
  })

  it('should create from curve', () => {
    const c = new Curve(
      new Point(0, 0),
      new Point(1, 1),
      new Point(2, 2),
      new Point(3, 3),
    )
    const m = MoveTo.create(c)
    expect(m).toBeInstanceOf(MoveTo)
    expect((m as MoveTo).end.equals(new Point(3, 3))).toBe(true)
  })

  it('should create from single point-like', () => {
    const m = MoveTo.create({ x: 10, y: 20 })
    expect(m).toBeInstanceOf(MoveTo)
    expect((m as MoveTo).end.equals(new Point(10, 20))).toBe(true)
  })

  it('should create moveto + lineto sequence from multiple point-likes', () => {
    const segs = MoveTo.create({ x: 0, y: 0 }, { x: 10, y: 10 }) as any[]
    expect(segs[0]).toBeInstanceOf(MoveTo)
    expect(segs[1]).toBeInstanceOf(LineTo)
  })

  it('should create from 2 coordinates', () => {
    const m = MoveTo.create(7, 8) as MoveTo
    expect(m).toBeInstanceOf(MoveTo)
    expect(m.end.equals(new Point(7, 8))).toBe(true)
  })

  it('should create moveto + lineto sequence from multiple coordinates', () => {
    const segs = MoveTo.create(0, 0, 5, 5, 10, 10) as any[]
    expect(segs[0]).toBeInstanceOf(MoveTo)
    expect(segs[1]).toBeInstanceOf(LineTo)
    expect(segs[2]).toBeInstanceOf(LineTo)
  })
})
