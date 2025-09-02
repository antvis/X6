import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NodeView, NodeViewToStringTag } from '../../../src/view/node'
import { createTestGraph } from '../../utils/graph-helpers'

describe('NodeView', () => {
  let graph: any
  let node: any
  let nodeView: NodeView
  let cleanup: () => void

  beforeEach(() => {
    vi.clearAllMocks()

    const testSetup = createTestGraph()
    graph = testSetup.graph
    cleanup = testSetup.cleanup

    node = graph.addNode({
      x: 100,
      y: 100,
      width: 80,
      height: 40,
      markup: [{ tagName: 'rect', selector: 'body' }],
    })

    nodeView = node.findView(graph) as NodeView
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  describe('static methods', () => {
    describe('isNodeView', () => {
      it('should return false for null/undefined', () => {
        expect(NodeView.isNodeView(null)).toBe(false)
        expect(NodeView.isNodeView(undefined)).toBe(false)
      })

      it('should return true for NodeView instance', () => {
        expect(NodeView.isNodeView(nodeView)).toBe(true)
      })

      it('should return true for object with NodeView-like interface', () => {
        const mockView = {
          [Symbol.toStringTag]: NodeViewToStringTag,
          isNodeView: vi.fn(),
          isEdgeView: vi.fn(),
          confirmUpdate: vi.fn(),
          update: vi.fn(),
          findPortElem: vi.fn(),
          resize: vi.fn(),
          rotate: vi.fn(),
          translate: vi.fn(),
        }
        expect(NodeView.isNodeView(mockView)).toBe(true)
      })

      it('should return false for object missing required methods', () => {
        const mockView = { isNodeView: vi.fn() }
        expect(NodeView.isNodeView(mockView)).toBe(false)
      })
    })
  })

  describe('instance methods', () => {
    it('should have Symbol.toStringTag', () => {
      expect(nodeView[Symbol.toStringTag]).toBe(NodeViewToStringTag)
    })

    it('should initialize portsCache as empty object', () => {
      expect((nodeView as any).portsCache).toEqual({})
    })

    it('should return true for isNodeView', () => {
      expect(nodeView.isNodeView()).toBe(true)
    })
  })

  describe('getContainerClassName', () => {
    it('should return base class names', () => {
      const spy = vi.spyOn(nodeView, 'can').mockReturnValue(true)
      const className = (nodeView as any).getContainerClassName()
      expect(className).toContain('node')
      spy.mockRestore()
    })

    it('should add immovable class when node is not movable', () => {
      const spy = vi.spyOn(nodeView, 'can').mockReturnValue(false)
      const className = (nodeView as any).getContainerClassName()
      expect(className).toContain('immovable')
      spy.mockRestore()
    })
  })

  describe('updateClassName', () => {
    it('should handle magnet element', () => {
      const target = document.createElement('div')
      target.setAttribute('magnet', 'true')
      const event = { target } as any

      const canSpy = vi.spyOn(nodeView, 'can').mockReturnValue(true)
      ;(nodeView as any).updateClassName(event)
      canSpy.mockRestore()
    })

    it('should handle non-magnet element', () => {
      const target = document.createElement('div')
      const event = { target } as any

      const canSpy = vi.spyOn(nodeView, 'can').mockReturnValue(true)
      const removeClassSpy = vi.spyOn(nodeView, 'removeClass')

      ;(nodeView as any).updateClassName(event)
      canSpy.mockRestore()
    })
  })

  describe('confirmUpdate', () => {
    beforeEach(() => {
      vi.spyOn(nodeView, 'hasAction').mockReturnValue(false)
      vi.spyOn(nodeView, 'removeAction').mockReturnValue(0)
      vi.spyOn(nodeView, 'handleAction').mockReturnValue(0)
      vi.spyOn(nodeView, 'getFlag').mockReturnValue(1)
      vi.spyOn(nodeView as any, 'removePorts').mockImplementation(() => {})
      vi.spyOn(nodeView as any, 'cleanPortsCache').mockImplementation(() => {})
      vi.spyOn(nodeView, 'render').mockImplementation(() => nodeView)
      vi.spyOn(nodeView, 'resize').mockImplementation(() => {})
      vi.spyOn(nodeView, 'update').mockImplementation(() => {})
      vi.spyOn(nodeView, 'translate').mockImplementation(() => {})
      vi.spyOn(nodeView, 'rotate').mockImplementation(() => {})
      vi.spyOn(nodeView as any, 'renderPorts').mockImplementation(() => {})
      vi.spyOn(nodeView as any, 'renderTools').mockImplementation(() => {})
      vi.spyOn(nodeView as any, 'updateTools').mockImplementation(() => {})
    })

    it('should handle ports action', () => {
      vi.spyOn(nodeView, 'hasAction').mockImplementation(
        (flag: any, action: any) => action === 'ports',
      )

      const result = nodeView.confirmUpdate(1)

      expect((nodeView as any).removePorts).toHaveBeenCalled()
      expect((nodeView as any).cleanPortsCache).toHaveBeenCalled()
      expect(typeof result).toBe('number')
    })

    it('should handle render action', () => {
      vi.spyOn(nodeView, 'hasAction').mockImplementation(
        (flag: any, action: any) => action === 'render',
      )

      const result = nodeView.confirmUpdate(1)

      expect(nodeView.render).toHaveBeenCalled()
      expect(nodeView.removeAction).toHaveBeenCalled()
      expect(typeof result).toBe('number')
    })

    it('should handle individual actions when not rendering', () => {
      vi.spyOn(nodeView, 'hasAction').mockReturnValue(false)

      const result = nodeView.confirmUpdate(1)

      expect(nodeView.handleAction).toHaveBeenCalled()
      expect(typeof result).toBe('number')
    })
  })

  describe('update', () => {
    beforeEach(() => {
      vi.spyOn(nodeView as any, 'cleanCache').mockImplementation(() => {})
      vi.spyOn(nodeView as any, 'removePorts').mockImplementation(() => {})
      vi.spyOn(nodeView as any, 'updateAttrs').mockImplementation(() => {})
      vi.spyOn(nodeView as any, 'renderPorts').mockImplementation(() => {})
      vi.spyOn(node, 'getSize').mockReturnValue({ width: 100, height: 50 })
      vi.spyOn(node, 'getAttrs').mockReturnValue({})
    })

    it('should update node view', () => {
      nodeView.update()

      expect((nodeView as any).cleanCache).toHaveBeenCalled()
      expect((nodeView as any).updateAttrs).toHaveBeenCalled()
    })

    it('should handle partial attributes', () => {
      const partialAttrs = { rect: { fill: 'red' } }

      nodeView.update(partialAttrs)

      expect((nodeView as any).updateAttrs).toHaveBeenCalled()
    })
  })

  describe('render methods', () => {
    beforeEach(() => {
      vi.spyOn(nodeView, 'empty').mockImplementation(() => nodeView)
      vi.spyOn(nodeView as any, 'renderMarkup').mockImplementation(() => {})
      vi.spyOn(nodeView, 'resize').mockImplementation(() => {})
      vi.spyOn(nodeView as any, 'updateTransform').mockImplementation(() => {})
      vi.spyOn(nodeView as any, 'renderPorts').mockImplementation(() => {})
      vi.spyOn(nodeView as any, 'renderTools').mockImplementation(() => {})
    })

    it('should render all components', () => {
      const result = nodeView.render()

      expect(nodeView.empty).toHaveBeenCalled()
      expect((nodeView as any).renderMarkup).toHaveBeenCalled()
      expect(nodeView.resize).toHaveBeenCalled()
      expect((nodeView as any).updateTransform).toHaveBeenCalled()
      expect(result).toBe(nodeView)
    })
  })

  describe('transform methods', () => {
    beforeEach(() => {
      vi.spyOn(nodeView, 'rotate').mockImplementation(() => {})
      vi.spyOn(nodeView, 'update').mockImplementation(() => {})
      vi.spyOn(nodeView as any, 'updateTransform').mockImplementation(() => {})
      vi.spyOn(node, 'getAngle').mockReturnValue(0)
      vi.spyOn(node, 'getPosition').mockReturnValue({ x: 100, y: 200 })
      vi.spyOn(node, 'getSize').mockReturnValue({ width: 100, height: 50 })
    })

    it('should resize and call rotate when node has angle', () => {
      vi.spyOn(node, 'getAngle').mockReturnValue(45)

      nodeView.resize()

      expect(nodeView.rotate).toHaveBeenCalled()
      expect(nodeView.update).toHaveBeenCalled()
    })

    it('should resize without rotate when node has no angle', () => {
      nodeView.resize()

      expect(nodeView.rotate).not.toHaveBeenCalled()
      expect(nodeView.update).toHaveBeenCalled()
    })

    it('should translate', () => {
      nodeView.translate()

      expect((nodeView as any).updateTransform).toHaveBeenCalled()
    })

    it('should return translation string', () => {
      const result = (nodeView as any).getTranslationString()

      expect(result).toBe('translate(100,200)')
    })

    it('should return rotation string when angle exists', () => {
      vi.spyOn(node, 'getAngle').mockReturnValue(45)

      const result = (nodeView as any).getRotationString()

      expect(result).toBe('rotate(45,50,25)')
    })

    it('should return undefined when no angle', () => {
      const result = (nodeView as any).getRotationString()

      expect(result).toBeUndefined()
    })
  })

  describe('port methods', () => {
    it('should return null when no port cache', () => {
      const result = nodeView.findPortElem('port1')
      expect(result).toBe(null)
    })

    it('should find port element', () => {
      const mockElement = document.createElement('div')
      ;(nodeView as any).portsCache['port1'] = {
        portElement: mockElement,
        portContentElement: mockElement,
        portContentSelectors: {},
      }
      vi.spyOn(nodeView, 'findOne').mockReturnValue(mockElement)

      const result = nodeView.findPortElem('port1', 'selector')

      expect(nodeView.findOne).toHaveBeenCalledWith('selector', mockElement, {})
      expect(result).toBe(mockElement)
    })

    it('should clean ports cache', () => {
      ;(nodeView as any).portsCache['port1'] = {} as any

      ;(nodeView as any).cleanPortsCache()

      expect((nodeView as any).portsCache).toEqual({})
    })

    it('should get port markup', () => {
      const mockPort = { markup: 'port-markup' } as any
      vi.spyOn(node, 'portMarkup', 'get').mockReturnValue('default-markup')

      const result = (nodeView as any).getPortMarkup(mockPort)

      expect(result).toBe('port-markup')
    })

    it('should get port label markup', () => {
      const mockLabel = { markup: 'label-markup' } as any
      vi.spyOn(node, 'portLabelMarkup', 'get').mockReturnValue(
        'default-label-markup',
      )

      const result = (nodeView as any).getPortLabelMarkup(mockLabel)

      expect(result).toBe('label-markup')
    })
  })

  describe('event methods', () => {
    it('should return mouse event args without position', () => {
      const event = { type: 'click' } as any

      const result = (nodeView as any).getEventArgs(event)

      expect(result).toEqual({
        e: event,
        view: nodeView,
        node: node,
        cell: node,
      })
    })

    it('should return position event args with position', () => {
      const event = { type: 'click' } as any

      const result = (nodeView as any).getEventArgs(event, 100, 200)

      expect(result).toEqual({
        e: event,
        x: 100,
        y: 200,
        view: nodeView,
        node: node,
        cell: node,
      })
    })

    it('should return port event args', () => {
      const event = { type: 'click' } as any

      const result = (nodeView as any).getPortEventArgs(event, 'port1', {
        x: 100,
        y: 200,
      })

      expect(result).toEqual({
        e: event,
        x: 100,
        y: 200,
        view: nodeView,
        node: node,
        cell: node,
        port: 'port1',
      })
    })

    it('should notify mouse events', () => {
      const event = { type: 'mousedown' } as any
      vi.spyOn(nodeView, 'onMouseDown' as any).mockImplementation(() => {})
      // @ts-expect-error
      vi.spyOn(nodeView, 'notify').mockImplementation(() => {})

      nodeView.notifyMouseDown(event, 100, 200)

      expect(nodeView.notify).toHaveBeenCalledWith(
        'node:mousedown',
        expect.objectContaining({
          e: event,
          x: 100,
          y: 200,
        }),
      )
    })

    it('should handle click events', () => {
      const event = { type: 'click' } as any
      // @ts-expect-error
      vi.spyOn(nodeView, 'notify').mockImplementation(() => {})
      vi.spyOn(nodeView, 'notifyPortEvent').mockImplementation(() => {})

      nodeView.onClick(event, 100, 200)

      expect(nodeView.notify).toHaveBeenCalledWith(
        'node:click',
        expect.objectContaining({
          e: event,
          x: 100,
          y: 200,
        }),
      )
    })

    it('should handle mouse down events', () => {
      const event = { type: 'mousedown' } as any
      vi.spyOn(nodeView, 'isPropagationStopped').mockReturnValue(false)
      vi.spyOn(nodeView, 'notifyMouseDown').mockImplementation(() => {})
      vi.spyOn(nodeView, 'notifyPortEvent').mockImplementation(() => {})
      vi.spyOn(nodeView as any, 'startNodeDragging').mockImplementation(
        () => {},
      )

      nodeView.onMouseDown(event, 100, 200)

      expect(nodeView.notifyMouseDown).toHaveBeenCalledWith(event, 100, 200)
    })

    it('should return early if propagation stopped', () => {
      const event = { type: 'mousedown' } as any
      vi.spyOn(nodeView, 'isPropagationStopped').mockReturnValue(true)
      vi.spyOn(nodeView, 'notifyMouseDown').mockImplementation(() => {})

      nodeView.onMouseDown(event, 100, 200)

      expect(nodeView.notifyMouseDown).not.toHaveBeenCalled()
    })
  })

  describe('dragging methods', () => {
    it('should get delegated view', () => {
      vi.spyOn(nodeView, 'can').mockReturnValue(true)
      vi.spyOn(node, 'hasParent').mockReturnValue(false)

      const result = nodeView.getDelegatedView()

      expect(result).toBe(nodeView)
    })

    it('should return null when cell is edge', () => {
      vi.spyOn(node, 'isEdge').mockReturnValue(true)

      const result = nodeView.getDelegatedView()

      expect(result).toBe(null)
    })

    it('should validate magnet', () => {
      const magnet = document.createElement('div')
      magnet.setAttribute('magnet', 'true')
      const event = { type: 'mousedown' } as any

      const result = (nodeView as any).validateMagnet(nodeView, magnet, event)

      expect(result).toBe(true)
    })

    it('should not validate passive magnet', () => {
      const magnet = document.createElement('div')
      magnet.setAttribute('magnet', 'passive')
      const event = { type: 'mousedown' } as any

      const result = (nodeView as any).validateMagnet(nodeView, magnet, event)

      expect(result).toBe(false)
    })

    it('should get restrict area', () => {
      vi.spyOn(graph.options.translating, 'restrict', 'get').mockReturnValue(
        true,
      )
      vi.spyOn(graph.transform, 'getGraphArea').mockReturnValue({
        inflate: vi.fn().mockReturnThis(),
      })

      const result = (nodeView as any).getRestrictArea(nodeView)

      expect(result).toBeDefined()
    })

    it('should handle number restrict area', () => {
      vi.spyOn(graph.options.translating, 'restrict', 'get').mockReturnValue(10)
      vi.spyOn(graph.transform, 'getGraphArea').mockReturnValue({
        inflate: vi.fn().mockReturnThis(),
      })

      const result = (nodeView as any).getRestrictArea(nodeView)

      expect(result).toBeDefined()
    })
  })

  describe('magnet methods', () => {
    it('should handle magnet click when threshold not exceeded', () => {
      const event = { type: 'mouseup' } as any
      const magnet = document.createElement('div')
      vi.spyOn(graph.view, 'getMouseMovedCount').mockReturnValue(1)
      vi.spyOn(graph.options, 'clickThreshold', 'get').mockReturnValue(5)
      // @ts-expect-error
      vi.spyOn(nodeView, 'notify').mockImplementation(() => {})

      nodeView.onMagnetClick(event, magnet, 100, 200)

      expect(nodeView.notify).toHaveBeenCalledWith(
        'node:magnet:click',
        expect.objectContaining({
          magnet,
          e: event,
          x: 100,
          y: 200,
        }),
      )
    })

    it('should not handle magnet click when threshold exceeded', () => {
      const event = { type: 'mouseup' } as any
      const magnet = document.createElement('div')
      vi.spyOn(graph.view, 'getMouseMovedCount').mockReturnValue(10)
      vi.spyOn(graph.options, 'clickThreshold', 'get').mockReturnValue(5)
      // @ts-expect-error
      vi.spyOn(nodeView, 'notify').mockImplementation(() => {})

      nodeView.onMagnetClick(event, magnet, 100, 200)

      expect(nodeView.notify).not.toHaveBeenCalled()
    })

    it('should handle magnet double click', () => {
      const event = { type: 'dblclick' } as any
      const magnet = document.createElement('div')
      // @ts-expect-error
      vi.spyOn(nodeView, 'notify').mockImplementation(() => {})

      nodeView.onMagnetDblClick(event, magnet, 100, 200)

      expect(nodeView.notify).toHaveBeenCalledWith(
        'node:magnet:dblclick',
        expect.objectContaining({
          magnet,
          e: event,
          x: 100,
          y: 200,
        }),
      )
    })

    it('should handle magnet context menu', () => {
      const event = { type: 'contextmenu' } as any
      const magnet = document.createElement('div')
      // @ts-expect-error
      vi.spyOn(nodeView, 'notify').mockImplementation(() => {})

      nodeView.onMagnetContextMenu(event, magnet, 100, 200)

      expect(nodeView.notify).toHaveBeenCalledWith(
        'node:magnet:contextmenu',
        expect.objectContaining({
          magnet,
          e: event,
          x: 100,
          y: 200,
        }),
      )
    })

    it('should start magnet dragging', () => {
      const event = { type: 'mousedown' } as any
      const magnet = document.createElement('div')
      vi.spyOn(nodeView as any, 'startMagnetDragging').mockImplementation(
        () => {},
      )

      nodeView.onMagnetMouseDown(event, magnet, 100, 200)

      expect((nodeView as any).startMagnetDragging).toHaveBeenCalledWith(
        event,
        100,
        200,
      )
    })
  })

  describe('embedding methods', () => {
    it('should prepare embedding', () => {
      const event = { clientX: 150, clientY: 250 } as any
      vi.spyOn(nodeView, 'getEventData').mockReturnValue({ cell: node })
      vi.spyOn(graph, 'findViewByCell').mockReturnValue(nodeView)
      vi.spyOn(graph, 'snapToGrid').mockReturnValue({ x: 150, y: 250 })
      vi.spyOn(node, 'getParent').mockReturnValue(null)
      // @ts-expect-error
      vi.spyOn(nodeView, 'notify').mockImplementation(() => {})

      ;(nodeView as any).prepareEmbedding(event)

      expect(nodeView.notify).toHaveBeenCalledWith(
        'node:embed',
        expect.objectContaining({
          e: event,
          node: node,
          view: nodeView,
          cell: node,
          x: 150,
          y: 250,
          currentParent: null,
        }),
      )
    })

    it('should clear embedding', () => {
      const mockCandidateView = {
        unhighlight: vi.fn(),
      }
      const data = {
        candidateEmbedView: mockCandidateView,
      } as any

      nodeView.clearEmbedding(data)

      expect(mockCandidateView.unhighlight).toHaveBeenCalledWith(null, {
        type: 'embedding',
      })
      expect(data.candidateEmbedView).toBe(null)
    })

    it('should finalize embedding', () => {
      const event = { clientX: 150, clientY: 250 } as any
      const mockCandidateView = {
        unhighlight: vi.fn(),
        cell: { id: 'candidate', insertChild: vi.fn() },
      }
      const data = {
        cell: node,
        graph: graph,
        candidateEmbedView: mockCandidateView,
      } as any

      vi.spyOn(graph, 'startBatch').mockImplementation(() => {})
      vi.spyOn(graph, 'stopBatch').mockImplementation(() => {})
      vi.spyOn(graph, 'findViewByCell').mockReturnValue(nodeView)
      vi.spyOn(graph, 'snapToGrid').mockReturnValue({ x: 150, y: 250 })
      vi.spyOn(graph.model, 'getConnectedEdges').mockReturnValue([])
      vi.spyOn(node, 'getParent').mockReturnValue(null)
      // @ts-expect-error
      vi.spyOn(nodeView, 'notify').mockImplementation(() => {})

      nodeView.finalizeEmbedding(event, data)

      expect(graph.startBatch).toHaveBeenCalledWith('embedding')
      expect(mockCandidateView.cell.insertChild).toHaveBeenCalledWith(
        node,
        undefined,
        { ui: true },
      )
      expect(graph.stopBatch).toHaveBeenCalledWith('embedding')
    })
  })

  describe('node dragging', () => {
    it('should start node dragging', () => {
      const event = { type: 'mousedown' } as any
      vi.spyOn(nodeView, 'getDelegatedView').mockReturnValue(nodeView)
      vi.spyOn(nodeView, 'can').mockReturnValue(true)
      // @ts-expect-error
      vi.spyOn(nodeView, 'setEventData').mockImplementation(() => {})
      vi.spyOn(node, 'getPosition').mockReturnValue({ x: 100, y: 200 })
      vi.spyOn(nodeView as any, 'getRestrictArea').mockReturnValue(null)

      ;(nodeView as any).startNodeDragging(event, 150, 250)

      expect(nodeView.setEventData).toHaveBeenCalled()
    })

    it('should notify unhandled mouse down when no delegated view', () => {
      const event = { type: 'mousedown' } as any
      vi.spyOn(nodeView, 'getDelegatedView').mockReturnValue(null)
      vi.spyOn(nodeView as any, 'notifyUnhandledMouseDown').mockImplementation(
        () => {},
      )

      ;(nodeView as any).startNodeDragging(event, 150, 250)

      expect((nodeView as any).notifyUnhandledMouseDown).toHaveBeenCalledWith(
        event,
        150,
        250,
      )
    })

    it('should notify unhandled mouse down when not movable', () => {
      const event = { type: 'mousedown' } as any
      vi.spyOn(nodeView, 'getDelegatedView').mockReturnValue(nodeView)
      vi.spyOn(nodeView, 'can').mockReturnValue(false)
      vi.spyOn(nodeView as any, 'notifyUnhandledMouseDown').mockImplementation(
        () => {},
      )

      ;(nodeView as any).startNodeDragging(event, 150, 250)

      expect((nodeView as any).notifyUnhandledMouseDown).toHaveBeenCalledWith(
        event,
        150,
        250,
      )
    })

    it('should drag node', () => {
      const event = { clientX: 150, clientY: 250 } as any
      const data = {
        moving: false,
        offset: { x: -50, y: -50 },
        restrict: null,
      }

      vi.spyOn(nodeView, 'getEventData').mockReturnValue(data)
      vi.spyOn(nodeView, 'addClass').mockImplementation(() => nodeView)
      vi.spyOn(nodeView as any, 'notifyNodeMove').mockImplementation(() => {})
      vi.spyOn(nodeView as any, 'autoScrollGraph').mockImplementation(() => {})
      vi.spyOn(graph, 'getGridSize').mockReturnValue(10)
      vi.spyOn(node, 'setPosition').mockImplementation(() => {})
      vi.spyOn(graph.options.embedding, 'enabled', 'get').mockReturnValue(false)

      ;(nodeView as any).dragNode(event, 150, 250)

      expect(nodeView.addClass).toHaveBeenCalledWith('node-moving')
      expect((nodeView as any).notifyNodeMove).toHaveBeenCalledWith(
        'node:move',
        event,
        150,
        250,
        node,
      )
      expect(node.setPosition).toHaveBeenCalled()
    })
  })

  describe('additional methods', () => {
    it('should auto scroll graph', () => {
      const mockScroller = {
        autoScroll: vi.fn(),
      }
      vi.spyOn(graph, 'getPlugin').mockReturnValue(mockScroller)

      ;(nodeView as any).autoScrollGraph(100, 200)

      expect(mockScroller.autoScroll).toHaveBeenCalledWith(100, 200)
    })

    it('should handle auto scroll when no scroller plugin', () => {
      vi.spyOn(graph, 'getPlugin').mockReturnValue(null)

      expect(() => (nodeView as any).autoScrollGraph(100, 200)).not.toThrow()
    })

    it('should notify node move for multiple cells', () => {
      const mockSelection = {
        isSelectionMovable: vi.fn().mockReturnValue(true),
        getSelectedCells: vi.fn().mockReturnValue([node]),
      }
      const event = { type: 'mousemove' } as any

      vi.spyOn(graph, 'getPlugin').mockReturnValue(mockSelection)
      vi.spyOn(nodeView, 'notify').mockImplementation(() => {})

      ;(nodeView as any).notifyNodeMove('node:move', event, 100, 200, node)

      expect(nodeView.notify).toHaveBeenCalledWith(
        'node:move',
        expect.objectContaining({
          e: event,
          x: 100,
          y: 200,
          cell: node,
          node: node,
        }),
      )
    })

    it('should get default edge', () => {
      const magnet = document.createElement('div')
      const mockEdge = { id: 'edge1' }

      vi.spyOn(graph.options.connecting, 'createEdge', 'get').mockReturnValue(
        vi.fn().mockReturnValue(mockEdge),
      )

      const result = (nodeView as any).getDefaultEdge(nodeView, magnet)

      expect(result).toBe(mockEdge)
    })

    it('should create edge from magnet', () => {
      const magnet = document.createElement('div')
      const mockEdge = {
        setSource: vi.fn(),
        setTarget: vi.fn(),
        addTo: vi.fn(),
        getSource: vi.fn().mockReturnValue({}),
        getTarget: vi.fn().mockReturnValue({}),
        findView: vi.fn().mockReturnValue({ id: 'edgeView' }),
      }

      vi.spyOn(nodeView as any, 'getDefaultEdge').mockReturnValue(mockEdge)
      vi.spyOn(nodeView as any, 'getEdgeTerminal').mockReturnValue({
        cell: node.id,
      })

      const result = (nodeView as any).createEdgeFromMagnet(magnet, 100, 200)

      expect(mockEdge.setSource).toHaveBeenCalled()
      expect(mockEdge.setTarget).toHaveBeenCalledWith(
        expect.objectContaining({ x: 100, y: 200 }),
      )
      expect(mockEdge.addTo).toHaveBeenCalledWith(graph.model, {
        async: false,
        ui: true,
      })
      expect(result).toEqual({ id: 'edgeView' })
    })

    it('should process embedding with candidates', () => {
      const event = { clientX: 150, clientY: 250 } as any
      const mockCandidate = {
        id: 'candidate',
        visible: true,
        findView: vi.fn().mockReturnValue({
          cell: { id: 'candidateCell' },
          highlight: vi.fn(),
        }),
      }
      const data = {
        cell: node,
        graph: graph,
        candidateEmbedView: null,
      } as any

      vi.spyOn(graph.options.embedding, 'findParent', 'get').mockReturnValue(
        'center',
      )
      vi.spyOn(graph.options.embedding, 'frontOnly', 'get').mockReturnValue(
        false,
      )
      vi.spyOn(graph.options.embedding, 'validate', 'get').mockReturnValue(
        vi.fn().mockReturnValue(true),
      )
      vi.spyOn(graph.model, 'getNodesUnderNode').mockReturnValue([
        mockCandidate,
      ])
      vi.spyOn(nodeView, 'clearEmbedding').mockImplementation(() => {})
      vi.spyOn(nodeView, 'notify').mockImplementation(() => {})
      vi.spyOn(graph, 'snapToGrid').mockReturnValue({ x: 150, y: 250 })
      vi.spyOn(graph, 'findViewByCell').mockReturnValue(nodeView)
      vi.spyOn(node, 'getParent').mockReturnValue(null)

      nodeView.processEmbedding(event, data)

      expect(nodeView.clearEmbedding).toHaveBeenCalledWith(data)
      expect(nodeView.notify).toHaveBeenCalledWith(
        'node:embedding',
        expect.objectContaining({
          candidateParent: { id: 'candidateCell' },
        }),
      )
    })
  })
})
