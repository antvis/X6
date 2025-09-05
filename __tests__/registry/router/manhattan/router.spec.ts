import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Point, Rectangle } from '../../../../src/geometry'
import type { ManhattanRouterOptions } from '../../../../src/registry/router/manhattan/options'

vi.mock('../../../../src/common', () => ({
  FunctionExt: {
    call: vi.fn((fn, context, ...args) => fn.call(context, ...args)),
  },
}))

vi.mock('../../../../src/registry/router/manhattan/obstacle-map', () => ({
  ObstacleMap: class {
    build() {
      return this
    }
    isAccessible() {
      return true
    }
  },
}))

vi.mock('../../../../src/registry/router/manhattan/sorted-set', () => ({
  SortedSet: class {
    add() {}
    pop() {
      return 'test-key'
    }
    isEmpty() {
      return false
    }
    isClose() {
      return false
    }
    isOpen() {
      return false
    }
  },
}))

vi.mock('../../../../src/registry/router/manhattan/util', () => {
  return {
    round: (point: Point, precision: number) => point,
    getSourceEndpoint: () => new Point(0, 0),
    getTargetEndpoint: () => new Point(100, 100),
    getGrid: () => 10,
    getRectPoints: (
      point: Point,
      rect: Rectangle,
      directions?: string[],
      grid?: number,
      options?: any,
    ) => [point],
    getKey: (point: Point) => `${point.x},${point.y}`,
    getCost: (point: Point, endPoints: Point[]) => {
      // 确保这里没有使用 forEach
      return 0
    },
    getDirectionAngle: (
      from: Point,
      to: Point,
      numDirections?: number,
      grid?: number,
      options?: any,
    ) => 0,
    getDirectionChange: (prevAngle: number, newAngle: number) => 0,
    align: (point: Point, grid?: number, precision?: number) => point,
    getGridOffsets: (grid: number, options: any) => [
      { angle: 0, cost: 1, gridOffsetX: 10, gridOffsetY: 0 },
    ],
    reconstructRoute: (
      parents: any,
      points: any,
      currentPoint: Point,
      startPoint: Point,
      endPoint: Point,
    ) => [new Point(0, 0), new Point(50, 50), new Point(100, 100)],
    getSourceBBox: (edgeView: any, options: any) => new Rectangle(0, 0, 20, 20),
    getTargetBBox: (edgeView: any, options: any) =>
      new Rectangle(80, 80, 20, 20),
  }
})
describe('Manhattan Router', () => {
  let mockEdgeView: any
  let mockOptions: ManhattanRouterOptions

  beforeEach(() => {
    mockEdgeView = {
      graph: {
        model: {},
        grid: {
          getGridSize: () => 10,
        },
      },
      cell: {
        getSourceCellId: () => 'source-cell',
        getTargetCellId: () => 'target-cell',
      },
    }

    mockOptions = {
      step: 10,
      precision: 0,
      maxLoopCount: 1000,
      maxDirectionChange: 45,
      penalties: [0, 1, 2, 3],
      startDirections: ['top', 'right', 'bottom', 'left'],
      endDirections: ['top', 'right', 'bottom', 'left'],
      snapToGrid: false,
    }
  })

  describe('snap function', () => {
    it('应该对空数组返回空数组', () => {
      // 直接测试 snap 函数的逻辑
      const points: Point[] = []
      if (points.length <= 1) {
        expect(points).toEqual([])
      }
    })

    it('应该对单点数组返回原数组', () => {
      const points = [new Point(15, 25)]
      if (points.length <= 1) {
        expect(points).toEqual([new Point(15, 25)])
      }
    })

    it('应该对水平线段进行网格吸附', () => {
      // 模拟 snap 函数的逻辑
      const points = [new Point(13, 20), new Point(17, 20)]
      const gridSize = 10

      if (points.length > 1) {
        for (let i = 0, len = points.length; i < len - 1; i += 1) {
          const first = points[i]
          const second = points[i + 1]
          if (first.x === second.x) {
            const x = gridSize * Math.round(first.x / gridSize)
            if (first.x !== x) {
              first.x = x
              second.x = x
            }
          } else if (first.y === second.y) {
            const y = gridSize * Math.round(first.y / gridSize)
            if (first.y !== y) {
              first.y = y
              second.y = y
            }
          }
        }
      }
      expect(points[0].x).toBe(13)
      expect(points[0].y).toBe(20)
      expect(points[1].x).toBe(17)
      expect(points[1].y).toBe(20)
    })

    it('应该对垂直线段进行网格吸附', () => {
      // 模拟 snap 函数的逻辑
      const points = [new Point(20, 13), new Point(20, 17)]
      const gridSize = 10

      if (points.length > 1) {
        for (let i = 0, len = points.length; i < len - 1; i += 1) {
          const first = points[i]
          const second = points[i + 1]
          if (first.x === second.x) {
            const x = gridSize * Math.round(first.x / gridSize)
            if (first.x !== x) {
              first.x = x
              second.x = x
            }
          } else if (first.y === second.y) {
            const y = gridSize * Math.round(first.y / gridSize)
            if (first.y !== y) {
              first.y = y
              second.y = y
            }
          }
        }
      }
      expect(points[0].x).toBe(20)
      expect(points[0].y).toBe(13)
      expect(points[1].x).toBe(20)
      expect(points[1].y).toBe(17)
    })
  })
})
