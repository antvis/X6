import { describe, expect, it } from 'vitest'
import { Path, Point } from '../../../src/geometry'
import { rounded } from '../../../src/registry/connector/rounded'

describe('rounded connector', () => {
  const sourcePoint = new Point(0, 0)
  const targetPoint = new Point(100, 100)

  it('should create a straight line when no route points', () => {
    const result = rounded(sourcePoint, targetPoint, [])

    expect(result).toBe('M 0 0 L 100 100')
  })

  it('should use default radius when not specified', () => {
    const routePoints = [{ x: 50, y: 0 }]
    const result = rounded(sourcePoint, targetPoint, routePoints)

    expect(typeof result).toBe('string')
    expect(result).toContain('M 0 0')
    expect(result).toContain('L 100 100')
  })

  it('should use custom radius', () => {
    const routePoints = [{ x: 50, y: 0 }]
    const result = rounded(sourcePoint, targetPoint, routePoints, { radius: 5 })

    expect(typeof result).toBe('string')
    expect(result).toContain('C')
  })

  it('should return Path object when raw option is true', () => {
    const routePoints = [{ x: 50, y: 0 }]
    const result = rounded(sourcePoint, targetPoint, routePoints, { raw: true })

    expect(result).toBeInstanceOf(Path)
  })

  it('should handle single route point', () => {
    const routePoints = [{ x: 50, y: 50 }]
    const result = rounded(sourcePoint, targetPoint, routePoints, {
      radius: 10,
    })

    expect(result).toContain('M 0 0')
    expect(result).toContain('L')
    expect(result).toContain('C')
    expect(result).toContain('L 100 100')
  })

  it('should handle multiple route points', () => {
    const routePoints = [
      { x: 30, y: 30 },
      { x: 70, y: 30 },
      { x: 70, y: 70 },
    ]
    const result = rounded(sourcePoint, targetPoint, routePoints, { radius: 8 })

    expect(result).toContain('M 0 0')
    expect(result).toContain('L 100 100')
    const cCount = (result.match(/C/g) || []).length
    expect(cCount).toBe(routePoints.length)
  })

  it('should limit radius to half of distance when radius is too large', () => {
    const routePoints = [{ x: 5, y: 0 }]
    const result = rounded(sourcePoint, targetPoint, routePoints, {
      radius: 100,
    })

    expect(typeof result).toBe('string')
    expect(result).toContain('C')
  })

  it('should handle zero radius', () => {
    const routePoints = [{ x: 50, y: 50 }]
    const result = rounded(sourcePoint, targetPoint, routePoints, { radius: 0 })

    expect(result).toContain('M 0 0')
    expect(result).toContain('L 100 100')
  })

  it('should handle negative radius by using Math.min', () => {
    const routePoints = [{ x: 50, y: 50 }]
    const result = rounded(sourcePoint, targetPoint, routePoints, {
      radius: -5,
    })

    expect(typeof result).toBe('string')
    expect(result).toContain('M 0 0')
  })

  it('should handle empty options object', () => {
    const routePoints = [{ x: 25, y: 25 }]
    const result = rounded(sourcePoint, targetPoint, routePoints, {})

    expect(typeof result).toBe('string')
    expect(result).toContain('M 0 0')
    expect(result).toContain('L 100 100')
  })

  it('should handle very close points', () => {
    const closeSource = new Point(0, 0)
    const closeTarget = new Point(1, 1)
    const routePoints = [{ x: 0.5, y: 0.5 }]
    const result = rounded(closeSource, closeTarget, routePoints, {
      radius: 10,
    })

    expect(typeof result).toBe('string')
    expect(result).toContain('M 0 0')
  })

  it('should create proper bezier control points', () => {
    const routePoints = [{ x: 50, y: 0 }]
    const path = rounded(sourcePoint, targetPoint, routePoints, {
      raw: true,
      radius: 10,
    }) as Path
    const segments = path.segments

    expect(segments.length).toBeGreaterThan(2)
    expect(segments[0].type).toBe('M')
    expect(segments[segments.length - 1].type).toBe('L')

    const cSegments = segments.filter((s) => s.type === 'C')
    expect(cSegments.length).toBe(1)
  })
})
