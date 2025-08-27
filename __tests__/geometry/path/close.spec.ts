import { describe, it, expect } from 'vitest'
import { Line } from '@'
import { Point } from '@/geometry'
import { Close } from '@/geometry/path/close'
import { MoveTo } from '@/geometry/path/moveto'
import { LineTo } from '@/geometry/path/lineto'

describe('Close', () => {
  const move = new MoveTo(0, 0)
  const lineTo = new LineTo(10, 0)
  const close = new Close()

  // 模拟 path 结构
  close.previousSegment = lineTo
  close.subpathStartSegment = move

  it('should have type Z', () => {
    expect(close.type).toBe('Z')
    expect(close.serialize()).toBe('Z')
  })

  it('should throw if subpathStartSegment missing', () => {
    const c = new Close()
    c.previousSegment = lineTo
    expect(() => c.end).toThrow(/Missing subpath start segment/)
  })

  it('should return correct line and end', () => {
    expect(close.end.equals(move.end)).toBe(true)
    expect(close.line).toBeDefined()
    expect(close.length()).toBeGreaterThan(0)
  })

  it('bbox/point/tangent methods should work', () => {
    expect(close.bbox()).toBeDefined()
    expect(close.pointAt(0)).toBeInstanceOf(Point)
    expect(close.pointAtLength(5)).toBeInstanceOf(Point)
    expect(close.tangentAt(0)).toBeInstanceOf(Line)
    expect(close.tangentAtLength(5)).toBeInstanceOf(Line)
  })

  it('should divide correctly', () => {
    const [seg1, seg2] = close.divideAt(0.5)
    expect(seg1).toBeInstanceOf(LineTo) // 前半段转成 LineTo
    expect(seg2).toBeInstanceOf(LineTo)

    const [s1, s2] = close.divideAtLength(close.length() / 2)
    expect(s1).toBeInstanceOf(LineTo)
    expect(s2).toBeInstanceOf(LineTo)
  })

  it('isDifferentiable should return correct values', () => {
    expect(close.isDifferentiable()).toBe(true)
    const c = new Close()
    expect(c.isDifferentiable()).toBe(false)
  })

  it('scale/rotate/translate should return itself', () => {
    expect(close.scale()).toBe(close)
    expect(close.rotate()).toBe(close)
    expect(close.translate()).toBe(close)
  })

  it('equals should work', () => {
    const another = new Close()
    another.previousSegment = lineTo
    another.subpathStartSegment = move
    expect(close.equals(another)).toBe(true)

    const different = new Close()
    different.previousSegment = new LineTo(5, 5)
    different.subpathStartSegment = move
    expect(close.equals(different)).toBe(false)
  })

  it('toJSON should return correct object', () => {
    const json = close.toJSON()
    expect(json).toHaveProperty('type', 'Z')
    expect(json.start).toBeDefined()
    expect(json.end).toBeDefined()
  })

  it('clone should return equal Close', () => {
    const cloned = close.clone()
    expect(cloned).toBeInstanceOf(Close)
    // clone 还没有 previousSegment，需要手动赋值才可比较
    cloned.previousSegment = lineTo
    cloned.subpathStartSegment = move
    expect(close.equals(cloned)).toBe(true)
  })
})
