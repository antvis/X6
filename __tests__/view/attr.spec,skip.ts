import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ArrayExt,
  Dom,
  FunctionExt,
  ObjectExt,
  StringExt,
  Util,
} from '../../src/common'
import { Rectangle } from '../../src/geometry'
import { View } from '../../src/view'
import { AttrManager } from '../../src/view/attr'

// Mock dependencies
vi.mock('../../src/common', () => ({
  ObjectExt: {
    isPlainObject: vi.fn(),
    merge: vi.fn(),
  },
  ArrayExt: {
    sortedIndex: vi.fn(),
  },
  Dom: {
    CASE_SENSITIVE_ATTR: ['viewBox', 'preserveAspectRatio'],
    transformStringToMatrix: vi.fn(),
    matrixToTransformString: vi.fn(),
    attr: vi.fn(),
    contains: vi.fn(),
  },
  FunctionExt: {
    call: vi.fn(),
  },
  StringExt: {
    kebabCase: vi.fn(),
  },
  Util: {
    transformRectangle: vi.fn(),
    getBBox: vi.fn(),
  },
  Dictionary: class Dictionary {
    private data = new Map()
    get(key: any) {
      return this.data.get(key)
    }
    set(key: any, value: any) {
      this.data.set(key, value)
    }
    each(callback: (value: any) => void) {
      this.data.forEach(callback)
    }
  },
}))

vi.mock('../../src/view/view', () => ({
  View: {
    find: vi.fn(),
  },
}))

/**
 * 先 skip 掉
 * TypeError: Cannot read properties of undefined (reading 'ToolItem')
    ❯ src/registry/tool/button.ts:10:39
          8| import { getViewBBox } from './util'
          9| 
         10| export class Button extends ToolsView.ToolItem<
 */
