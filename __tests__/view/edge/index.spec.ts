import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Dom } from '../../../src/common'
import { Path, Point, Rectangle } from '../../../src/geometry'
import { Graph } from '../../../src/graph'
import { Edge } from '../../../src/model/edge'
import { EdgeView } from '../../../src/view/edge'

describe('EdgeView', () => {
  let graph: Graph
  let edge: Edge
  let edgeView: EdgeView

  beforeEach(() => {
    const container = document.createElement('div')
    graph = new Graph({ container, width: 800, height: 600 })

    edge = new Edge({
      source: { x: 100, y: 100 },
      target: { x: 200, y: 200 },
      markup: [
        {
          tagName: 'path',
          selector: 'wrap',
          attrs: {
            'stroke-width': 10,
            stroke: 'transparent',
            fill: 'none',
          },
        },
        {
          tagName: 'path',
          selector: 'line',
          attrs: {
            stroke: '#333',
            'stroke-width': 2,
            fill: 'none',
          },
        },
      ],
    })

    graph.addEdge(edge)
    edgeView = edge.findView(graph) as EdgeView
  })

  describe('static methods', () => {
    it('should identify EdgeView instances correctly', () => {
      expect(EdgeView.isEdgeView(edgeView)).toBe(true)
      expect(EdgeView.isEdgeView(null)).toBe(false)
      expect(EdgeView.isEdgeView(undefined)).toBe(false)
      expect(EdgeView.isEdgeView({})).toBe(false)

      const mockEdgeView = {
        isNodeView: () => false,
        isEdgeView: () => true,
        confirmUpdate: () => {},
        update: () => {},
        getConnection: () => {},
      }
      expect(EdgeView.isEdgeView(mockEdgeView)).toBe(true)
    })
  })

  describe('getters', () => {
    it('should return correct string tag', () => {
      expect(edgeView[Symbol.toStringTag]).toBe('X6.EdgeView')
    })

    it('should return correct container class name', () => {
      const className = edgeView.getContainerClassName()
      expect(className).toContain('edge')
    })

    it('should return source bbox', () => {
      const sourceNode = graph.addNode({
        x: 50,
        y: 50,
        width: 100,
        height: 100,
      })
      edge.setSource(sourceNode)
      edgeView.update()

      const bbox = edgeView.sourceBBox
      expect(bbox).toBeInstanceOf(Rectangle)
    })

    it('should return target bbox', () => {
      const targetNode = graph.addNode({
        x: 150,
        y: 150,
        width: 100,
        height: 100,
      })
      edge.setTarget(targetNode)
      edgeView.update()

      const bbox = edgeView.targetBBox
      expect(bbox).toBeInstanceOf(Rectangle)
    })
  })

  describe('identification methods', () => {
    it('should identify as edge view', () => {
      expect(edgeView.isEdgeView()).toBe(true)
    })
  })

  describe('confirmUpdate', () => {
    it('should handle various update flags', () => {
      const spy = vi.spyOn(edgeView, 'update')
      edgeView.confirmUpdate(edgeView.getFlag(['source', 'target', 'update']))
      expect(spy).toHaveBeenCalled()
    })

    it('should handle render flag', () => {
      const spy = vi.spyOn(edgeView, 'render')
      edgeView.confirmUpdate(edgeView.getFlag(['render']))
      expect(spy).toHaveBeenCalled()
    })

    it('should handle labels flag', () => {
      const spy = vi.spyOn(edgeView, 'onLabelsChange')
      edgeView.confirmUpdate(edgeView.getFlag(['labels']))
      expect(spy).toHaveBeenCalled()
    })

    it('should handle tools flag', () => {
      const spy = vi.spyOn(edgeView, 'renderTools')
      edgeView.confirmUpdate(edgeView.getFlag(['tools']))
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('rendering', () => {
    it('should render correctly', () => {
      const result = edgeView.render()
      expect(result).toBe(edgeView)
      expect(edgeView.container.children.length).toBeGreaterThan(0)
    })

    it('should render JSON markup', () => {
      const markup = [
        {
          tagName: 'path',
          selector: 'line',
        },
      ]
      edgeView.renderJSONMarkup(markup)
      expect(edgeView.selectors.line).toBeDefined()
    })

    it('should render tools', () => {
      const result = edgeView.renderTools()
      expect(result).toBe(edgeView)
    })
  })

  describe('labels', () => {
    beforeEach(() => {
      edge.setLabels([
        { attrs: { text: { text: 'Label 1' } } },
        { attrs: { text: { text: 'Label 2' } } },
      ])
    })

    it('should render labels', () => {
      const result = edgeView.renderLabels()
      expect(result).toBe(edgeView)
      expect(edgeView.labelContainer).toBeDefined()
    })

    it('should handle label changes', () => {
      edgeView.onLabelsChange()
      expect(edgeView.labelContainer).toBeDefined()
    })

    it('should parse label markup', () => {
      const stringMarkup = '<text>Label</text>'
      const result = edgeView.parseLabelStringMarkup(stringMarkup)
      expect(result.fragment).toBeInstanceOf(DocumentFragment)
    })

    it('should normalize label markup', () => {
      const markup = {
        fragment: document.createDocumentFragment(),
        selectors: {},
      }
      const textElement = document.createElement('text')
      markup.fragment.appendChild(textElement)

      const result = edgeView.normalizeLabelMarkup(markup)
      expect(result).toBeDefined()
      expect(result!.node).toBeDefined()
    })

    it('should update labels', () => {
      edgeView.renderLabels()
      edgeView.updateLabels()
      expect(edgeView.labelContainer).toBeDefined()
    })

    it('should update label positions', () => {
      edgeView.renderLabels()
      const result = edgeView.updateLabelPositions()
      expect(result).toBe(edgeView)
    })

    it('should handle empty labels in position update', () => {
      edge.setLabels([])
      edgeView.renderLabels()
      const result = edgeView.updateLabelPositions()
      expect(result).toBe(edgeView)
    })

    it('should get label position angle', () => {
      edge.setLabels([{ position: { distance: 0.5, angle: 45 } }])
      const angle = edgeView.getLabelPositionAngle(0)
      expect(angle).toBe(45)
    })

    it('should merge label position args', () => {
      const labelArgs = { distance: 0.3 }
      const defaultArgs = { distance: 0.5, offset: 10 }
      const result = edgeView.mergeLabelPositionArgs(labelArgs, defaultArgs)
      expect(result.distance).toBe(0.3)
      expect(result.offset).toBe(10)
    })
  })

  describe('connection updates', () => {
    it('should update connection', () => {
      edgeView.updateConnection()
      expect(edgeView.path).toBeDefined()
      expect(edgeView.sourcePoint).toBeDefined()
      expect(edgeView.targetPoint).toBeDefined()
    })

    it('should find anchors', () => {
      const vertices = [new Point(150, 150)]
      const result = edgeView.findAnchors(vertices)
      expect(result.source).toBeInstanceOf(Point)
      expect(result.target).toBeInstanceOf(Point)
    })

    it('should find anchors with priority', () => {
      const sourceNode = graph.addNode({
        x: 50,
        y: 50,
        width: 100,
        height: 100,
      })
      const targetNode = graph.addNode({
        x: 250,
        y: 250,
        width: 100,
        height: 100,
      })
      edge.setSource({ cell: sourceNode.id })
      edge.setTarget({ cell: targetNode.id, priority: true })

      const vertices = [new Point(150, 150)]
      const result = edgeView.findAnchors(vertices)
      expect(result.source).toBeInstanceOf(Point)
      expect(result.target).toBeInstanceOf(Point)
    })

    it('should find route points', () => {
      const vertices = [{ x: 150, y: 150 }]
      const result = edgeView.findRoutePoints(vertices)
      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(Point)
    })

    it('should find connection points', () => {
      const routePoints = [new Point(150, 150)]
      const sourceAnchor = new Point(100, 100)
      const targetAnchor = new Point(200, 200)

      const result = edgeView.findConnectionPoints(
        routePoints,
        sourceAnchor,
        targetAnchor,
      )
      expect(result.source).toBeInstanceOf(Point)
      expect(result.target).toBeInstanceOf(Point)
    })

    it('should find path', () => {
      const routePoints = [new Point(150, 150)]
      const sourcePoint = new Point(100, 100)
      const targetPoint = new Point(200, 200)

      const path = edgeView.findPath(routePoints, sourcePoint, targetPoint)
      expect(path).toBeInstanceOf(Path)
    })
  })

  describe('terminal properties', () => {
    it('should update terminal properties', () => {
      const sourceNode = graph.addNode({
        x: 50,
        y: 50,
        width: 100,
        height: 100,
      })
      edge.setSource({ cell: sourceNode.id })

      const result = edgeView.updateTerminalProperties('source')
      expect(result).toBe(true)
      expect(edgeView.sourceView).toBeDefined()
    })

    it('should update terminal magnet', () => {
      const sourceNode = graph.addNode({
        x: 50,
        y: 50,
        width: 100,
        height: 100,
      })
      edge.setSource({ cell: sourceNode.id })
      edgeView.updateTerminalProperties('source')

      edgeView.updateTerminalMagnet('source')
      expect(edgeView.sourceMagnet).toBeDefined()
    })

    it('should get terminal view', () => {
      const sourceNode = graph.addNode({
        x: 50,
        y: 50,
        width: 100,
        height: 100,
      })
      edge.setSource({ cell: sourceNode.id })
      edgeView.updateTerminalProperties('source')

      const view = edgeView.getTerminalView('source')
      expect(view).toBeDefined()
    })

    it('should get terminal anchor', () => {
      edgeView.updateConnection()
      const anchor = edgeView.getTerminalAnchor('source')
      expect(anchor).toBeInstanceOf(Point)
    })

    it('should get terminal connection point', () => {
      edgeView.updateConnection()
      const point = edgeView.getTerminalConnectionPoint('source')
      expect(point).toBeInstanceOf(Point)
    })

    it('should get terminal magnet', () => {
      const sourceNode = graph.addNode({
        x: 50,
        y: 50,
        width: 100,
        height: 100,
      })
      edge.setSource({ cell: sourceNode.id })
      edgeView.updateTerminalProperties('source')

      const magnet = edgeView.getTerminalMagnet('source')
      expect(magnet).toBeDefined()
    })
  })

  describe('path operations', () => {
    beforeEach(() => {
      edgeView.updateConnection()
    })

    it('should get connection', () => {
      const connection = edgeView.getConnection()
      expect(connection).toBeInstanceOf(Path)
    })

    it('should get connection path data', () => {
      const pathData = edgeView.getConnectionPathData()
      expect(typeof pathData).toBe('string')
    })

    it('should get connection subdivisions', () => {
      const subdivisions = edgeView.getConnectionSubdivisions()
      expect(Array.isArray(subdivisions)).toBe(true)
    })

    it('should get connection length', () => {
      const length = edgeView.getConnectionLength()
      expect(typeof length).toBe('number')
      expect(length).toBeGreaterThan(0)
    })

    it('should get point at length', () => {
      const length = edgeView.getConnectionLength()
      const point = edgeView.getPointAtLength(length / 2)
      expect(point).toBeInstanceOf(Point)
    })

    it('should get point at ratio', () => {
      const point = edgeView.getPointAtRatio(0.5)
      expect(point).toBeInstanceOf(Point)
    })

    it('should handle percentage ratio', () => {
      const point = edgeView.getPointAtRatio('50%')
      expect(point).toBeInstanceOf(Point)
    })

    it('should get closest point', () => {
      const testPoint = new Point(150, 150)
      const closest = edgeView.getClosestPoint(testPoint)
      expect(closest).toBeInstanceOf(Point)
    })

    it('should get closest point length', () => {
      const testPoint = new Point(150, 150)
      const length = edgeView.getClosestPointLength(testPoint)
      expect(typeof length).toBe('number')
    })

    it('should get closest point ratio', () => {
      const testPoint = new Point(150, 150)
      const ratio = edgeView.getClosestPointRatio(testPoint)
      expect(typeof ratio).toBe('number')
      expect(ratio).toBeGreaterThanOrEqual(0)
      expect(ratio).toBeLessThanOrEqual(1)
    })
  })

  describe('label positioning', () => {
    beforeEach(() => {
      edgeView.updateConnection()
    })

    it('should get label position with basic params', () => {
      const position = edgeView.getLabelPosition(150, 150)
      expect(position.distance).toBeDefined()
      expect(typeof position.distance).toBe('number')
    })

    it('should get label position with angle', () => {
      const position = edgeView.getLabelPosition(150, 150, 45)
      expect(position.distance).toBeDefined()
    })

    it('should get label position with options', () => {
      const options = { absoluteDistance: true }
      const position = edgeView.getLabelPosition(150, 150, options)
      expect(position.distance).toBeDefined()
    })

    it('should normalize label position', () => {
      const position = { distance: 0.5, offset: 10 }
      const normalized = edgeView.normalizeLabelPosition(position)
      expect(normalized).toEqual(position)
    })

    it('should handle undefined position normalization', () => {
      const normalized = edgeView.normalizeLabelPosition()
      expect(normalized).toBeUndefined()
    })

    it('should get label transformation matrix', () => {
      const position = { distance: 0.5 }
      const matrix = edgeView.getLabelTransformationMatrix(position)
      expect(matrix).toBeDefined()
    })
  })

  describe('vertices', () => {
    beforeEach(() => {
      edge.setVertices([
        { x: 150, y: 150 },
        { x: 175, y: 175 },
      ])
      edgeView.updateConnection()
    })

    it('should get vertex index', () => {
      const index = edgeView.getVertexIndex(150, 150)
      expect(typeof index).toBe('number')
    })

    it('should remove redundant linear vertices', () => {
      const removed = edgeView.removeRedundantLinearVertices()
      expect(typeof removed).toBe('number')
    })

    it('should handle no redundant vertices', () => {
      edge.setVertices([{ x: 150, y: 100 }]) // Non-linear vertex
      edgeView.updateConnection()
      const removed = edgeView.removeRedundantLinearVertices()
      expect(removed).toBe(0)
    })
  })

  describe('event handling', () => {
    it('should get event args', () => {
      const mockEvent = new MouseEvent('click')
      const args = edgeView.getEventArgs(mockEvent)
      expect(args.e).toBe(mockEvent)
      expect(args.view).toBe(edgeView)
    })

    it('should get event args with position', () => {
      const mockEvent = new MouseEvent('click')
      const args = edgeView.getEventArgs(mockEvent, 100, 200)
      expect(args.x).toBe(100)
      expect(args.y).toBe(200)
    })

    it('should handle mouse events', () => {
      const mockEvent = new MouseEvent('mousedown') as Dom.MouseDownEvent

      edgeView.notifyMouseDown(mockEvent, 100, 100)
      edgeView.notifyMouseMove(mockEvent as Dom.MouseMoveEvent, 110, 110)
      edgeView.notifyMouseUp(mockEvent as Dom.MouseUpEvent, 120, 120)
    })

    it('should handle click events', () => {
      const mockEvent = new MouseEvent('click') as Dom.ClickEvent
      edgeView.onClick(mockEvent, 100, 100)
    })

    it('should handle double click events', () => {
      const mockEvent = new MouseEvent('dblclick') as Dom.DoubleClickEvent
      edgeView.onDblClick(mockEvent, 100, 100)
    })

    it('should handle context menu events', () => {
      const mockEvent = new MouseEvent('contextmenu') as Dom.ContextMenuEvent
      edgeView.onContextMenu(mockEvent, 100, 100)
    })

    it('should handle mouse over/out/enter/leave events', () => {
      const mockEvent = new MouseEvent('mouseover') as Dom.MouseOverEvent

      edgeView.onMouseOver(mockEvent)
      edgeView.onMouseOut(mockEvent as Dom.MouseOutEvent)
      edgeView.onMouseEnter(mockEvent as Dom.MouseEnterEvent)
      edgeView.onMouseLeave(mockEvent as Dom.MouseLeaveEvent)
    })

    it('should handle mouse wheel events', () => {
      const mockEvent = {} as Dom.EventObject
      edgeView.onMouseWheel(mockEvent, 100, 100, 1)
    })
  })

  describe('dragging operations', () => {
    it('should start edge dragging', () => {
      const mockEvent = new MouseEvent('mousedown') as Dom.MouseDownEvent
      edgeView.startEdgeDragging(mockEvent, 100, 100)
      const eventData = edgeView.getEventData(mockEvent)
      expect(eventData.action).toBe('drag-edge')
    })

    it('should drag edge', () => {
      const mockEvent = new MouseEvent('mousemove') as Dom.MouseMoveEvent
      edgeView.startEdgeDragging(mockEvent as Dom.MouseDownEvent, 100, 100)
      edgeView.dragEdge(mockEvent, 110, 110)
    })

    it('should prepare arrowhead dragging', () => {
      const options = { x: 100, y: 100 }
      edgeView.prepareArrowheadDragging('source', options)
    })

    it('should handle label mouse down', () => {
      const mockEvent = new MouseEvent('mousedown') as Dom.MouseDownEvent
      edgeView.onLabelMouseDown(mockEvent, 100, 100)
    })
  })

  describe('validation', () => {
    it('should validate connection', () => {
      const sourceNode = graph.addNode({
        x: 50,
        y: 50,
        width: 100,
        height: 100,
      })
      const targetNode = graph.addNode({
        x: 250,
        y: 250,
        width: 100,
        height: 100,
      })
      const sourceView = sourceNode.findView(graph)
      const targetView = targetNode.findView(graph)

      const isValid = edgeView.validateConnection(
        sourceView,
        sourceView?.container,
        targetView,
        targetView?.container,
        'source',
        edgeView,
      )
      expect(typeof isValid).toBe('boolean')
    })

    it('should check if connection to blank is allowed', () => {
      const allowed = edgeView.allowConnectToBlank(edge)
      expect(typeof allowed).toBe('boolean')
    })

    it('should validate edge', () => {
      const initialTerminal = { x: 100, y: 100 }
      const isValid = edgeView.validateEdge(edge, 'source', initialTerminal)
      expect(typeof isValid).toBe('boolean')
    })
  })

  describe('highlighting', () => {
    it('should highlight available magnets', () => {
      const data = {
        terminalType: 'source' as Edge.TerminalType,
        edge,
        edgeView,
        isNewEdge: false,
      }
      edgeView.highlightAvailableMagnets(data)
      edgeView.unhighlightAvailableMagnets(data)
    })
  })

  describe('update method', () => {
    it('should update with options', () => {
      const result = edgeView.update({ silent: true })
      expect(result).toBe(edgeView)
    })

    it('should handle text attributes', () => {
      edge.setAttrs({ text: { text: 'Test' }, line: { stroke: 'red' } })
      edgeView.update()
      expect(edgeView.path).toBeDefined()
    })
  })
})
