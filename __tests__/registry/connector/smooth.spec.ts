import { describe, expect, it } from 'vitest'
import { Point } from '../../../src/geometry'
import { smooth } from '../../../src/registry/connector/smooth'

describe('smooth connector', () => {
  const sourcePoint = new Point(0, 0)
  const targetPoint = new Point(100, 100)

  it('should create smooth curve with route points', () => {
    const routePoints = [new Point(25, 50), new Point(75, 50)]
    const result = smooth(sourcePoint, targetPoint, routePoints)

    expect(typeof result).toBe('string')
    expect(result).toContain('M')
    expect(result).toContain('C')
  })

  it('should create smooth curve without route points using default direction', () => {
    const result = smooth(sourcePoint, targetPoint)

    expect(typeof result).toBe('string')
    expect(result).toContain('M 0 0')
    expect(result).toContain('C')
  })

  it('should use horizontal direction when x difference is greater than y difference', () => {
    const source = new Point(0, 0)
    const target = new Point(200, 50)
    const result = smooth(source, target)

    expect(result).toContain('M 0 0')
    expect(result).toContain('C 100 0 100 50 200 50')
  })

  it('should use vertical direction when y difference is greater than x difference', () => {
    const source = new Point(0, 0)
    const target = new Point(50, 200)
    const result = smooth(source, target)

    expect(result).toContain('M 0 0')
    expect(result).toContain('C 0 100 50 100 50 200')
  })

  it('should respect explicit horizontal direction option', () => {
    const result = smooth(sourcePoint, targetPoint, undefined, {
      direction: 'H',
    })

    expect(result).toContain('M 0 0')
    expect(result).toContain('C 50 0 50 100 100 100')
  })

  it('should respect explicit vertical direction option', () => {
    const result = smooth(sourcePoint, targetPoint, undefined, {
      direction: 'V',
    })

    expect(result).toContain('M 0 0')
    expect(result).toContain('C 0 50 100 50 100 100')
  })

  it('should return raw path when raw option is true', () => {
    const result = smooth(sourcePoint, targetPoint, undefined, { raw: true })

    expect(result).toHaveProperty('serialize')
    expect(typeof result.serialize).toBe('function')
  })

  it('should handle empty route points array', () => {
    const result = smooth(sourcePoint, targetPoint, [])

    expect(typeof result).toBe('string')
    expect(result).toContain('M 0 0')
    expect(result).toContain('C')
  })

  it('should handle single route point', () => {
    const routePoints = [new Point(50, 50)]
    const result = smooth(sourcePoint, targetPoint, routePoints)

    expect(typeof result).toBe('string')
    expect(result).toContain('M')
  })

  it('should handle negative coordinates', () => {
    const source = new Point(-50, -50)
    const target = new Point(-10, -10)
    const result = smooth(source, target)

    expect(typeof result).toBe('string')
    expect(result).toContain('M -50 -50')
  })

  it('should handle same source and target points', () => {
    const samePoint = new Point(50, 50)
    const result = smooth(samePoint, samePoint)

    expect(typeof result).toBe('string')
    expect(result).toContain('M 50 50')
    expect(result).toContain('C 50 50 50 50 50 50')
  })

  it('should handle equal x and y differences (should default to horizontal)', () => {
    const source = new Point(0, 0)
    const target = new Point(50, 50)
    const result = smooth(source, target)

    expect(result).toContain('C 25 0 25 50 50 50')
  })

  it('should return raw path with route points when raw option is true', () => {
    const routePoints = [new Point(25, 25)]
    const result = smooth(sourcePoint, targetPoint, routePoints, { raw: true })

    expect(result).toHaveProperty('serialize')
    expect(typeof result.serialize).toBe('function')
  })
})
