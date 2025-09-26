import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type Cell, Dom, type Graph } from '../../src'
import { Selection } from '../../src/plugin/selection'
import { createTestGraph } from '../utils/graph-helpers'
import { sleep } from '../utils/sleep'

describe('Selection plugin', () => {
  let graph: Graph
  let cleanup: () => void
  let selection: Selection

  beforeEach(() => {
    const { graph: g, cleanup: c } = createTestGraph()
    graph = g
    cleanup = c
    graph.use(new Selection())
    selection = graph.getPlugin('selection') as Selection
  })

  afterEach(() => {
    cleanup()
    selection.dispose()
  })

  describe('graph api of selection', () => {
    it('isSelectionEnabled', () => {
      const spy = vi.spyOn(selection, 'isEnabled')

      const res = graph.isSelectionEnabled()
      expect(spy).toBeCalled()
      expect(res).toBe(true)
    })

    it('enableSelection', () => {
      const spy = vi.spyOn(selection, 'enable')

      graph.enableSelection()
      expect(spy).toBeCalled()
      expect(selection['options']['enabled']).toBe(true)
    })

    it('disableSelection', () => {
      const spy = vi.spyOn(selection, 'disable')

      graph.disableSelection()
      expect(spy).toBeCalled()
      expect(selection['options']['enabled']).toBe(false)
    })

    it('toggleSelection', () => {
      const spy = vi.spyOn(selection, 'toggleEnabled')

      graph.toggleSelection()
      expect(spy).toBeCalled()
      expect(selection['options']['enabled']).toBe(false)

      graph.toggleSelection(true)
      expect(spy).toBeCalledWith(true)
      expect(selection['options']['enabled']).toBe(true)
    })

    it('isMultipleSelection', () => {
      const spy = vi.spyOn(selection, 'isMultipleSelection')

      const res = graph.isMultipleSelection()
      expect(spy).toBeCalled()
      expect(res).toBe(true)
    })

    it('enableMultipleSelection', () => {
      const spy = vi.spyOn(selection, 'enableMultipleSelection')

      graph.enableMultipleSelection()
      expect(spy).toBeCalled()
      expect(selection['options']['multiple']).toBe(true)
    })

    it('disableMultipleSelection', () => {
      const spy = vi.spyOn(selection, 'disableMultipleSelection')

      graph.disableMultipleSelection()
      expect(spy).toBeCalled()
      expect(selection['options']['multiple']).toBe(false)
    })

    it('toggleMultipleSelection', () => {
      const spy = vi.spyOn(selection, 'toggleMultipleSelection')

      graph.toggleMultipleSelection()
      expect(spy).toBeCalled()
      expect(selection['options']['multiple']).toBe(false)

      graph.toggleMultipleSelection(true)
      expect(spy).toBeCalledWith(true)
      expect(selection['options']['multiple']).toBe(true)
    })

    it('isSelectionMovable', () => {
      const spy = vi.spyOn(selection, 'isSelectionMovable')

      const res = graph.isSelectionMovable()
      expect(spy).toBeCalled()
      expect(res).toBe(true)
    })

    it('enableSelectionMovable', () => {
      const spy = vi.spyOn(selection, 'enableSelectionMovable')

      graph.enableSelectionMovable()
      expect(spy).toBeCalled()
      expect(selection['options']['movable']).toBe(true)
    })

    it('disableSelectionMovable', () => {
      const spy = vi.spyOn(selection, 'disableSelectionMovable')

      graph.disableSelectionMovable()
      expect(spy).toBeCalled()
      expect(selection['selectionImpl']['options']['movable']).toBe(false)
    })

    it('toggleSelectionMovable', () => {
      const spy = vi.spyOn(selection, 'toggleSelectionMovable')

      graph.toggleSelectionMovable()
      expect(spy).toBeCalled()

      graph.toggleSelectionMovable()
      expect(spy).toBeCalled()
    })

    it('isRubberbandEnabled', () => {
      const spy = vi.spyOn(selection, 'isRubberbandEnabled')

      const res = graph.isRubberbandEnabled()
      expect(spy).toBeCalled()
      expect(res).toBe(false)
    })

    it('enableRubberband', () => {
      const spy = vi.spyOn(selection, 'enableRubberband')

      graph.enableRubberband()
      expect(spy).toBeCalled()
      expect(selection['options']['rubberband']).toBe(true)
    })

    it('disableRubberband', () => {
      const spy = vi.spyOn(selection, 'disableRubberband')

      graph.disableRubberband()
      expect(spy).toBeCalled()
      expect(selection['options']['rubberband']).toBe(false)
    })

    it('toggleRubberband', () => {
      const spy = vi.spyOn(selection, 'toggleRubberband')

      graph.toggleRubberband()
      expect(spy).toBeCalled()
      expect(selection['options']['rubberband']).toBe(true)

      graph.toggleRubberband(false)
      expect(spy).toBeCalledWith(false)
      expect(selection['options']['rubberband']).toBe(false)
    })

    it('isStrictRubberband', () => {
      const spy = vi.spyOn(selection, 'isStrictRubberband')

      const res = graph.isStrictRubberband()
      expect(spy).toBeCalled()
      expect(res).toBe(false)
    })

    it('enableStrictRubberband', () => {
      const spy = vi.spyOn(selection, 'enableStrictRubberband')

      graph.enableStrictRubberband()
      expect(spy).toBeCalled()
      expect(selection['selectionImpl']['options']['strict']).toBe(true)
    })

    it('disableStrictRubberband', () => {
      const spy = vi.spyOn(selection, 'disableStrictRubberband')

      graph.disableStrictRubberband()
      expect(spy).toBeCalled()
      expect(selection['selectionImpl']['options']['strict']).toBe(false)
    })

    it('toggleStrictRubberband', () => {
      const spy = vi.spyOn(selection, 'toggleStrictRubberband')

      graph.toggleStrictRubberband()
      expect(spy).toBeCalled()
      expect(selection['selectionImpl']['options']['strict']).toBe(true)

      graph.toggleStrictRubberband(false)
      expect(spy).toBeCalledWith(false)
      expect(selection['selectionImpl']['options']['strict']).toBe(false)
    })

    it('setRubberbandModifiers', () => {
      const spy = vi.spyOn(selection, 'setRubberbandModifiers')
      const modifiers = ['ctrl', 'shift']

      graph.setRubberbandModifiers(modifiers as any[])
      expect(spy).toBeCalledWith(modifiers)
    })

    it('setSelectionFilter', () => {
      const spy = vi.spyOn(selection, 'setSelectionFilter')
      const filter = (cell: Cell) => cell.isNode()

      graph.setSelectionFilter(filter)
      expect(spy).toBeCalledWith(filter)
    })

    it('setSelectionDisplayContent', () => {
      const spy = vi.spyOn(selection, 'setSelectionDisplayContent')
      const content = 'test content'

      graph.setSelectionDisplayContent(content)
      expect(spy).toBeCalledWith(content)
    })

    it('isSelectionEmpty', () => {
      const spy = vi.spyOn(selection, 'isEmpty')

      const res = graph.isSelectionEmpty()
      expect(spy).toBeCalled()
      expect(res).toBe(true)
    })

    it('cleanSelection', () => {
      const spy = vi.spyOn(selection, 'clean')

      graph.cleanSelection()
      expect(spy).toBeCalled()
    })

    it('resetSelection', () => {
      const spy = vi.spyOn(selection, 'reset')

      graph.resetSelection()
      expect(spy).toBeCalled()
    })

    it('getSelectedCells', () => {
      const spy = vi.spyOn(selection, 'getSelectedCells')

      const res = graph.getSelectedCells()
      expect(spy).toBeCalled()
      expect(res).toEqual([])
    })

    it('getSelectedCellCount', () => {
      const spy = vi.spyOn(selection, 'getSelectedCellCount')

      const res = graph.getSelectedCellCount()
      expect(spy).toBeCalled()
      expect(res).toBe(0)
    })

    it('isSelected', () => {
      const spy = vi.spyOn(selection, 'isSelected')
      const node = graph.addNode({
        shape: 'rect',
        x: 10,
        y: 10,
        width: 50,
        height: 50,
      })

      const res = graph.isSelected(node)
      expect(spy).toBeCalledWith(node)
      expect(res).toBe(false)
    })

    it('select', () => {
      const spy = vi.spyOn(selection, 'select')
      const node = graph.addNode({
        shape: 'rect',
        x: 10,
        y: 10,
        width: 50,
        height: 50,
      })

      graph.select(node)
      expect(spy).toBeCalledWith(node, undefined)
    })

    it('unselect', () => {
      const spy = vi.spyOn(selection, 'unselect')
      const node = graph.addNode({
        shape: 'rect',
        x: 10,
        y: 10,
        width: 50,
        height: 50,
      })

      graph.unselect(node)
      expect(spy).toBeCalledWith(node, undefined)
    })

    it('should filter cells when selection filter is set', () => {
      const filter = (cell: Cell) => cell.isNode()
      graph.setSelectionFilter(filter)

      const node = graph.addNode({ shape: 'rect' })
      const edge = graph.addEdge({ source: node, target: node })

      // Select both node and edge
      graph.select([node, edge])

      // Only node should be selected due to filter
      expect(graph.getSelectedCellCount()).toBe(1)
      expect(graph.isSelected(node)).toBe(true)
      expect(graph.isSelected(edge)).toBe(false)
    })

    it('should handle array filter', () => {
      // Filter by shape
      graph.setSelectionFilter(['rect'])

      const node1 = graph.addNode({ shape: 'rect' })
      const node2 = graph.addNode({ shape: 'circle' })

      graph.select([node1, node2])

      // Only rect node should be selected
      expect(graph.getSelectedCellCount()).toBe(1)
      expect(graph.isSelected(node1)).toBe(true)
      expect(graph.isSelected(node2)).toBe(false)
    })

    it('should handle id filter', () => {
      const node1 = graph.addNode({ id: 'node1', shape: 'rect' })
      const node2 = graph.addNode({ id: 'node2', shape: 'rect' })

      // Filter by id
      graph.setSelectionFilter([{ id: 'node1' }])

      graph.select([node1, node2])

      // Only node1 should be selected
      expect(graph.getSelectedCellCount()).toBe(1)
      expect(graph.isSelected(node1)).toBe(true)
      expect(graph.isSelected(node2)).toBe(false)
    })

    it('should handle null filter', () => {
      graph.setSelectionFilter(null)

      const node = graph.addNode({ shape: 'rect' })
      const edge = graph.addEdge({ source: node, target: node })

      graph.select([node, edge])

      // Both should be selected
      expect(graph.getSelectedCellCount()).toBe(2)
      expect(graph.isSelected(node)).toBe(true)
      expect(graph.isSelected(edge)).toBe(true)
    })
  })

  describe('constructor', () => {
    it('should has name', () => {
      expect(selection.name).toBe('selection')
    })

    it('should use default options', () => {
      graph.use(new Selection())
      selection = graph.getPlugin('selection') as Selection

      expect(selection['options']).toEqual({
        enabled: true,
        ...Selection.defaultOptions,
      })
    })
  })

  describe('onBlankMouseDown', () => {
    it('should start rubberband ', async () => {
      graph.use(
        new Selection({
          rubberband: true,
          multiple: true,
        }),
      )
      selection = graph.getPlugin('selection') as Selection
      const e = new Dom.EventObject(new MouseEvent('mousedown'))
      graph.trigger('blank:mousedown', {
        e,
      })
      await sleep(100)
      expect(Object.values(e.data)[0]).toEqual({
        action: 'selecting',
        clientX: 0,
        clientY: 0,
        offsetX: 0,
        offsetY: 0,
        scrollerX: 0,
        scrollerY: 0,
        moving: false,
      })
    })
  })

  describe('onMouseUp', () => {
    it('should stop selecting', async () => {
      graph.use(
        new Selection({
          rubberband: true,
          multiple: true,
          rubberNode: true,
        }),
      )
      graph.addNode({
        id: 'n1',
        width: 100,
        height: 100,
      })
      selection = graph.getPlugin('selection') as Selection
      const e = new Dom.EventObject(new MouseEvent('mouseup'))
      Object.defineProperty(selection['selectionImpl'], 'getEventData', {
        value: vi.fn().mockReturnValue({
          action: 'selecting',
          clientX: 200,
          clientY: 200,
          offsetX: 0,
          offsetY: 0,
          scrollerX: 0,
          scrollerY: 0,
        }),
      })
      selection['selectionImpl']['delegateDocumentEvents'](
        { mouseup: 'onMouseUp' },
        e,
      )
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      await sleep(100)

      expect(
        selection['selectionImpl']['container'].className.includes(
          'x6-widget-selection-selected',
        ),
      ).toBe(false)
    })

    it('should stop translating', async () => {
      graph.use(
        new Selection({
          rubberband: true,
          multiple: true,
        }),
      )
      const n1 = graph.addNode({
        id: 'n1',
        width: 100,
        height: 100,
      })
      selection = graph.getPlugin('selection') as Selection
      const e = new Dom.EventObject(new MouseEvent('mouseup'))
      Object.defineProperty(selection['selectionImpl'], 'getEventData', {
        value: vi.fn().mockReturnValue({
          action: 'translating',
          clientX: 200,
          clientY: 200,
          offsetX: 0,
          offsetY: 0,
          scrollerX: 0,
          scrollerY: 0,
          activeView: {
            cell: n1,
          },
        }),
      })
      const notifyBoxEventSpy = vi.spyOn(
        selection['selectionImpl'],
        'notifyBoxEvent' as any,
      )
      selection['selectionImpl']['delegateDocumentEvents'](
        { mouseup: 'onMouseUp' },
        e,
      )
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

      await sleep(100)

      expect(notifyBoxEventSpy).toHaveBeenCalled()
    })
  })

  describe('onBlankClick', () => {
    it('should clean selection', async () => {
      graph.use(
        new Selection({
          rubberband: true,
          multiple: true,
        }),
      )
      selection = graph.getPlugin('selection') as Selection

      const n1 = graph.addNode({
        id: 'n1',
        width: 100,
        height: 100,
      })

      selection.select(n1)

      expect(selection.cells.length).toBe(1)

      const e = new Dom.EventObject(new MouseEvent('click'))
      graph.trigger('blank:click', { e })
      await sleep(100)
      expect(selection.cells.length).toBe(0)
    })
  })

  describe('onMouseMove', () => {
    it('should update selection container size', async () => {
      graph.use(
        new Selection({
          rubberband: true,
          multiple: true,
        }),
      )
      selection = graph.getPlugin('selection') as Selection

      const e = new Dom.EventObject(new MouseEvent('mousemove'))
      Object.defineProperty(selection['selectionImpl'], 'normalizeEvent', {
        value: vi.fn().mockReturnValue({
          ...e,
          clientX: 10,
          clientY: 10,
        }),
      })

      Object.defineProperty(selection['selectionImpl'], 'getEventData', {
        value: vi.fn().mockReturnValue({
          action: 'selecting',
          clientX: 0,
          clientY: 0,
          offsetX: 0,
          offsetY: 0,
          scrollerX: 0,
          scrollerY: 0,
          moving: false,
        }),
      })

      selection['selectionImpl']['delegateDocumentEvents'](
        { mousemove: 'adjustSelection' },
        e,
      )
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }))
      await sleep(100)
      const selectionContainerStyle =
        selection['selectionImpl']['container']['style']
      expect(selectionContainerStyle['width']).toBe('10px')
      expect(selectionContainerStyle['height']).toBe('10px')
      expect(selectionContainerStyle['left']).toBe('0px')
      expect(selectionContainerStyle['top']).toBe('0px')
    })

    it('should update selection nodes position', async () => {
      graph.use(
        new Selection({
          rubberband: true,
          multiple: true,
          following: true,
        }),
      )
      selection = graph.getPlugin('selection') as Selection
      const n1 = graph.addNode({
        id: 'n1',
        width: 100,
        height: 100,
      })
      selection.select([n1])
      const e = new Dom.EventObject(new MouseEvent('mousemove'))
      Object.defineProperty(e, 'clientX', {
        value: 10,
      })
      Object.defineProperty(e, 'clientY', {
        value: 10,
      })

      Object.defineProperty(selection['selectionImpl'], 'normalizeEvent', {
        value: vi.fn().mockReturnValue({
          ...e,
          clientX: 10,
          clientY: 10,
        }),
      })
      Object.defineProperty(selection['selectionImpl'], 'getEventData', {
        value: vi.fn().mockReturnValue({
          action: 'translating',
          clientX: 200,
          clientY: 200,
          offsetX: 0,
          offsetY: 0,
          scrollerX: 0,
          scrollerY: 0,
          activeView: {
            cell: n1,
          },
        }),
      })
      selection['selectionImpl']['delegateDocumentEvents'](
        { mousemove: 'adjustSelection' },
        e,
      )

      const notifyBoxEventSpy = vi.spyOn(
        selection['selectionImpl'],
        'notifyBoxEvent' as any,
      )
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }))
      await sleep(100)
      expect(notifyBoxEventSpy).toHaveBeenCalled()
    })
  })

  describe('onCellAdded', () => {
    it('should add listener', () => {
      const n1 = graph.addNode({
        id: 'n1',
        width: 100,
        height: 100,
      })
      const cellOnSpy = vi.spyOn(n1, 'on')
      const cellOffSpy = vi.spyOn(n1, 'off')
      selection['selectionImpl']['onCellAdded']({ cell: n1 } as any)
      expect(cellOnSpy).toBeCalled()
      expect(cellOffSpy).toBeCalled()
    })

    it('should get pointer events value', () => {
      graph.use(
        new Selection({
          rubberband: true,
          multiple: true,
          showNodeSelectionBox: true,
        }),
      )
      selection = graph.getPlugin('selection') as Selection
      const n1 = graph.addNode({
        id: 'n1',
        width: 100,
        height: 100,
        x: 10,
        y: 10,
      })
      Object.defineProperty(selection['selectionImpl'], 'canShowSelectionBox', {
        value: vi.fn().mockReturnValue(true),
      })
      selection['selectionImpl']['onCellAdded']({ cell: n1 } as any)

      const box = selection['selectionImpl']['container'].querySelector(
        `.${selection['selectionImpl']['boxClassName']}`,
      )
      expect(box).not.toBe(null)
    })
  })

  describe('onSelectionBoxMouseDown', () => {
    it('should notify other event', () => {
      const n1 = graph.addNode({
        id: 'n1',
        width: 100,
        height: 100,
      })
      const mockEl = document.createElement('g')
      mockEl.setAttribute('data-cell-id', 'n1')
      const e = new Dom.EventObject(new MouseEvent('mousedown'))
      Object.defineProperty(e, 'clientX', {
        value: 10,
      })
      Object.defineProperty(e, 'clientY', {
        value: 10,
      })
      Object.defineProperty(e, 'target', {
        value: mockEl,
      })
      selection.select([n1])
      const notifyBoxEventSpy = vi.spyOn(
        selection['selectionImpl'],
        'notifyBoxEvent' as any,
      )
      const snapToGridSpy = vi.spyOn(
        selection['selectionImpl']['graph'],
        'snapToGrid' as any,
      )
      selection['selectionImpl']['onSelectionBoxMouseDown'](e as any)
      expect(notifyBoxEventSpy).toBeCalled()
      expect(snapToGridSpy).toBeCalledWith(10, 10)
    })
  })

  describe('on select node position change', () => {
    it('should translate selected nodes', async () => {
      const n1 = graph.addNode({
        id: 'n1',
        width: 100,
        height: 100,
        x: 0,
        y: 0,
      })
      const n2 = graph.addNode({
        id: 'n2',
        width: 100,
        height: 100,
        x: 40,
        y: 0,
      })
      const edge = graph.addEdge({
        source: n1,
        target: n2,
      })

      selection.select(n1)
      selection.select(n2)
      n1.position(10, 10)

      expect(n2.position()).toEqual({ x: 40, y: 0 })

      selection['selectionImpl']['collection'].trigger('node:change:position', {
        node: n1,
        options: {
          restrict: null,
          deep: true,
          ui: true,
          translateBy: 'n1',
          tx: 0,
          ty: 10,
        },
      })

      await sleep(20)
      expect(selection['selectionImpl']['translating']).toBe(false)
      expect(n2.position()).toEqual({ x: 50, y: 10 })
    })
  })

  describe('selection content', () => {
    it('should set selection display content as string', () => {
      const content = 'Custom Content'
      graph.setSelectionDisplayContent(content)

      const node = graph.addNode({ shape: 'rect' })
      graph.select(node)

      // Check if content is set
      expect(selection['selectionImpl']['options']['content']).toBe(content)
    })

    it('should set selection display content as function', () => {
      const contentFn = (selection: any, contentElement: HTMLElement) => {
        return `Selected: ${selection.length} cells`
      }
      graph.setSelectionDisplayContent(contentFn)

      const node = graph.addNode({ shape: 'rect' })
      graph.select(node)

      // Check if content function is set
      expect(typeof selection['selectionImpl']['options']['content']).toBe(
        'function',
      )
    })
  })

  describe('multiple selection', () => {
    it('should select multiple cells when multiple selection is enabled', () => {
      graph.enableMultipleSelection()

      const node1 = graph.addNode({ shape: 'rect' })
      const node2 = graph.addNode({ shape: 'circle' })

      graph.select([node1, node2])

      expect(graph.getSelectedCellCount()).toBe(2)
      expect(graph.isSelected(node1)).toBe(true)
      expect(graph.isSelected(node2)).toBe(true)
    })

    it('should only select first cell when multiple selection is disabled', () => {
      graph.disableMultipleSelection()

      const node1 = graph.addNode({ shape: 'rect' })
      const node2 = graph.addNode({ shape: 'circle' })

      graph.select([node1, node2])

      expect(graph.getSelectedCellCount()).toBe(1)
      expect(graph.isSelected(node1)).toBe(true)
      expect(graph.isSelected(node2)).toBe(false)
    })
  })

  describe('rubberband selection', () => {
    it('should enable and disable rubberband', () => {
      // Initially disabled
      expect(graph.isRubberbandEnabled()).toBe(false)

      // Enable
      graph.enableRubberband()
      expect(graph.isRubberbandEnabled()).toBe(true)

      // Disable
      graph.disableRubberband()
      expect(graph.isRubberbandEnabled()).toBe(false)
    })

    it('should toggle rubberband', () => {
      // Initially disabled
      expect(graph.isRubberbandEnabled()).toBe(false)

      // Toggle on
      graph.toggleRubberband()
      expect(graph.isRubberbandEnabled()).toBe(true)

      // Toggle off
      graph.toggleRubberband()
      expect(graph.isRubberbandEnabled()).toBe(false)
    })
  })

  describe('strict rubberband', () => {
    it('should enable and disable strict rubberband', () => {
      // Initially disabled
      expect(graph.isStrictRubberband()).toBe(false)

      // Enable
      graph.enableStrictRubberband()
      expect(graph.isStrictRubberband()).toBe(true)

      // Disable
      graph.disableStrictRubberband()
      expect(graph.isStrictRubberband()).toBe(false)
    })

    it('should toggle strict rubberband', () => {
      // Initially disabled
      expect(graph.isStrictRubberband()).toBe(false)

      // Toggle on
      graph.toggleStrictRubberband()
      expect(graph.isStrictRubberband()).toBe(true)

      // Toggle off
      graph.toggleStrictRubberband()
      expect(graph.isStrictRubberband()).toBe(false)
    })
  })

  describe('reset and clean', () => {
    it('should reset selection with cells', () => {
      const node1 = graph.addNode({ shape: 'rect' })
      const node2 = graph.addNode({ shape: 'circle' })

      // Select first node
      graph.select(node1)
      expect(graph.getSelectedCellCount()).toBe(1)

      // Reset with new cells
      graph.resetSelection([node2])
      expect(graph.getSelectedCellCount()).toBe(1)
      expect(graph.isSelected(node1)).toBe(false)
      expect(graph.isSelected(node2)).toBe(true)
    })

    it('should clean selection', () => {
      const node = graph.addNode({ shape: 'rect' })
      graph.select(node)

      expect(graph.getSelectedCellCount()).toBe(1)

      graph.cleanSelection()
      expect(graph.getSelectedCellCount()).toBe(0)
    })
  })

  describe('selection events', () => {
    it('should trigger cell:selected event', () => {
      const onSelect = vi.fn()
      graph.on('cell:selected', onSelect)

      const node = graph.addNode({ shape: 'rect' })
      graph.select(node)

      expect(onSelect).toBeCalled()
    })

    it('should trigger cell:unselected event', () => {
      const onUnselect = vi.fn()
      graph.on('cell:unselected', onUnselect)

      const node = graph.addNode({ shape: 'rect' })
      graph.select(node)
      graph.unselect(node)

      expect(onUnselect).toBeCalled()
    })

    it('should trigger selection:changed event', () => {
      const onChange = vi.fn()
      graph.on('selection:changed', onChange)

      const node = graph.addNode({ shape: 'rect' })
      graph.select(node)

      expect(onChange).toBeCalled()
    })
  })

  describe('selection filter', () => {
    it('should filter nodes by shape', () => {
      graph.use(
        new Selection({
          rubberband: true,
          multiple: true,
        }),
      )
      selection = graph.getPlugin('selection') as Selection

      // Set filter to only allow rect shapes
      selection.setSelectionFilter(['rect'])

      const node1 = graph.addNode({ shape: 'rect' })
      const node2 = graph.addNode({ shape: 'circle' })

      // Try to select both nodes
      selection.select([node1, node2])

      // Only rect node should be selected
      expect(selection.length).toBe(1)
      expect(selection.isSelected(node1)).toBe(true)
      expect(selection.isSelected(node2)).toBe(false)
    })

    it('should filter nodes by function', () => {
      graph.use(
        new Selection({
          rubberband: true,
          multiple: true,
        }),
      )
      selection = graph.getPlugin('selection') as Selection

      // Set filter to only allow nodes with x > 50
      selection.setSelectionFilter((cell: Cell) => {
        if (cell.isNode()) {
          return cell.position().x > 50
        }
        return true
      })

      const node1 = graph.addNode({ shape: 'rect', x: 10, y: 10 })
      const node2 = graph.addNode({ shape: 'circle', x: 100, y: 100 })

      // Try to select both nodes
      selection.select([node1, node2])

      // Only node2 should be selected (x > 50)
      expect(selection.length).toBe(1)
      expect(selection.isSelected(node1)).toBe(false)
      expect(selection.isSelected(node2)).toBe(true)
    })
  })

  describe('selection with modifiers', () => {
    it('should handle multiple selection with modifiers', () => {
      graph.use(
        new Selection({
          rubberband: true,
          multiple: true,
          multipleSelectionModifiers: ['ctrl'],
        }),
      )
      selection = graph.getPlugin('selection') as Selection

      const node1 = graph.addNode({ shape: 'rect' })
      const node2 = graph.addNode({ shape: 'circle' })

      // Select first node
      selection.select(node1)

      // Mock event with ctrl key pressed
      const mockEvent = {
        ctrlKey: true,
        metaKey: false,
        shiftKey: false,
      }

      // Check if multiple selection is allowed with modifier
      const allowMultiple = (selection as any).allowMultipleSelection(mockEvent)
      expect(allowMultiple).toBe(true)

      // Select second node with modifier
      selection.select(node2)

      // Both nodes should be selected
      expect(selection.length).toBe(2)
      expect(selection.isSelected(node1)).toBe(true)
      expect(selection.isSelected(node2)).toBe(true)
    })
  })

  describe('selectionImpl internal methods', () => {
    it('should handle empty selection', () => {
      expect(selection['selectionImpl'].isEmpty()).toBe(true)

      const node = graph.addNode({ shape: 'rect' })
      selection.select(node)

      expect(selection['selectionImpl'].isEmpty()).toBe(false)

      selection.clean()
      expect(selection['selectionImpl'].isEmpty()).toBe(true)
    })

    it('should update selection boxes', async () => {
      graph.use(
        new Selection({
          rubberband: true,
          multiple: true,
          showNodeSelectionBox: true,
        }),
      )
      selection = graph.getPlugin('selection') as Selection

      const node = graph.addNode({ shape: 'rect' })
      selection.select(node)

      // Reset boxesUpdated to false to test the update
      selection['selectionImpl']['boxesUpdated'] = false

      // Call updateSelectionBoxes which should trigger refreshSelectionBoxes after throttle
      selection['selectionImpl']['updateSelectionBoxes']()

      // Wait for throttle to complete
      await sleep(100)

      // Check that boxesUpdated is true after the update
      expect(selection['selectionImpl']['boxesUpdated']).toBe(true)
    })

    it('should handle cell removal', () => {
      const node = graph.addNode({ shape: 'rect' })
      selection.select(node)

      expect(selection.length).toBe(1)

      // Remove the node from graph
      node.remove()

      // Selection should be cleaned
      expect(selection.length).toBe(0)
    })

    it('should filter cells correctly', () => {
      graph.use(
        new Selection({
          rubberband: true,
          multiple: true,
        }),
      )
      selection = graph.getPlugin('selection') as Selection

      const node1 = graph.addNode({ shape: 'rect' })
      const node2 = graph.addNode({ shape: 'circle' })

      // Test with array filter
      selection['selectionImpl'].setFilter(['rect'])
      const filtered1 = selection['selectionImpl']['filter']([node1, node2])
      expect(filtered1).toEqual([node1])

      // Test with function filter
      selection['selectionImpl'].setFilter(
        (cell: Cell) => cell.isNode() && cell.id === node1.id,
      )
      const filtered2 = selection['selectionImpl']['filter']([node1, node2])
      expect(filtered2).toEqual([node1])

      // Test with null filter (should allow all)
      selection['selectionImpl'].setFilter(null)
      const filtered3 = selection['selectionImpl']['filter']([node1, node2])
      expect(filtered3).toEqual([node1, node2])
    })
  })

  describe('edge cases', () => {
    it('should handle selection with invalid cell ids', () => {
      // Try to select a cell that doesn't exist
      selection.select('non-existent-id')

      expect(selection.length).toBe(0)
    })

    it('should handle selection with mixed valid and invalid cells', () => {
      const node = graph.addNode({ shape: 'rect' })

      // Try to select both valid and invalid cells
      selection.select([node, 'non-existent-id'])

      expect(selection.length).toBe(1)
      expect(selection.isSelected(node)).toBe(true)
    })

    it('should handle duplicate selections', () => {
      const node = graph.addNode({ shape: 'rect' })

      // Select the same node twice
      selection.select(node)
      selection.select(node)

      expect(selection.length).toBe(1)
      expect(selection.isSelected(node)).toBe(true)
    })

    it('should handle unselecting non-selected cells', () => {
      const node1 = graph.addNode({ shape: 'rect' })
      const node2 = graph.addNode({ shape: 'circle' })

      // Select only node1
      selection.select(node1)

      // Try to unselect node2 which is not selected
      selection.unselect(node2)

      // node1 should still be selected
      expect(selection.length).toBe(1)
      expect(selection.isSelected(node1)).toBe(true)
    })
  })

  describe('dispose', () => {
    it('should dispose selection plugin correctly', () => {
      const node = graph.addNode({ shape: 'rect' })
      selection.select(node)

      expect(selection.length).toBe(1)

      // Spy on dispose methods
      const stopListeningSpy = vi.spyOn(selection as any, 'stopListening')
      const offSpy = vi.spyOn(selection, 'off')
      const selectionImplDisposeSpy = vi.spyOn(
        selection['selectionImpl'],
        'dispose',
      )

      // Dispose the selection plugin
      selection.dispose()

      // Check that all dispose methods were called
      expect(stopListeningSpy).toBeCalled()
      expect(offSpy).toBeCalled()
      expect(selectionImplDisposeSpy).toBeCalled()
    })
  })
})
