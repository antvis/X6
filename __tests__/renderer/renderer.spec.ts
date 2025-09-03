import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Cell, Edge, type Graph, Node } from '../../src'
import { Util } from '../../src/common'
import { Point, Rectangle } from '../../src/geometry'
import { Renderer } from '../../src/renderer/renderer'
import type { CellView } from '../../src/view'
import { createTestGraph } from '../utils/graph-helpers'

describe('Renderer', () => {
  let graph: Graph
  let cleanup: () => void
  let renderer: Renderer

  beforeEach(() => {
    const { graph: g, cleanup: c } = createTestGraph()
    graph = g
    cleanup = c
    renderer = new Renderer(graph)
  })

  afterEach(() => {
    cleanup()
    renderer.dispose()
  })

  describe('requestViewUpdate', () => {
    it('should call scheduler.requestViewUpdate', () => {
      const mockView = { cell: { id: 'test-cell' } } as any
      const flag = 1
      const options = { test: true }

      const spy = vi.spyOn(renderer['schedule'], 'requestViewUpdate')

      renderer.requestViewUpdate(mockView, flag, options)

      expect(spy).toHaveBeenCalledWith(mockView, flag, options)
    })
  })

  describe('isViewMounted', () => {
    it('should call scheduler.isViewMounted', () => {
      const mockView = { cell: { id: 'test-cell' } } as any
      const spy = vi.spyOn(renderer['schedule'], 'isViewMounted')
      spy.mockReturnValue(true)

      const result = renderer.isViewMounted(mockView)

      expect(spy).toHaveBeenCalledWith(mockView)
      expect(result).toBe(true)
    })
  })

  describe('setRenderArea', () => {
    it('should call scheduler.setRenderArea', () => {
      const mockArea = new Rectangle(0, 0, 100, 100)
      const spy = vi.spyOn(renderer['schedule'], 'setRenderArea')

      renderer.setRenderArea(mockArea)

      expect(spy).toHaveBeenCalledWith(mockArea)
    })

    it('should call scheduler.setRenderArea with undefined', () => {
      const spy = vi.spyOn(renderer['schedule'], 'setRenderArea')

      renderer.setRenderArea()

      expect(spy).toHaveBeenCalledWith(undefined)
    })
  })

  describe('findViewByElem', () => {
    it('should return null when elem is null', () => {
      const result = renderer.findViewByElem(null)
      expect(result).toBeNull()
    })

    it('should return null when elem is undefined', () => {
      const result = renderer.findViewByElem(undefined)
      expect(result).toBeNull()
    })

    it('should find view by element selector', () => {
      // Add a node to the graph
      const node = graph.addNode({
        id: 'node1',
        x: 50,
        y: 50,
        width: 100,
        height: 50,
      })

      // Get the view for the node
      const view = graph.findViewByCell(node) as CellView
      expect(view).not.toBeNull()

      // Find view by its container element
      const result = renderer.findViewByElem(view.container)
      expect(result).not.toBeNull()
      expect(result!.cell).toBe(node)
    })

    it('should return null when element not found', () => {
      const elem = document.createElement('div')
      const result = renderer.findViewByElem(elem)
      expect(result).toBeNull()
    })
  })

  describe('findViewByCell', () => {
    it('should return null when cell is null', () => {
      const result = renderer.findViewByCell(null)
      expect(result).toBeNull()
    })

    it('should find view by cell object', () => {
      const node = graph.addNode({
        id: 'node1',
        x: 50,
        y: 50,
        width: 100,
        height: 50,
      })

      const view = graph.findViewByCell(node) as CellView
      expect(view).not.toBeNull()

      const result = renderer.findViewByCell(node)
      expect(result).not.toBeNull()
      expect(result!.cell).toBe(node)
    })

    it('should find view by cell id', () => {
      const node = graph.addNode({
        id: 'node1',
        x: 50,
        y: 50,
        width: 100,
        height: 50,
      })

      const view = graph.findViewByCell(node) as CellView
      expect(view).not.toBeNull()

      const result = renderer.findViewByCell('node1')
      expect(result).not.toBeNull()
      expect(result!.cell).toBe(node)
    })

    it('should return null when cell not found', () => {
      const result = renderer.findViewByCell('non-existent')
      expect(result).toBeNull()
    })
  })
})
