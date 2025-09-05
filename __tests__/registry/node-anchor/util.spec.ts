import { describe, expect, it, vi } from 'vitest'
import { Point } from '../../../src/geometry'
import { getPointAtEdge, resolve } from '../../../src/registry/node-anchor/util'
import type { EdgeView } from '../../../src/view'

vi.mock('../../../src/view', () => ({
  EdgeView: {
    prototype: {
      getPointAtRatio: vi.fn(),
      getPointAtLength: vi.fn(),
      isEdgeElement: vi.fn(),
    },
  },
}))

describe('util', () => {
  describe('resolve', () => {
    it('应该正确处理元素引用并调用原始函数', () => {
      const mockFn = vi.fn().mockReturnValue('test-result')
      const resolvedFn = resolve(mockFn)

      const mockView = {} as EdgeView
      const mockMagnet = document.createElement('div')
      const mockRef = document.createElement('div')
      const mockOptions = { fixedAt: '50%' }

      const mockGraph = { findViewByElem: vi.fn().mockReturnValue(null) }
      const mockThis = { graph: mockGraph } as unknown as EdgeView

      const result = resolvedFn.call(
        mockThis,
        mockView,
        mockMagnet,
        mockRef,
        mockOptions,
      )
      expect(mockGraph.findViewByElem).toHaveBeenCalledWith(mockRef)
      expect(mockFn).toHaveBeenCalledWith(
        mockView,
        mockMagnet,
        expect.any(Point),
        mockOptions,
      )
      expect(result).toBe('test-result')
    })

    it('应该处理边缘元素引用', () => {
      const mockFn = vi.fn()
      const resolvedFn = resolve(mockFn)

      const mockEdgeView = {
        isEdgeElement: vi.fn().mockReturnValue(true),
        getPointAtRatio: vi.fn().mockReturnValue(new Point(0, 0)),
      } as unknown as EdgeView

      const mockGraph = {
        findViewByElem: vi.fn().mockReturnValue(mockEdgeView),
      }
      const mockThis = { graph: mockGraph } as unknown as EdgeView

      resolvedFn.call(
        mockThis,
        {} as EdgeView,
        document.createElement('div'),
        document.createElement('div'),
        {},
      )
      expect(mockEdgeView.isEdgeElement).toHaveBeenCalled()
    })

    it('应该处理非元素引用', () => {
      const mockFn = vi.fn().mockReturnValue('direct-call')
      const resolvedFn = resolve(mockFn)

      const result = resolvedFn.call(
        {} as EdgeView,
        {} as EdgeView,
        document.createElement('div'),
        'string-ref',
        {},
      )

      expect(mockFn).toHaveBeenCalledWith(
        {} as EdgeView,
        document.createElement('div'),
        'string-ref',
        {},
      )
      expect(result).toBe('direct-call')
    })
  })

  describe('getPointAtEdge', () => {
    it('应该处理百分比值', () => {
      const mockGetPointAtRatio = vi.fn().mockReturnValue(new Point(10, 20))
      const mockEdgeView = {
        getPointAtRatio: mockGetPointAtRatio,
      } as unknown as EdgeView
      const result = getPointAtEdge(mockEdgeView, '50%')

      expect(mockGetPointAtRatio).toHaveBeenCalledWith(0.5)
      expect(result).toEqual(new Point(10, 20))
    })

    it('应该处理长度值', () => {
      const mockGetPointAtLength = vi.fn().mockReturnValue(new Point(30, 40))
      const mockEdgeView = {
        getPointAtLength: mockGetPointAtLength,
      } as unknown as EdgeView
      const result = getPointAtEdge(mockEdgeView, '100')

      expect(mockGetPointAtLength).toHaveBeenCalledWith(100)
      expect(result).toEqual(new Point(30, 40))
    })

    it('应该处理数字长度值', () => {
      const mockGetPointAtLength = vi.fn().mockReturnValue(new Point(50, 60))
      const mockEdgeView = {
        getPointAtLength: mockGetPointAtLength,
      } as unknown as EdgeView
      const result = getPointAtEdge(mockEdgeView, 200)

      expect(mockGetPointAtLength).toHaveBeenCalledWith(200)
      expect(result).toEqual(new Point(50, 60))
    })
  })
})
