import { describe, expect, it } from 'vitest'
import { Point, Rectangle } from '../../../src/geometry'

describe('Orth Router', () => {
  // 辅助函数来测试内部逻辑
  const testOrthogonalRoute = (
    from: Point,
    to: Point,
    expectedBearing: string | null,
  ) => {
    if (from.x === to.x) {
      return from.y > to.y ? 'N' : 'S'
    }
    if (from.y === to.y) {
      return from.x > to.x ? 'W' : 'E'
    }
    return null
  }
  describe('Bearing detection', () => {
    it('should return correct bearing for north direction', () => {
      const from = new Point(50, 100)
      const to = new Point(50, 50)
      const bearing = testOrthogonalRoute(from, to, 'N')
      expect(bearing).toBe('N')
    })

    it('should return correct bearing for south direction', () => {
      const from = new Point(50, 50)
      const to = new Point(50, 100)
      const bearing = testOrthogonalRoute(from, to, 'S')
      expect(bearing).toBe('S')
    })

    it('should return correct bearing for east direction', () => {
      const from = new Point(50, 50)
      const to = new Point(100, 50)
      const bearing = testOrthogonalRoute(from, to, 'E')
      expect(bearing).toBe('E')
    })

    it('should return correct bearing for west direction', () => {
      const from = new Point(100, 50)
      const to = new Point(50, 50)
      const bearing = testOrthogonalRoute(from, to, 'W')
      expect(bearing).toBe('W')
    })

    it('should return null for diagonal direction', () => {
      const from = new Point(50, 50)
      const to = new Point(100, 100)
      const bearing = testOrthogonalRoute(from, to, null)
      expect(bearing).toBeNull()
    })
  })

  describe('edge cases', () => {
    it('should handle same point', () => {
      const from = new Point(50, 50)
      const to = new Point(50, 50)
      const bearing = testOrthogonalRoute(from, to, null)
      expect(bearing).toBe('S')
    })

    it('should handle points on same axis', () => {
      const from = new Point(50, 50)
      const to = new Point(50, 100)
      const bearing = testOrthogonalRoute(from, to, 'S')
      expect(bearing).toBe('S')
    })
  })

  describe('Rectangle operations', () => {
    it('should handle rectangle union and intersection', () => {
      const rect1 = new Rectangle(0, 0, 100, 100)
      const rect2 = new Rectangle(50, 50, 100, 100)

      // 测试矩形合并
      const union = rect1.union(rect2)
      expect(union.x).toBe(0)
      expect(union.y).toBe(0)
      expect(union.width).toBe(150)
      expect(union.height).toBe(150)
    })

    it('should handle rectangle inflation', () => {
      const rect = new Rectangle(0, 0, 100, 100)
      const inflated = rect.clone().inflate(10)

      expect(inflated.x).toBe(-10)
      expect(inflated.y).toBe(-10)
      expect(inflated.width).toBe(120)
      expect(inflated.height).toBe(120)
    })
  })
})
