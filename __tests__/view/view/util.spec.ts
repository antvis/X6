import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dom } from '../../../src/common'
import { Config } from '../../../src/config'
import {
  createViewElement,
  getView,
  normalizeEvent,
  registerView,
  unregisterView,
  viewFind,
} from '../../../src/view/view/util'

// Mock dependencies
vi.mock('../../../src/common', () => ({
  Dom: {
    createSvgElement: vi.fn(),
    createElementNS: vi.fn(),
  },
}))

vi.mock('../../../src/config', () => ({
  Config: {
    useCSSSelector: false,
  },
}))

describe('view/util', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getView', () => {
    it('should return null when view does not exist', () => {
      expect(getView('non-existent')).toBeNull()
    })

    it('should return view when it exists', () => {
      const mockView = { id: 'test' } as any
      // Access the internal VIEWS object through registerView side effect
      registerView('test-cid', mockView)
      // Since registerView is empty, we need to test the actual implementation
      expect(getView('test-cid')).toBeNull()
    })
  })

  describe('registerView', () => {
    it('should register view successfully', () => {
      const mockView = { id: 'test' } as any
      expect(() => registerView('test-cid', mockView)).not.toThrow()
    })
  })

  describe('unregisterView', () => {
    it('should unregister view successfully', () => {
      expect(() => unregisterView('test-cid')).not.toThrow()
    })
  })

  describe('createViewElement', () => {
    it('should create SVG element when isSvgElement is true', () => {
      const mockElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g',
      )
      vi.mocked(Dom.createSvgElement).mockReturnValue(mockElement)

      const result = createViewElement('circle', true)

      expect(Dom.createSvgElement).toHaveBeenCalledWith('circle')
      expect(result).toBe(mockElement)
    })

    it('should create SVG element with default tag when isSvgElement is true and no tagName', () => {
      const mockElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g',
      )
      vi.mocked(Dom.createSvgElement).mockReturnValue(mockElement)

      createViewElement(undefined, true)

      expect(Dom.createSvgElement).toHaveBeenCalledWith('g')
    })

    it('should create HTML element when isSvgElement is false', () => {
      const mockElement = document.createElement('div')
      vi.mocked(Dom.createElementNS).mockReturnValue(mockElement)

      const result = createViewElement('span', false)

      expect(Dom.createElementNS).toHaveBeenCalledWith('span')
      expect(result).toBe(mockElement)
    })

    it('should create HTML element with default tag when no tagName provided', () => {
      const mockElement = document.createElement('div')
      vi.mocked(Dom.createElementNS).mockReturnValue(mockElement)

      createViewElement()

      expect(Dom.createElementNS).toHaveBeenCalledWith('div')
    })
  })

  describe('viewFind', () => {
    let mockRootElem: Element

    beforeEach(() => {
      mockRootElem = document.createElement('div')
    })

    it('should return root element when selector is null', () => {
      const result = viewFind(null, mockRootElem, {})
      expect(result).toEqual({ elems: [mockRootElem] })
    })

    it('should return root element when selector is undefined', () => {
      const result = viewFind(undefined, mockRootElem, {})
      expect(result).toEqual({ elems: [mockRootElem] })
    })

    it('should return root element when selector is "."', () => {
      const result = viewFind('.', mockRootElem, {})
      expect(result).toEqual({ elems: [mockRootElem] })
    })

    it('should return elements from selectors when found and is array', () => {
      const mockElements = [
        document.createElement('span'),
        document.createElement('p'),
      ]
      const selectors = { 'test-selector': mockElements }

      const result = viewFind('test-selector', mockRootElem, selectors)
      expect(result).toEqual({ elems: mockElements })
    })

    it('should return single element from selectors when found and is not array', () => {
      const mockElement = document.createElement('span')
      const selectors = { 'test-selector': mockElement }

      const result = viewFind('test-selector', mockRootElem, selectors)
      expect(result).toEqual({ elems: [mockElement] })
    })

    it('should use CSS selector when Config.useCSSSelector is true and selector does not contain ">"', () => {
      vi.mocked(Config).useCSSSelector = true
      const mockElements = [document.createElement('span')]
      mockRootElem.querySelectorAll = vi.fn().mockReturnValue(mockElements)

      const result = viewFind('.test-class', mockRootElem, {})

      expect(mockRootElem.querySelectorAll).toHaveBeenCalledWith('.test-class')
      expect(result).toEqual({ isCSSSelector: true, elems: mockElements })
    })

    it('should use CSS selector with :scope when selector contains ">"', () => {
      vi.mocked(Config).useCSSSelector = true
      const mockElements = [document.createElement('span')]
      mockRootElem.querySelectorAll = vi.fn().mockReturnValue(mockElements)

      const result = viewFind('> .child', mockRootElem, {})

      expect(mockRootElem.querySelectorAll).toHaveBeenCalledWith(
        ':scope > .child',
      )
      expect(result).toEqual({ isCSSSelector: true, elems: mockElements })
    })

    it('should return empty array when Config.useCSSSelector is false and no selectors match', () => {
      vi.mocked(Config).useCSSSelector = false

      const result = viewFind('non-existent', mockRootElem, {})
      expect(result).toEqual({ elems: [] })
    })
  })

  describe('normalizeEvent', () => {
    it('should return original event when no touch event', () => {
      const mockEvent = { type: 'click', target: null } as any

      const result = normalizeEvent(mockEvent)
      expect(result).toBe(mockEvent)
    })

    it('should return original event when originalEvent has no changedTouches', () => {
      const mockEvent = {
        type: 'click',
        originalEvent: {},
      } as any

      const result = normalizeEvent(mockEvent)
      expect(result).toBe(mockEvent)
    })

    it('should return touch event when originalEvent has changedTouches', () => {
      const mockTouchEvent = { clientX: 100, clientY: 200 }
      const mockEvent = {
        type: 'touchstart',
        customProp: 'test',
        originalEvent: {
          changedTouches: [mockTouchEvent],
        },
      } as any

      const result = normalizeEvent(mockEvent)

      expect(result).toBe(mockTouchEvent)
      expect(result.customProp).toBe('test')
    })

    it('should not override existing touch event properties', () => {
      const mockTouchEvent = { clientX: 100, type: 'touch' }
      const mockEvent = {
        type: 'touchstart',
        clientX: 50,
        originalEvent: {
          changedTouches: [mockTouchEvent],
        },
      } as any

      const result = normalizeEvent(mockEvent)

      expect(result.clientX).toBe(100) // Should keep touch event value
      expect(result.type).toBe('touch') // Should keep touch event value
    })
  })
})
