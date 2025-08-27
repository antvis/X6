import { describe, it, expect } from 'vitest'
import { Point, Rectangle, GeometryUtil } from '@/geometry'

describe('GeometryUtil', () => {
  describe('round', () => {
    it('should round numbers to given precision', () => {
      expect(GeometryUtil.round(1.2345, 2)).toBe(1.23)
      expect(GeometryUtil.round(1.2355, 2)).toBe(1.24)
      expect(GeometryUtil.round(5)).toBe(5)
    })
  })

  describe('random', () => {
    it('should generate number between 0 and 1 if no arguments', () => {
      const val = GeometryUtil.random()
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThanOrEqual(1)
    })

    it('should generate number between 0 and max if only max provided', () => {
      for (let i = 0; i < 10; i++) {
        const val = GeometryUtil.random(10)
        expect(val).toBeGreaterThanOrEqual(0)
        expect(val).toBeLessThanOrEqual(10)
      }
    })

    it('should generate number between min and max if both provided', () => {
      for (let i = 0; i < 10; i++) {
        const val = GeometryUtil.random(5, 15)
        expect(val).toBeGreaterThanOrEqual(5)
        expect(val).toBeLessThanOrEqual(15)
      }
    })

    it('should swap min and max if min > max', () => {
      for (let i = 0; i < 10; i++) {
        const val = GeometryUtil.random(20, 10)
        expect(val).toBeGreaterThanOrEqual(10)
        expect(val).toBeLessThanOrEqual(20)
      }
    })
  })

  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(GeometryUtil.clamp(5, 0, 10)).toBe(5)
      expect(GeometryUtil.clamp(-5, 0, 10)).toBe(0)
      expect(GeometryUtil.clamp(15, 0, 10)).toBe(10)
    })

    it('should handle inverted min/max', () => {
      expect(GeometryUtil.clamp(5, 10, 0)).toBe(5)
      expect(GeometryUtil.clamp(-5, 10, 0)).toBe(0)
      expect(GeometryUtil.clamp(15, 10, 0)).toBe(10)
    })

    it('should return NaN if value is NaN', () => {
      expect(GeometryUtil.clamp(NaN, 0, 10)).toBeNaN()
    })

    it('should return 0 if min or max is NaN', () => {
      expect(GeometryUtil.clamp(5, NaN, 10)).toBe(0)
      expect(GeometryUtil.clamp(5, 0, NaN)).toBe(0)
    })
  })

  describe('snapToGrid', () => {
    it('should snap value to nearest multiple of gridSize', () => {
      expect(GeometryUtil.snapToGrid(12, 5)).toBe(10)
      expect(GeometryUtil.snapToGrid(13, 5)).toBe(15)
      expect(GeometryUtil.snapToGrid(-2, 5)).toBeCloseTo(0)
    })
  })

  describe('containsPoint', () => {
    const rect: Rectangle.RectangleLike = { x: 0, y: 0, width: 10, height: 20 }
    it('should return true if point is inside rect', () => {
      const pt: Point.PointLike = { x: 5, y: 10 }
      expect(GeometryUtil.containsPoint(rect, pt)).toBe(true)
    })

    it('should return false if point is outside rect', () => {
      const pt: Point.PointLike = { x: 15, y: 10 }
      expect(GeometryUtil.containsPoint(rect, pt)).toBe(false)
    })

    it('should return false if point or rect is null/undefined', () => {
      expect(GeometryUtil.containsPoint(null as any, { x: 0, y: 0 })).toBe(
        false,
      )
      expect(GeometryUtil.containsPoint(rect, null as any)).toBe(false)
    })
  })

  describe('squaredLength', () => {
    it('should return squared distance between two points', () => {
      const p1: Point.PointLike = { x: 0, y: 0 }
      const p2: Point.PointLike = { x: 3, y: 4 }
      expect(GeometryUtil.squaredLength(p1, p2)).toBe(25)
    })
  })
})
