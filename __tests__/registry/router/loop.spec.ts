import { describe, expect, it, vi } from 'vitest'
import { Point } from '../../../src/geometry'
import { loop } from '../../../src/registry/router/loop'

const createMockEdgeView = (
  sourcePoint: Point.PointLike,
  targetPoint: Point.PointLike,
  sourceBBox?: any,
  targetBBox?: any,
) => {
  return {
    sourceAnchor: Point.create(sourcePoint),
    targetAnchor: Point.create(targetPoint),
    sourceBBox: sourceBBox || {
      containsPoint: vi.fn().mockReturnValue(false),
      intersectsWithLine: vi.fn().mockReturnValue(false),
      getCenter: vi.fn().mockReturnValue(Point.create({ x: 0, y: 0 })),
    },
    targetBBox: targetBBox || {
      containsPoint: vi.fn().mockReturnValue(false),
      intersectsWithLine: vi.fn().mockReturnValue(false),
    },
  }
}

describe('loop router', () => {
  describe('when source and target anchors are the same', () => {
    it('should return loop vertices with default options', () => {
      const vertices: Point.PointLike[] = []
      const options = {}
      const edgeView = createMockEdgeView({ x: 0, y: 0 }, { x: 0, y: 0 })

      const result = loop(vertices, options, edgeView as any)

      expect(result).toHaveLength(3)
      expect(result[0]).toHaveProperty('x')
      expect(result[0]).toHaveProperty('y')
      expect(result[1]).toHaveProperty('x')
      expect(result[1]).toHaveProperty('y')
      expect(result[2]).toHaveProperty('x')
      expect(result[2]).toHaveProperty('y')
    })

    it('should return loop vertices with custom angle', () => {
      const vertices: Point.PointLike[] = []
      const options = { angle: 45 }
      const edgeView = createMockEdgeView({ x: 0, y: 0 }, { x: 0, y: 0 })

      const result = loop(vertices, options, edgeView as any)

      expect(result).toHaveLength(3)
    })

    it('should return merged vertices when merge option is true', () => {
      const vertices: Point.PointLike[] = []
      const options = { merge: true }
      const edgeView = createMockEdgeView({ x: 0, y: 0 }, { x: 0, y: 0 })

      const result = loop(vertices, options, edgeView as any)

      expect(result).toHaveLength(5) // 合并后会添加两个点
    })

    it('should return merged vertices when merge option is a number', () => {
      const vertices: Point.PointLike[] = []
      const options = { merge: 10 }
      const edgeView = createMockEdgeView({ x: 0, y: 0 }, { x: 0, y: 0 })

      const result = loop(vertices, options, edgeView as any)

      expect(result).toHaveLength(5)
    })
  })

  describe('when source and target anchors are different', () => {
    it('should return loop vertices for different anchors', () => {
      const vertices: Point.PointLike[] = []
      const options = {}
      const edgeView = createMockEdgeView({ x: 0, y: 0 }, { x: 100, y: 0 })

      const result = loop(vertices, options, edgeView as any)

      expect(result).toHaveLength(3)
      expect(result[0]).toHaveProperty('x')
      expect(result[0]).toHaveProperty('y')
      expect(result[1]).toHaveProperty('x')
      expect(result[1]).toHaveProperty('y')
      expect(result[2]).toHaveProperty('x')
      expect(result[2]).toHaveProperty('y')
    })

    it('should handle merge option for different anchors', () => {
      const vertices: Point.PointLike[] = []
      const options = { merge: true }
      const edgeView = createMockEdgeView({ x: 0, y: 0 }, { x: 100, y: 0 })

      const result = loop(vertices, options, edgeView as any)

      expect(result).toHaveLength(5)
    })

    it('should handle custom width and height', () => {
      const vertices: Point.PointLike[] = []
      const options = { width: 100, height: 120 }
      const edgeView = createMockEdgeView({ x: 0, y: 0 }, { x: 100, y: 0 })

      const result = loop(vertices, options, edgeView as any)

      expect(result).toHaveLength(3)
    })
  })

  describe('edge cases', () => {
    it('should handle when center equals source anchor', () => {
      const vertices: Point.PointLike[] = []
      const options = {}
      const mockBBox = {
        containsPoint: vi.fn().mockReturnValue(false),
        intersectsWithLine: vi.fn().mockReturnValue(false),
        getCenter: vi.fn().mockReturnValue(Point.create({ x: 0, y: 0 })),
      }
      const edgeView = createMockEdgeView(
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        mockBBox,
      )

      const result = loop(vertices, options, edgeView as any)

      expect(result).toHaveLength(3)
    })

    it('should handle bounding box intersections', () => {
      const vertices: Point.PointLike[] = []
      const options = {}

      // 创建会与边界框相交的模拟
      const mockSourceBBox = {
        containsPoint: vi
          .fn()
          .mockImplementation((point) => point.x === 50 && point.y === 0),
        intersectsWithLine: vi.fn().mockReturnValue(true),
        getCenter: vi.fn().mockReturnValue(Point.create({ x: 25, y: 0 })),
      }

      const mockTargetBBox = {
        containsPoint: vi.fn().mockReturnValue(false),
        intersectsWithLine: vi.fn().mockReturnValue(true),
      }

      const edgeView = createMockEdgeView(
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        mockSourceBBox,
        mockTargetBBox,
      )

      const result = loop(vertices, options, edgeView as any)

      expect(result).toHaveLength(3)
    })
  })

  describe('rollup functionality', () => {
    it('should not merge points when merge option is false', () => {
      const vertices: Point.PointLike[] = []
      const options = { merge: false }
      const edgeView = createMockEdgeView({ x: 0, y: 0 }, { x: 0, y: 0 })

      const result = loop(vertices, options, edgeView as any)

      expect(result).toHaveLength(3)
    })

    it('should merge points when merge option is true', () => {
      const vertices: Point.PointLike[] = []
      const options = { merge: true }
      const edgeView = createMockEdgeView({ x: 0, y: 0 }, { x: 0, y: 0 })

      const result = loop(vertices, options, edgeView as any)

      expect(result).toHaveLength(5)
    })

    it('should merge points with custom amount when merge option is a number', () => {
      const vertices: Point.PointLike[] = []
      const options = { merge: 10 }
      const edgeView = createMockEdgeView({ x: 0, y: 0 }, { x: 0, y: 0 })

      const result = loop(vertices, options, edgeView as any)

      expect(result).toHaveLength(5)
    })
  })
})
