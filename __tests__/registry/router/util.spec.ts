import { describe, expect, it } from 'vitest'
import { Point, Rectangle } from '../../../src/geometry'
import {
  getPaddingBox,
  getPointBBox,
  getSourceAnchor,
  getSourceBBox,
  getTargetAnchor,
  getTargetBBox,
  type PaddingOptions,
} from '../../../src/registry/router/util'
import type { EdgeView } from '../../../src/view/edge'

describe('Router Util Functions', () => {
  describe('getPointBBox', () => {
    it('should create a rectangle from a point with zero width and height', () => {
      const point = new Point(10, 20)
      const bbox = getPointBBox(point)

      expect(bbox).toBeInstanceOf(Rectangle)
      expect(bbox.x).toBe(10)
      expect(bbox.y).toBe(20)
      expect(bbox.width).toBe(0)
      expect(bbox.height).toBe(0)
    })

    it('should handle point with decimal coordinates', () => {
      const point = new Point(15.5, 25.75)
      const bbox = getPointBBox(point)

      expect(bbox.x).toBe(15.5)
      expect(bbox.y).toBe(25.75)
      expect(bbox.width).toBe(0)
      expect(bbox.height).toBe(0)
    })
  })

  describe('getPaddingBox', () => {
    it('should return default padding box when no options provided', () => {
      const result = getPaddingBox()

      expect(result).toEqual({
        x: -20,
        y: -20,
        width: 40,
        height: 40,
      })
    })

    it('should return padding box with custom padding number', () => {
      const options: PaddingOptions = { padding: 30 }
      const result = getPaddingBox(options)

      expect(result).toEqual({
        x: -30,
        y: -30,
        width: 60,
        height: 60,
      })
    })

    it('should return padding box with side-specific padding', () => {
      const options: PaddingOptions = {
        padding: {
          top: 10,
          right: 20,
          bottom: 30,
          left: 40,
        },
      }
      const result = getPaddingBox(options)

      expect(result).toEqual({
        x: -40,
        y: -10,
        width: 60, // left + right = 40 + 20
        height: 40, // top + bottom = 10 + 30
      })
    })

    it('should handle vertical and horizontal padding', () => {
      const options: PaddingOptions = {
        padding: {
          vertical: 15,
          horizontal: 25,
        },
      }
      const result = getPaddingBox(options)

      expect(result).toEqual({
        x: -25,
        y: -15,
        width: 50, // horizontal * 2
        height: 30, // vertical * 2
      })
    })

    it('should handle mixed padding options', () => {
      const options: PaddingOptions = {
        padding: {
          vertical: 10,
          left: 5,
          bottom: 20,
        },
      }
      const result = getPaddingBox(options)

      expect(result).toEqual({
        x: -5,
        y: -10,
        width: 5, // left only (right defaults to 0)
        height: 30, // top (from vertical) + bottom = 10 + 20
      })
    })
  })

  describe('getSourceBBox and getTargetBBox', () => {
    // Mock EdgeView for testing
    const createMockEdgeView = (
      sourceBBox: Rectangle,
      targetBBox: Rectangle,
    ) => {
      return {
        sourceBBox: sourceBBox.clone(),
        targetBBox: targetBBox.clone(),
      } as unknown as EdgeView
    }

    it('should expand source bbox with padding', () => {
      const sourceBBox = new Rectangle(0, 0, 100, 50)
      const targetBBox = new Rectangle(200, 100, 80, 60)
      const mockView = createMockEdgeView(sourceBBox, targetBBox)

      const options: PaddingOptions = { padding: 10 }
      const result = getSourceBBox(mockView, options)

      expect(result.x).toBe(-10)
      expect(result.y).toBe(-10)
      expect(result.width).toBe(120) // 100 + 20 (padding)
      expect(result.height).toBe(70) // 50 + 20 (padding)
    })

    it('should expand target bbox with padding', () => {
      const sourceBBox = new Rectangle(0, 0, 100, 50)
      const targetBBox = new Rectangle(200, 100, 80, 60)
      const mockView = createMockEdgeView(sourceBBox, targetBBox)

      const options: PaddingOptions = { padding: 15 }
      const result = getTargetBBox(mockView, options)

      expect(result.x).toBe(185) // 200 - 15
      expect(result.y).toBe(85) // 100 - 15
      expect(result.width).toBe(110) // 80 + 30 (padding)
      expect(result.height).toBe(90) // 60 + 30 (padding)
    })

    it('should handle custom padding for source bbox', () => {
      const sourceBBox = new Rectangle(50, 50, 100, 100)
      const targetBBox = new Rectangle(0, 0, 50, 50)
      const mockView = createMockEdgeView(sourceBBox, targetBBox)

      const options: PaddingOptions = {
        padding: {
          top: 5,
          right: 10,
          bottom: 15,
          left: 20,
        },
      }
      const result = getSourceBBox(mockView, options)

      expect(result.x).toBe(30) // 50 - 20
      expect(result.y).toBe(45) // 50 - 5
      expect(result.width).toBe(130) // 100 + 20 + 10
      expect(result.height).toBe(120) // 100 + 5 + 15
    })
  })

  describe('getSourceAnchor and getTargetAnchor', () => {
    // Mock EdgeView with sourceAnchor and targetAnchor
    const createMockEdgeViewWithAnchors = (
      sourceAnchor: Point | null,
      targetAnchor: Point | null,
      sourceBBox: Rectangle,
      targetBBox: Rectangle,
    ) => {
      return {
        sourceAnchor: sourceAnchor ? sourceAnchor.clone() : null,
        targetAnchor: targetAnchor ? targetAnchor.clone() : null,
        sourceBBox: sourceBBox.clone(),
        targetBBox: targetBBox.clone(),
      } as unknown as EdgeView
    }

    it('should return existing source anchor if available', () => {
      const sourceAnchor = new Point(25, 35)
      const sourceBBox = new Rectangle(0, 0, 100, 100)
      const targetBBox = new Rectangle(200, 200, 50, 50)
      const mockView = createMockEdgeViewWithAnchors(
        sourceAnchor,
        null,
        sourceBBox,
        targetBBox,
      )

      const result = getSourceAnchor(mockView)

      expect(result.equals(sourceAnchor)).toBe(true)
    })

    it('should return center of source bbox when no source anchor', () => {
      const sourceBBox = new Rectangle(10, 20, 100, 50)
      const targetBBox = new Rectangle(0, 0, 50, 50)
      const mockView = createMockEdgeViewWithAnchors(
        null,
        null,
        sourceBBox,
        targetBBox,
      )

      const result = getSourceAnchor(mockView)
      const expectedCenter = sourceBBox.getCenter()

      expect(result.x).toBeCloseTo(expectedCenter.x)
      expect(result.y).toBeCloseTo(expectedCenter.y)
    })

    it('should return existing target anchor if available', () => {
      const targetAnchor = new Point(125, 135)
      const sourceBBox = new Rectangle(0, 0, 100, 100)
      const targetBBox = new Rectangle(200, 200, 50, 50)
      const mockView = createMockEdgeViewWithAnchors(
        null,
        targetAnchor,
        sourceBBox,
        targetBBox,
      )

      const result = getTargetAnchor(mockView)

      expect(result.equals(targetAnchor)).toBe(true)
    })

    it('should return center of target bbox when no target anchor', () => {
      const sourceBBox = new Rectangle(0, 0, 50, 50)
      const targetBBox = new Rectangle(30, 40, 80, 60)
      const mockView = createMockEdgeViewWithAnchors(
        null,
        null,
        sourceBBox,
        targetBBox,
      )

      const result = getTargetAnchor(mockView)
      const expectedCenter = targetBBox.getCenter()

      expect(result.x).toBeCloseTo(expectedCenter.x)
      expect(result.y).toBeCloseTo(expectedCenter.y)
    })

    it('should apply padding when calculating anchor from bbox', () => {
      const sourceBBox = new Rectangle(0, 0, 100, 100)
      const targetBBox = new Rectangle(200, 200, 100, 100)
      const mockView = createMockEdgeViewWithAnchors(
        null,
        null,
        sourceBBox,
        targetBBox,
      )

      const options: PaddingOptions = { padding: 20 }
      const sourceResult = getSourceAnchor(mockView, options)
      const targetResult = getTargetAnchor(mockView, options)

      // With padding, the expanded bbox center should be different
      const expandedSourceBBox = sourceBBox
        .clone()
        .moveAndExpand(getPaddingBox(options))
      const expandedTargetBBox = targetBBox
        .clone()
        .moveAndExpand(getPaddingBox(options))

      expect(sourceResult.equals(expandedSourceBBox.getCenter())).toBe(true)
      expect(targetResult.equals(expandedTargetBBox.getCenter())).toBe(true)
    })
  })

  describe('Edge cases', () => {
    it('should handle zero-sized bboxes', () => {
      const sourceBBox = new Rectangle(10, 10, 0, 0)
      const targetBBox = new Rectangle(20, 20, 0, 0)
      const mockView = {
        sourceBBox: sourceBBox.clone(),
        targetBBox: targetBBox.clone(),
        sourceAnchor: null,
        targetAnchor: null,
      } as unknown as EdgeView

      const sourceResult = getSourceAnchor(mockView)
      const targetResult = getTargetAnchor(mockView)

      expect(sourceResult.x).toBe(10)
      expect(sourceResult.y).toBe(10)
      expect(targetResult.x).toBe(20)
      expect(targetResult.y).toBe(20)
    })

    it('should handle negative coordinates', () => {
      const sourceBBox = new Rectangle(-50, -30, 100, 60)
      const targetBBox = new Rectangle(-20, -40, 80, 40)
      const mockView = {
        sourceBBox: sourceBBox.clone(),
        targetBBox: targetBBox.clone(),
        sourceAnchor: null,
        targetAnchor: null,
      } as unknown as EdgeView

      const sourceResult = getSourceAnchor(mockView)
      const targetResult = getTargetAnchor(mockView)

      expect(sourceResult.x).toBe(0) // (-50 + 100/2)
      expect(sourceResult.y).toBe(0) // (-30 + 60/2)
      expect(targetResult.x).toBe(20) // (-20 + 80/2)
      expect(targetResult.y).toBe(-20) // (-40 + 40/2)
    })
  })
})
