import { describe, expect, it } from 'vitest'
import { diamond } from '../../../src/registry/marker/diamond'

describe('diamond marker', () => {
  describe('basic functionality', () => {
    it('should create a diamond marker with default size', () => {
      const result = diamond({})

      expect(result).toHaveProperty('tagName', 'path')
      expect(result).toHaveProperty('d')
      expect(typeof result.d).toBe('string')
    })

    it('should accept custom attributes', () => {
      const result = diamond({ fill: 'red', stroke: 'black' })

      expect(result).toHaveProperty('fill', 'red')
      expect(result).toHaveProperty('stroke', 'black')
      expect(result.tagName).toBe('path')
    })
  })

  describe('size options', () => {
    it('should use size parameter when provided', () => {
      const result = diamond({ size: 20 })

      expect(result.d).toContain('20')
    })

    it('should use width and height when provided', () => {
      const result = diamond({ width: 30, height: 40 })

      expect(result.d).toContain('30')
      expect(result.d).toContain('M 0 0 L 15 -20 L 30 0 L 15 20 Z')
    })

    it('should prioritize width/height over size', () => {
      const result1 = diamond({ size: 10, width: 30, height: 40 })
      const result2 = diamond({ size: 10 })

      expect(result1.d).not.toBe(result2.d)
    })
  })

  describe('offset handling', () => {
    it('should apply default offset (-w/2) when offset is not provided', () => {
      const result = diamond({ width: 20 })
      expect(result.d).toContain('M 0 0 L 10 -5 L 20 0 L 10 5 Z')
    })

    it('should apply custom offset when provided', () => {
      const result = diamond({ width: 20, offset: 5 })

      expect(result.d).toContain('5')
      expect(result.d).not.toContain('-10')
    })

    it('should handle offset=0 correctly', () => {
      const result = diamond({ width: 20, offset: 0 })
      expect(result.d).toContain('0')
    })
  })

  describe('path generation', () => {
    it('should generate valid SVG path data', () => {
      const result = diamond({ size: 10 })

      expect(result.d).toMatch('M 0 0 L 5 -5 L 10 0 L 5 5 Z')
      expect(result.d).toMatch('M 0 0 L 5 -5 L 10 0 L 5 5 Z')
      expect(result.d).toMatch(/Z$/)
    })

    it('should create a diamond shape with correct proportions', () => {
      const result = diamond({ width: 20, height: 10 })

      expect(result.d).toContain('20')
      expect(result.d).toContain('10')
    })
  })
})
