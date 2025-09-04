import { describe, expect, it, vi } from 'vitest'
import { Dom } from '../../../src/common'
import { fixedDot } from '../../../src/registry/grid/fixed-dot'

vi.mock('../../../src/common', () => ({
  Dom: {
    attr: vi.fn(),
  },
}))

const mockDomAttr = vi.mocked(Dom.attr)

describe('fixedDot grid definition', () => {
  describe('default properties', () => {
    it('should have correct default color', () => {
      expect(fixedDot.color).toBe('#aaaaaa')
    })

    it('should have correct default thickness', () => {
      expect(fixedDot.thickness).toBe(1)
    })

    it('should have correct markup type', () => {
      expect(fixedDot.markup).toBe('rect')
    })
  })

  describe('update method', () => {
    const mockElem = {
      setAttribute: vi.fn(),
      style: {},
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      },
    } as unknown as SVGElement
    const mockOptions = {
      sx: 1,
      thickness: 2,
      color: '#ff0000',
    }

    beforeEach(() => {
      vi.clearAllMocks()
      mockDomAttr.mockClear()
    })

    it('should call Dom.attr with correct parameters when sx <= 1', () => {
      const options = { ...mockOptions, sx: 0.5 }

      fixedDot.update(mockElem, options)

      expect(mockDomAttr).toHaveBeenCalledWith(mockElem, {
        width: 1,
        height: 1,
        rx: 1,
        ry: 1,
        fill: '#ff0000',
      })
    })

    it('should call Dom.attr with correct parameters when sx > 1', () => {
      const options = { ...mockOptions, sx: 2 }

      fixedDot.update(mockElem, options)

      expect(mockDomAttr).toHaveBeenCalledWith(mockElem, {
        width: 2,
        height: 2,
        rx: 2,
        ry: 2,
        fill: '#ff0000',
      })
    })

    it('should handle different colors', () => {
      const options = { ...mockOptions, color: '#00ff00' }

      fixedDot.update(mockElem, options)

      expect(mockDomAttr).toHaveBeenCalledWith(
        mockElem,
        expect.objectContaining({
          fill: '#00ff00',
        }),
      )
    })

    it('should handle different thickness values', () => {
      const options = { ...mockOptions, thickness: 3, sx: 0.5 }

      fixedDot.update(mockElem, options)

      expect(mockDomAttr).toHaveBeenCalledWith(
        mockElem,
        expect.objectContaining({
          width: 1.5,
          height: 1.5,
        }),
      )
    })
  })

  describe('type definitions', () => {
    it('should have correct FixedDotOptions interface', () => {
      const options: typeof fixedDot extends import('./index').GridDefinition<
        infer O
      >
        ? O
        : never = {
        sx: 1,
        thickness: 1,
        color: '#aaaaaa',
      }

      expect(options).toBeDefined()
    })
  })
})
