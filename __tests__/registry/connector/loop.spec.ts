import { describe, expect, it } from 'vitest'
import { Path, Point } from '../../../src/geometry'
import { loop } from '../../../src/registry/connector/loop'

describe('loop connector', () => {
  const sourcePoint = new Point(0, 0)
  const targetPoint = new Point(100, 100)

  it('should generate path data with 3 route points', () => {
    const routePoints = [
      new Point(25, -25),
      new Point(50, -50),
      new Point(75, -25),
    ]

    const result = loop(sourcePoint, targetPoint, routePoints, {})

    expect(typeof result).toBe('string')
    expect(result).toContain('M 0 0')
    expect(result).toContain('Q')
    expect(result).toContain('100 100')
  })

  it('should generate path data with 4 route points (fix = 1)', () => {
    const routePoints = [
      new Point(0, 0),
      new Point(25, -25),
      new Point(50, -50),
      new Point(75, -25),
    ]

    const result = loop(sourcePoint, targetPoint, routePoints)

    expect(typeof result).toBe('string')
    expect(result).toContain('M 0 0')
    expect(result).toContain('Q')
    expect(result).toContain('100 100')
  })

  it('should return Path object when raw option is true', () => {
    const routePoints = [
      new Point(25, -25),
      new Point(50, -50),
      new Point(75, -25),
    ]

    const result = loop(sourcePoint, targetPoint, routePoints, { raw: true })

    expect(result).toBeInstanceOf(Path)
  })

  it('should handle same source and target points', () => {
    const samePoint = new Point(50, 50)
    const routePoints = [new Point(25, 25), new Point(50, 0), new Point(75, 25)]

    const result = loop(samePoint, samePoint, routePoints)

    expect(typeof result).toBe('string')
    expect(result).toContain('M 50 50')
    expect(result).toContain('50 50')
  })

  it('should rotate points when angle > 1', () => {
    const routePoints = [
      new Point(25, 25),
      new Point(50, 200),
      new Point(75, 25),
    ]

    const result = loop(sourcePoint, targetPoint, routePoints)

    expect(typeof result).toBe('string')
    expect(result).toContain('M 0 0')
    expect(result).toContain('100 100')
  })

  it('should not rotate points when angle <= 1', () => {
    const routePoints = [
      new Point(25, -5),
      new Point(50, -10),
      new Point(75, -5),
    ]

    const result = loop(sourcePoint, targetPoint, routePoints)

    expect(typeof result).toBe('string')
    expect(result).toContain('M 0 0')
    expect(result).toContain('100 100')
  })

  it('should handle empty options object', () => {
    const routePoints = [
      new Point(25, -25),
      new Point(50, -50),
      new Point(75, -25),
    ]

    const result = loop(sourcePoint, targetPoint, routePoints, {})

    expect(typeof result).toBe('string')
  })

  it('should handle undefined options', () => {
    const routePoints = [
      new Point(25, -25),
      new Point(50, -50),
      new Point(75, -25),
    ]

    const result = loop(sourcePoint, targetPoint, routePoints)

    expect(typeof result).toBe('string')
  })

  it('should generate correct quadratic bezier curves', () => {
    const routePoints = [
      new Point(10, 10),
      new Point(50, 50),
      new Point(90, 10),
    ]

    const result = loop(sourcePoint, targetPoint, routePoints)

    expect(result).toMatch(/M 0 0\s+Q 10 10 50 50\s+Q 90 10 100 100/)
  })

  it('should handle negative coordinates', () => {
    const negativeSource = new Point(-50, -50)
    const negativeTarget = new Point(-10, -10)
    const routePoints = [
      new Point(-40, -70),
      new Point(-30, -80),
      new Point(-20, -70),
    ]

    const result = loop(negativeSource, negativeTarget, routePoints)

    expect(typeof result).toBe('string')
    expect(result).toContain('M -50 -50')
    expect(result).toContain('-10 -10')
  })
})
