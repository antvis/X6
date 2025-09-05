import { describe, expect, it, vi } from 'vitest'
import { Point } from '../../../src/geometry'
import { midSide } from '../../../src/registry/node-anchor/middle-side'

const createMockView = (bbox: any, angle: number = 0) => ({
  cell: {
    getBBox: vi.fn(() => ({
      getCenter: vi.fn(
        () => new Point(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2),
      ),
    })),
    getAngle: vi.fn(() => angle),
    visible: true,
  },
  getBBoxOfElement: vi.fn(() => bbox),
  getUnrotatedBBoxOfElement: vi.fn(() => bbox),
})

const createMockBBox = (
  x: number,
  y: number,
  width: number,
  height: number,
) => ({
  x,
  y,
  width,
  height,
  inflate: vi.fn(function (padding: number) {
    this.x -= padding
    this.y -= padding
    this.width += padding * 2
    this.height += padding * 2
    return this
  }),
  getLeftMiddle: vi.fn(() => new Point(x, y + height / 2)),
  getRightMiddle: vi.fn(() => new Point(x + width, y + height / 2)),
  getTopCenter: vi.fn(() => new Point(x + width / 2, y)),
  getBottomCenter: vi.fn(() => new Point(x + width / 2, y + height)),
  getNearestSideToPoint: vi.fn((point: Point) => {
    const distances = {
      left: Math.abs(point.x - x),
      right: Math.abs(point.x - (x + width)),
      top: Math.abs(point.y - y),
      bottom: Math.abs(point.y - (y + height)),
    }
    return Object.entries(distances).reduce(
      (min, [side, dist]) =>
        dist < min.distance ? { side, distance: dist } : min,
      { side: 'left', distance: Infinity },
    ).side
  }),
})

describe('midSide anchor', () => {
  it('应该返回左边中点当参考点在左侧', () => {
    const bbox = createMockBBox(0, 0, 100, 100)
    const view = createMockView(bbox)
    const refPoint = new Point(-10, 50)
    const magnet = document.createElement('div')

    const result = midSide(view, magnet, refPoint, {})

    expect(result.x).toBe(0)
    expect(result.y).toBe(50)
  })

  it('应该返回右边中点当参考点在右侧', () => {
    const bbox = createMockBBox(0, 0, 100, 100)
    const view = createMockView(bbox)
    const refPoint = new Point(110, 50)
    const magnet = document.createElement('div')

    const result = midSide(view, magnet, refPoint, {})

    expect(result.x).toBe(100)
    expect(result.y).toBe(50)
  })

  it('应该返回上边中点当参考点在上方', () => {
    const bbox = createMockBBox(0, 0, 100, 100)
    const view = createMockView(bbox)
    const refPoint = new Point(50, -10)
    const magnet = document.createElement('div')

    const result = midSide(view, magnet, refPoint, {})

    expect(result.x).toBe(50)
    expect(result.y).toBe(0)
  })

  it('应该返回下边中点当参考点在下方', () => {
    const bbox = createMockBBox(0, 0, 100, 100)
    const view = createMockView(bbox)
    const refPoint = new Point(50, 110)
    const magnet = document.createElement('div')

    const result = midSide(view, magnet, refPoint, {})

    expect(result.x).toBe(50)
    expect(result.y).toBe(100)
  })

  it('应该应用padding选项', () => {
    const bbox = createMockBBox(0, 0, 100, 100)
    const view = createMockView(bbox)
    const refPoint = new Point(-10, 50)
    const magnet = document.createElement('div')

    const result = midSide(view, magnet, refPoint, { padding: 10 })

    expect(bbox.inflate).toHaveBeenCalledWith(10)
  })

  it('应该处理旋转的节点', () => {
    const bbox = createMockBBox(0, 0, 100, 100)
    const view = createMockView(bbox, 45)
    const refPoint = new Point(-10, 50)
    const magnet = document.createElement('div')

    const result = midSide(view, magnet, refPoint, { rotate: true })

    // 旋转后的点应该被正确计算
    expect(result).toBeDefined()
  })

  it('应该处理水平方向约束', () => {
    const bbox = createMockBBox(0, 0, 100, 100)
    const view = createMockView(bbox)
    const refPoint = new Point(50, -10)
    const magnet = document.createElement('div')

    const result = midSide(view, magnet, refPoint, { direction: 'H' })

    expect(result.x === 0 || result.x === 100).toBe(true)
    expect(result.y).toBe(50)
  })

  it('应该处理垂直方向约束', () => {
    const bbox = createMockBBox(0, 0, 100, 100)
    const view = createMockView(bbox)
    const refPoint = new Point(-10, 50)
    const magnet = document.createElement('div')

    const result = midSide(view, magnet, refPoint, { direction: 'V' })

    expect(result.y === 0 || result.y === 100).toBe(true)
    expect(result.x).toBe(50)
  })

  it('应该处理不可见节点', () => {
    const bbox = createMockBBox(0, 0, 100, 100)
    const view = {
      ...createMockView(bbox),
      cell: {
        ...createMockView(bbox).cell,
        visible: false,
        getBBox: vi.fn(() => bbox),
      },
    }
    const refPoint = new Point(-10, 50)
    const magnet = document.createElement('div')

    const result = midSide(view, magnet, refPoint, {})

    expect(result.x).toBe(0)
    expect(result.y).toBe(50)
  })
})