describe('AttrManager', () => {
  let attrManager: AttrManager
  let mockView: any
  let mockCell: any
  let mockElement: any

  beforeEach(() => {
    mockElement = {
      setAttribute: vi.fn(),
      getAttribute: vi.fn(),
    }

    mockCell = {
      getAttrDefinition: vi.fn(),
    }

    mockView = {
      cell: mockCell,
      setAttrs: vi.fn(),
      find: vi.fn(),
      getBoundingRectOfElement: vi.fn(),
    }

    attrManager = new AttrManager(mockView)

    // Reset all mocks
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create instance with view', () => {
      expect(attrManager['view']).toBe(mockView)
    })
  })

  describe('cell getter', () => {
    it('should return view.cell', () => {
      expect(attrManager['cell']).toBe(mockCell)
    })
  })

  describe('getDefinition', () => {
    it('should call cell.getAttrDefinition', () => {
      mockCell.getAttrDefinition.mockReturnValue({ set: vi.fn() })

      const result = attrManager['getDefinition']('test-attr')

      expect(mockCell.getAttrDefinition).toHaveBeenCalledWith('test-attr')
      expect(result).toEqual({ set: vi.fn() })
    })

    it('should return null when no definition exists', () => {
      mockCell.getAttrDefinition.mockReturnValue(null)

      const result = attrManager['getDefinition']('unknown-attr')

      expect(result).toBeNull()
    })
  })

  describe('processAttrs', () => {
    beforeEach(() => {
      vi.mocked(ObjectExt.isPlainObject).mockReturnValue(true)
      vi.mocked(FunctionExt.call).mockReturnValue(true)
      vi.mocked(Dom.CASE_SENSITIVE_ATTR).includes = vi
        .fn()
        .mockReturnValue(false)
      vi.mocked(StringExt.kebabCase).mockImplementation((str) =>
        str.toLowerCase(),
      )
    })

    it('should process normal attributes', () => {
      const elem = mockElement
      const raw = { fill: 'red', stroke: 'blue' }

      mockCell.getAttrDefinition.mockReturnValue(null)

      const result = attrManager['processAttrs'](elem, raw)

      expect(result.raw).toBe(raw)
      expect(result.normal).toEqual({
        fill: 'red',
        stroke: 'blue',
      })
    })

    it('should process string definition attributes', () => {
      const elem = mockElement
      const raw = { customAttr: 'value' }

      mockCell.getAttrDefinition.mockReturnValue('fill')

      const result = attrManager['processAttrs'](elem, raw)

      expect(result.normal).toEqual({
        fill: 'value',
      })
    })

    it('should process set definition attributes', () => {
      const elem = mockElement
      const raw = { customSet: 'value' }

      mockCell.getAttrDefinition.mockReturnValue({ set: vi.fn() })

      const result = attrManager['processAttrs'](elem, raw)

      expect(result.set).toEqual({
        customSet: 'value',
      })
    })

    it('should process offset definition attributes', () => {
      const elem = mockElement
      const raw = { customOffset: 'value' }

      mockCell.getAttrDefinition.mockReturnValue({ offset: vi.fn() })

      const result = attrManager['processAttrs'](elem, raw)

      expect(result.offset).toEqual({
        customOffset: 'value',
      })
    })

    it('should process position definition attributes', () => {
      const elem = mockElement
      const raw = { customPosition: 'value' }

      mockCell.getAttrDefinition.mockReturnValue({ position: vi.fn() })

      const result = attrManager['processAttrs'](elem, raw)

      expect(result.position).toEqual({
        customPosition: 'value',
      })
    })

    it('should handle case sensitive attributes', () => {
      const elem = mockElement
      const raw = { viewBox: '0 0 100 100' }

      vi.mocked(Dom.CASE_SENSITIVE_ATTR).includes = vi
        .fn()
        .mockReturnValue(true)
      mockCell.getAttrDefinition.mockReturnValue(null)

      const result = attrManager['processAttrs'](elem, raw)

      expect(result.normal).toEqual({
        viewBox: '0 0 100 100',
      })
    })

    it('should skip null values for special definitions', () => {
      const elem = mockElement
      const raw = { customSet: null }

      mockCell.getAttrDefinition.mockReturnValue({ set: vi.fn() })

      const result = attrManager['processAttrs'](elem, raw)

      expect(result.set).toBeUndefined()
    })

    it('should handle invalid definitions', () => {
      const elem = mockElement
      const raw = { invalidAttr: 'value' }

      mockCell.getAttrDefinition.mockReturnValue({ set: vi.fn() })
      vi.mocked(FunctionExt.call).mockReturnValue(false)

      const result = attrManager['processAttrs'](elem, raw)

      expect(result.normal).toEqual({
        invalidattr: 'value',
      })
    })
  })

  describe('mergeProcessedAttrs', () => {
    it('should merge processed attributes correctly', () => {
      const allProcessed = {
        raw: {},
        set: { attr1: 'value1' },
        position: { pos1: 'pos1' },
        offset: { off1: 'off1' },
        normal: { fill: 'red', transform: 'scale(2)' },
      }

      const roProcessed = {
        raw: {},
        set: { attr2: 'value2' },
        position: { pos2: 'pos2' },
        offset: { off2: 'off2' },
        normal: { stroke: 'blue' },
      }

      attrManager['mergeProcessedAttrs'](allProcessed, roProcessed)

      expect(allProcessed.set).toEqual({
        attr1: 'value1',
        attr2: 'value2',
      })
      expect(allProcessed.position).toEqual({
        pos1: 'pos1',
        pos2: 'pos2',
      })
      expect(allProcessed.offset).toEqual({
        off1: 'off1',
        off2: 'off2',
      })
      expect(allProcessed.normal).toEqual({
        stroke: 'blue',
        transform: 'scale(2)',
      })
    })

    it('should handle undefined normal attrs', () => {
      const allProcessed = {
        raw: {},
        normal: undefined,
      }

      const roProcessed = {
        raw: {},
        normal: { stroke: 'blue' },
      }

      attrManager['mergeProcessedAttrs'](allProcessed, roProcessed)

      expect(allProcessed.normal).toEqual({ stroke: 'blue' })
    })
  })

  describe('findAttrs', () => {
    beforeEach(() => {
      vi.mocked(ObjectExt.isPlainObject).mockReturnValue(true)
      vi.mocked(ObjectExt.merge).mockImplementation((a, b) => ({ ...a, ...b }))
      vi.mocked(ArrayExt.sortedIndex).mockReturnValue(0)
      vi.mocked(View.find).mockReturnValue({
        isCSSSelector: false,
        elems: [mockElement],
      })
    })

    it('should find and process attributes by selector', () => {
      const cellAttrs = {
        rect: { fill: 'red' },
      }
      const selectors = { rect: mockElement }

      const result = attrManager['findAttrs'](
        cellAttrs,
        mockElement,
        {},
        selectors,
      )

      expect(result.get(mockElement)).toEqual({
        elem: mockElement,
        attrs: { fill: 'red' },
        priority: -1,
        array: false,
      })
    })

    it('should handle multiple elements with same selector', () => {
      const elem2 = { setAttribute: vi.fn() }
      vi.mocked(View.find).mockReturnValue({
        isCSSSelector: false,
        elems: [mockElement, elem2],
      })

      const cellAttrs = {
        rect: { fill: 'red' },
      }

      const result = attrManager['findAttrs'](cellAttrs, mockElement, {}, {})

      expect(result.get(mockElement)).toBeDefined()
      // @ts-expect-error
      expect(result.get(elem2)).toBeDefined()
    })

    it('should merge attributes for duplicate elements', () => {
      const cellAttrs = {
        rect: { fill: 'red' },
        '.class': { stroke: 'blue' },
      }

      vi.mocked(View.find)
        .mockReturnValueOnce({
          isCSSSelector: false,
          elems: [mockElement],
        })
        .mockReturnValueOnce({
          isCSSSelector: true,
          elems: [mockElement],
        })

      const result = attrManager['findAttrs'](cellAttrs, mockElement, {}, {})

      expect(result.get(mockElement)?.attrs).toEqual({
        fill: 'red',
        stroke: 'blue',
      })
    })

    it('should skip non-plain objects', () => {
      vi.mocked(ObjectExt.isPlainObject).mockReturnValue(false)

      const cellAttrs = {
        rect: 'not-an-object',
      }

      // @ts-expect-error
      const result = attrManager['findAttrs'](cellAttrs, mockElement, {}, {})

      expect(result.get(mockElement)).toBeUndefined()
    })
  })

  describe('updateRelativeAttrs', () => {
    beforeEach(() => {
      vi.mocked(Dom.transformStringToMatrix).mockReturnValue({
        e: 0,
        f: 0,
        a: 1,
        b: 0,
        c: 0,
        d: 1,
      } as DOMMatrix)
      vi.mocked(Dom.matrixToTransformString).mockReturnValue(
        'matrix(1,0,0,1,0,0)',
      )
      vi.mocked(FunctionExt.call).mockReturnValue({ x: 10, y: 20 })
      mockView.getBoundingRectOfElement.mockReturnValue({
        width: 100,
        height: 50,
      })
      vi.mocked(Util.transformRectangle).mockReturnValue(
        new Rectangle(0, 0, 100, 50),
      )
    })

    it('should handle HTMLElement', () => {
      const htmlElement = document.createElement('div')
      const processedAttrs = {
        raw: {},
        normal: { color: 'red' },
      }
      const refBBox = new Rectangle(0, 0, 100, 100)

      attrManager['updateRelativeAttrs'](htmlElement, processedAttrs, refBBox)

      expect(mockView.setAttrs).toHaveBeenCalledWith(
        { color: 'red' },
        htmlElement,
      )
    })

    it('should handle set attributes', () => {
      const processedAttrs = {
        raw: { customSet: 'value' },
        normal: {},
        set: { customSet: 'value' },
      }
      const refBBox = new Rectangle(0, 0, 100, 100)

      mockCell.getAttrDefinition.mockReturnValue({ set: vi.fn() })
      vi.mocked(FunctionExt.call).mockReturnValue({ fill: 'red' })

      attrManager['updateRelativeAttrs'](mockElement, processedAttrs, refBBox)

      expect(mockView.setAttrs).toHaveBeenCalledWith(
        expect.objectContaining({ fill: 'red' }),
        mockElement,
      )
    })

    it('should handle position attributes', () => {
      const processedAttrs = {
        raw: { customPos: 'value' },
        normal: {},
        position: { customPos: 'value' },
      }
      const refBBox = new Rectangle(0, 0, 100, 100)

      mockCell.getAttrDefinition.mockReturnValue({ position: vi.fn() })

      attrManager['updateRelativeAttrs'](mockElement, processedAttrs, refBBox)

      expect(mockElement.setAttribute).toHaveBeenCalledWith(
        'transform',
        'matrix(1,0,0,1,0,0)',
      )
    })

    it('should handle offset attributes', () => {
      const processedAttrs = {
        raw: { customOffset: 'value' },
        normal: {},
        offset: { customOffset: 'value' },
      }
      const refBBox = new Rectangle(0, 0, 100, 100)

      mockCell.getAttrDefinition.mockReturnValue({ offset: vi.fn() })

      attrManager['updateRelativeAttrs'](mockElement, processedAttrs, refBBox)

      expect(mockElement.setAttribute).toHaveBeenCalledWith(
        'transform',
        'matrix(1,0,0,1,0,0)',
      )
    })

    it('should handle transform attribute', () => {
      const processedAttrs = {
        raw: {},
        normal: { transform: 'scale(2)' },
      }
      const refBBox = new Rectangle(0, 0, 100, 100)

      attrManager['updateRelativeAttrs'](mockElement, processedAttrs, refBBox)

      expect(mockElement.setAttribute).toHaveBeenCalledWith(
        'transform',
        'matrix(1,0,0,1,0,0)',
      )
    })

    it('should skip offset when element has zero dimensions', () => {
      mockView.getBoundingRectOfElement.mockReturnValue({
        width: 0,
        height: 0,
      })

      const processedAttrs = {
        raw: {},
        normal: {},
        offset: { customOffset: 'value' },
      }
      const refBBox = new Rectangle(0, 0, 100, 100)

      mockCell.getAttrDefinition.mockReturnValue({ offset: vi.fn() })

      attrManager['updateRelativeAttrs'](mockElement, processedAttrs, refBBox)

      expect(FunctionExt.call).not.toHaveBeenCalled()
    })

    it('should handle null return values from functions', () => {
      const processedAttrs = {
        raw: {},
        normal: {},
        position: { customPos: 'value' },
      }
      const refBBox = new Rectangle(0, 0, 100, 100)

      mockCell.getAttrDefinition.mockReturnValue({ position: vi.fn() })
      vi.mocked(FunctionExt.call).mockReturnValue(null)

      attrManager['updateRelativeAttrs'](mockElement, processedAttrs, refBBox)

      expect(mockElement.setAttribute).not.toHaveBeenCalled()
    })
  })

  describe('update', () => {
    beforeEach(() => {
      vi.mocked(ObjectExt.isPlainObject).mockReturnValue(true)
      vi.mocked(View.find).mockReturnValue({
        isCSSSelector: false,
        elems: [mockElement],
      })
      vi.mocked(Dom.transformStringToMatrix).mockReturnValue({
        e: 0,
        f: 0,
      } as DOMMatrix)
      vi.mocked(Util.getBBox).mockReturnValue(new Rectangle(0, 0, 100, 100))
      vi.mocked(Util.transformRectangle).mockReturnValue(
        new Rectangle(0, 0, 100, 100),
      )
      vi.mocked(Dom.contains).mockReturnValue(true)
      // @ts-expect-error
      vi.mocked(Dom.attr).mockReturnValue('matrix(1,0,0,1,0,0)')
    })

    it('should update simple attributes', () => {
      const attrs = {
        rect: { fill: 'red' },
      }
      const options = {
        rootBBox: new Rectangle(0, 0, 200, 200),
        selectors: {},
      }

      mockCell.getAttrDefinition.mockReturnValue(null)

      attrManager.update(mockElement, attrs, options)

      expect(mockView.setAttrs).toHaveBeenCalledWith(
        expect.objectContaining({ fill: 'red' }),
        mockElement,
      )
    })

    it('should handle referenced elements', () => {
      const refElement = { getAttribute: vi.fn() }
      const attrs = {
        rect: { fill: 'red', ref: 'refRect' },
        refRect: { stroke: 'blue' },
      }
      const options = {
        rootBBox: new Rectangle(0, 0, 200, 200),
        selectors: { refRect: refElement },
      }

      vi.mocked(View.find)
        .mockReturnValueOnce({
          isCSSSelector: false,
          elems: [mockElement],
        })
        .mockReturnValueOnce({
          isCSSSelector: false,
          // @ts-expect-error
          elems: [refElement],
        })

      mockCell.getAttrDefinition.mockReturnValue({ position: vi.fn() })
      vi.mocked(FunctionExt.call).mockReturnValue({ x: 10, y: 10 })

      // @ts-expect-error
      attrManager.update(mockElement, attrs, options)

      expect(Util.getBBox).toHaveBeenCalledWith(refElement, {
        target: mockElement,
      })
    })

    it('should throw error for invalid reference', () => {
      const attrs = {
        rect: { fill: 'red', ref: 'invalidRef' },
      }
      const options = {
        rootBBox: new Rectangle(0, 0, 200, 200),
        selectors: {},
      }

      mockView.find.mockReturnValue([])
      mockCell.getAttrDefinition.mockReturnValue({ position: vi.fn() })

      expect(() => {
        attrManager.update(mockElement, attrs, options)
      }).toThrow('"invalidRef" reference does not exist.')
    })

    it('should handle rotatable nodes', () => {
      const rotatableNode = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g',
      )
      const refElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )

      rotatableNode.appendChild(refElement)

      const attrs = {
        rect: { fill: 'red', ref: 'refRect' },
        refRect: { stroke: 'blue' },
      }
      const options = {
        rootBBox: new Rectangle(0, 0, 200, 200),
        selectors: { refRect: refElement },
        rotatableNode,
      }

      vi.mocked(View.find)
        .mockReturnValueOnce({
          isCSSSelector: false,
          elems: [mockElement],
        })
        .mockReturnValueOnce({
          isCSSSelector: false,
          elems: [refElement],
        })

      vi.mocked(Dom.contains).mockReturnValue(true)
      mockCell.getAttrDefinition.mockReturnValue({ position: vi.fn() })

      attrManager.update(mockElement, attrs, options)

      expect(Util.getBBox).toHaveBeenCalledWith(refElement, {
        target: rotatableNode,
      })
    })

    it('should handle partial attribute updates', () => {
      const attrs = {
        rect: { fill: 'red', stroke: 'blue' },
      }
      const partialAttrs = {
        rect: { fill: 'green' },
      }
      const options = {
        rootBBox: new Rectangle(0, 0, 200, 200),
        selectors: {},
        attrs: partialAttrs,
      }

      mockCell.getAttrDefinition.mockReturnValue({ position: vi.fn() })

      attrManager.update(mockElement, attrs, options)

      expect(mockView.setAttrs).toHaveBeenCalled()
    })

    it('should sort special items by dependency', () => {
      const elem1 = { setAttribute: vi.fn() }
      const elem2 = { setAttribute: vi.fn() }

      const attrs = {
        rect1: { fill: 'red', ref: 'rect2' },
        rect2: { fill: 'blue' },
      }
      const options = {
        rootBBox: new Rectangle(0, 0, 200, 200),
        selectors: { rect1: elem1, rect2: elem2 },
      }

      vi.mocked(View.find)
        .mockReturnValueOnce({
          isCSSSelector: false,
          // @ts-expect-error
          elems: [elem1],
        })
        .mockReturnValueOnce({
          isCSSSelector: false,
          // @ts-expect-error
          elems: [elem2],
        })

      mockCell.getAttrDefinition.mockReturnValue({ position: vi.fn() })
      mockView.find.mockReturnValue([elem2])

      // @ts-expect-error
      attrManager.update(mockElement, attrs, options)

      expect(Util.getBBox).toHaveBeenCalled()
    })
  })
})
