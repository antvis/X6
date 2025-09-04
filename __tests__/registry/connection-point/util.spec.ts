import { describe, expect, it } from 'vitest'
import { Line, Point } from '../../../src/geometry'
import {
  findShapeNode,
  getStrokeWidth,
  offset,
} from '../../../src/registry/connection-point/util'

describe('connection-point util', () => {
  describe('offset', () => {
    it('should return p1 when offset is undefined', () => {
      const p1 = new Point(10, 10)
      const p2 = new Point(20, 20)
      const result = offset(p1, p2)
      expect(result).toEqual(p1)
    })

    it('should return p1 when offset is not finite number', () => {
      const p1 = new Point(10, 10)
      const p2 = new Point(20, 20)
      const result = offset(p1, p2, NaN)
      expect(result).toEqual(p1)
    })

    it('should apply numeric offset correctly', () => {
      const p1 = new Point(10, 10)
      const p2 = new Point(20, 20)
      const result = offset(p1, p2, 5)

      // 计算预期结果
      const distance = p1.distance(p2)
      const expected = p1.move(p2, -Math.min(5, distance - 1))
      expect(result).toEqual(expected)
    })

    it('should apply object offset with y coordinate', () => {
      const p1 = new Point(10, 10)
      const p2 = new Point(20, 20)
      const offsetObj = { x: 5, y: 3 }
      const result = offset(p1, p2, offsetObj)

      // 先计算平行线偏移
      const line = new Line(p2, p1)
      const parallelLine = line.parallel(offsetObj.y)
      const expectedP1 = parallelLine.end
      const expected = expectedP1.move(
        parallelLine.start,
        -Math.min(offsetObj.x, expectedP1.distance(parallelLine.start) - 1),
      )

      expect(result.x).toBeCloseTo(expected.x)
      expect(result.y).toBeCloseTo(expected.y)
    })

    it('should handle zero offset', () => {
      const p1 = new Point(10, 10)
      const p2 = new Point(20, 20)
      const result = offset(p1, p2, 0)
      expect(result).toEqual(p1)
    })
  })

  describe('getStrokeWidth', () => {
    it('should return 0 when stroke-width attribute is null', () => {
      const mockElement = {
        getAttribute: () => null,
      } as SVGElement

      const result = getStrokeWidth(mockElement)
      expect(result).toBe(0)
    })

    it('should return 0 when stroke-width is not a number', () => {
      const mockElement = {
        getAttribute: () => 'invalid',
      } as SVGElement

      const result = getStrokeWidth(mockElement)
      expect(result).toBe(0)
    })

    it('should return parsed stroke width', () => {
      const mockElement = {
        getAttribute: () => '2.5',
      } as SVGElement

      const result = getStrokeWidth(mockElement)
      expect(result).toBe(2.5)
    })

    it('should handle integer stroke width', () => {
      const mockElement = {
        getAttribute: () => '3',
      } as SVGElement

      const result = getStrokeWidth(mockElement)
      expect(result).toBe(3)
    })
  })

  describe('findShapeNode', () => {
    it('should return null when magnet is null', () => {
      const result = findShapeNode(null as any)
      expect(result).toBeNull()
    })

    it('should return the node itself when it is not G or TITLE', () => {
      const mockElement = {
        tagName: 'RECT',
      } as Element

      const result = findShapeNode(mockElement)
      expect(result).toBe(mockElement)
    })

    it('should skip G element and return its first child', () => {
      const mockFirstChild = { tagName: 'RECT' } as Element
      const mockElement = {
        tagName: 'G',
        firstElementChild: mockFirstChild,
        nextElementSibling: null,
      } as Element

      const result = findShapeNode(mockElement)
      expect(result).toBe(mockFirstChild)
    })

    it('should skip TITLE element and return its next sibling', () => {
      const mockNextSibling = { tagName: 'CIRCLE' } as Element
      const mockElement = {
        tagName: 'TITLE',
        firstElementChild: null,
        nextElementSibling: mockNextSibling,
      } as Element

      const result = findShapeNode(mockElement)
      expect(result).toBe(mockNextSibling)
    })

    it('should handle nested G elements', () => {
      const mockFinalChild = { tagName: 'PATH' } as Element
      const mockFirstChild = {
        tagName: 'G',
        firstElementChild: mockFinalChild,
        nextElementSibling: null,
      } as Element
      const mockElement = {
        tagName: 'G',
        firstElementChild: mockFirstChild,
        nextElementSibling: null,
      } as Element

      const result = findShapeNode(mockElement)
      expect(result).toBe(mockFinalChild)
    })

    it('should return null when tagName is not a string', () => {
      const mockElement = {
        tagName: 123, // 非字符串
      } as any

      const result = findShapeNode(mockElement)
      expect(result).toBeNull()
    })
  })
})
