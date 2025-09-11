import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { Unit } from '../../../src/common'

describe('Unit', () => {
  beforeAll(() => {
    const div = document.createElement('div')
    div.textContent = 'Mocked element'
    const originalCreateElement = document.createElement
    vi.stubGlobal('document', {
      ...document,
      body: {
        ...document.body,
        appendChild: vi.fn((child) => {
          return child
        }),
        removeChild: vi.fn((child) => {
          return child
        }),
      },
      createElement: vi.fn((tagName) => {
        if (tagName === 'div') return div
        return originalCreateElement.call(document, tagName)
      }),
    })
  })
  beforeEach(() => {
    // 每次测试前清理 millimeterSize
    ;(Unit as any).setMillimeterSize(undefined as any)
  })
  describe('setMillimeterSize / getMillimeterSize', () => {
    it('should set and get millimeter size correctly', () => {
      Unit.setMillimeterSize(3.5)
      expect(Unit.getMillimeterSize()).toBe(3.5)
    })
  })

  describe('toPx', () => {
    beforeEach(() => {
      Unit.setMillimeterSize(3.78) // 1mm ≈ 3.78px
    })

    it('should return value in px when unit is px', () => {
      expect(Unit.toPx(100, 'px')).toBe(100)
    })

    it('should convert mm to px', () => {
      expect(Unit.toPx(2, 'mm')).toBeCloseTo(2 * 3.78)
    })

    it('should convert cm to px', () => {
      expect(Unit.toPx(1, 'cm')).toBeCloseTo(10 * 3.78)
    })

    it('should convert in to px', () => {
      expect(Unit.toPx(1, 'in')).toBeCloseTo(25.4 * 3.78)
    })

    it('should convert pt to px', () => {
      expect(Unit.toPx(72, 'pt')).toBeCloseTo(25.4 * 3.78) // 72pt = 1in
    })

    it('should convert pc to px', () => {
      expect(Unit.toPx(6, 'pc')).toBeCloseTo(25.4 * 3.78) // 6pc = 1in
    })

    it('should return raw value if unit is not provided', () => {
      expect(Unit.toPx(123)).toBe(123)
    })

    it('should initialize default millimeterSize in Node/test env', () => {
      ;(Unit as any).setMillimeterSize(undefined)
      // 模拟 Node 环境：没有 document
      const oldDoc = global.document
      // @ts-expect-error
      delete global.document

      const px = Unit.toPx(1, 'mm')
      expect(px).toBeCloseTo(3.7795275591)

      global.document = oldDoc
    })

    it('should initialize millimeterSize using measure in browser env', () => {
      ;(Unit as any).setMillimeterSize(undefined)

      // mock document.createElement
      const appendSpy = vi.fn()
      const removeSpy = vi.fn()
      const rect = { width: 5, height: 5 }

      const mockDiv: any = {
        style: {},
        getBoundingClientRect: () => rect,
      }

      const createSpy = vi
        .spyOn(document, 'createElement')
        .mockReturnValue(mockDiv)
      const bodyAppend = vi
        .spyOn(document.body, 'appendChild')
        .mockImplementation(appendSpy)
      const bodyRemove = vi
        .spyOn(document.body, 'removeChild')
        .mockImplementation(removeSpy)

      const result = Unit.toPx(1, 'mm')

      expect(result).toBe(5) // 1mm = 5px
      expect(appendSpy).toHaveBeenCalled()
      expect(removeSpy).toHaveBeenCalled()

      createSpy.mockRestore()
      bodyAppend.mockRestore()
      bodyRemove.mockRestore()
    })
  })

  describe('measure', () => {
    it('should measure div size', () => {
      const mockDiv: any = {
        style: {},
        getBoundingClientRect: () => ({ width: 42, height: 24 }),
      }
      const createSpy = vi
        .spyOn(document, 'createElement')
        .mockReturnValue(mockDiv)
      const appendSpy = vi
        .spyOn(document.body, 'appendChild')
        // @ts-expect-error mock
        .mockImplementation(() => {})
      const removeSpy = vi
        .spyOn(document.body, 'removeChild')
        // @ts-expect-error mock
        .mockImplementation(() => {})

      const size = Unit.measure('10', '20', 'px')
      expect(size.width).toBe(42)
      expect(size.height).toBe(24)

      createSpy.mockRestore()
      appendSpy.mockRestore()
      removeSpy.mockRestore()
    })
  })
})
