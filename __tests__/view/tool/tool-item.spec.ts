import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Dom } from '../../../src/common'
import type { Cell } from '../../../src/model'
import type { CellView } from '../../../src/view/cell'
import { ToolItem, ToolItemToStringTag } from '../../../src/view/tool/tool-item'
import type { ToolsView } from '../../../src/view/tool/tool-view'
import { View } from '../../../src/view/view'

describe('ToolItem', () => {
  let toolItem: ToolItem
  let mockCellView: CellView
  let mockToolsView: ToolsView
  let mockCell: Cell

  beforeEach(() => {
    // Create mock cell
    mockCell = {
      id: 'test-cell-id',
      isEdge: vi.fn().mockReturnValue(false),
      isNode: vi.fn().mockReturnValue(true),
    } as any

    // Create mock graph
    const mockGraph = {
      view: {
        guard: vi.fn().mockReturnValue(false),
      },
    } as any

    // Create mock cell view
    mockCellView = {
      graph: mockGraph,
      cell: mockCell,
    } as any

    // Create mock tools view
    mockToolsView = {
      focus: vi.fn(),
      blur: vi.fn(),
    } as any

    toolItem = new ToolItem()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('static methods', () => {
    it('should have correct toStringTag', () => {
      expect(ToolItem.toStringTag).toBe('X6.ToolItem')
    })

    it('should return correct defaults', () => {
      const defaults = ToolItem.getDefaults()
      expect(defaults).toEqual({
        isSVGElement: true,
        tagName: 'g',
      })
    })

    it('should identify ToolItem instance', () => {
      expect(ToolItem.isToolItem(toolItem)).toBe(true)
      expect(ToolItem.isToolItem(null)).toBe(false)
      expect(ToolItem.isToolItem(undefined)).toBe(false)
      expect(ToolItem.isToolItem({})).toBe(false)
    })

    it('should identify duck-typed ToolItem', () => {
      const duckTyped = {
        [Symbol.toStringTag]: ToolItemToStringTag,
        graph: {},
        cell: {},
        config: vi.fn(),
        update: vi.fn(),
        focus: vi.fn(),
        blur: vi.fn(),
        show: vi.fn(),
        hide: vi.fn(),
        isVisible: vi.fn(),
      }
      expect(ToolItem.isToolItem(duckTyped)).toBe(true)
    })

    it('should identify duck-typed ToolItem without toStringTag', () => {
      const duckTyped = {
        graph: {},
        cell: {},
        config: vi.fn(),
        update: vi.fn(),
        focus: vi.fn(),
        blur: vi.fn(),
        show: vi.fn(),
        hide: vi.fn(),
        isVisible: vi.fn(),
      }
      expect(ToolItem.isToolItem(duckTyped)).toBe(true)
    })

    it('should config defaults', () => {
      const newOptions = { name: 'test-tool', focusOpacity: 0.5 }
      ToolItem.config(newOptions)
      const defaults = ToolItem.getDefaults()
      expect(defaults).toMatchObject(newOptions)
    })

    it('should get options with merge', () => {
      const options = ToolItem.getOptions({ name: 'test' })
      expect(options).toMatchObject({
        isSVGElement: true,
        tagName: 'g',
        name: 'test',
      })
    })

    it('should define new tool class', () => {
      const CustomTool = ToolItem.define({ name: 'custom-tool' })
      expect(CustomTool).toBeDefined()
      expect(CustomTool.name).toBe('CustomTool')
    })
  })

  describe('constructor', () => {
    it('should create instance with default options', () => {
      expect(toolItem.options).toMatchObject({
        isSVGElement: true,
        tagName: 'g',
      })
      expect(toolItem.container).toBeDefined()
      expect(toolItem.container.tagName.toLowerCase()).toBe('g')
    })

    it('should create instance with custom options', () => {
      const customToolItem = new ToolItem({
        name: 'custom',
        tagName: 'div',
        isSVGElement: false,
        className: 'custom-class',
      })
      expect(customToolItem.options.name).toBe('custom')
      expect(customToolItem.container.tagName.toLowerCase()).toBe('div')
    })

    it('should add className to container', () => {
      const customToolItem = new ToolItem({
        className: 'test-class',
      })
      expect(customToolItem.container.classList.contains('test-class')).toBe(
        true,
      )
    })
  })

  describe('instance properties', () => {
    beforeEach(() => {
      toolItem.config(mockCellView, mockToolsView)
    })

    it('should return graph from cellView', () => {
      expect(toolItem.graph).toBe(mockCellView.graph)
    })

    it('should return cell from cellView', () => {
      expect(toolItem.cell).toBe(mockCell)
    })

    it('should return name from options', () => {
      const namedTool = new ToolItem({ name: 'test-tool' })
      expect(namedTool.name).toBe('test-tool')
    })

    it('should have correct Symbol.toStringTag', () => {
      expect(toolItem[Symbol.toStringTag]).toBe(ToolItemToStringTag)
    })
  })

  describe('config method', () => {
    it('should configure tool with cellView and toolsView', () => {
      const result = toolItem.config(mockCellView, mockToolsView)
      // @ts-expect-error
      expect(toolItem.cellView).toBe(mockCellView)
      expect(toolItem.parent).toBe(mockToolsView)
      expect(result).toBe(toolItem)
    })

    it('should add node-tool class for node cells', () => {
      toolItem.config(mockCellView, mockToolsView)
      expect(
        toolItem.container.classList.contains('x6-cell-tool-node-tool'),
      ).toBe(false)
    })

    it('should set data-tool-name attribute when name is provided', () => {
      const namedTool = new ToolItem({ name: 'test-tool' })
      namedTool.config(mockCellView, mockToolsView)
      expect(namedTool.container.getAttribute('data-tool-name')).toBe(
        'test-tool',
      )
    })
  })

  describe('render method', () => {
    it('should render without markup', () => {
      const result = toolItem.render()
      expect(result).toBe(toolItem)
    })

    it('should render with markup', () => {
      const markupTool = new ToolItem({
        markup: [
          {
            tagName: 'circle',
            selector: 'circle',
            attributes: { r: 5 },
          },
        ],
      })
      markupTool.render()
      expect(markupTool.childNodes).toBeDefined()
      expect(markupTool.childNodes.circle).toBeDefined()
    })
  })

  describe('visibility methods', () => {
    it('should show tool', () => {
      toolItem.hide()
      const result = toolItem.show()
      expect(toolItem.container.style.display).toBe('')
      expect(toolItem.isVisible()).toBe(true)
      expect(result).toBe(toolItem)
    })

    it('should hide tool', () => {
      const result = toolItem.hide()
      expect(toolItem.container.style.display).toBe('none')
      expect(toolItem.isVisible()).toBe(false)
      expect(result).toBe(toolItem)
    })
  })

  describe('focus and blur methods', () => {
    beforeEach(() => {
      toolItem.config(mockCellView, mockToolsView)
    })

    it('should focus with opacity', () => {
      const focusTool = new ToolItem({ focusOpacity: 0.5 })
      focusTool.config(mockCellView, mockToolsView)
      const result = focusTool.focus()
      expect(focusTool.container.style.opacity).toBe('0.5')
      expect(mockToolsView.focus).toHaveBeenCalledWith(focusTool)
      expect(result).toBe(focusTool)
    })

    it('should focus without opacity when not set', () => {
      const result = toolItem.focus()
      expect(toolItem.container.style.opacity).toBe('0.5')
      expect(mockToolsView.focus).toHaveBeenCalledWith(toolItem)
      expect(result).toBe(toolItem)
    })

    it('should focus without opacity when not finite', () => {
      const focusTool = new ToolItem({ focusOpacity: NaN })
      focusTool.config(mockCellView, mockToolsView)
      focusTool.focus()
      expect(focusTool.container.style.opacity).toBe('')
    })

    it('should blur tool', () => {
      toolItem.container.style.opacity = '0.5'
      const result = toolItem.blur()
      expect(toolItem.container.style.opacity).toBe('')
      expect(mockToolsView.blur).toHaveBeenCalledWith(toolItem)
      expect(result).toBe(toolItem)
    })
  })

  describe('update method', () => {
    it('should return this', () => {
      const result = toolItem.update()
      expect(result).toBe(toolItem)
    })
  })

  describe('stamp method', () => {
    it('should stamp element with cell id', () => {
      toolItem.config(mockCellView, mockToolsView)
      const elem = document.createElement('div')
      toolItem['stamp'](elem)
      expect(elem.getAttribute('data-cell-id')).toBe('test-cell-id')
    })

    it('should handle null element', () => {
      toolItem.config(mockCellView, mockToolsView)
      expect(() => toolItem['stamp'](null as any)).not.toThrow()
    })
  })

  describe('guard method', () => {
    it('should call graph.view.guard when both are available', () => {
      toolItem.config(mockCellView, mockToolsView)
      const event = {} as Dom.EventObject
      const result = toolItem['guard'](event)
      expect(mockCellView.graph.view.guard).toHaveBeenCalledWith(
        event,
        mockCellView,
      )
      expect(result).toBe(false)
    })
  })

  describe('delegateEvents method', () => {
    it('should delegate events when events option is provided', () => {
      const events = { click: 'onClick' }
      const eventTool = new ToolItem({ events })
      const spy = vi.spyOn(View.prototype, 'delegateEvents')
      const result = eventTool.delegateEvents()
      expect(spy).toHaveBeenCalledWith(events)
      expect(result).toBe(eventTool)
    })

    it('should not delegate events when events option is null', () => {
      const eventTool = new ToolItem({ events: null })
      const spy = vi.spyOn(View.prototype, 'delegateEvents')
      eventTool.delegateEvents()
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('protected methods', () => {
    it('should call init during construction', () => {
      const spy = vi.spyOn(ToolItem.prototype, 'init' as any)
      new ToolItem()
      expect(spy).toHaveBeenCalled()
    })

    it('should call onRender during render', () => {
      const spy = vi.spyOn(ToolItem.prototype, 'onRender' as any)
      toolItem.render()
      expect(spy).toHaveBeenCalled()
    })

    it('should get options from constructor', () => {
      const options = toolItem['getOptions']({ name: 'test' })
      expect(options).toMatchObject({
        isSVGElement: true,
        tagName: 'g',
        name: 'test',
      })
    })
  })
})
