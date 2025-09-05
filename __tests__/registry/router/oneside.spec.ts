import { describe, expect, it } from 'vitest'
import { Point } from '../../../src/geometry'
import { oneSide } from '../../../src/registry/router/oneside'

const createMockEdgeView = (sourceBBox: any, targetBBox: any) => ({
  sourceBBox,
  targetBBox,
})

describe('oneSide router', () => {
  describe('default behavior (bottom side)', () => {
    it('should route from bottom side with default padding', () => {
      const sourceBBox = { x: 100, y: 100, width: 50, height: 50 }
      const targetBBox = { x: 200, y: 200, width: 60, height: 60 }

      const mockEdgeView = createMockEdgeView(
        {
          getCenter: () => new Point(125, 125),
          width: 50,
          height: 50,
        },
        {
          getCenter: () => new Point(230, 230),
          width: 60,
          height: 60,
        },
      )

      const result = oneSide([], {}, mockEdgeView as any)

      expect(result).toHaveLength(2)
      expect(result[0].x).toBeCloseTo(125)
      expect(result[0].y).toBeCloseTo(300)
      expect(result[1].x).toBeCloseTo(230)
      expect(result[1].y).toBeCloseTo(300)
    })
  })

  describe('different sides', () => {
    it('should route from top side', () => {
      const mockEdgeView = createMockEdgeView(
        {
          getCenter: () => new Point(125, 125),
          width: 50,
          height: 50,
        },
        {
          getCenter: () => new Point(230, 230),
          width: 60,
          height: 60,
        },
      )

      const result = oneSide([], { side: 'top' }, mockEdgeView as any)

      expect(result[0].y).toBeCloseTo(125 - 25 - 40) // y - height/2 - padding
      expect(result[1].y).toBeCloseTo(60) // y - height/2 - padding
    })

    it('should route from left side', () => {
      const mockEdgeView = createMockEdgeView(
        {
          getCenter: () => new Point(125, 125),
          width: 50,
          height: 50,
        },
        {
          getCenter: () => new Point(230, 230),
          width: 60,
          height: 60,
        },
      )

      const result = oneSide([], { side: 'left' }, mockEdgeView as any)

      expect(result[0].x).toBeCloseTo(125 - 25 - 40) // x - width/2 - padding
      expect(result[1].x).toBeCloseTo(60) // x - width/2 - padding
    })

    it('should route from right side', () => {
      const mockEdgeView = createMockEdgeView(
        {
          getCenter: () => new Point(125, 125),
          width: 50,
          height: 50,
        },
        {
          getCenter: () => new Point(230, 230),
          width: 60,
          height: 60,
        },
      )

      const result = oneSide([], { side: 'right' }, mockEdgeView as any)

      expect(result[0].x).toBeCloseTo(300) // x + width/2 + padding
      expect(result[1].x).toBeCloseTo(230 + 30 + 40) // x + width/2 + padding
    })
  })

  describe('custom padding', () => {
    it('should use custom padding value', () => {
      const mockEdgeView = createMockEdgeView(
        {
          getCenter: () => new Point(125, 125),
          width: 50,
          height: 50,
        },
        {
          getCenter: () => new Point(230, 230),
          width: 60,
          height: 60,
        },
      )

      const result = oneSide([], { padding: 20 }, mockEdgeView as any)

      expect(result[0].y).toBeCloseTo(280) // y + height/2 + padding
      expect(result[1].y).toBeCloseTo(230 + 30 + 20) // y + height/2 + padding
    })

    it('should use object padding', () => {
      const mockEdgeView = createMockEdgeView(
        {
          getCenter: () => new Point(125, 125),
          width: 50,
          height: 50,
        },
        {
          getCenter: () => new Point(230, 230),
          width: 60,
          height: 60,
        },
      )

      const result = oneSide(
        [],
        {
          padding: { top: 10, right: 20, bottom: 30, left: 40 },
        },
        mockEdgeView as any,
      )

      expect(result[0].y).toBeCloseTo(290) // y + height/2 + bottom padding
      expect(result[1].y).toBeCloseTo(230 + 30 + 30) // y + height/2 + bottom padding
    })
  })

  describe('orthogonal routing', () => {
    it('should make edge orthogonal when source is above target', () => {
      const mockEdgeView = createMockEdgeView(
        {
          getCenter: () => new Point(125, 100), // 上方
          width: 50,
          height: 50,
        },
        {
          getCenter: () => new Point(230, 200), // 下方
          width: 60,
          height: 60,
        },
      )

      const result = oneSide([], {}, mockEdgeView as any)

      // 两个点的 y 坐标应该相同（正交）
      expect(result[0].y).toBeCloseTo(result[1].y)
    })

    it('should make edge orthogonal when target is above source', () => {
      const mockEdgeView = createMockEdgeView(
        {
          getCenter: () => new Point(125, 200), // 下方
          width: 50,
          height: 50,
        },
        {
          getCenter: () => new Point(230, 100), // 上方
          width: 60,
          height: 60,
        },
      )

      const result = oneSide([], {}, mockEdgeView as any)

      // 两个点的 y 坐标应该相同（正交）
      expect(result[0].y).toBeCloseTo(result[1].y)
    })
  })

  describe('with intermediate vertices', () => {
    it('should include intermediate vertices in result', () => {
      const mockEdgeView = createMockEdgeView(
        {
          getCenter: () => new Point(125, 125),
          width: 50,
          height: 50,
        },
        {
          getCenter: () => new Point(230, 230),
          width: 60,
          height: 60,
        },
      )

      const intermediateVertices = [
        { x: 150, y: 150 },
        { x: 180, y: 180 },
      ]
      const result = oneSide(intermediateVertices, {}, mockEdgeView as any)

      expect(result).toHaveLength(4) // source + 2 vertices + target
      expect(result[1]).toEqual(intermediateVertices[0])
      expect(result[2]).toEqual(intermediateVertices[1])
    })
  })
})
