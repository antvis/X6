import { describe, expect, it } from 'vitest'
import { Point } from '../../../src/geometry'
import { normal } from '../../../src/registry/connector/normal'

describe('normal connector', () => {
  it('should create path with source and target points only', () => {
    const sourcePoint = new Point(0, 0)
    const targetPoint = new Point(100, 100)
    const result = normal(sourcePoint, targetPoint, [])

    expect(typeof result).toBe('string')
    expect(result).toContain('M 0 0')
    expect(result).toContain('L 100 100')
  })

  it('should create path with route points', () => {
    const sourcePoint = new Point(0, 0)
    const targetPoint = new Point(100, 100)
    const routePoints = [new Point(50, 0), new Point(50, 100)]
    const result = normal(sourcePoint, targetPoint, routePoints)

    expect(typeof result).toBe('string')
    expect(result).toContain('M 0 0')
    expect(result).toContain('L 50 0')
    expect(result).toContain('L 50 100')
    expect(result).toContain('L 100 100')
  })

  it('should return raw path when options.raw is true', () => {
    const sourcePoint = new Point(0, 0)
    const targetPoint = new Point(100, 100)
    const result = normal(sourcePoint, targetPoint, [], { raw: true })

    expect(result).toHaveProperty('serialize')
    expect(typeof result.serialize).toBe('function')
  })

  it('should return serialized path when options.raw is false', () => {
    const sourcePoint = new Point(0, 0)
    const targetPoint = new Point(100, 100)
    const result = normal(sourcePoint, targetPoint, [], { raw: false })

    expect(typeof result).toBe('string')
  })

  it('should handle undefined options', () => {
    const sourcePoint = new Point(0, 0)
    const targetPoint = new Point(100, 100)
    const result = normal(sourcePoint, targetPoint, [])

    expect(typeof result).toBe('string')
  })

  it('should handle empty route points array', () => {
    const sourcePoint = new Point(10, 20)
    const targetPoint = new Point(30, 40)
    const result = normal(sourcePoint, targetPoint, [])

    expect(typeof result).toBe('string')
    expect(result).toContain('M 10 20')
    expect(result).toContain('L 30 40')
  })

  it('should handle multiple route points', () => {
    const sourcePoint = new Point(0, 0)
    const targetPoint = new Point(100, 100)
    const routePoints = [
      new Point(25, 0),
      new Point(50, 25),
      new Point(75, 50),
      new Point(100, 75),
    ]
    const result = normal(sourcePoint, targetPoint, routePoints)

    expect(typeof result).toBe('string')
    expect(result).toContain('M 0 0')
    expect(result).toContain('L 25 0')
    expect(result).toContain('L 50 25')
    expect(result).toContain('L 75 50')
    expect(result).toContain('L 100 75')
    expect(result).toContain('L 100 100')
  })

  it('should handle options with split property', () => {
    const sourcePoint = new Point(0, 0)
    const targetPoint = new Point(100, 100)
    const result = normal(sourcePoint, targetPoint, [], { split: true })

    expect(typeof result).toBe('string')
  })

  it('should handle options with numeric split property', () => {
    const sourcePoint = new Point(0, 0)
    const targetPoint = new Point(100, 100)
    const result = normal(sourcePoint, targetPoint, [], { split: 5 })

    expect(typeof result).toBe('string')
  })
})
