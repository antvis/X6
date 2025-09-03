import { describe, expect, it, vi } from 'vitest'
import { Point } from '../../src/geometry'
import { pointsToString } from '../../src/shape/util'

describe('pointsToString', () => {
  it('should return string as is when input is string', () => {
    const points = '10,20 30,40'
    expect(pointsToString(points)).toBe(points)
  })

  it('should convert array points to string', () => {
    const points = [
      [10, 20],
      [30, 40],
    ]
    // @ts-expect-error
    expect(pointsToString(points)).toBe('10,20 30,40')
  })

  it('should convert Point.PointLike objects to string', () => {
    vi.spyOn(Point, 'isPointLike').mockReturnValue(true)
    const points = [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
    ]
    expect(pointsToString(points)).toBe('10, 20 30, 40')
  })

  it('should handle mixed valid and invalid points', () => {
    vi.spyOn(Point, 'isPointLike').mockImplementation(
      (p) => typeof p === 'object' && 'x' in p && 'y' in p,
    )
    const points = [{ x: 10, y: 20 }, 'invalid', [30, 40]]
    // @ts-expect-error
    expect(pointsToString(points)).toBe('10, 20  30,40')
  })

  it('should return empty string for invalid point', () => {
    vi.spyOn(Point, 'isPointLike').mockReturnValue(false)
    const points = ['invalid']
    // @ts-expect-error
    expect(pointsToString(points)).toBe('')
  })
})
