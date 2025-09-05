import { describe, expect, it } from 'vitest'
import { Rectangle } from '../../../src/geometry'
import {
  bottom,
  left,
  right,
  top,
} from '../../../src/registry/port-label-layout/side'

describe('Port Label Layout - Side', () => {
  const mockPortPosition = { x: 100, y: 100 }
  const mockElemBBox = new Rectangle(0, 0, 200, 100)
  const mockArgs = { x: 0, y: 0 }

  describe('left layout', () => {
    it('should position label to the left with correct attributes', () => {
      const result = left(mockPortPosition, mockElemBBox, mockArgs)

      expect(result.position).toEqual({ x: 0, y: 0 })
      expect(result.attrs).toEqual({
        '.': { y: '.3em', 'text-anchor': 'end' },
      })
    })
  })

  describe('right layout', () => {
    it('should position label to the right with correct attributes', () => {
      const result = right(mockPortPosition, mockElemBBox, mockArgs)

      expect(result.position).toEqual({ x: 0, y: 0 })
      expect(result.attrs).toEqual({
        '.': { y: '.3em', 'text-anchor': 'start' },
      })
    })
  })

  describe('top layout', () => {
    it('should position label to the top with correct attributes', () => {
      const result = top(mockPortPosition, mockElemBBox, mockArgs)

      expect(result.position).toEqual({ x: 0, y: 0 })
      expect(result.attrs).toEqual({
        '.': { 'text-anchor': 'middle', y: '0' },
      })
    })
  })

  describe('bottom layout', () => {
    it('should position label to the bottom with correct attributes', () => {
      const result = bottom(mockPortPosition, mockElemBBox, mockArgs)

      expect(result.position).toEqual({ x: 0, y: 0 })
      expect(result.attrs).toEqual({
        '.': { y: '.6em', 'text-anchor': 'middle' },
      })
    })
  })

  describe('with custom args', () => {
    it('should apply custom offset when provided', () => {
      const customArgs = { x: 10, y: 20 }
      const result = left(mockPortPosition, mockElemBBox, customArgs)

      expect(result.position).toEqual({ x: 10, y: 20 })
    })

    it('should handle negative offset values', () => {
      const customArgs = { x: -5, y: -10 }
      const result = right(mockPortPosition, mockElemBBox, customArgs)

      expect(result.position).toEqual({ x: -5, y: -10 })
    })
  })
})
