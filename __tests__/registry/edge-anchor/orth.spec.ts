import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FunctionExt } from '../../../src/common'
import { Point } from '../../../src/geometry'
import { getClosestPoint } from '../../../src/registry/edge-anchor/closest'
import { orth } from '../../../src/registry/edge-anchor/orth'
import { getPointAtEdge } from '../../../src/registry/node-anchor/util'

vi.mock('../../../src/registry/node-anchor/util', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('../../../src/registry/node-anchor/util')
    >()
  return {
    ...actual,
    getPointAtEdge: vi.fn(),
  }
})

vi.mock('../../../src/registry/edge-anchor/closest', () => ({
  getClosestPoint: vi.fn(),
}))

vi.mock('../../../src/common', () => ({
  FunctionExt: {
    call: vi.fn(),
  },
}))

describe('orth edge anchor', () => {
  const mockView = {
    getConnection: vi.fn(),
    getConnectionSubdivisions: vi.fn(),
  } as any

  const mockMagnet = {} as SVGElement
  const mockRefPoint = new Point(100, 100)

  beforeEach(() => {
    vi.clearAllMocks()
    ;(getPointAtEdge as any).mockReturnValue(new Point(50, 50))
    ;(getClosestPoint as any).mockReturnValue(new Point(60, 60))
    ;(FunctionExt.call as any).mockImplementation((fn, ctx, ...args) =>
      fn(...args),
    )
  })

  describe('orth function', () => {
    it('应该返回垂直线和水平线的交点', () => {
      // 模拟路径与垂直线和水平线都有交点
      const mockPath = {
        intersect: vi.fn((line) => {
          if (line.start.x === line.end.x) {
            // 垂直线
            return [new Point(100, 150), new Point(100, 50)]
          } else {
            // 水平线
            return [new Point(150, 100), new Point(50, 100)]
          }
        }),
        // 添加 intersectsWithLine 方法
        intersectsWithLine: vi.fn(),
      }

      mockView.getConnection.mockReturnValue(mockPath)
      mockView.getConnectionSubdivisions.mockReturnValue([])

      const result = orth.call(
        { graph: {} } as any,
        mockView,
        mockMagnet,
        mockRefPoint,
        {},
      )

      expect(result).toBeInstanceOf(Point)
      // 应该返回离参考点最近的交点
      expect(result.x).toBe(60)
      expect(result.y).toBe(60)
    })

    it('应该处理只有垂直线交点的情况', () => {
      const mockPath = {
        intersect: vi.fn((line) => {
          if (line.start.x === line.end.x) {
            return [new Point(100, 150), new Point(100, 50)]
          }
          return null
        }),
        intersectsWithLine: vi.fn(),
      }

      mockView.getConnection.mockReturnValue(mockPath)
      mockView.getConnectionSubdivisions.mockReturnValue([])

      const result = orth.call(
        { graph: {} } as any,
        mockView,
        mockMagnet,
        mockRefPoint,
        {},
      )

      expect(result).toBeInstanceOf(Point)
      expect(result.x).toBe(60)
      expect(result.y).toBe(60)
    })

    it('应该处理只有水平线交点的情况', () => {
      const mockPath = {
        intersect: vi.fn((line) => {
          if (line.start.x !== line.end.x) {
            return [new Point(150, 100), new Point(50, 100)]
          }
          return null
        }),
        intersectsWithLine: vi.fn(),
      }

      mockView.getConnection.mockReturnValue(mockPath)
      mockView.getConnectionSubdivisions.mockReturnValue([])

      const result = orth.call(
        { graph: {} } as any,
        mockView,
        mockMagnet,
        mockRefPoint,
        {},
      )

      expect(result).toBeInstanceOf(Point)
      expect(result.x).toBe(60)
      expect(result.y).toBe(60)
    })

    it('应该在没有交点时使用fallbackAt选项', () => {
      const mockPath = {
        intersect: vi.fn(() => null),
        intersectsWithLine: vi.fn(),
      }

      mockView.getConnection.mockReturnValue(mockPath)
      mockView.getConnectionSubdivisions.mockReturnValue([])

      const fallbackPoint = new Point(200, 200)
      ;(getPointAtEdge as any).mockReturnValue(fallbackPoint)

      const result = orth.call(
        { graph: {} } as any,
        mockView,
        mockMagnet,
        mockRefPoint,
        { fallbackAt: '50%' },
      )

      expect(getPointAtEdge).toHaveBeenCalledWith(mockView, '50%')
      expect(result).toBe(fallbackPoint)
    })

    it('应该在没有交点且没有fallbackAt时使用getClosestPoint', () => {
      const mockPath = {
        intersect: vi.fn(() => null),
        intersectsWithLine: vi.fn(),
      }

      mockView.getConnection.mockReturnValue(mockPath)
      mockView.getConnectionSubdivisions.mockReturnValue([])

      const closestPoint = new Point(300, 300)
      ;(getClosestPoint as any).mockReturnValue(closestPoint)

      const result = orth.call(
        { graph: {} } as any,
        mockView,
        mockMagnet,
        mockRefPoint,
        {},
      )

      expect(FunctionExt.call).toHaveBeenCalledWith(
        getClosestPoint,
        expect.any(Object),
        mockView,
        mockMagnet,
        mockRefPoint,
        {},
      )
      expect(result).toBe(closestPoint)
    })

    it('应该处理空交点数组的情况', () => {
      const mockPath = {
        intersect: vi.fn(() => []),
        intersectsWithLine: vi.fn(),
      }

      mockView.getConnection.mockReturnValue(mockPath)
      mockView.getConnectionSubdivisions.mockReturnValue([])

      const closestPoint = new Point(400, 400)
      ;(getClosestPoint as any).mockReturnValue(closestPoint)

      const result = orth.call(
        { graph: {} } as any,
        mockView,
        mockMagnet,
        mockRefPoint,
        {},
      )

      expect(result).toBe(closestPoint)
    })

    it('应该正确处理segmentSubdivisions参数', () => {
      const mockPath = {
        intersect: vi.fn((line, options) => {
          expect(options).toEqual({ segmentSubdivisions: ['subdivision1'] })
          return [new Point(100, 100)]
        }),
        intersectsWithLine: vi.fn(),
      }

      mockView.getConnection.mockReturnValue(mockPath)
      mockView.getConnectionSubdivisions.mockReturnValue(['subdivision1'])

      const result = orth.call(
        { graph: {} } as any,
        mockView,
        mockMagnet,
        mockRefPoint,
        {},
      )

      expect(result.x).toBe(60)
      expect(result.y).toBe(60)
    })
  })
})
