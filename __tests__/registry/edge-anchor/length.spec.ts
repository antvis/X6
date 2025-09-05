import { describe, expect, it, vi } from 'vitest'
import { length } from '../../../src/registry/edge-anchor/length'

describe('length edge anchor', () => {
  it('should return point at specified length', () => {
    const mockView = {
      getPointAtLength: vi.fn().mockReturnValue({ x: 10, y: 20 }),
    }
    const mockMagnet = {} as any
    const mockRef = {} as any

    const result = length(mockView as any, mockMagnet, mockRef, { length: 30 })

    expect(mockView.getPointAtLength).toHaveBeenCalledWith(30)
    expect(result).toEqual({ x: 10, y: 20 })
  })

  it('should use default length of 20 when no length option provided', () => {
    const mockView = {
      getPointAtLength: vi.fn().mockReturnValue({ x: 15, y: 25 }),
    }
    const mockMagnet = {} as any
    const mockRef = {} as any

    const result = length(mockView as any, mockMagnet, mockRef, {})

    expect(mockView.getPointAtLength).toHaveBeenCalledWith(20)
    expect(result).toEqual({ x: 15, y: 25 })
  })

  it('should use default length of 20 when length option is null', () => {
    const mockView = {
      getPointAtLength: vi.fn().mockReturnValue({ x: 15, y: 25 }),
    }
    const mockMagnet = {} as any
    const mockRef = {} as any

    const result = length(mockView as any, mockMagnet, mockRef, {
      length: null,
    } as any)

    expect(mockView.getPointAtLength).toHaveBeenCalledWith(20)
    expect(result).toEqual({ x: 15, y: 25 })
  })

  it('should use default length of 20 when length option is undefined', () => {
    const mockView = {
      getPointAtLength: vi.fn().mockReturnValue({ x: 15, y: 25 }),
    }
    const mockMagnet = {} as any
    const mockRef = {} as any

    const result = length(mockView as any, mockMagnet, mockRef, {
      length: undefined,
    })

    expect(mockView.getPointAtLength).toHaveBeenCalledWith(20)
    expect(result).toEqual({ x: 15, y: 25 })
  })

  it('should handle zero length', () => {
    const mockView = {
      getPointAtLength: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    }
    const mockMagnet = {} as any
    const mockRef = {} as any

    const result = length(mockView as any, mockMagnet, mockRef, { length: 0 })

    expect(mockView.getPointAtLength).toHaveBeenCalledWith(0)
    expect(result).toEqual({ x: 0, y: 0 })
  })

  it('should handle negative length', () => {
    const mockView = {
      getPointAtLength: vi.fn().mockReturnValue({ x: -5, y: -10 }),
    }
    const mockMagnet = {} as any
    const mockRef = {} as any

    const result = length(mockView as any, mockMagnet, mockRef, { length: -10 })

    expect(mockView.getPointAtLength).toHaveBeenCalledWith(-10)
    expect(result).toEqual({ x: -5, y: -10 })
  })
})
