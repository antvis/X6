import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Dnd, Dom, Graph, type Node, Snapline } from '../../src'
import { Rect } from '../../src/shape/rect'
import { createTestContainer, createTestGraph } from '../utils/graph-helpers'

const containerWidth = 800
const containerHeight = 600

describe('Dnd', () => {
  let graph: Graph
  let container: HTMLDivElement
  let cleanup: () => void
  let dnd: Dnd

  beforeEach(() => {
    container = createTestContainer(containerWidth, containerHeight)
    container.style.borderLeftWidth = '0px'
    container.style.borderTopWidth = '0px'
    Object.defineProperty(container, 'clientWidth', {
      get: () => containerWidth,
    })
    Object.defineProperty(container, 'clientHeight', {
      get: () => containerHeight,
    })
    const { graph: g, cleanup: c } = createTestGraph({ container })
    graph = g
    cleanup = c
    dnd = new Dnd({
      target: graph,
    })
  })

  afterEach(() => {
    container.remove()
    cleanup()
    dnd.dispose()
  })

  describe('constructor', () => {
    it('should create a new Dnd instance', () => {
      expect(dnd).toBeInstanceOf(Dnd)
      expect(dnd.name).toBe('dnd')
    })

    it('should have default options', () => {
      expect(dnd.options.getDragNode).toBeInstanceOf(Function)
      expect(dnd.options.getDropNode).toBeInstanceOf(Function)
    })

    it('should create a dragging graph', () => {
      expect(dnd.draggingGraph).toBeInstanceOf(Graph)
    })
  })

  describe('init', () => {
    it('should create container element', () => {
      expect(dnd.container).toBeInstanceOf(HTMLDivElement)
      expect(dnd.container.className).toContain('widget-dnd')
    })

    it('should append dragging graph container', () => {
      expect(dnd.container.contains(dnd.draggingGraph.container)).toBe(true)
    })
  })

  describe('start', () => {
    it('should start dragging a node', () => {
      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 150,
        clientY: 150,
        data: {},
      } as any

      dnd.start(node, mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(dnd.container.classList.contains('dragging')).toBe(true)
    })

    it('should start dragging a node with the plugin of snapline', () => {
      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 150,
        clientY: 150,
        data: {},
      } as any

      graph.use(new Snapline({ enabled: true }))

      const captureCursorOffsetSpy = vi.spyOn(
        dnd['snapline'],
        'captureCursorOffset',
      )

      expect(dnd['snapline'] instanceof Snapline).toBe(true)
      expect(dnd['isSnaplineEnabled']()).toBe(true)
      dnd.start(node, mockEvent)

      expect(captureCursorOffsetSpy).toBeCalled()
    })
  })

  describe('prepareDragging', () => {
    it('should prepare dragging with default options', () => {
      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })

      // Mock the necessary methods
      const mockView = {
        getBBox: vi.fn().mockReturnValue({
          getTopLeft: vi
            .fn()
            .mockReturnValue({ diff: vi.fn().mockReturnValue({ x: 0, y: 0 }) }),
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        }),
        undelegateEvents: vi.fn(),
        cell: { off: vi.fn() },
      }
      const updateGraphPositionSpy = vi.spyOn(dnd, 'updateGraphPosition' as any)
      dnd.draggingGraph.findViewByCell = vi.fn().mockReturnValue(mockView)
      dnd.draggingGraph.fitToContent = vi.fn()
      dnd.draggingGraph.model.resetCells = vi.fn()
      dnd['prepareDragging'](node, 150, 150)

      expect(dnd.draggingGraph.model.resetCells).toHaveBeenCalledWith([
        expect.any(Object),
      ])
      expect(dnd.draggingGraph.fitToContent).toHaveBeenCalled()
      expect(updateGraphPositionSpy).toHaveBeenCalled()
    })
  })

  describe('updateNodePosition', () => {
    it('should update node position', () => {
      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })

      dnd['prepareDragging'](node, 150, 150)

      const local = dnd['updateNodePosition'](220, 220)
      expect(local).toEqual({ x: 170, y: 170 })
    })
  })

  describe('snap', () => {
    it('should snap position if snapped enabled', () => {
      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })
      dnd['prepareDragging'](node, 150, 150)
      const options = {
        snapped: true,
        restrict: null,
        translateBy: 'a31006ed-6a5b-45a2-9a65-2c5331503954',
        tx: 7,
        ty: -8,
      }
      const current = {
        x: 100,
        y: -160,
      }
      const positionSpy = vi.spyOn(node, 'position')

      dnd['snap']({
        cell: node,
        current,
        options,
      } as any)

      expect(positionSpy).toHaveBeenCalled()
      expect(dnd['snapOffset']).toEqual({ x: 7, y: -8 })
    })

    it('should set snapOffset as null if not snapped', () => {
      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })
      dnd['prepareDragging'](node, 150, 150)
      const options = {
        snapped: false,
        restrict: null,
        translateBy: 'a31006ed-6a5b-45a2-9a65-2c5331503954',
        tx: 7,
        ty: -8,
      }
      const current = {
        x: 100,
        y: -160,
      }
      const positionSpy = vi.spyOn(node, 'position')

      dnd['snap']({
        cell: node,
        current,
        options,
      } as any)

      expect(positionSpy).not.toHaveBeenCalled()
      expect(dnd['snapOffset']).toBe(null)
    })
  })

  describe('getDropArea', () => {
    it('should get drop rect area', () => {
      expect(dnd['getDropArea'](graph.container)).toEqual({
        x: 0,
        y: 0,
        width: containerWidth,
        height: containerHeight,
      })
    })
  })

  describe('isInsideValidArea', () => {
    it('should point is inside valid area', () => {
      const result = dnd['isInsideValidArea']({ x: 100, y: 100 })
      expect(result).toBe(true)
    })

    it('should point is not inside valid area', () => {
      const result = dnd['isInsideValidArea']({ x: 900, y: 100 })
      expect(result).toBe(false)
    })
  })

  describe('drop', () => {
    it('should set node position in valid area', async () => {
      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })

      const result = dnd['drop'](node, {
        x: 400,
        y: 300,
      })

      expect((result as Node).position()).toEqual({ x: 450, y: 350 })
    })

    it('should return null if is not inside valid area', () => {
      const node = new Rect({
        width: 100,
        height: 100,
      })
      const result = dnd['drop'](node, {
        x: 900,
        y: 300,
      })

      expect(result).toBe(null)
    })
  })

  describe('onDragEnd', () => {
    it('should drop draggingNode', async () => {
      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })
      dnd['prepareDragging'](node, 100, 100)

      const mouseupEvent = new Dom.EventObject(new MouseEvent('mouseup'))
      const dropSpy = vi.spyOn(dnd, 'drop' as any)
      dnd['onDragEnd'](mouseupEvent as any)
      expect(dropSpy).toHaveBeenCalled()
    })

    it('should do nothing if no draggingNode', async () => {
      const normalizeEventSpy = vi.spyOn(dnd, 'normalizeEvent')

      dnd['onDragEnd']({} as any)
      expect(normalizeEventSpy).not.toHaveBeenCalled()
    })
  })

  describe('onDropInvalid', () => {
    it('should call onDropped method', () => {
      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })
      dnd['prepareDragging'](node, 100, 100)

      const onDroppedSpy = vi.spyOn(dnd, 'onDropped' as any)
      dnd['onDropInvalid']()
      expect(onDroppedSpy).toHaveBeenCalled()
    })

    it('should do nothing if no draggingNode', () => {
      const onDroppedSpy = vi.spyOn(dnd, 'onDropped' as any)
      dnd['onDropInvalid']()
      expect(onDroppedSpy).not.toHaveBeenCalled()
    })
  })

  describe('clearDragging', () => {
    it('should clear dragging state', () => {
      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })
      dnd['prepareDragging'](node, 150, 150)

      expect(dnd['draggingNode']).not.toBeNull()
      dnd['clearDragging']()
      expect(dnd['draggingNode']).toBeNull()
      expect(dnd['draggingView']).toBeNull()
    })
  })

  describe('custom options', () => {
    it('should use custom getDragNode function', () => {
      const customDnd = new Dnd({
        target: graph,
        getDragNode: (sourceNode) => {
          const clone = sourceNode.clone()
          clone.setProp('custom', true)
          return clone
        },
      })

      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })

      const dragNode = customDnd.options.getDragNode(node, {
        sourceNode: node,
        draggingGraph: customDnd.draggingGraph,
        targetGraph: graph,
      })

      expect(dragNode.getProp('custom')).toBe(true)

      customDnd.dispose()
    })

    it('should use custom getDropNode function', () => {
      const customDnd = new Dnd({
        target: graph,
        getDropNode: (draggingNode) => {
          const clone = draggingNode.clone()
          clone.setProp('dropped', true)
          return clone
        },
      })

      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })

      const dropNode = customDnd.options.getDropNode(node, {
        sourceNode: node,
        draggingNode: node,
        draggingGraph: customDnd.draggingGraph,
        targetGraph: graph,
      })

      expect(dropNode.getProp('dropped')).toBe(true)

      customDnd.dispose()
    })

    it('should use custom validateNode function', () => {
      const customDnd = new Dnd({
        target: graph,
        validateNode: (droppingNode) => {
          return droppingNode.size().width > 50
        },
      })

      const largeNode = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })

      const smallNode = new Rect({
        x: 100,
        y: 100,
        width: 30,
        height: 30,
      })

      const largeValid = customDnd.options.validateNode!(largeNode, {
        sourceNode: largeNode,
        draggingNode: largeNode,
        droppingNode: largeNode,
        targetGraph: graph,
        draggingGraph: customDnd.draggingGraph,
      })

      const smallValid = customDnd.options.validateNode!(smallNode, {
        sourceNode: smallNode,
        draggingNode: smallNode,
        droppingNode: smallNode,
        targetGraph: graph,
        draggingGraph: customDnd.draggingGraph,
      })

      expect(largeValid).toBe(true)
      expect(smallValid).toBe(false)

      customDnd.dispose()
    })
  })

  describe('onDragging', () => {
    it('should update graph position', async () => {
      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })
      dnd['prepareDragging'](node, 100, 100)
      const mousemoveEvent = new Dom.EventObject(new MouseEvent('mousemove'))
      const updateGraphPositionSpy = vi.spyOn(dnd, 'updateGraphPosition' as any)

      dnd['onDragging'](mousemoveEvent as any)
      expect(updateGraphPositionSpy).toHaveBeenCalledWith(
        mousemoveEvent.clientX,
        mousemoveEvent.clientY,
      )
    })

    it('should process embedding if embedding is enabled', () => {
      const node = new Rect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      })
      dnd['prepareDragging'](node, 100, 100)
      Object.defineProperty(dnd['targetGraph'].options.embedding, 'enabled', {
        value: true,
      })
      const mousemoveEvent = new Dom.EventObject(new MouseEvent('mousemove'))
      const processEmbeddingSpy = vi.spyOn(
        dnd['draggingView'] as any,
        'processEmbedding',
      )

      dnd['onDragging'](mousemoveEvent as any)
      expect(processEmbeddingSpy).toHaveBeenCalled()
    })

    it('should do nothing if no draggingView', () => {
      const mousemoveEvent = new Dom.EventObject(new MouseEvent('mousemove'))
      const updateGraphPositionSpy = vi.spyOn(dnd, 'updateGraphPosition' as any)

      dnd['onDragging'](mousemoveEvent as any)
      expect(updateGraphPositionSpy).not.toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('should dispose properly', () => {
      const disposeSpy = vi.spyOn(dnd, 'dispose')
      dnd.dispose()
      expect(disposeSpy).toHaveBeenCalled()
    })
  })
})
