import { describe, expect, it, vi } from 'vitest'
import { ratio } from '../../../src/registry/edge-anchor/ratio'

describe('ratio edge anchor', () => {
  const createMockView = (points: { x: number; y: number }[]) => ({
    getPointAtRatio: vi.fn((ratio: number) => {
      const index = Math.floor((points.length - 1) * ratio)
      return points[index] || null
    }),
  })

  const mockMagnet = {} as SVGElement
  const mockRef = { x: 0, y: 0 }

  it('should return point at default ratio (0.5)', () => {
    const mockPoints = [
      { x: 0, y: 0 },
      { x: 50, y: 50 },
      { x: 100, y: 100 },
    ]
    const mockView = createMockView(mockPoints)

    const result = ratio(mockView as any, mockMagnet, mockRef, {})

    expect(mockView.getPointAtRatio).toHaveBeenCalledWith(0.5)
    expect(result).toEqual({ x: 50, y: 50 })
  })

  it('should return point at custom ratio', () => {
    const mockPoints = [
      { x: 0, y: 0 },
      { x: 25, y: 25 },
      { x: 50, y: 50 },
      { x: 75, y: 75 },
      { x: 100, y: 100 },
    ]
    const mockView = createMockView(mockPoints)

    const result = ratio(mockView as any, mockMagnet, mockRef, { ratio: 0.75 })

    expect(mockView.getPointAtRatio).toHaveBeenCalledWith(0.75)
    expect(result).toEqual({ x: 75, y: 75 })
  })

  it('should convert percentage ratio to decimal', () => {
    const mockPoints = [
      { x: 0, y: 0 },
      { x: 50, y: 50 },
      { x: 100, y: 100 },
    ]
    const mockView = createMockView(mockPoints)

    const result = ratio(mockView as any, mockMagnet, mockRef, { ratio: 75 })

    expect(mockView.getPointAtRatio).toHaveBeenCalledWith(0.75)
    expect(result).toEqual({ x: 50, y: 50 })
  })

  it('should handle ratio greater than 1 (percentage conversion)', () => {
    const mockPoints = [
      { x: 0, y: 0 },
      { x: 25, y: 25 },
      { x: 50, y: 50 },
      { x: 75, y: 75 },
      { x: 100, y: 100 },
    ]
    const mockView = createMockView(mockPoints)

    const result = ratio(mockView as any, mockMagnet, mockRef, { ratio: 80 })

    expect(mockView.getPointAtRatio).toHaveBeenCalledWith(0.8)
    expect(result).toEqual({ x: 75, y: 75 })
  })

  it('should handle edge case - ratio 0', () => {
    const mockPoints = [
      { x: 0, y: 0 },
      { x: 50, y: 50 },
      { x: 100, y: 100 },
    ]
    const mockView = createMockView(mockPoints)

    const result = ratio(mockView as any, mockMagnet, mockRef, { ratio: 0 })

    expect(mockView.getPointAtRatio).toHaveBeenCalledWith(0)
    expect(result).toEqual({ x: 0, y: 0 })
  })

  it('should handle edge case - ratio 1', () => {
    const mockPoints = [
      { x: 0, y: 0 },
      { x: 50, y: 50 },
      { x: 100, y: 100 },
    ]
    const mockView = createMockView(mockPoints)

    const result = ratio(mockView as any, mockMagnet, mockRef, { ratio: 1 })

    expect(mockView.getPointAtRatio).toHaveBeenCalledWith(1)
    expect(result).toEqual({ x: 100, y: 100 })
  })

  it('should return null when getPointAtRatio returns null', () => {
    const mockView = {
      getPointAtRatio: vi.fn(() => null),
    }

    const result = ratio(mockView as any, mockMagnet, mockRef, { ratio: 0.5 })!

    expect(mockView.getPointAtRatio).toHaveBeenCalledWith(0.5)
    expect(result).toBeNull()
  })
})
