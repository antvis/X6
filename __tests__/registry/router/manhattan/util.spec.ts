import { describe, expect, it } from 'vitest'
import { Point, Rectangle } from '../../../../src/geometry'
import type {
  Direction,
  ResolvedOptions,
} from '../../../../src/registry/router/manhattan/options'
import * as util from '../../../../src/registry/router/manhattan/util'
import type { EdgeView } from '../../../../src/view/edge'

// Mock EdgeView
const mockEdgeView = {
  sourceBBox: new Rectangle(0, 0, 100, 100),
  targetBBox: new Rectangle(200, 200, 100, 100),
  sourceAnchor: null,
  targetAnchor: null,
} as unknown as EdgeView

// Mock ResolvedOptions
const mockOptions: ResolvedOptions = {
  step: 10,
  precision: 2,
  paddingBox: { x: 5, y: 5, width: 10, height: 10 },
  directions: [],
  directionMap: {},
}

describe('Manhattan Router Utilities', () => {
  describe('getSourceBBox', () => {
    it('should return cloned source bbox without padding', () => {
      const options = { ...mockOptions, paddingBox: undefined }
      const result = util.getSourceBBox(mockEdgeView, options)
      expect(result).toEqual(mockEdgeView.sourceBBox.clone())
      expect(result).not.toBe(mockEdgeView.sourceBBox)
    })

    it('should return padded source bbox when paddingBox is provided', () => {
      const result = util.getSourceBBox(mockEdgeView, mockOptions)
      expect(result.x).toBe(5)
      expect(result.y).toBe(5)
      expect(result.width).toBe(110)
      expect(result.height).toBe(110)
    })
  })

  describe('getTargetBBox', () => {
    it('should return cloned target bbox without padding', () => {
      const options = { ...mockOptions, paddingBox: undefined }
      const result = util.getTargetBBox(mockEdgeView, options)
      expect(result).toEqual(mockEdgeView.targetBBox.clone())
      expect(result).not.toBe(mockEdgeView.targetBBox)
    })

    it('should return padded target bbox when paddingBox is provided', () => {
      const result = util.getTargetBBox(mockEdgeView, mockOptions)
      expect(result.x).toBe(205)
      expect(result.y).toBe(205)
      expect(result.width).toBe(110)
      expect(result.height).toBe(110)
    })
  })

  describe('getSourceEndpoint', () => {
    it('should return source anchor when available', () => {
      const anchor = new Point(50, 50)
      const view = { ...mockEdgeView, sourceAnchor: anchor }
      const result = util.getSourceEndpoint(view, mockOptions)
      expect(result).toBe(anchor)
    })

    it('should return center of source bbox when no anchor', () => {
      const result = util.getSourceEndpoint(mockEdgeView, mockOptions)
      expect(result).toEqual(new Point(60, 60))
    })
  })

  describe('getTargetEndpoint', () => {
    it('should return target anchor when available', () => {
      const anchor = new Point(250, 250)
      const view = { ...mockEdgeView, targetAnchor: anchor }
      const result = util.getTargetEndpoint(view, mockOptions)
      expect(result).toBe(anchor)
    })

    it('should return center of target bbox when no anchor', () => {
      const result = util.getTargetEndpoint(mockEdgeView, mockOptions)
      expect(result).toEqual(new Point(260, 260))
    })
  })

  describe('getDirectionAngle', () => {
    it('should calculate correct direction angle', () => {
      const start = new Point(0, 0)
      const end = new Point(100, 100)
      const grid = { source: start, x: 10, y: 10 }
      const directionCount = 8

      const result = util.getDirectionAngle(
        start,
        end,
        directionCount,
        grid,
        mockOptions,
      )
      expect(result).toBe(315)
    })
  })

  describe('getDirectionChange', () => {
    it('should calculate direction change correctly', () => {
      expect(util.getDirectionChange(0, 90)).toBe(90)
      expect(util.getDirectionChange(90, 0)).toBe(90)
      expect(util.getDirectionChange(350, 10)).toBe(20)
      expect(util.getDirectionChange(10, 350)).toBe(20)
    })
  })

  describe('getGrid', () => {
    it('should create grid with correct dimensions', () => {
      const source = new Point(0, 0)
      const target = new Point(100, 50)
      const step = 10

      const grid = util.getGrid(step, source, target)
      expect(grid.source).toEqual(source)
      expect(grid.x).toBeCloseTo(10)
      expect(grid.y).toBeCloseTo(10)
    })

    it('should handle zero distance', () => {
      const source = new Point(0, 0)
      const target = new Point(0, 0)
      const step = 10

      const grid = util.getGrid(step, source, target)
      expect(grid.x).toBe(10)
      expect(grid.y).toBe(10)
    })
  })

  describe('align', () => {
    it('should align point to grid with precision', () => {
      const point = new Point(12.345, 67.891)
      const grid = { source: new Point(0, 0), x: 5, y: 5 }
      const precision = 1

      const result = util.align(point, grid, precision)
      expect(result.x).toBe(10)
      expect(result.y).toBe(70)
    })
  })

  describe('getKey', () => {
    it('should generate unique key for point', () => {
      const point = new Point(123.456, 789.012)
      const key = util.getKey(point)
      expect(key).toBe('{"x":123.456,"y":789.012}')
    })

    describe('normalizePoint', () => {
      it('should normalize point to unit vectors', () => {
        expect(util.normalizePoint({ x: 5, y: -3 })).toEqual(new Point(1, -1))
        expect(util.normalizePoint({ x: -10, y: 0 })).toEqual(new Point(-1, 0))
        expect(util.normalizePoint({ x: 0, y: 0 })).toEqual(new Point(0, 0))
      })
    })

    describe('getCost', () => {
      it('should calculate minimum manhattan distance', () => {
        const from = new Point(0, 0)
        const anchors = [new Point(10, 10), new Point(5, 5), new Point(15, 15)]

        const cost = util.getCost(from, anchors)
        expect(cost).toBe(10) // Manhattan distance to (5,5)
      })
    })

    describe('getRectPoints', () => {
      it('should generate rect points for directions', () => {
        const anchor = new Point(50, 50)
        const bbox = new Rectangle(0, 0, 100, 100)
        const directionList = ['right', 'down'] as Direction[]
        const grid = { source: new Point(0, 0), x: 10, y: 10 }

        const options: ResolvedOptions = {
          ...mockOptions,
          directionMap: {
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
          } as any,
        }

        const points = util.getRectPoints(
          anchor,
          bbox,
          directionList,
          grid,
          options,
        )
        expect(points.length).toBeGreaterThan(0)
        points.forEach((point) => {
          expect(point.x % 10).toBe(0)
          expect(point.y % 10).toBe(0)
        })
      })
    })
  })
})
