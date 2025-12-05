import { describe, expect, it } from 'vitest'
import { Point } from '../../../src/geometry'
import {
  arcToCurves,
  drawArc,
  drawPoints,
  isValid,
} from '../../../src/geometry/path/util'

describe('util.ts', () => {
  describe('isValid', () => {
    it('should return true for valid path data', () => {
      expect(isValid('M10 10L20 20Z')).toBe(true)
      expect(isValid(' 10 20 L 30 40')).toBe(true)
    })

    it('should return false for invalid input', () => {
      expect(isValid(123 as any)).toBe(false)
      expect(isValid('INVALID')).toBe(false)
      expect(isValid('M10X')).toBe(false)
    })
  })

  describe('drawPoints', () => {
    const points = [new Point(0, 0), new Point(10, 0), new Point(10, 10)]

    it('should draw with initial move by default', () => {
      const path = drawPoints(points)
      expect(path.startsWith('M')).toBe(true)
      expect(path.includes('L')).toBe(true)
    })

    it('should draw with initial L if initialMove=false', () => {
      const path = drawPoints(points, { initialMove: false })
      expect(path.startsWith('L')).toBe(true)
    })

    it('should close path with Z if close=true', () => {
      const path = drawPoints(points, { close: true })
      expect(path.endsWith('Z')).toBe(true)
    })

    it('should apply rounding if round>0', () => {
      const path = drawPoints(points, { round: 5 })
      expect(path.includes('Q')).toBe(true) // quadratic curve inserted
    })

    it('should exclude rounding for excluded indices', () => {
      const path = drawPoints(points, { round: 5, exclude: [0] })
      // ensure it still draws lines
      expect(path.includes('L')).toBe(true)
    })

    it('should handle array input as PointData', () => {
      const arrPoints: [number, number][] = [
        [0, 0],
        [5, 5],
        [10, 0],
      ]
      const path = drawPoints(arrPoints)
      expect(path).toContain('M')
      expect(path).toContain('L')
    })

    it('should return empty string for empty points', () => {
      expect(drawPoints([])).toBe('')
    })
  })

  describe('arcToCurves', () => {
    it('should return [] if r1 or r2 is zero', () => {
      expect(arcToCurves(0, 0, 0, 10, 0, 0, 0, 100, 0)).toEqual([])
      expect(arcToCurves(0, 0, 10, 0, 0, 0, 0, 100, 0)).toEqual([])
    })

    it('should generate curve points for valid arc', () => {
      const result = arcToCurves(0, 0, 50, 50, 0, 0, 1, 50, 50)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length % 6).toBe(0) // multiple of 6
      expect(result.every((n) => typeof n === 'number')).toBe(true)
    })

    it('should handle largeArcFlag=1', () => {
      const result = arcToCurves(0, 0, 50, 30, 0, 1, 1, 100, 0)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('drawArc', () => {
    it('should return a C command string', () => {
      const path = drawArc(0, 0, 50, 50, 0, 0, 1, 50, 50)
      expect(path.startsWith('C')).toBe(true)
      expect(path.includes(',')).toBe(false) // numbers joined with spaces
    })

    it('should handle degenerate arc (rx=0)', () => {
      const path = drawArc(0, 0, 0, 50, 0, 0, 1, 100, 100)
      expect(path).toBe('')
    })
  })
})
