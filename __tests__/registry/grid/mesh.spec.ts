import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dom } from '../../../src/common'
import { mesh } from '../../../src/registry/grid/mesh'

const mockElement = {
  setAttribute: vi.fn(),
}

vi.mock('../../../src/common', () => ({
  Dom: {
    attr: vi.fn(),
  },
}))

describe('mesh grid', () => {
  describe('default properties', () => {
    it('should have correct default color', () => {
      expect(mesh.color).toBe('rgba(224,224,224,1)')
    })

    it('should have correct default thickness', () => {
      expect(mesh.thickness).toBe(1)
    })

    it('should have correct markup type', () => {
      expect(mesh.markup).toBe('path')
    })
  })

  describe('update method', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should set correct attributes for valid dimensions', () => {
      const options = {
        width: 100,
        height: 50,
        thickness: 1,
        color: 'rgba(224,224,224,1)',
      }

      mesh.update(mockElement as any, options)

      expect(Dom.attr).toHaveBeenCalledWith(mockElement, {
        d: 'M 100 0 H0 M0 0 V0 50',
        stroke: 'rgba(224,224,224,1)',
        'stroke-width': 1,
      })
    })

    it('should handle zero dimensions gracefully', () => {
      const options = {
        width: 0,
        height: 0,
        thickness: 1,
        color: 'red',
      }

      mesh.update(mockElement as any, options)

      expect(Dom.attr).toHaveBeenCalledWith(mockElement, {
        d: 'M 0 0 0 0',
        stroke: 'red',
        'stroke-width': 1,
      })
    })

    it('should handle negative dimensions', () => {
      const options = {
        width: -10,
        height: -5,
        thickness: 2,
        color: 'blue',
      }

      mesh.update(mockElement as any, options)

      expect(Dom.attr).toHaveBeenCalledWith(mockElement, {
        d: 'M 0 0 0 0',
        stroke: 'blue',
        'stroke-width': 2,
      })
    })

    it('should handle thickness greater than dimensions', () => {
      const options = {
        width: 5,
        height: 3,
        thickness: 10,
        color: 'green',
      }

      mesh.update(mockElement as any, options)

      expect(Dom.attr).toHaveBeenCalledWith(mockElement, {
        d: 'M 0 0 0 0',
        stroke: 'green',
        'stroke-width': 10,
      })
    })

    it('should use custom color and thickness', () => {
      const options = {
        width: 200,
        height: 100,
        thickness: 3,
        color: '#ff0000',
      }

      mesh.update(mockElement as any, options)

      expect(Dom.attr).toHaveBeenCalledWith(mockElement, {
        d: 'M 200 0 H0 M0 0 V0 100',
        stroke: '#ff0000',
        'stroke-width': 3,
      })
    })
  })
})
