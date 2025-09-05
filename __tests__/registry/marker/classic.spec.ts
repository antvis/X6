import { describe, expect, it } from 'vitest'
import { block, classic } from '../../../src/registry/marker/classic'

describe('Classic Marker', () => {
  describe('block marker', () => {
    it('should create block marker with default options', () => {
      const result = block({})

      expect(result).toHaveProperty('tagName', 'path')
      expect(result).toHaveProperty('d')
      expect(result.fill).toBeUndefined()
    })

    it('should create open block marker', () => {
      const result = block({ open: true })

      expect(result).toHaveProperty('tagName', 'path')
      expect(result).toHaveProperty('d')
      expect(result.fill).toBe('none')
    })

    it('should respect custom size', () => {
      const result = block({ size: 20 })
      const d = result.d as string

      expect(d).toContain('M 0 0 L 20 -10 L 20 10 Z')
      expect(d).toContain('M 0 0 L 20 -10 L 20 10 Z')
    })

    it('should respect custom width and height', () => {
      const result = block({ width: 15, height: 25 })
      const d = result.d as string

      expect(d).toContain('M 0 0 L 15 -12.5 L 15 12.5 Z')
      expect(d).toContain('M 0 0 L 15 -12.5 L 15 12.5 Z')
    })

    it('should apply offset', () => {
      const result = block({ offset: 5 })
      const d = result.d as string

      expect(d).toContain('M -10 0 L 0 -5 L 0 5 Z')
    })

    it('should merge custom attributes', () => {
      const result = block({ stroke: 'red', 'stroke-width': 2 })

      expect(result.stroke).toBe('red')
      expect(result['stroke-width']).toBe(2)
    })
  })

  describe('classic marker', () => {
    it('should create classic marker with default options', () => {
      const result = classic({})

      expect(result).toHaveProperty('tagName', 'path')
      expect(result).toHaveProperty('d')
      expect(result.fill).toBeUndefined()
    })

    it('should respect custom factor', () => {
      const result = classic({ factor: 0.5 })
      const d = result.d as string

      expect(d).toContain('M 0 0 L 10 -5 L 5 0 L 10 5 Z')
    })

    it('should clamp factor between 0 and 1', () => {
      const result1 = classic({ factor: -1 })
      const result2 = classic({ factor: 2 })
      const d1 = result1.d as string
      const d2 = result2.d as string

      expect(d1).toContain('M 0 0 L 10 -5 L 0 0 L 10 5 Z')
      expect(d2).toContain('M 0 0 L 10 -5 L 10 0 L 10 5 Z')
    })

    it('should respect custom size and offset', () => {
      const result = classic({ size: 30, offset: 10 })
      const d = result.d as string

      expect(d).toContain('M -25 0 L 5 -15 L -2.5 0 L 5 15 Z')
      expect(d).toContain('M -25 0 L 5 -15 L -2.5 0 L 5 15 Z')
    })

    it('should merge custom attributes', () => {
      const result = classic({ fill: 'blue', class: 'marker' })

      expect(result.fill).toBe('blue')
      expect(result.class).toBe('marker')
    })
  })

  describe('edge cases', () => {
    it('should handle zero values', () => {
      const result = block({ size: 0, width: 0, height: 0 })
      const d = result.d as string

      expect(typeof d).toBe('string')
      expect(d.length).toBeGreaterThan(0)
    })

    it('should handle negative values', () => {
      const result = block({ size: -10, offset: -5 })
      const d = result.d as string

      expect(typeof d).toBe('string')
      expect(d.length).toBeGreaterThan(0)
    })
  })
})
