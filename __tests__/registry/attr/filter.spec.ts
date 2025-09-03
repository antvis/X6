import { describe, expect, it, vi } from 'vitest'
import { filter } from '../../../src/registry/attr/filter'

describe('Filter attribute', () => {
  it('should qualify plain objects', () => {
    expect(filter.qualify({})).toBe(true)
    expect(filter.qualify([])).toBe(false)
    expect(filter.qualify(null)).toBe(false)
    expect(filter.qualify('string')).toBe(false)
  })

  it('should set filter attribute correctly', () => {
    const mockView = {
      graph: {
        defineFilter: vi.fn().mockReturnValue('test-filter'),
      },
    }

    const result = filter.set({ type: 'blur' }, { view: mockView } as any)
    expect(result).toBe('url(#test-filter)')
    expect(mockView.graph.defineFilter).toHaveBeenCalledWith({ type: 'blur' })
  })
})
