import { describe, expect, it } from 'vitest'
import { Line, Point } from '../../../src/geometry'
import { LineTo } from '../../../src/geometry/path/lineto'
import type { Segment } from '../../../src/geometry/path/segment'

describe('LineTo', () => {
  it('should construct from coordinates', () => {
    const seg = new LineTo(10, 20)
    expect(seg.end.x).toBe(10)
    expect(seg.end.y).toBe(20)
    expect(seg.type).toBe('L')
    expect(seg.isSubpathStart).toBe(false)
    expect(seg.isVisible).toBe(true)
  })

  it('should construct from Point', () => {
    const p = new Point(5, 15)
    const seg = new LineTo(p)
    expect(seg.end.equals(p)).toBe(true)
  })

  it('should construct from Line', () => {
    const start = new Point(0, 0)
    const end = new Point(10, 10)
    const line = new Line(start, end)
    const seg = new LineTo(line)
    expect(seg.end.equals(end)).toBe(true)
  })

  it('create() should support different argument types', () => {
    const p1 = new Point(1, 2)
    const p2 = new Point(3, 4)
    const l = new Line(new Point(0, 0), new Point(5, 5))

    const fromLine = LineTo.create(l)
    expect(fromLine).toBeInstanceOf(LineTo)
    expect(fromLine.end.equals(new Point(5, 5))).toBe(true)

    const fromPoint = LineTo.create(p1)
    expect(fromPoint).toBeInstanceOf(LineTo)
    expect(fromPoint.end.equals(p1)).toBe(true)

    const fromCoords = LineTo.create(7, 8)
    expect(fromCoords).toBeInstanceOf(LineTo)
    expect(fromCoords.end.equals(new Point(7, 8))).toBe(true)

    const polyPoints = LineTo.create(p1, p2)
    expect(Array.isArray(polyPoints)).toBe(true)
    expect(polyPoints.length).toBe(2)
    expect(polyPoints[0].end.equals(p1)).toBe(true)
    expect(polyPoints[1].end.equals(p2)).toBe(true)
  })

  it('should clone correctly', () => {
    const seg = new LineTo(10, 20)
    const clone = seg.clone()
    expect(clone).not.toBe(seg)
    expect(clone.end.equals(seg.end)).toBe(true)
  })

  it('should scale, rotate, translate correctly', () => {
    const seg = new LineTo(10, 20)
    seg.scale(2, 3)
    expect(seg.end.x).toBe(20)
    expect(seg.end.y).toBe(60)

    seg.rotate(90)
    expect(seg.end.x).toBeCloseTo(60)
    expect(seg.end.y).toBeCloseTo(-20)

    seg.translate(5, 10)
    expect(seg.end.x).toBeCloseTo(65)
    expect(seg.end.y).toBeCloseTo(-10)
  })

  it('should return correct JSON and serialized string', () => {
    const seg = new LineTo(1, 2)
    const prev = new LineTo(0, 0)
    seg.previousSegment = prev
    expect(seg.toJSON()).toEqual({
      type: 'L',
      start: prev.end.toJSON(),
      end: seg.end.toJSON(),
    })
    expect(seg.serialize()).toBe(`L ${seg.end.x} ${seg.end.y}`)
  })

  it('should compute length and points', () => {
    const start = new Point(0, 0)
    const end = new Point(3, 4)
    const seg = new LineTo(end)
    seg.previousSegment = { end: start } as Segment
    const line = seg.line
    expect(seg.length()).toBe(line.length())
    expect(seg.pointAt(0.5).equals(line.pointAt(0.5))).toBe(true)
    const [seg1, seg2] = seg.divideAt(0.5)
    expect(seg1).toBeInstanceOf(LineTo)
    expect(seg2).toBeInstanceOf(LineTo)
  })

  it('should report differentiable correctly', () => {
    const seg = new LineTo(0, 0)
    expect(seg.isDifferentiable()).toBe(false)
    const prev = new LineTo(1, 1)
    seg.previousSegment = prev
    expect(seg.isDifferentiable()).toBe(true)
  })
})
