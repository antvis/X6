import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dom } from '../../../src/common'
import { EdgeTool, NodeTool } from '../../../src/registry/tool'
import { CellView } from '../../../src/view/cell'
import { ToolItem } from '../../../src/view/tool/tool-item'
import {
  ToolsView,
  ToolsViewToStringTag,
} from '../../../src/view/tool/tool-view'
import { View } from '../../../src/view/view'

describe('ToolsView', () => {
  let mockCellView: any
  let mockCell: any
  let mockGraph: any
  let toolsView: ToolsView

  beforeEach(() => {
    mockCell = {
      id: 'test-cell-id',
      isEdge: vi.fn().mockReturnValue(false),
      isNode: vi.fn().mockReturnValue(true),
    }

    mockGraph = {
      view: {
        decorator: document.createElement('div'),
      },
      container: document.createElement('div'),
    }

    mockCellView = {
      graph: mockGraph,
      cell: mockCell,
      container: document.createElement('g'),
    }

    vi.spyOn(CellView, 'isCellView').mockReturnValue(true)
    vi.spyOn(View, 'createElement').mockImplementation((tagName, isSVG) => {
      // @ts-expect-error
      return isSVG
        ? document.createElementNS('http://www.w3.org/2000/svg', tagName)
        : document.createElement(tagName)
    })
    vi.spyOn(Dom, 'addClass').mockImplementation(() => {})
    vi.spyOn(Dom, 'remove').mockImplementation(() => {})
  })

  describe('constructor', () => {
    it('should create ToolsView with default options', () => {
      toolsView = new ToolsView()
      expect(toolsView).toBeInstanceOf(ToolsView)
      expect(toolsView.svgContainer).toBeDefined()
      expect(toolsView.htmlContainer).toBeDefined()
    })

    it('should create ToolsView with custom options', () => {
      const options = { className: 'custom-class', name: 'test-tools' }
      toolsView = new ToolsView(options)
      expect(toolsView.options).toEqual(expect.objectContaining(options))
    })
  })

  describe('static methods', () => {
    describe('isToolsView', () => {
      it('should return false for null', () => {
        expect(ToolsView.isToolsView(null)).toBe(false)
      })

      it('should return false for undefined', () => {
        expect(ToolsView.isToolsView(undefined)).toBe(false)
      })

      it('should return true for ToolsView instance', () => {
        toolsView = new ToolsView()
        expect(ToolsView.isToolsView(toolsView)).toBe(true)
      })

      it('should return true for object with correct properties and tag', () => {
        const mockInstance = {
          [Symbol.toStringTag]: ToolsViewToStringTag,
          graph: mockGraph,
          cell: mockCell,
          config: vi.fn(),
          update: vi.fn(),
          focus: vi.fn(),
          blur: vi.fn(),
          show: vi.fn(),
          hide: vi.fn(),
        }
        expect(ToolsView.isToolsView(mockInstance)).toBe(true)
      })

      it('should return true for object with null tag but correct properties', () => {
        const mockInstance = {
          [Symbol.toStringTag]: null,
          graph: mockGraph,
          cell: mockCell,
          config: vi.fn(),
          update: vi.fn(),
          focus: vi.fn(),
          blur: vi.fn(),
          show: vi.fn(),
          hide: vi.fn(),
        }
        expect(ToolsView.isToolsView(mockInstance)).toBe(true)
      })

      it('should return false for object with missing properties', () => {
        const mockInstance = {
          [Symbol.toStringTag]: ToolsViewToStringTag,
          graph: mockGraph,
          cell: mockCell,
        }
        expect(ToolsView.isToolsView(mockInstance)).toBe(false)
      })
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      toolsView = new ToolsView({ name: 'test-name', view: mockCellView })
    })

    it('should return correct name', () => {
      expect(toolsView.name).toBe('test-name')
    })

    it('should return correct graph', () => {
      expect(toolsView.graph).toBe(mockGraph)
    })

    it('should return correct cell', () => {
      expect(toolsView.cell).toBe(mockCell)
    })

    it('should return correct Symbol.toStringTag', () => {
      expect(toolsView[Symbol.toStringTag]).toBe(ToolsViewToStringTag)
    })
  })

  describe('createContainer', () => {
    beforeEach(() => {
      toolsView = new ToolsView()
    })

    it('should create SVG container', () => {
      const container = toolsView['createContainer'](true, {})
      expect(View.createElement).toHaveBeenCalledWith('g', true)
    })

    it('should create HTML container', () => {
      const container = toolsView['createContainer'](false, {})
      expect(View.createElement).toHaveBeenCalledWith('div', false)
    })

    it('should add custom className', () => {
      const options = { className: 'custom-class' }
      toolsView['createContainer'](true, options)
      expect(Dom.addClass).toHaveBeenCalledWith(
        expect.any(Object),
        'custom-class',
      )
    })
  })

  describe('config', () => {
    beforeEach(() => {
      toolsView = new ToolsView()
    })

    it('should return this when view is the same', () => {
      toolsView.cellView = mockCellView
      const result = toolsView.config({ view: mockCellView })
      expect(result).toBe(toolsView)
    })

    it('should return this when view is not a CellView', () => {
      vi.spyOn(CellView, 'isCellView').mockReturnValue(false)
      const result = toolsView.config({ view: {} as any })
      expect(result).toBe(toolsView)
    })

    it('should configure for edge cell', () => {
      mockCell.isEdge.mockReturnValue(true)
      mockCell.isNode.mockReturnValue(false)
      toolsView.config({ view: mockCellView })
      expect(Dom.addClass).toHaveBeenCalledWith(
        toolsView.svgContainer,
        expect.stringContaining('edge-tools'),
      )
      expect(Dom.addClass).toHaveBeenCalledWith(
        toolsView.htmlContainer,
        expect.stringContaining('edge-tools'),
      )
    })

    it('should set data attributes', () => {
      const setAttributeSpy = vi.spyOn(toolsView.svgContainer, 'setAttribute')
      const setAttributeSpyHTML = vi.spyOn(
        toolsView.htmlContainer,
        'setAttribute',
      )

      toolsView.config({ view: mockCellView, name: 'test-tools' })

      expect(setAttributeSpy).toHaveBeenCalledWith(
        'data-cell-id',
        'test-cell-id',
      )
      expect(setAttributeSpyHTML).toHaveBeenCalledWith(
        'data-cell-id',
        'test-cell-id',
      )
      expect(setAttributeSpy).toHaveBeenCalledWith(
        'data-tools-name',
        'test-tools',
      )
      expect(setAttributeSpyHTML).toHaveBeenCalledWith(
        'data-tools-name',
        'test-tools',
      )
    })

    it('should return this when items is not an array', () => {
      const result = toolsView.config({ view: mockCellView, items: null })
      expect(result).toBe(toolsView)
    })

    it('should handle ToolItem instances', () => {
      const mockTool = {
        name: 'test-tool',
        config: vi.fn(),
        render: vi.fn(),
        options: { isSVGElement: true },
        container: document.createElement('div'),
      }

      vi.spyOn(ToolItem, 'isToolItem').mockReturnValue(true)
      const appendChildSpy = vi.spyOn(toolsView.svgContainer, 'appendChild')

      toolsView.config({ view: mockCellView, items: [mockTool as any] })

      expect(mockTool.config).toHaveBeenCalledWith(mockCellView, toolsView)
      expect(mockTool.render).toHaveBeenCalled()
      expect(appendChildSpy).toHaveBeenCalledWith(mockTool.container)
      expect(toolsView.tools).toHaveLength(1)
    })

    it('should handle string tool names for nodes', () => {
      const mockConstructor = vi.fn().mockImplementation(() => ({
        config: vi.fn(),
        render: vi.fn(),
        options: { isSVGElement: true },
        container: document.createElement('div'),
      }))

      vi.spyOn(NodeTool.registry, 'get').mockReturnValue(mockConstructor)
      vi.spyOn(ToolItem, 'isToolItem').mockReturnValue(false)

      toolsView.config({ view: mockCellView, items: ['test-tool'] })

      expect(NodeTool.registry.get).toHaveBeenCalledWith('test-tool')
      expect(mockConstructor).toHaveBeenCalledWith({})
    })

    it('should handle object tool definitions for nodes', () => {
      const mockConstructor = vi.fn().mockImplementation(() => ({
        config: vi.fn(),
        render: vi.fn(),
        options: { isSVGElement: true },
        container: document.createElement('div'),
      }))

      vi.spyOn(NodeTool.registry, 'get').mockReturnValue(mockConstructor)
      vi.spyOn(ToolItem, 'isToolItem').mockReturnValue(false)

      const toolDef = { name: 'test-tool', args: { param: 'value' } }
      // @ts-expect-error
      toolsView.config({ view: mockCellView, items: [toolDef] })

      expect(NodeTool.registry.get).toHaveBeenCalledWith('test-tool')
      expect(mockConstructor).toHaveBeenCalledWith({ param: 'value' })
    })

    it('should handle edge tools', () => {
      mockCell.isEdge.mockReturnValue(true)
      mockCell.isNode.mockReturnValue(false)

      const mockConstructor = vi.fn().mockImplementation(() => ({
        config: vi.fn(),
        render: vi.fn(),
        options: { isSVGElement: true },
        container: document.createElement('div'),
      }))

      vi.spyOn(EdgeTool.registry, 'get').mockReturnValue(mockConstructor)
      vi.spyOn(ToolItem, 'isToolItem').mockReturnValue(false)

      toolsView.config({ view: mockCellView, items: ['edge-tool'] })

      expect(EdgeTool.registry.get).toHaveBeenCalledWith('edge-tool')
    })

    it('should handle tool not found for nodes', () => {
      // @ts-expect-error
      vi.spyOn(NodeTool.registry, 'get').mockReturnValue(undefined)
      // @ts-expect-error
      vi.spyOn(NodeTool.registry, 'onNotFound').mockReturnValue(undefined)
      vi.spyOn(ToolItem, 'isToolItem').mockReturnValue(false)

      const result = toolsView.config({
        view: mockCellView,
        items: ['unknown-tool'],
      })

      expect(NodeTool.registry.onNotFound).toHaveBeenCalledWith('unknown-tool')
      expect(result).toBeUndefined()
    })

    it('should handle tool not found for edges', () => {
      mockCell.isEdge.mockReturnValue(true)
      mockCell.isNode.mockReturnValue(false)

      // @ts-expect-error
      vi.spyOn(EdgeTool.registry, 'get').mockReturnValue(undefined)
      // @ts-expect-error
      vi.spyOn(EdgeTool.registry, 'onNotFound').mockReturnValue(undefined)
      vi.spyOn(ToolItem, 'isToolItem').mockReturnValue(false)

      const result = toolsView.config({
        view: mockCellView,
        items: ['unknown-tool'],
      })

      expect(EdgeTool.registry.onNotFound).toHaveBeenCalledWith('unknown-tool')
      expect(result).toBeUndefined()
    })

    it('should append HTML tools to HTML container', () => {
      const mockTool = {
        config: vi.fn(),
        render: vi.fn(),
        options: { isSVGElement: false },
        container: document.createElement('div'),
      }

      vi.spyOn(ToolItem, 'isToolItem').mockReturnValue(true)
      const appendChildSpy = vi.spyOn(toolsView.htmlContainer, 'appendChild')

      toolsView.config({ view: mockCellView, items: [mockTool as any] })

      expect(appendChildSpy).toHaveBeenCalledWith(mockTool.container)
    })
  })

  describe('update', () => {
    beforeEach(() => {
      toolsView = new ToolsView()
    })

    it('should update all visible tools', () => {
      const tool1 = {
        cid: 'tool1',
        isVisible: vi.fn().mockReturnValue(true),
        update: vi.fn(),
      }
      const tool2 = {
        cid: 'tool2',
        isVisible: vi.fn().mockReturnValue(true),
        update: vi.fn(),
      }

      toolsView.tools = [tool1, tool2] as any

      const result = toolsView.update()

      expect(tool1.update).toHaveBeenCalled()
      expect(tool2.update).toHaveBeenCalled()
      expect(result).toBe(toolsView)
    })

    it('should skip tool with matching toolId', () => {
      const tool1 = {
        cid: 'tool1',
        isVisible: vi.fn().mockReturnValue(true),
        update: vi.fn(),
      }
      const tool2 = {
        cid: 'tool2',
        isVisible: vi.fn().mockReturnValue(true),
        update: vi.fn(),
      }

      toolsView.tools = [tool1, tool2] as any

      toolsView.update({ toolId: 'tool1' })

      expect(tool1.update).not.toHaveBeenCalled()
      expect(tool2.update).toHaveBeenCalled()
    })

    it('should skip invisible tools', () => {
      const tool1 = {
        cid: 'tool1',
        isVisible: vi.fn().mockReturnValue(false),
        update: vi.fn(),
      }

      toolsView.tools = [tool1] as any

      toolsView.update()

      expect(tool1.update).not.toHaveBeenCalled()
    })

    it('should handle null tools', () => {
      toolsView.tools = null
      const result = toolsView.update()
      expect(result).toBe(toolsView)
    })
  })

  describe('focus', () => {
    beforeEach(() => {
      toolsView = new ToolsView()
    })

    it('should show focused tool and hide others', () => {
      const tool1 = { show: vi.fn(), hide: vi.fn() }
      const tool2 = { show: vi.fn(), hide: vi.fn() }

      toolsView.tools = [tool1, tool2] as any

      const result = toolsView.focus(tool1 as any)

      expect(tool1.show).toHaveBeenCalled()
      expect(tool2.hide).toHaveBeenCalled()
      expect(result).toBe(toolsView)
    })

    it('should hide all tools when focusedTool is null', () => {
      const tool1 = { show: vi.fn(), hide: vi.fn() }
      const tool2 = { show: vi.fn(), hide: vi.fn() }

      toolsView.tools = [tool1, tool2] as any

      toolsView.focus(null)

      expect(tool1.hide).toHaveBeenCalled()
      expect(tool2.hide).toHaveBeenCalled()
    })

    it('should handle null tools', () => {
      toolsView.tools = null
      const result = toolsView.focus(null)
      expect(result).toBe(toolsView)
    })
  })

  describe('blur', () => {
    beforeEach(() => {
      toolsView = new ToolsView()
    })

    it('should show and update invisible tools except blurred', () => {
      const tool1 = {
        show: vi.fn(),
        hide: vi.fn(),
        update: vi.fn(),
        isVisible: vi.fn().mockReturnValue(false),
      }
      const tool2 = {
        show: vi.fn(),
        hide: vi.fn(),
        update: vi.fn(),
        isVisible: vi.fn().mockReturnValue(false),
      }

      toolsView.tools = [tool1, tool2] as any

      const result = toolsView.blur(tool1 as any)

      expect(tool1.show).not.toHaveBeenCalled()
      expect(tool2.show).toHaveBeenCalled()
      expect(tool2.update).toHaveBeenCalled()
      expect(result).toBe(toolsView)
    })

    it('should not affect visible tools', () => {
      const tool1 = {
        show: vi.fn(),
        hide: vi.fn(),
        update: vi.fn(),
        isVisible: vi.fn().mockReturnValue(true),
      }

      toolsView.tools = [tool1] as any

      toolsView.blur(null)

      expect(tool1.show).not.toHaveBeenCalled()
    })

    it('should handle null tools', () => {
      toolsView.tools = null
      const result = toolsView.blur(null)
      expect(result).toBe(toolsView)
    })
  })

  describe('hide', () => {
    it('should call focus with null', () => {
      toolsView = new ToolsView()
      const focusSpy = vi.spyOn(toolsView, 'focus')

      const result = toolsView.hide()

      expect(focusSpy).toHaveBeenCalledWith(null)
      expect(result).toBe(toolsView)
    })
  })

  describe('show', () => {
    it('should call blur with null', () => {
      toolsView = new ToolsView()
      const blurSpy = vi.spyOn(toolsView, 'blur')

      const result = toolsView.show()

      expect(blurSpy).toHaveBeenCalledWith(null)
      expect(result).toBe(toolsView)
    })
  })

  describe('remove', () => {
    beforeEach(() => {
      toolsView = new ToolsView()
      vi.spyOn(View.prototype, 'remove').mockReturnValue(toolsView)
    })

    it('should remove all tools and containers', () => {
      const tool1 = { remove: vi.fn() }
      const tool2 = { remove: vi.fn() }

      toolsView.tools = [tool1, tool2] as any

      const result = toolsView.remove()

      expect(tool1.remove).toHaveBeenCalled()
      expect(tool2.remove).toHaveBeenCalled()
      expect(toolsView.tools).toBe(null)
      expect(Dom.remove).toHaveBeenCalledWith(toolsView.svgContainer)
      expect(Dom.remove).toHaveBeenCalledWith(toolsView.htmlContainer)
      expect(View.prototype.remove).toHaveBeenCalled()
      expect(result).toBe(toolsView)
    })

    it('should handle null tools', () => {
      toolsView.tools = null
      const result = toolsView.remove()
      expect(result).toBe(toolsView)
    })
  })

  describe('mount', () => {
    beforeEach(() => {
      toolsView = new ToolsView()
      toolsView.cellView = mockCellView
    })

    it('should mount SVG container to decorator when not local', () => {
      const tool1 = { options: { isSVGElement: true } }
      toolsView.tools = [tool1] as any
      toolsView.options = { local: false }

      const appendChildSpy = vi.spyOn(mockGraph.view.decorator, 'appendChild')

      const result = toolsView.mount()

      expect(appendChildSpy).toHaveBeenCalledWith(toolsView.svgContainer)
      expect(result).toBe(toolsView)
    })

    it('should mount SVG container to cell container when local', () => {
      const tool1 = { options: { isSVGElement: true } }
      toolsView.tools = [tool1] as any
      toolsView.options = { local: true }

      const appendChildSpy = vi.spyOn(mockCellView.container, 'appendChild')

      toolsView.mount()

      expect(appendChildSpy).toHaveBeenCalledWith(toolsView.svgContainer)
    })

    it('should mount HTML container to graph container', () => {
      const tool1 = { options: { isSVGElement: false } }
      toolsView.tools = [tool1] as any

      const appendChildSpy = vi.spyOn(mockGraph.container, 'appendChild')

      toolsView.mount()

      expect(appendChildSpy).toHaveBeenCalledWith(toolsView.htmlContainer)
    })

    it('should handle mixed SVG and HTML tools', () => {
      const tool1 = { options: { isSVGElement: true } }
      const tool2 = { options: { isSVGElement: false } }
      toolsView.tools = [tool1, tool2] as any

      const svgSpy = vi.spyOn(mockGraph.view.decorator, 'appendChild')
      const htmlSpy = vi.spyOn(mockGraph.container, 'appendChild')

      toolsView.mount()

      expect(svgSpy).toHaveBeenCalledWith(toolsView.svgContainer)
      expect(htmlSpy).toHaveBeenCalledWith(toolsView.htmlContainer)
    })

    it('should handle no cellView', () => {
      toolsView.cellView = null as any
      const result = toolsView.mount()
      expect(result).toBe(toolsView)
    })

    it('should handle no tools', () => {
      toolsView.tools = null
      const result = toolsView.mount()
      expect(result).toBe(toolsView)
    })

    it('should handle tools with default isSVGElement', () => {
      const tool1 = { options: {} } // isSVGElement undefined, should default to true
      toolsView.tools = [tool1] as any

      const appendChildSpy = vi.spyOn(mockGraph.view.decorator, 'appendChild')

      toolsView.mount()

      expect(appendChildSpy).toHaveBeenCalledWith(toolsView.svgContainer)
    })
  })

  describe('static properties', () => {
    it('should have correct toStringTag', () => {
      expect(ToolsView.toStringTag).toBe('X6.ToolsView')
    })

    it('should export correct ToolsViewToStringTag', () => {
      expect(ToolsViewToStringTag).toBe('X6.ToolsView')
    })
  })
})
