import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dictionary, Dom, Util } from '../../src/common'
import { Ellipse, Rectangle } from '../../src/geometry'
import { Cache } from '../../src/view/cache'
import type { CellView } from '../../src/view/cell'

describe('Cache', () => {
  let cache: Cache
  let mockView: CellView
  let mockElement: Element

  beforeEach(() => {
    // @ts-expect-error
    mockView = {
      container: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    }
    mockElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    cache = new Cache(mockView)
  })

  describe('constructor', () => {
    it('should initialize cache and call clean', () => {
      const cleanSpy = vi.spyOn(Cache.prototype, 'clean')
      const newCache = new Cache(mockView)
      expect(cleanSpy).toHaveBeenCalled()
      expect(newCache.pathCache).toEqual({})
    })
  })

  describe('clean', () => {
    it('should dispose existing elemCache and create new one', () => {
      const disposeSpy = vi.spyOn(cache['elemCache'], 'dispose')
      cache.clean()
      expect(disposeSpy).toHaveBeenCalled()
      expect(cache['elemCache']).toBeInstanceOf(Dictionary)
      expect(cache.pathCache).toEqual({})
    })

    it('should handle when elemCache is undefined', () => {
      cache['elemCache'] = undefined as any
      expect(() => cache.clean()).not.toThrow()
      expect(cache['elemCache']).toBeInstanceOf(Dictionary)
    })
  })

  describe('get', () => {
    it('should return existing cache item', () => {
      const existingItem = { data: { test: 'value' } }
      cache['elemCache'].set(mockElement, existingItem)

      const result = cache.get(mockElement)
      expect(result).toBe(existingItem)
    })

    it('should create new cache item if not exists', () => {
      const result = cache.get(mockElement)
      expect(result).toEqual({})
      expect(cache['elemCache'].has(mockElement)).toBe(true)
    })
  })

  describe('getData', () => {
    it('should return existing data', () => {
      const existingData = { test: 'value' }
      cache['elemCache'].set(mockElement, { data: existingData })

      const result = cache.getData(mockElement)
      expect(result).toBe(existingData)
    })

    it('should create empty data object if not exists', () => {
      const result = cache.getData(mockElement)
      expect(result).toEqual({})

      const meta = cache.get(mockElement)
      expect(meta.data).toBe(result)
    })
  })

  describe('getMatrix', () => {
    it('should return existing matrix', () => {
      const mockMatrix = new DOMMatrix()
      cache['elemCache'].set(mockElement, { matrix: mockMatrix })

      const createSVGMatrixSpy = vi
        .spyOn(Dom, 'createSVGMatrix')
        .mockReturnValue(mockMatrix)

      const result = cache.getMatrix(mockElement)
      expect(createSVGMatrixSpy).toHaveBeenCalledWith(mockMatrix)
      expect(result).toBe(mockMatrix)
    })

    it('should compute and cache matrix if not exists', () => {
      const mockMatrix = new DOMMatrix()
      const getTransformSpy = vi
        .spyOn(Dom, 'getTransformToParentElement')
        .mockReturnValue(mockMatrix)
      const createSVGMatrixSpy = vi
        .spyOn(Dom, 'createSVGMatrix')
        .mockReturnValue(mockMatrix)

      const result = cache.getMatrix(mockElement)

      expect(getTransformSpy).toHaveBeenCalledWith(
        mockElement,
        mockView.container,
      )
      expect(createSVGMatrixSpy).toHaveBeenCalledWith(mockMatrix)

      const meta = cache.get(mockElement)
      expect(meta.matrix).toBe(mockMatrix)
      expect(result).toBe(mockMatrix)
    })
  })

  describe('getShape', () => {
    it('should return cloned existing shape', () => {
      const mockShape = new Rectangle(0, 0, 10, 10)
      const clonedShape = new Rectangle(0, 0, 10, 10)
      const cloneSpy = vi.spyOn(mockShape, 'clone').mockReturnValue(clonedShape)

      cache['elemCache'].set(mockElement, { shape: mockShape })

      const result = cache.getShape(mockElement)
      expect(cloneSpy).toHaveBeenCalled()
      expect(result).toBe(clonedShape)
    })

    it('should compute and cache shape if not exists', () => {
      const mockShape = new Ellipse(0, 0, 5, 5)
      const clonedShape = new Ellipse(0, 0, 5, 5)
      const cloneSpy = vi.spyOn(mockShape, 'clone').mockReturnValue(clonedShape)
      const toGeometryShapeSpy = vi
        .spyOn(Util, 'toGeometryShape')
        .mockReturnValue(mockShape)

      const result = cache.getShape(mockElement)

      expect(toGeometryShapeSpy).toHaveBeenCalledWith(mockElement)
      expect(cloneSpy).toHaveBeenCalled()

      const meta = cache.get(mockElement)
      expect(meta.shape).toBe(mockShape)
      expect(result).toBe(clonedShape)
    })
  })

  describe('getBoundingRect', () => {
    it('should return cloned existing boundingRect', () => {
      const mockRect = new Rectangle(0, 0, 10, 10)
      const clonedRect = new Rectangle(0, 0, 10, 10)
      const cloneSpy = vi.spyOn(mockRect, 'clone').mockReturnValue(clonedRect)

      cache['elemCache'].set(mockElement, { boundingRect: mockRect })

      const result = cache.getBoundingRect(mockElement)
      expect(cloneSpy).toHaveBeenCalled()
      expect(result).toBe(clonedRect)
    })

    it('should compute and cache boundingRect if not exists', () => {
      const mockRect = new Rectangle(5, 5, 15, 15)
      const clonedRect = new Rectangle(5, 5, 15, 15)
      const cloneSpy = vi.spyOn(mockRect, 'clone').mockReturnValue(clonedRect)
      const getBBoxSpy = vi.spyOn(Util, 'getBBoxV2').mockReturnValue(mockRect)

      const result = cache.getBoundingRect(mockElement)

      expect(getBBoxSpy).toHaveBeenCalledWith(mockElement)
      expect(cloneSpy).toHaveBeenCalled()

      const meta = cache.get(mockElement)
      expect(meta.boundingRect).toBe(mockRect)
      expect(result).toBe(clonedRect)
    })
  })

  describe('pathCache', () => {
    it('should initialize pathCache as empty object', () => {
      expect(cache.pathCache).toEqual({})
    })

    it('should allow setting pathCache properties', () => {
      cache.pathCache.data = 'M 0 0 L 10 10'
      cache.pathCache.length = 100
      cache.pathCache.segmentSubdivisions = []

      expect(cache.pathCache.data).toBe('M 0 0 L 10 10')
      expect(cache.pathCache.length).toBe(100)
      expect(cache.pathCache.segmentSubdivisions).toEqual([])
    })
  })
})
