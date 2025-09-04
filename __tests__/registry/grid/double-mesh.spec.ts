import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dom } from '../../../src/common'
import { doubleMesh } from '../../../src/registry/grid/double-mesh'

vi.mock('../../../src/common', () => ({
  Dom: {
    attr: vi.fn(),
  },
}))

describe('doubleMesh', () => {
  const mockElement = {
    setAttribute: vi.fn(),
  } as unknown as SVGPathElement
  const baseOptions = {
    width: 100,
    height: 100,
    thickness: 1,
    color: 'rgba(224,224,224,1)',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('first grid definition', () => {
    const gridDef = doubleMesh[0]

    it('should have correct properties', () => {
      expect(gridDef.color).toBe('rgba(224,224,224,1)')
      expect(gridDef.thickness).toBe(1)
      expect(gridDef.markup).toBe('path')
      expect(typeof gridDef.update).toBe('function')
    })

    it('should update element with correct attributes for valid dimensions', () => {
      gridDef.update(mockElement, { ...baseOptions })

      expect(Dom.attr).toHaveBeenCalledWith(mockElement, {
        d: 'M 100 0 H0 M0 0 V0 100',
        stroke: 'rgba(224,224,224,1)',
        'stroke-width': 1,
      })
    })

    it('should handle zero dimensions', () => {
      gridDef.update(mockElement, {
        ...baseOptions,
        width: 0,
        height: 0,
      })

      expect(Dom.attr).toHaveBeenCalledWith(mockElement, {
        d: 'M 0 0 0 0',
        stroke: 'rgba(224,224,224,1)',
        'stroke-width': 1,
      })
    })

    it('should handle negative dimensions', () => {
      gridDef.update(mockElement, {
        ...baseOptions,
        width: -10,
        height: -10,
      })

      expect(Dom.attr).toHaveBeenCalledWith(mockElement, {
        d: 'M 0 0 0 0',
        stroke: 'rgba(224,224,224,1)',
        'stroke-width': 1,
      })
    })
  })

  describe('second grid definition', () => {
    const gridDef = doubleMesh[1]

    it('should have correct properties', () => {
      expect(gridDef.color).toBe('rgba(224,224,224,0.2)')
      expect(gridDef.thickness).toBe(3)
      expect(gridDef.factor).toBe(4)
      expect(gridDef.markup).toBe('path')
      expect(typeof gridDef.update).toBe('function')
    })

    it('should update element with scaled dimensions and correct attributes', () => {
      const options = { ...baseOptions, thickness: 3 }
      gridDef.update(mockElement, options)

      expect(Dom.attr).toHaveBeenCalledWith(mockElement, {
        d: 'M 100 0 H0 M0 0 V0 100',
        stroke: 'rgba(224,224,224,1)',
        'stroke-width': 3,
      })

      expect(options.width).toBe(100)
      expect(options.height).toBe(100)
    })

    it('should use custom factor when provided', () => {
      const options = { ...baseOptions, thickness: 3, factor: 2 }
      gridDef.update(mockElement, options)

      expect(Dom.attr).toHaveBeenCalledWith(mockElement, {
        d: 'M 200 0 H0 M0 0 V0 200',
        stroke: 'rgba(224,224,224,1)',
        'stroke-width': 3,
      })

      expect(options.width).toBe(200)
      expect(options.height).toBe(200)
    })

    it('should handle zero dimensions with scaling', () => {
      const options = { ...baseOptions, width: 0, height: 0, thickness: 3 }
      gridDef.update(mockElement, options)

      expect(Dom.attr).toHaveBeenCalledWith(mockElement, {
        d: 'M 0 0 0 0',
        stroke: 'rgba(224,224,224,1)',
        'stroke-width': 3,
      })

      expect(options.width).toBe(0)
      expect(options.height).toBe(0)
    })
  })

  describe('array structure', () => {
    it('should export an array with 2 grid definitions', () => {
      expect(doubleMesh).toHaveLength(2)
      expect(Array.isArray(doubleMesh)).toBe(true)
    })

    it('each grid definition should have required properties', () => {
      doubleMesh.forEach((gridDef, index) => {
        expect(gridDef).toHaveProperty('color')
        expect(gridDef).toHaveProperty('thickness')
        expect(gridDef).toHaveProperty('markup', 'path')
        expect(gridDef).toHaveProperty('update')
        expect(typeof gridDef.update).toBe('function')
      })
    })
  })
})
