import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { BBoxEndpointOptions } from '../../../src/registry/node-anchor/bbox'
import * as bboxModule from '../../../src/registry/node-anchor/bbox'

// Mock 相关依赖
vi.mock('../../../src/common', () => ({
  NumberExt: {
    normalizePercentage: vi.fn((value, base) => {
      if (typeof value === 'string' && value.endsWith('%')) {
        return (parseFloat(value) / 100) * base
      }
      return Number(value) || 0
    }),
  },
}))

vi.mock('../../../src/geometry', () => ({
  Point: {
    prototype: {
      rotate: vi.fn(function (angle, center) {
        return { x: this.x, y: this.y, rotated: true, angle, center }
      }),
    },
  },
}))

describe('BBox Node Anchor', () => {
  let mockView: any
  let mockMagnet: any
  let mockRef: any
  let mockCell: any

  beforeEach(() => {
    mockCell = {
      visible: true,
      getAngle: vi.fn(() => 30),
      getBBox: vi.fn(() => ({
        getCenter: vi.fn(() => ({ x: 50, y: 50 })),
      })),
    }

    mockView = {
      cell: mockCell,
      getUnrotatedBBoxOfElement: vi.fn(() => ({
        center: { x: 100, y: 100 },
        topCenter: { x: 100, y: 50 },
        bottomCenter: { x: 100, y: 150 },
        leftMiddle: { x: 50, y: 100 },
        rightMiddle: { x: 150, y: 100 },
        topLeft: { x: 50, y: 50 },
        topRight: { x: 150, y: 50 },
        bottomLeft: { x: 50, y: 150 },
        bottomRight: { x: 150, y: 150 },
        width: 100,
        height: 100,
      })),
      getBBoxOfElement: vi.fn(() => ({
        center: { x: 100, y: 100 },
        topCenter: { x: 100, y: 50 },
        bottomCenter: { x: 100, y: 150 },
        leftMiddle: { x: 50, y: 100 },
        rightMiddle: { x: 150, y: 100 },
        topLeft: { x: 50, y: 50 },
        topRight: { x: 150, y: 50 },
        bottomLeft: { x: 50, y: 150 },
        bottomRight: { x: 150, y: 150 },
        width: 100,
        height: 100,
      })),
    }

    mockMagnet = document.createElement('div')
    mockRef = { x: 200, y: 200 }
  })

  describe('createBBoxAnchor function', () => {
    const testCases = [
      { method: 'center', expected: { x: 100, y: 100 } },
      { method: 'top', expected: { x: 100, y: 50 } },
      { method: 'bottom', expected: { x: 100, y: 150 } },
      { method: 'left', expected: { x: 50, y: 100 } },
      { method: 'right', expected: { x: 150, y: 100 } },
      { method: 'topLeft', expected: { x: 50, y: 50 } },
      { method: 'topRight', expected: { x: 150, y: 50 } },
      { method: 'bottomLeft', expected: { x: 50, y: 150 } },
      { method: 'bottomRight', expected: { x: 150, y: 150 } },
    ]

    testCases.forEach(({ method, expected }) => {
      it(`should return correct ${method} position`, () => {
        const anchor = bboxModule[method as keyof typeof bboxModule]
        const result = anchor(mockView, mockMagnet, mockRef, {})

        expect(result).toEqual(expected)
      })
    })
  })

  describe('with offset options', () => {
    it('should apply dx and dy offsets', () => {
      const options: BBoxEndpointOptions = {
        dx: 10,
        dy: -5,
      }

      const result = bboxModule.center(mockView, mockMagnet, mockRef, options)

      expect(result).toEqual({ x: 110, y: 95 })
    })

    it('should handle percentage offsets', () => {
      const options: BBoxEndpointOptions = {
        dx: '10%',
        dy: '20%',
      }

      const result = bboxModule.center(mockView, mockMagnet, mockRef, options)

      expect(result).toEqual({ x: 110, y: 120 })
    })
  })

  describe('rotate option', () => {
    it('should use normal bbox when rotate is false', () => {
      const options: BBoxEndpointOptions = {
        rotate: false,
      }

      const result = bboxModule.center(mockView, mockMagnet, mockRef, options)

      expect(mockView.getBBoxOfElement).toHaveBeenCalledWith(mockMagnet)
      expect(result).toEqual({ x: 100, y: 100 })
    })
  })

  describe('when cell is not visible', () => {
    beforeEach(() => {
      mockCell.visible = false
      mockCell.getBBox = vi.fn(() => ({
        center: { x: 75, y: 75 },
        width: 50,
        height: 50,
      }))
    })

    it('should use cell bbox when cell is not visible', () => {
      const result = bboxModule.center(mockView, mockMagnet, mockRef, {})

      expect(mockView.getBBoxOfElement).not.toHaveBeenCalled()
      expect(mockView.getUnrotatedBBoxOfElement).not.toHaveBeenCalled()
      expect(result).toEqual({ x: 75, y: 75 })
    })
  })

  describe('exported anchors', () => {
    const anchors = [
      'center',
      'top',
      'bottom',
      'left',
      'right',
      'topLeft',
      'topRight',
      'bottomLeft',
      'bottomRight',
    ]

    anchors.forEach((anchor) => {
      it(`should export ${anchor} anchor function`, () => {
        expect(bboxModule[anchor as keyof typeof bboxModule]).toBeDefined()
        expect(typeof bboxModule[anchor as keyof typeof bboxModule]).toBe(
          'function',
        )
      })
    })
  })
})
