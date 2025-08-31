import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dom } from '../../src/common'
import { Point, Rectangle } from '../../src/geometry'
import type { Cell } from '../../src/model/cell'
import type { Attr } from '../../src/registry/attr'
import { AttrManager } from '../../src/view/attr'
import type { CellView } from '../../src/view/cell'

// Mock dependencies
const mockCell = {
  getAttrDefinition: vi.fn(),
} as unknown as Cell

const mockView = {
  cell: mockCell,
  setAttrs: vi.fn(),
  getBoundingRectOfElement: vi.fn(),
  find: vi.fn(),
} as unknown as CellView

describe('AttrManager', () => {
  let attrManager: AttrManager
  let mockElement: Element

  beforeEach(() => {
    vi.clearAllMocks()
    attrManager = new AttrManager(mockView)
    mockElement = document.createElement('div')
  })

  describe('constructor', () => {
    it('should create instance with view', () => {
      expect(attrManager).toBeInstanceOf(AttrManager)
      expect((attrManager as any).view).toBe(mockView)
    })
  })

  describe('cell getter', () => {
    it('should return cell from view', () => {
      expect((attrManager as any).cell).toBe(mockCell)
    })
  })

  describe('getDefinition', () => {
    it('should call cell.getAttrDefinition', () => {
      const attrName = 'test-attr'
      ;(attrManager as any).getDefinition(attrName)
      expect(mockCell.getAttrDefinition).toHaveBeenCalledWith(attrName)
    })
  })

  describe('processAttrs', () => {
    beforeEach(() => {
      vi.spyOn(Dom, 'CASE_SENSITIVE_ATTR', 'get').mockReturnValue([
        'preserveAspectRatio',
      ])
    })

    it('should process normal attributes', () => {
      const raw = { fill: 'red', stroke: 'blue' }
      mockCell.getAttrDefinition = vi.fn().mockReturnValue(null)

      const result = (attrManager as any).processAttrs(mockElement, raw)

      expect(result.raw).toBe(raw)
      expect(result.normal).toEqual({ fill: 'red', stroke: 'blue' })
      expect(result.set).toBeUndefined()
      expect(result.offset).toBeUndefined()
      expect(result.position).toBeUndefined()
    })

    it('should handle string definitions', () => {
      const raw = { customAttr: 'value' }
      mockCell.getAttrDefinition = vi.fn().mockReturnValue('data-custom')

      const result = (attrManager as any).processAttrs(mockElement, raw)

      expect(result.normal).toEqual({ 'data-custom': 'value' })
    })

    it('should handle set definitions', () => {
      const raw = { customAttr: 'value' }
      const setDef = { set: vi.fn() }
      mockCell.getAttrDefinition = vi.fn().mockReturnValue(setDef)

      const result = (attrManager as any).processAttrs(mockElement, raw)

      expect(result.set).toEqual({ customAttr: 'value' })
    })

    it('should handle offset definitions', () => {
      const raw = { customAttr: 'value' }
      const offsetDef = { offset: vi.fn() }
      mockCell.getAttrDefinition = vi.fn().mockReturnValue(offsetDef)

      const result = (attrManager as any).processAttrs(mockElement, raw)

      expect(result.offset).toEqual({ customAttr: 'value' })
    })

    it('should handle position definitions', () => {
      const raw = { customAttr: 'value' }
      const positionDef = { position: vi.fn() }
      mockCell.getAttrDefinition = vi.fn().mockReturnValue(positionDef)

      const result = (attrManager as any).processAttrs(mockElement, raw)

      expect(result.position).toEqual({ customAttr: 'value' })
    })

    it('should handle null values for complex definitions', () => {
      const raw = { customAttr: null }
      const setDef = { set: vi.fn() }
      mockCell.getAttrDefinition = vi.fn().mockReturnValue(setDef)

      const result = (attrManager as any).processAttrs(mockElement, raw)

      expect(result.set).toBeUndefined()
    })

    it('should convert camelCase to kebab-case for normal attributes', () => {
      const raw = { strokeWidth: '2' }
      mockCell.getAttrDefinition = vi.fn().mockReturnValue(null)

      const result = (attrManager as any).processAttrs(mockElement, raw)

      expect(result.normal).toEqual({ 'stroke-width': '2' })
    })

    it('should preserve case for case-sensitive attributes', () => {
      const raw = { preserveAspectRatio: 'xMidYMid' }
      mockCell.getAttrDefinition = vi.fn().mockReturnValue(null)

      const result = (attrManager as any).processAttrs(mockElement, raw)

      expect(result.normal).toEqual({ preserveAspectRatio: 'xMidYMid' })
    })
  })

  describe('mergeProcessedAttrs', () => {
    it('should merge all processed attributes', () => {
      const allProcessed = {
        raw: {},
        set: { attr1: 'value1' },
        position: { attr2: 'value2' },
        offset: { attr3: 'value3' },
        normal: { fill: 'red' },
      }

      const roProcessed = {
        raw: {},
        set: { attr4: 'value4' },
        position: { attr5: 'value5' },
        offset: { attr6: 'value6' },
        normal: { stroke: 'blue' },
      }

      ;(attrManager as any).mergeProcessedAttrs(allProcessed, roProcessed)

      expect(allProcessed.set).toEqual({ attr1: 'value1', attr4: 'value4' })
      expect(allProcessed.position).toEqual({
        attr2: 'value2',
        attr5: 'value5',
      })
      expect(allProcessed.offset).toEqual({ attr3: 'value3', attr6: 'value6' })
      expect(allProcessed.normal).toBe(roProcessed.normal)
    })

    it('should handle transform property specially', () => {
      const allProcessed = {
        raw: {},
        normal: { transform: 'rotate(45)', fill: 'red' },
      }

      const roProcessed = {
        raw: {},
        normal: { stroke: 'blue' },
      }

      ;(attrManager as any).mergeProcessedAttrs(allProcessed, roProcessed)

      expect(roProcessed.normal.transform).toBe('rotate(45)')
      expect(allProcessed.normal).toBe(roProcessed.normal)
    })

    it('should handle undefined normal attributes', () => {
      const allProcessed = { raw: {} }
      const roProcessed = { raw: {}, normal: { stroke: 'blue' } }

      ;(attrManager as any).mergeProcessedAttrs(allProcessed, roProcessed)

      expect(allProcessed.normal).toBe(roProcessed.normal)
    })
  })

  describe('findAttrs', () => {
    let rootNode: Element
    let selectors: any

    beforeEach(() => {
      rootNode = document.createElement('div')
      selectors = {}

      // Mock View.find
      vi.doMock('../../src/view/view', () => ({
        View: {
          find: vi.fn().mockReturnValue({
            isCSSSelector: false,
            elems: [mockElement],
          }),
        },
      }))
    })

    it('should handle unique selectors', () => {
      const cellAttrs = {
        rect: { fill: 'red' },
      }
      const selectorCache = {}
      selectors.rect = mockElement

      const result = (attrManager as any).findAttrs(
        cellAttrs,
        rootNode,
        selectorCache,
        selectors,
      )

      const data = result.get(mockElement)
      expect(data.priority).toBe(-1)
    })
  })

  describe('updateRelativeAttrs', () => {
    let processedAttrs: any
    let refBBox: Rectangle

    beforeEach(() => {
      processedAttrs = {
        raw: {},
        normal: { fill: 'red' },
      }
      refBBox = new Rectangle(0, 0, 100, 100)
      mockView.setAttrs = vi.fn()
      mockView.getBoundingRectOfElement = vi.fn().mockReturnValue({
        width: 50,
        height: 50,
        x: 0,
        y: 0,
      })
    })

    it('should handle HTML elements', () => {
      const htmlElement = document.createElement('div')

      ;(attrManager as any).updateRelativeAttrs(
        htmlElement,
        processedAttrs,
        refBBox,
      )

      expect(mockView.setAttrs).toHaveBeenCalledWith(
        processedAttrs.normal,
        htmlElement,
      )
    })

    it('should handle set attributes', () => {
      processedAttrs.set = { customAttr: 'value' }
      const setDef = {
        set: vi.fn().mockReturnValue({ width: '100' }),
      }
      mockCell.getAttrDefinition = vi.fn().mockReturnValue(setDef)

      const svgElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )

      ;(attrManager as any).updateRelativeAttrs(
        svgElement,
        processedAttrs,
        refBBox,
      )

      expect(setDef.set).toHaveBeenCalled()
      expect(mockView.setAttrs).toHaveBeenCalledWith(
        expect.objectContaining({ fill: 'red', width: '100' }),
        svgElement,
      )
    })

    it('should skip offset for invisible elements', () => {
      processedAttrs.offset = { customAttr: 'value' }
      const offsetDef = {
        offset: vi.fn().mockReturnValue({ x: 5, y: 10 }),
      }
      mockCell.getAttrDefinition = vi.fn().mockReturnValue(offsetDef)
      mockView.getBoundingRectOfElement = vi.fn().mockReturnValue({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      })

      const svgElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )

      ;(attrManager as any).updateRelativeAttrs(
        svgElement,
        processedAttrs,
        refBBox,
      )

      expect(offsetDef.offset).not.toHaveBeenCalled()
    })

    it('should handle set returning primitive value', () => {
      processedAttrs.set = { customAttr: 'value' }
      const setDef = {
        set: vi.fn().mockReturnValue('100'),
      }
      mockCell.getAttrDefinition = vi.fn().mockReturnValue(setDef)

      const svgElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )

      ;(attrManager as any).updateRelativeAttrs(
        svgElement,
        processedAttrs,
        refBBox,
      )

      expect(mockView.setAttrs).toHaveBeenCalledWith(
        expect.objectContaining({ customAttr: '100' }),
        svgElement,
      )
    })

    it('should handle set returning null', () => {
      processedAttrs.set = { customAttr: 'value' }
      const setDef = {
        set: vi.fn().mockReturnValue(null),
      }
      mockCell.getAttrDefinition = vi.fn().mockReturnValue(setDef)

      const svgElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )

      ;(attrManager as any).updateRelativeAttrs(
        svgElement,
        processedAttrs,
        refBBox,
      )

      expect(mockView.setAttrs).toHaveBeenCalledWith(
        processedAttrs.normal,
        svgElement,
      )
    })
  })

  describe('update', () => {
    let rootNode: Element
    let attrs: any
    let options: any

    beforeEach(() => {
      rootNode = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      attrs = { rect: { fill: 'red' } }
      options = {
        rootBBox: new Rectangle(0, 0, 200, 200),
        selectors: {},
        attrs: null,
      }

      // Mock findAttrs to return simple result
      vi.spyOn(attrManager as any, 'findAttrs').mockReturnValue({
        each: vi.fn().mockImplementation((callback) => {
          callback({ elem: mockElement, attrs: { fill: 'red' } })
        }),
        get: vi
          .fn()
          .mockReturnValue({ elem: mockElement, attrs: { fill: 'red' } }),
      })

      // Mock processAttrs
      vi.spyOn(attrManager as any, 'processAttrs').mockReturnValue({
        raw: { fill: 'red' },
        normal: { fill: 'red' },
      })
    })

    it('should update simple attributes', () => {
      attrManager.update(rootNode, attrs, options)

      expect(mockView.setAttrs).toHaveBeenCalledWith(
        { fill: 'red' },
        mockElement,
      )
    })

    it('should handle special attributes with ref', () => {
      const refElement = document.createElement('div')

      vi.spyOn(attrManager as any, 'processAttrs').mockReturnValue({
        raw: { fill: 'red', ref: 'refElem' },
        normal: { fill: 'red' },
        set: { customAttr: 'value' },
      })

      mockView.find = vi.fn().mockReturnValue([refElement])
      vi.spyOn(attrManager as any, 'updateRelativeAttrs').mockImplementation(
        () => {},
      )

      attrManager.update(rootNode, attrs, options)

      expect((attrManager as any).updateRelativeAttrs).toHaveBeenCalled()
    })

    it('should handle rotatableNode transformations', () => {
      const rotatableNode = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g',
      )
      const refElement = document.createElement('div')

      options.rotatableNode = rotatableNode

      vi.spyOn(attrManager as any, 'processAttrs').mockReturnValue({
        raw: { fill: 'red', ref: 'refElem' },
        normal: { fill: 'red' },
        position: { customAttr: 'value' },
      })

      mockView.find = vi.fn().mockReturnValue([refElement])
      vi.spyOn(Dom, 'contains').mockReturnValue(true)
      vi.spyOn(Dom, 'attr').mockReturnValue('matrix(1,0,0,1,0,0)')
      vi.spyOn(attrManager as any, 'updateRelativeAttrs').mockImplementation(
        () => {},
      )

      attrManager.update(rootNode, attrs, options)

      expect((attrManager as any).updateRelativeAttrs).toHaveBeenCalled()
    })

    it('should handle attrs option with merging', () => {
      options.attrs = { rect: { stroke: 'blue' } }

      const findAttrsSpy = vi.spyOn(attrManager as any, 'findAttrs')
      findAttrsSpy
        .mockReturnValueOnce({
          each: vi.fn().mockImplementation((callback) => {
            callback({ elem: mockElement, attrs: { stroke: 'blue' } })
          }),
          get: vi.fn().mockReturnValue({
            elem: mockElement,
            attrs: { fill: 'red', stroke: 'blue' },
          }),
        })
        .mockReturnValueOnce({
          get: vi.fn().mockReturnValue({
            elem: mockElement,
            attrs: { fill: 'red', stroke: 'blue' },
          }),
        })

      vi.spyOn(attrManager as any, 'processAttrs')
        .mockReturnValueOnce({
          raw: { stroke: 'blue' },
          position: { customAttr: 'value' },
        })
        .mockReturnValueOnce({
          raw: { fill: 'red', stroke: 'blue' },
          normal: { fill: 'red', stroke: 'blue' },
        })

      vi.spyOn(attrManager as any, 'mergeProcessedAttrs').mockImplementation(
        () => {},
      )
      vi.spyOn(attrManager as any, 'updateRelativeAttrs').mockImplementation(
        () => {},
      )

      attrManager.update(rootNode, attrs, options)

      expect((attrManager as any).mergeProcessedAttrs).toHaveBeenCalled()
    })

    it('should handle element ordering for references', () => {
      const elem1 = document.createElement('div')
      const elem2 = document.createElement('div')

      const mockFindAttrs = {
        each: vi.fn().mockImplementation((callback) => {
          // elem2 references elem1
          callback({ elem: elem1, attrs: { fill: 'red' } })
          callback({ elem: elem2, attrs: { fill: 'blue', ref: 'elem1' } })
        }),
        get: vi.fn().mockImplementation((elem) => ({
          elem,
          attrs:
            elem === elem1 ? { fill: 'red' } : { fill: 'blue', ref: 'elem1' },
        })),
      }

      vi.spyOn(attrManager as any, 'findAttrs').mockReturnValue(mockFindAttrs)

      vi.spyOn(attrManager as any, 'processAttrs')
        .mockReturnValueOnce({
          raw: { fill: 'red' },
          position: { customAttr: 'value' },
        })
        .mockReturnValueOnce({
          raw: { fill: 'blue', ref: 'elem1' },
          position: { customAttr: 'value' },
        })

      mockView.find = vi.fn().mockReturnValue([elem1])
      vi.spyOn(attrManager as any, 'updateRelativeAttrs').mockImplementation(
        () => {},
      )

      attrManager.update(rootNode, attrs, options)

      expect((attrManager as any).updateRelativeAttrs).toHaveBeenCalledTimes(2)
    })
  })
})
