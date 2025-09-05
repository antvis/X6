import { describe, expect, it, vi } from 'vitest'
import { Point } from '../../../src/geometry/point'
import {
  closest,
  getClosestPoint,
} from '../../../src/registry/edge-anchor/closest'

describe('Edge Anchor - Closest', () => {
  describe('getClosestPoint', () => {
    it('应该返回视图上距离参考点最近的点', () => {
      const mockView = {
        getClosestPoint: vi.fn().mockReturnValue(new Point(10, 20)),
      } as any

      const result = getClosestPoint(mockView, null as any, new Point(5, 5), {})

      expect(result).toBeInstanceOf(Point)
      expect(result.x).toBe(10)
      expect(result.y).toBe(20)
      expect(mockView.getClosestPoint).toHaveBeenCalledWith(new Point(5, 5))
    })

    it('当getClosestPoint返回null时应该返回默认点', () => {
      const mockView = {
        getClosestPoint: vi.fn().mockReturnValue(null),
      } as any

      const result = getClosestPoint(mockView, null as any, new Point(5, 5), {})

      expect(result).toBeInstanceOf(Point)
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
    })

    it('当getClosestPoint返回undefined时应该返回默认点', () => {
      const mockView = {
        getClosestPoint: vi.fn().mockReturnValue(undefined),
      } as any

      const result = getClosestPoint(mockView, null as any, new Point(5, 5), {})

      expect(result).toBeInstanceOf(Point)
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
    })
  })

  describe('closest', () => {
    it('应该正确处理元素引用', () => {
      const mockEdgeView = {
        graph: {
          findViewByElem: vi.fn().mockReturnValue({
            isEdgeElement: vi.fn().mockReturnValue(false),
            getBBoxOfElement: vi.fn().mockReturnValue({
              getCenter: vi.fn().mockReturnValue(new Point(15, 25)),
            }),
          }),
        },
      } as any

      const mockView = {
        getClosestPoint: vi.fn().mockReturnValue(new Point(10, 20)),
      } as any

      const mockElement = document.createElement('div')
      const result = closest.call(
        mockEdgeView,
        mockView,
        null as any,
        mockElement,
        {},
      )

      expect(result).toBeInstanceOf(Point)
      expect(result.x).toBe(10)
      expect(result.y).toBe(20)
      expect(mockView.getClosestPoint).toHaveBeenCalledWith(new Point(15, 25))
    })

    it('应该处理找不到视图的情况', () => {
      const mockEdgeView = {
        graph: {
          findViewByElem: vi.fn().mockReturnValue(null),
        },
      } as any

      const mockView = {
        getClosestPoint: vi.fn().mockReturnValue(new Point(0, 0)),
      } as any

      const mockElement = document.createElement('div')
      const result = closest.call(
        mockEdgeView,
        mockView,
        null as any,
        mockElement,
        {},
      )

      expect(result).toBeInstanceOf(Point)
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
      expect(mockView.getClosestPoint).toHaveBeenCalledWith(new Point(0, 0))
    })

    it('应该直接传递非元素引用', () => {
      const mockView = {
        getClosestPoint: vi.fn().mockReturnValue(new Point(30, 40)),
      } as any

      const mockEdgeView = {} as any
      const result = closest.call(
        mockEdgeView,
        mockView,
        null as any,
        new Point(25, 35),
        {},
      )

      expect(result).toBeInstanceOf(Point)
      expect(result.x).toBe(30)
      expect(result.y).toBe(40)
      expect(mockView.getClosestPoint).toHaveBeenCalledWith(new Point(25, 35))
    })

    it('应该处理边元素引用', () => {
      const mockEdgeView = {
        graph: {
          findViewByElem: vi.fn().mockReturnValue({
            isEdgeElement: vi.fn().mockReturnValue(true),
            getPointAtRatio: vi.fn().mockReturnValue(new Point(40, 50)),
          }),
        },
      } as any

      const mockView = {
        getClosestPoint: vi.fn().mockReturnValue(new Point(50, 60)),
      } as any

      const mockElement = document.createElement('div')
      const result = closest.call(
        mockEdgeView,
        mockView,
        null as any,
        mockElement,
        { fixedAt: '75%' },
      )

      expect(result).toBeInstanceOf(Point)
      expect(result.x).toBe(50)
      expect(result.y).toBe(60)
      const edgeView = mockEdgeView.graph.findViewByElem()
      expect(edgeView.getPointAtRatio).toHaveBeenCalledWith(0.75)
    })
  })
})
