import { describe, expect, it } from 'vitest'
import { async } from '../../../src/registry/marker/async'

describe('async marker', () => {
  describe('default options', () => {
    it('should return correct marker with default options', () => {
      const result = async({})

      expect(result).toHaveProperty('tagName', 'path')
      expect(result).toHaveProperty('d')
      expect(result.fill).toBeUndefined()

      expect(result.d).toContain('M')
      expect(result.d).toContain('L')
      expect(result.d).toContain('Z')
    })
  })

  describe('width and height options', () => {
    it('should use custom width and height', () => {
      const result = async({ width: 20, height: 12 })

      expect(result.d).toContain('20')
      expect(result.d).toContain('12')
    })

    it('should use default values when width/height not provided', () => {
      const result = async({})

      expect(result.d).toContain('10')
      expect(result.d).toContain('6')
    })
  })

  describe('offset option', () => {
    it('should apply offset to path', () => {
      const result = async({ offset: 5 })
      const resultWithoutOffset = async({ offset: 0 })

      expect(result.d).not.toEqual(resultWithoutOffset.d)
    })

    it('should use default offset when not provided', () => {
      const result = async({})

      expect(result.d).toContain('M 0 0 L 10 -6 L 10 0 Z')
    })
  })

  describe('open option', () => {
    it('should create open path when open=true', () => {
      const result = async({ open: true })

      expect(result.fill).toBe('none')
      expect(result.d).not.toContain('Z')
    })

    it('should create closed path when open=false or not provided', () => {
      const resultClosed = async({ open: false })
      const resultDefault = async({})

      expect(resultClosed.fill).toBeUndefined()
      expect(resultDefault.fill).toBeUndefined()
      expect(resultClosed.d).toContain('Z')
      expect(resultDefault.d).toContain('Z')
    })
  })

  describe('additional attributes', () => {
    it('should preserve additional attributes', () => {
      const result = async({
        class: 'test-class',
        'data-test': 'test-value',
        stroke: 'red',
      })

      expect(result).toHaveProperty('class', 'test-class')
      expect(result).toHaveProperty('data-test', 'test-value')
      expect(result).toHaveProperty('stroke', 'red')
      expect(result.tagName).toBe('path')
    })
  })

  describe('path construction', () => {
    it('should construct correct path commands', () => {
      const result = async({ width: 10, height: 6, open: false })

      expect(result.d).toMatch(/M[^L]*L[^L]*L[^Z]*Z/)
    })

    it('should handle edge cases with zero dimensions', () => {
      const result = async({ width: 0, height: 0 })

      expect(result.d).toBeDefined()
      expect(typeof result.d).toBe('string')
    })
  })
})
