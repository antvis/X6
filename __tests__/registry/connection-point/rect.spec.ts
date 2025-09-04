import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FunctionExt } from '../../../src/common'
import { Point } from '../../../src/geometry'
import { bbox } from '../../../src/registry/connection-point/bbox'
import { rect } from '../../../src/registry/connection-point/rect'
import {
  getStrokeWidth,
  offset,
} from '../../../src/registry/connection-point/util'

// Mock 相关模块
vi.mock('../../../src/common', () => ({
  FunctionExt: {
    call: vi.fn(),
  },
}))

vi.mock('../../../src/registry/connection-point/bbox', () => ({
  bbox: vi.fn(),
}))

vi.mock('../../../src/registry/connection-point/util', () => ({
  getStrokeWidth: vi.fn(),
  offset: vi.fn(),
}))

describe('rect connection point', () => {
  let mockLine: any
  let mockView: any
  let mockMagnet: any
  let mockOptions: any

  beforeEach(() => {
    // 重置所有 mock
    vi.resetAllMocks()

    // 创建 mock 对象
    mockLine = {
      clone: vi.fn(),
      start: new Point(0, 0),
      end: new Point(100, 100),
    }

    mockView = {
      cell: {
        isNode: vi.fn(),
        getAngle: vi.fn(),
      },
      getUnrotatedBBoxOfElement: vi.fn(),
    }

    mockMagnet = document.createElement('div')
    mockOptions = {
      stroked: false,
      offset: 0,
    }

    // 设置默认 mock 返回值
    mockView.cell.isNode.mockReturnValue(true)
    mockView.cell.getAngle.mockReturnValue(0)
    mockView.getUnrotatedBBoxOfElement.mockReturnValue({
      getCenter: vi.fn().mockReturnValue(new Point(50, 50)),
      inflate: vi.fn(),
    })
  })

  describe('when angle is 0', () => {
    it('should call bbox function directly', () => {
      const result = new Point(10, 10)
      // 正确设置 FunctionExt.call 的返回值
      const mockFunctionExtCall = FunctionExt.call as vi.Mock
      mockFunctionExtCall.mockReturnValue(result)

      const actual = rect.call(
        {},
        mockLine,
        mockView,
        mockMagnet,
        mockOptions,
        'source',
      )

      expect(mockView.cell.getAngle).toHaveBeenCalled()
      expect(FunctionExt.call).toHaveBeenCalledWith(
        bbox,
        {},
        mockLine,
        mockView,
        mockMagnet,
        mockOptions,
        'source',
      )
      expect(actual).toBe(result)
    })
  })

  describe('when angle is not 0', () => {
    let rotatedLine: any
    let center: Point

    beforeEach(() => {
      mockView.cell.getAngle.mockReturnValue(45) // 设置角度不为0

      center = new Point(50, 50)

      // 创建完整的 rotatedLine 对象，包含所有必要的方法
      rotatedLine = {
        rotate: vi.fn(),
        setLength: vi.fn(),
        intersect: vi.fn(),
        start: new Point(0, 0),
        end: new Point(100, 100),
      }

      // 设置方法链式调用
      rotatedLine.rotate.mockReturnValue(rotatedLine)
      rotatedLine.setLength.mockReturnValue(rotatedLine)

      // clone 返回 rotatedLine
      mockLine.clone.mockReturnValue(rotatedLine)
    })

    it('should handle unrotated bbox calculation', () => {
      const mockBbox = {
        getCenter: vi.fn().mockReturnValue(center),
        inflate: vi.fn(),
      }
      mockView.getUnrotatedBBoxOfElement.mockReturnValue(mockBbox)

      const mockGetStrokeWidth = getStrokeWidth as vi.Mock
      mockGetStrokeWidth.mockReturnValue(2)

      rect.call(
        {},
        mockLine,
        mockView,
        mockMagnet,
        { ...mockOptions, stroked: true },
        'target',
      )

      expect(mockView.getUnrotatedBBoxOfElement).toHaveBeenCalledWith(
        mockMagnet,
      )
      expect(mockGetStrokeWidth).toHaveBeenCalledWith(mockMagnet)
      expect(mockBbox.inflate).toHaveBeenCalledWith(1)
    })

    it('should rotate line and find intersections', () => {
      const mockBbox = {
        getCenter: vi.fn().mockReturnValue(center),
        inflate: vi.fn(),
      }
      mockView.getUnrotatedBBoxOfElement.mockReturnValue(mockBbox)

      // 设置 intersect 返回值
      rotatedLine.intersect.mockReturnValue([
        new Point(25, 25),
        new Point(75, 75),
      ])

      // 为 rotatedLine.start 添加 closest 方法
      const closestPoint = new Point(25, 25)
      rotatedLine.start.closest = vi.fn().mockReturnValue(closestPoint)

      const expectedResult = new Point(20, 20)
      const mockOffset = offset as vi.Mock
      mockOffset.mockReturnValue(expectedResult)

      const result = rect.call(
        {},
        mockLine,
        mockView,
        mockMagnet,
        mockOptions,
        'target',
      )

      // 验证方法调用
      expect(mockLine.clone).toHaveBeenCalled()
      expect(rotatedLine.rotate).toHaveBeenCalledWith(45, center)
      expect(rotatedLine.setLength).toHaveBeenCalledWith(1e6)
      expect(rotatedLine.intersect).toHaveBeenCalledWith(mockBbox)
      expect(rotatedLine.start.closest).toHaveBeenCalledWith([
        new Point(25, 25),
        new Point(75, 75),
      ])
      expect(mockOffset).toHaveBeenCalledWith(
        closestPoint.rotate(-45, center),
        mockLine.start,
        0,
      )
      expect(result).toBe(expectedResult)
    })

    it('should return line end when no intersections found', () => {
      const mockBbox = {
        getCenter: vi.fn().mockReturnValue(center),
        inflate: vi.fn(),
      }
      mockView.getUnrotatedBBoxOfElement.mockReturnValue(mockBbox)

      // 设置 intersect 返回 null
      rotatedLine.intersect.mockReturnValue(null)

      const expectedResult = new Point(30, 30)
      const mockOffset = offset as vi.Mock
      mockOffset.mockReturnValue(expectedResult)

      const result = rect.call(
        {},
        mockLine,
        mockView,
        mockMagnet,
        mockOptions,
        'target',
      )

      expect(mockOffset).toHaveBeenCalledWith(mockLine.end, mockLine.start, 0)
      expect(result).toBe(expectedResult)
    })
  })

  describe('edge cases', () => {
    it('should handle offset options', () => {
      mockView.cell.getAngle.mockReturnValue(45)
      const center = new Point(50, 50)
      const mockBbox = {
        getCenter: vi.fn().mockReturnValue(center),
        inflate: vi.fn(),
      }
      mockView.getUnrotatedBBoxOfElement.mockReturnValue(mockBbox)

      // 创建新的 rotatedLine 实例
      const rotatedLine = {
        rotate: vi.fn(),
        setLength: vi.fn(),
        intersect: vi.fn().mockReturnValue([new Point(25, 25)]),
        start: new Point(0, 0),
        end: new Point(100, 100),
      }
      rotatedLine.rotate.mockReturnValue(rotatedLine)
      rotatedLine.setLength.mockReturnValue(rotatedLine)
      rotatedLine.start.closest = vi.fn().mockReturnValue(new Point(25, 25))

      mockLine.clone.mockReturnValue(rotatedLine)

      const expectedResult = new Point(20, 20)
      const mockOffset = offset as vi.Mock
      mockOffset.mockReturnValue(expectedResult)

      const result = rect.call(
        {},
        mockLine,
        mockView,
        mockMagnet,
        { ...mockOptions, offset: 10 },
        'target',
      )

      expect(mockOffset).toHaveBeenCalledWith(
        expect.any(Point),
        mockLine.start,
        10,
      )
      expect(result).toBe(expectedResult)
    })
  })
})
