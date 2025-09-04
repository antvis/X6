import { beforeEach, describe, expect, it, vi } from 'vitest'
import { bbox } from '../../../src/registry/connection-point/bbox'
import {
  getStrokeWidth,
  offset,
} from '../../../src/registry/connection-point/util'

// Mock util functions
vi.mock('../../../src/registry/connection-point/util', () => ({
  offset: vi.fn((p) => p),
  getStrokeWidth: vi.fn(() => 0),
}))

describe('bbox connection point', () => {
  const mockView = {
    getBBoxOfElement: vi.fn(() => ({
      inflate: vi.fn(),
      intersect: vi.fn(),
    })),
  }

  const mockMagnet = document.createElement('div')
  const mockLine = {
    start: { closest: vi.fn() },
    end: { x: 100, y: 100 },
    intersect: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return offset point when intersections exist', () => {
    const intersections = [
      { x: 50, y: 50 },
      { x: 60, y: 60 },
    ]
    const closestPoint = { x: 50, y: 50 }

    mockLine.intersect.mockReturnValue(intersections)
    mockLine.start.closest.mockReturnValue(closestPoint)
    mockView.getBBoxOfElement.mockReturnValue({
      inflate: vi.fn(),
      intersect: vi.fn(() => intersections),
    })

    const result = bbox(mockLine as any, mockView as any, mockMagnet, {})

    expect(mockView.getBBoxOfElement).toHaveBeenCalledWith(mockMagnet)
    expect(mockLine.intersect).toHaveBeenCalled()
    expect(mockLine.start.closest).toHaveBeenCalledWith(intersections)
    expect(offset).toHaveBeenCalledWith(closestPoint, mockLine.start, undefined)
    expect(result).toBe(closestPoint)
  })

  it('should return line end when no intersections', () => {
    mockLine.intersect.mockReturnValue(null)
    mockView.getBBoxOfElement.mockReturnValue({
      inflate: vi.fn(),
      intersect: vi.fn(() => null),
    })

    const result = bbox(mockLine as any, mockView as any, mockMagnet, {})

    expect(offset).toHaveBeenCalledWith(mockLine.end, mockLine.start, undefined)
    expect(result).toBe(mockLine.end)
  })

  it('should inflate bbox when stroked option is true', () => {
    const mockBBox = {
      inflate: vi.fn(),
      intersect: vi.fn(() => []),
    }

    mockView.getBBoxOfElement.mockReturnValue(mockBBox)
    vi.mocked(getStrokeWidth).mockReturnValue(10)

    bbox(mockLine as any, mockView as any, mockMagnet, { stroked: true })

    expect(getStrokeWidth).toHaveBeenCalledWith(mockMagnet)
    expect(mockBBox.inflate).toHaveBeenCalledWith(5) // 10 / 2
  })

  it('should not inflate bbox when stroked option is false', () => {
    const mockBBox = {
      inflate: vi.fn(),
      intersect: vi.fn(() => []),
    }

    mockView.getBBoxOfElement.mockReturnValue(mockBBox)

    bbox(mockLine as any, mockView as any, mockMagnet, { stroked: false })

    expect(mockBBox.inflate).not.toHaveBeenCalled()
  })

  it('should pass offset options to offset function', () => {
    const offsetOptions = { x: 10, y: 20 }

    bbox(mockLine as any, mockView as any, mockMagnet, {
      offset: offsetOptions,
    })

    expect(offset).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      offsetOptions,
    )
  })

  it('should handle empty intersections array', () => {
    mockLine.intersect.mockReturnValue([])
    mockView.getBBoxOfElement.mockReturnValue({
      inflate: vi.fn(),
      intersect: vi.fn(() => []),
    })

    const result = bbox(mockLine as any, mockView as any, mockMagnet, {})

    expect(offset).toHaveBeenCalledWith(mockLine.end, mockLine.start, undefined)
    expect(result).toBe(mockLine.end)
  })
})
