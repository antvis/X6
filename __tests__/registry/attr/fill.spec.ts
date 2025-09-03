import { describe, expect, it, vi } from 'vitest'
import { fill } from '../../../src/registry/attr/fill'

describe('Fill attribute', () => {
  describe('qualify', () => {
    it('should return true for plain objects', () => {
      expect(fill.qualify({})).toBe(true)
      expect(fill.qualify({ color: 'red' })).toBe(true)
    })

    it('should return false for non-plain objects', () => {
      expect(fill.qualify(null)).toBe(false)
      expect(fill.qualify(undefined)).toBe(false)
      expect(fill.qualify(123)).toBe(false)
      expect(fill.qualify('string')).toBe(false)
      expect(fill.qualify([])).toBe(false)
      expect(fill.qualify(new Date())).toBe(false)
    })
  })

  describe('set', () => {
    it('should call defineGradient and return url pattern', () => {
      const mockDefineGradient = vi.fn().mockReturnValue('gradient1')
      const mockView = {
        graph: {
          defineGradient: mockDefineGradient,
        },
      }

      const gradient = { type: 'linear', stops: [] }
      const result = fill.set(gradient, { view: mockView } as any)

      expect(mockDefineGradient).toHaveBeenCalledWith(gradient)
      expect(result).toBe('url(#gradient1)')
    })
  })
})
